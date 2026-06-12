import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const evalsRoot = path.join(repoRoot, 'evals');

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(entryPath));
      continue;
    }

    if (entry.isFile() && entry.name === 'evals.json') {
      files.push(entryPath);
    }
  }

  return files;
}

function parseArgs(argv) {
  const options = {
    manifests: [],
    responsesDir: path.join(repoRoot, 'responses'),
    json: false,
    output: null,
    outputDir: null,
    format: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === '--manifest' && argv[index + 1]) {
      options.manifests.push(argv[index + 1]);
      index += 1;
      continue;
    }

    if (token === '--responses-dir' && argv[index + 1]) {
      options.responsesDir = argv[index + 1];
      index += 1;
      continue;
    }

    if (token === '--json') {
      options.json = true;
      continue;
    }

    if (token === '--format' && argv[index + 1]) {
      options.format = argv[index + 1];
      index += 1;
      continue;
    }

    if (token === '--output' && argv[index + 1]) {
      options.output = argv[index + 1];
      index += 1;
      continue;
    }

    if (token === '--output-dir' && argv[index + 1]) {
      options.outputDir = argv[index + 1];
      index += 1;
      continue;
    }

    if (token === '--help' || token === '-h') {
      options.help = true;
      continue;
    }

    if (!token.startsWith('--') && options.manifests.length === 0) {
      options.manifests.push(token);
    }
  }

  return options;
}

function loadManifest(manifestPath) {
  return readFile(manifestPath, 'utf8').then((text) => JSON.parse(text));
}

function containsAny(text, needles) {
  return needles.filter((needle) => text.includes(needle));
}

function buildResponseCandidates(responsesDir, skillName, evalId) {
  return [
    path.join(responsesDir, skillName, `${evalId}.txt`),
    path.join(responsesDir, skillName, `${evalId}.md`),
    path.join(responsesDir, skillName, 'all.txt'),
    path.join(responsesDir, skillName, 'all.md'),
  ];
}

function extractEvalSection(responseText, evalId) {
  const sectionPattern = new RegExp(`^##\\s+Eval\\s+${evalId}\\s*$`, 'm');
  const match = sectionPattern.exec(responseText);

  if (!match) {
    return responseText;
  }

  const startIndex = match.index + match[0].length;
  const remainder = responseText.slice(startIndex);
  const nextSectionMatch = /^##\s+Eval\s+\d+\s*$/m.exec(remainder);

  return nextSectionMatch ? remainder.slice(0, nextSectionMatch.index) : remainder;
}

function buildReportData(summary, totalChecks, passedChecks, failedEvals) {
  return {
    generatedAt: new Date().toISOString(),
    overall: {
      totalEvals: summary.filter((item) => !item.error).length,
      failedEvals,
      totalChecks,
      passedChecks,
      score: totalChecks === 0 ? 100 : Math.round((passedChecks / totalChecks) * 100),
    },
    manifests: summary,
  };
}

function renderMarkdownReport(report) {
  const lines = [
    '# Eval Report',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    '## Overall',
    '',
    `- Total eval manifests: ${report.overall.totalEvals}`,
    `- Failed eval manifests: ${report.overall.failedEvals}`,
    `- Passed checks: ${report.overall.passedChecks}/${report.overall.totalChecks}`,
    `- Score: ${report.overall.score}%`,
    '',
    '## Manifests',
    '',
  ];

  for (const item of report.manifests) {
    lines.push(`### ${item.manifest}`);
    lines.push('');

    if (item.error) {
      lines.push('- Status: FAIL');
      lines.push(`- Error: ${item.error}`);
      lines.push('');
      continue;
    }

    lines.push(`- Skill: ${item.skill}`);
    lines.push(`- Status: ${item.passed ? 'PASS' : 'FAIL'}`);
    lines.push('');

    for (const result of item.results) {
      lines.push(`#### Eval ${result.id}`);
      lines.push('');
      lines.push(`- Status: ${result.passed ? 'PASS' : 'FAIL'}`);
      lines.push(`- Score: ${result.score}%`);
      lines.push(`- Response: ${result.responsePath ?? 'missing'}`);
      lines.push('');

      for (const check of result.checks) {
        lines.push(`- ${check.pass ? 'PASS' : 'FAIL'} ${check.label}: ${check.detail}`);
      }

      lines.push('');
    }
  }

  return `${lines.join('\n').trimEnd()}\n`;
}

async function writeReportFiles(options, report) {
  if (options.outputDir) {
    const outputDirectory = path.resolve(repoRoot, options.outputDir);
    await mkdir(outputDirectory, { recursive: true });
    const jsonPath = path.join(outputDirectory, 'eval-report.json');
    const markdownPath = path.join(outputDirectory, 'eval-report.md');
    await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    await writeFile(markdownPath, renderMarkdownReport(report), 'utf8');
    return [path.relative(repoRoot, jsonPath), path.relative(repoRoot, markdownPath)];
  }

  if (options.output) {
    const outputFile = path.resolve(repoRoot, options.output);
    await mkdir(path.dirname(outputFile), { recursive: true });
    const format = options.format || (path.extname(outputFile).toLowerCase() === '.md' ? 'markdown' : 'json');
    const outputText = format === 'markdown'
      ? renderMarkdownReport(report)
      : `${JSON.stringify(report, null, 2)}\n`;
    await writeFile(outputFile, outputText, 'utf8');
    return [path.relative(repoRoot, outputFile)];
  }

  return [];
}

const options = parseArgs(process.argv.slice(2));

if (options.help) {
  console.log(`Usage: node scripts/run-evals.mjs [--manifest evals/<skill>/evals.json] [--responses-dir responses] [--json] [--format json|markdown] [--output file] [--output-dir dir]`);
  process.exit(0);
}

const manifestPaths = options.manifests.length > 0
  ? options.manifests.map((manifestPath) => path.resolve(repoRoot, manifestPath))
  : (await exists(evalsRoot) ? await walk(evalsRoot) : []);

const responsesDir = path.resolve(repoRoot, options.responsesDir);
const summary = [];
let totalChecks = 0;
let passedChecks = 0;
let failedEvals = 0;

for (const manifestPath of manifestPaths) {
  if (!(await exists(manifestPath))) {
    summary.push({ manifest: path.relative(repoRoot, manifestPath), error: 'manifest not found' });
    failedEvals += 1;
    continue;
  }

  let manifest;

  try {
    manifest = await loadManifest(manifestPath);
  } catch (error) {
    summary.push({ manifest: path.relative(repoRoot, manifestPath), error: `invalid JSON (${error.message})` });
    failedEvals += 1;
    continue;
  }

  const manifestKey = manifest.skill_name || path.basename(path.dirname(manifestPath));
  const manifestResults = [];
  let manifestPassed = true;

  for (const evalCase of Array.isArray(manifest.evals) ? manifest.evals : []) {
    const responseCandidates = buildResponseCandidates(responsesDir, manifestKey, evalCase.id);

    let responsePath = null;
    let responseText = null;

    for (const candidateFile of responseCandidates) {
      if (await exists(candidateFile)) {
        responsePath = candidateFile;
        responseText = await readFile(candidateFile, 'utf8');
        if (path.basename(candidateFile) === 'all.txt' || path.basename(candidateFile) === 'all.md') {
          responseText = extractEvalSection(responseText, evalCase.id);
        }
        break;
      }
    }

    const checks = [];

    if (Array.isArray(evalCase.must_contain_any) && evalCase.must_contain_any.length > 0) {
      const matches = responseText ? containsAny(responseText, evalCase.must_contain_any) : [];
      checks.push({
        label: 'must_contain_any',
        pass: matches.length > 0,
        detail: responseText
          ? (matches.length > 0 ? `matched ${matches.map((item) => JSON.stringify(item)).join(', ')}` : 'no required token matched')
          : 'response file missing',
      });
    }

    if (Array.isArray(evalCase.must_not_contain) && evalCase.must_not_contain.length > 0) {
      const offenders = responseText ? evalCase.must_not_contain.filter((needle) => responseText.includes(needle)) : evalCase.must_not_contain;
      checks.push({
        label: 'must_not_contain',
        pass: offenders.length === 0,
        detail: responseText
          ? (offenders.length === 0 ? 'no forbidden tokens found' : `found ${offenders.map((item) => JSON.stringify(item)).join(', ')}`)
          : 'response file missing',
      });
    }

    const evalPassed = checks.every((check) => check.pass) && Boolean(responseText);
    const evalCheckCount = checks.length;
    const evalPassedChecks = checks.filter((check) => check.pass).length;

    totalChecks += evalCheckCount;
    passedChecks += evalPassedChecks;
    manifestPassed = manifestPassed && evalPassed;

    manifestResults.push({
      id: evalCase.id,
      responsePath: responsePath ? path.relative(repoRoot, responsePath) : null,
      passed: evalPassed,
      score: evalCheckCount === 0 ? 100 : Math.round((evalPassedChecks / evalCheckCount) * 100),
      checks,
    });
  }

  if (!manifestPassed) {
    failedEvals += 1;
  }

  summary.push({
    manifest: path.relative(repoRoot, manifestPath),
    skill: manifest.skill_name,
    passed: manifestPassed,
    results: manifestResults,
  });
}

const report = buildReportData(summary, totalChecks, passedChecks, failedEvals);
const requestedFormat = options.format || (options.json ? 'json' : null);

if (options.output || options.outputDir) {
  const writtenFiles = await writeReportFiles(options, report);
  if (writtenFiles.length > 0) {
    console.log(`Wrote report file${writtenFiles.length > 1 ? 's' : ''}: ${writtenFiles.join(', ')}`);
  }
}

if (requestedFormat === 'json') {
  console.log(JSON.stringify(report, null, 2));
  process.exit(failedEvals > 0 ? 1 : 0);
}

if (requestedFormat === 'markdown') {
  console.log(renderMarkdownReport(report));
  process.exit(failedEvals > 0 ? 1 : 0);
}

if (summary.length === 0) {
  console.log('No eval manifests found under evals/.');
  process.exit(0);
}

for (const item of summary) {
  if (item.error) {
    console.log(`[FAIL] ${item.manifest} - ${item.error}`);
    continue;
  }

  const manifestStatus = item.passed ? 'PASS' : 'FAIL';
  console.log(`[${manifestStatus}] ${item.manifest} (${item.skill})`);

  for (const result of item.results) {
    const resultStatus = result.passed ? 'PASS' : 'FAIL';
    console.log(`  [${resultStatus}] eval ${result.id} - ${result.score}%`);
    console.log(`    response: ${result.responsePath ?? 'missing'}`);

    for (const check of result.checks) {
      const checkStatus = check.pass ? 'PASS' : 'FAIL';
      console.log(`    - ${checkStatus} ${check.label}: ${check.detail}`);
    }
  }
}

console.log(`Overall score: ${totalChecks === 0 ? 100 : Math.round((passedChecks / totalChecks) * 100)}% (${passedChecks}/${totalChecks} checks passed)`);

process.exit(failedEvals > 0 ? 1 : 0);