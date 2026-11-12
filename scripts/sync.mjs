#!/usr/bin/env node

// Local-first synchronization CLI for accessibility-skills and ACCESSIBILITY.md.
//
// This is a thin, deterministic wrapper around scripts/sync-check.sh. It adds
// repository discovery, status/diff/review/report commands, and safe metadata
// updates. It uses only Git, Node.js built-ins, and the existing shell engine.
//
// No model, network, GitHub API, or paid service is used.

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, '..');
const ENGINE = join(REPO_ROOT, 'scripts', 'sync-check.sh');
const EXPECTED = {
  canonical: { slug: 'mgifford/ACCESSIBILITY.md', markers: ['AGENTS.md', 'examples/README.md'] },
  skills: { slug: 'mgifford/accessibility-skills', markers: ['skills', 'scripts/sync-check.sh'] },
};

const DECISION_MAP = {
  update: 'updated',
  updated: 'updated',
  'no-update': 'no-update-needed',
  'no-update-needed': 'no-update-needed',
  divergence: 'intentional-divergence',
  'intentional-divergence': 'intentional-divergence',
  defer: 'deferred',
  'further-review-required': 'further-review-required',
};

function usage() {
  console.log(`Usage: node scripts/sync.mjs <command> [options]

Commands:
  status                 Repository state, review items, vocabulary, and errors
  list                   List skill mappings and shared-vocabulary consumers
  diff [--skill NAME]    Show canonical changes since the recorded revision
  review [options]       Record a review decision without editing SKILL.md
  validate               Run deterministic sync, metadata, and test checks
  report                 Produce a Markdown or JSON report

Discovery precedence:
  1. --canonical PATH / --skills PATH
  2. ACCESSIBILITY_MD_DIR / ACCESSIBILITY_SKILLS_DIR
  3. sync.config.yaml or .accessibility-sync.local.yaml
  4. Sibling-directory detection
  5. A clear error with instructions

Options:
  --canonical PATH       ACCESSIBILITY.md checkout
  --skills PATH          accessibility-skills checkout
  --config PATH          Configuration file
  --skill NAME           Limit diff/review to one skill
  --all                  All items (diff/review)
  --decision NAME        update | no-update | divergence | defer
  --note TEXT            Review note (required when recording a decision)
  --dry-run              Show metadata changes without writing
  --show-skill           Include the current SKILL.md in diff output
  --format markdown|json Report format (default: markdown)
  --output PATH          Write report to a file
  --validate             Include validation results in report
  --no-tests             validate/report: skip the Node test suites
  --interactive          review: prompt for decisions when stdin is a TTY
  --allow-remote-mismatch  Continue when markers match but origin differs
  --help                 Show this help

Examples:
  npm run sync:status
  npm run sync:diff -- --skill forms
  npm run sync:review -- --skill forms --decision no-update --note "No material change"
  npm run sync:validate
  npm run sync:report -- --output sync-report.md

A source update may be reviewed without changing the skill. Recording
no-update-needed or intentional-divergence advances the reviewed source
revision; recording defer leaves synchronization metadata unchanged.
`);
}

function parseArgs(argv) {
  const options = { command: argv[0] || 'status', _: [] };
  const take = (index, name) => {
    if (index + 1 >= argv.length) throw new Error(`${name} requires a value`);
    return argv[index + 1];
  };
  for (let i = 1; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case '--canonical': options.canonical = take(i, arg); i += 1; break;
      case '--skills': options.skills = take(i, arg); i += 1; break;
      case '--config': options.config = take(i, arg); i += 1; break;
      case '--skill': options.skill = take(i, arg); i += 1; break;
      case '--decision': options.decision = take(i, arg); i += 1; break;
      case '--note': options.note = take(i, arg); i += 1; break;
      case '--format': options.format = take(i, arg); i += 1; break;
      case '--output': options.output = take(i, arg); i += 1; break;
      case '--all': options.all = true; break;
      case '--dry-run': options.dryRun = true; break;
      case '--show-skill': options.showSkill = true; break;
      case '--validate': options.validate = true; break;
      case '--no-tests': options.noTests = true; break;
      case '--interactive': options.interactive = true; break;
      case '--allow-remote-mismatch': options.allowRemoteMismatch = true; break;
      case '--help': case '-h': options.help = true; break;
      default:
        if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
        options._.push(arg);
    }
  }
  return options;
}

function run(command, args, cwd, { allowFailure = false, env = {} } = {}) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
  if (result.error) throw result.error;
  if (!allowFailure && result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed in ${cwd}\n${result.stdout}\n${result.stderr}`);
  }
  return result;
}

function git(cwd, args, options = {}) {
  return run('git', args, cwd, options);
}

function gitOutput(cwd, args) {
  return git(cwd, args).stdout.trim();
}

function findGitRoot(inputPath) {
  if (!inputPath) return null;
  const absolute = resolve(inputPath);
  if (!existsSync(absolute)) return null;
  const result = git(absolute, ['rev-parse', '--show-toplevel'], { allowFailure: true });
  if (result.status !== 0) return null;
  return result.stdout.trim();
}

function readConfigFile(configPath) {
  if (!existsSync(configPath)) return null;
  const text = readFileSync(configPath, 'utf8');
  if (configPath.endsWith('.json')) {
    return JSON.parse(text);
  }
  const config = { repositories: {}, sync: {} };
  let section = null;
  let repository = null;
  for (const rawLine of text.split('\n')) {
    const line = rawLine.replace(/\s+#.*$/, '');
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (/^repositories:\s*$/.test(line)) { section = 'repositories'; repository = null; continue; }
    if (/^sync:\s*$/.test(line)) { section = 'sync'; repository = null; continue; }
    const repoMatch = line.match(/^  (canonical|skills):\s*$/);
    if (section === 'repositories' && repoMatch) {
      repository = repoMatch[1];
      config.repositories[repository] = {};
      continue;
    }
    const fieldMatch = line.match(/^    (path|remote):\s*(.+)$/);
    if (section === 'repositories' && repository && fieldMatch) {
      config.repositories[repository][fieldMatch[1]] = fieldMatch[2].replace(/^["']|["']$/g, '').trim();
      continue;
    }
    const syncMatch = line.match(/^  (base_ref|mode):\s*(.+)$/);
    if (section === 'sync' && syncMatch) {
      config.sync[syncMatch[1]] = syncMatch[2].replace(/^["']|["']$/g, '').trim();
    }
  }
  return config;
}

function findConfig(explicit) {
  if (explicit) {
    const absolute = resolve(explicit);
    if (!existsSync(absolute)) throw new Error(`Configuration file not found: ${absolute}`);
    return { path: absolute, data: readConfigFile(absolute) };
  }
  const candidates = [
    join(process.cwd(), '.accessibility-sync.local.yaml'),
    join(process.cwd(), 'sync.config.yaml'),
    join(process.cwd(), 'sync.config.json'),
    join(REPO_ROOT, '.accessibility-sync.local.yaml'),
    join(REPO_ROOT, 'sync.config.yaml'),
    join(REPO_ROOT, 'sync.config.json'),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return { path: candidate, data: readConfigFile(candidate) };
    }
  }
  return null;
}

function validateRepository(root, kind, options) {
  if (!root) return null;
  const absolute = resolve(root);
  const expected = EXPECTED[kind];
  const missingMarkers = expected.markers.filter((marker) => !existsSync(join(absolute, marker)));
  if (missingMarkers.length > 0) {
    throw new Error(
      `${kind} path does not look like ${expected.slug}: ${absolute}\n` +
      `Missing: ${missingMarkers.join(', ')}\n` +
      'Provide the repository root, not a subdirectory or an unrelated checkout.'
    );
  }
  const remoteResult = git(absolute, ['remote', 'get-url', 'origin'], { allowFailure: true });
  const remote = remoteResult.status === 0 ? remoteResult.stdout.trim() : '';
  if (remote && !remote.includes(expected.slug) && !options.allowRemoteMismatch) {
    throw new Error(
      `${kind} checkout at ${absolute} has origin ${remote}, expected ${expected.slug}.\n` +
      'Use --allow-remote-mismatch only if this is an intentional fork.'
    );
  }
  return absolute;
}

function discover(options) {
  const config = findConfig(options.config);
  const configDir = config ? dirname(config.path) : process.cwd();
  const fromConfig = (kind, field) => {
    const value = config?.data?.repositories?.[kind]?.[field];
    return value ? resolve(configDir, value) : null;
  };

  const canonicalInput = options.canonical || process.env.ACCESSIBILITY_MD_DIR || fromConfig('canonical', 'path');
  const skillsInput = options.skills || process.env.ACCESSIBILITY_SKILLS_DIR || fromConfig('skills', 'path');

  let canonicalRoot = canonicalInput ? findGitRoot(canonicalInput) : null;
  let skillsRoot = skillsInput ? findGitRoot(skillsInput) : null;

  if (canonicalInput && !canonicalRoot) {
    throw new Error(`The supplied canonical path is not inside a Git checkout: ${canonicalInput}`);
  }
  if (skillsInput && !skillsRoot) {
    throw new Error(`The supplied skills path is not inside a Git checkout: ${skillsInput}`);
  }

  if (!canonicalRoot && !skillsRoot) {
    const cwdRoot = findGitRoot(process.cwd());
    if (cwdRoot) {
      if (existsSync(join(cwdRoot, 'skills')) && existsSync(join(cwdRoot, 'scripts', 'sync-check.sh'))) {
        skillsRoot = cwdRoot;
      } else if (existsSync(join(cwdRoot, 'examples', 'README.md')) && existsSync(join(cwdRoot, 'AGENTS.md'))) {
        canonicalRoot = cwdRoot;
      }
    }
  }

  if (!canonicalRoot && skillsRoot) canonicalRoot = findGitRoot(join(skillsRoot, '..', 'ACCESSIBILITY.md'));
  if (!skillsRoot && canonicalRoot) skillsRoot = findGitRoot(join(canonicalRoot, '..', 'accessibility-skills'));

  if (!canonicalRoot) {
    throw new Error(
      'Cannot locate the ACCESSIBILITY.md checkout.\n' +
      'Provide --canonical PATH, set ACCESSIBILITY_MD_DIR, add repositories.canonical.path to sync.config.yaml, or place the repositories as siblings.'
    );
  }
  if (!skillsRoot) {
    throw new Error(
      'Cannot locate the accessibility-skills checkout.\n' +
      'Provide --skills PATH, set ACCESSIBILITY_SKILLS_DIR, add repositories.skills.path to sync.config.yaml, or place the repositories as siblings.'
    );
  }

  canonicalRoot = validateRepository(canonicalRoot, 'canonical', options);
  skillsRoot = validateRepository(skillsRoot, 'skills', options);

  return {
    canonical: canonicalRoot,
    skills: skillsRoot,
    config: config?.data || null,
    configPath: config?.path || null,
  };
}

function repoInfo(root) {
  const branch = gitOutput(root, ['rev-parse', '--abbrev-ref', 'HEAD']);
  const head = gitOutput(root, ['rev-parse', 'HEAD']);
  const porcelain = gitOutput(root, ['status', '--porcelain']);
  const dirty = porcelain.split('\n').filter(Boolean);
  return { root, branch, head, dirty, clean: dirty.length === 0 };
}

function engine(repos, args = []) {
  const result = run('bash', [join(repos.skills, 'scripts', 'sync-check.sh'), ...args], repos.skills, {
    allowFailure: true,
    env: { ACCESSIBILITY_MD_DIR: repos.canonical },
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

function parseStatusLines(output) {
  const items = [];
  const vocabulary = [];
  for (const line of output.split('\n')) {
    const match = line.match(/^\[([^\]]+)\]\s+(\S+)(.*)$/);
    if (!match) continue;
    const [, label, name, rest] = match;
    if (label.startsWith('VOCAB')) {
      vocabulary.push({ label, name, detail: rest.trim() });
    } else {
      items.push({ label, name, detail: rest.trim() });
    }
  }
  return { items, vocabulary };
}

function statusFor(item) {
  switch (item.label) {
    case 'SYNCED': return 'SYNCED';
    case 'INTENTIONAL DIVERGENCE': return 'INTENTIONAL_DIVERGENCE';
    case 'REVIEW REQUIRED': return 'REVIEW_REQUIRED';
    case 'EXTERNAL REVIEW DUE': return 'REVIEW_REQUIRED';
    case 'DEFERRED': return 'DEFERRED';
    case 'ORPHAN': return 'MISSING_SOURCE';
    case 'MISSING SKILL': return 'MISSING_SKILL';
    case 'MISSING SYNC': return 'INVALID_METADATA';
    case 'STALE METADATA': return 'INVALID_METADATA';
    case 'MISMATCH': return 'INVALID_METADATA';
    case 'INCONSISTENT': return 'INVALID_METADATA';
    case 'UNKNOWN': return 'UNVERIFIED';
    case 'N/A': return 'NOT_APPLICABLE';
    case 'EXTERNAL': return 'EXTERNAL';
    default: return 'UNVERIFIED';
  }
}

function statusSummary(parsed) {
  const summary = {};
  for (const item of parsed.items) {
    const status = statusFor(item);
    summary[status] = (summary[status] || 0) + 1;
  }
  return summary;
}

function printRepositoryInfo(repos) {
  for (const [kind, root] of [['canonical', repos.canonical], ['skills', repos.skills]]) {
    const info = repoInfo(root);
    console.log(`${kind}: ${info.root}`);
    console.log(`  branch: ${info.branch}`);
    console.log(`  HEAD:   ${info.head}`);
    console.log(`  tree:   ${info.clean ? 'clean' : `dirty (${info.dirty.length} path(s))`}`);
    if (!info.clean) {
      console.log('  note:   status uses committed history; uncommitted canonical changes are not source revisions');
    }
  }
  if (repos.configPath) console.log(`config: ${repos.configPath}`);
}

function readSyncFile(repos, skill) {
  const file = join(repos.skills, 'skills', skill, 'SYNC.md');
  if (!existsSync(file)) return null;
  const text = readFileSync(file, 'utf8');
  const fields = {};
  for (const line of text.split('\n')) {
    const match = line.match(/^([a-z_]+):\s*(.*)$/);
    if (match) {
      const [, key, value] = match;
      if (!(key in fields)) fields[key] = value.replace(/^"(.*)"$/, '$1').trim();
    }
  }
  return { file, text, fields };
}

function latestCommit(repos, sourcePath) {
  const result = git(repos.canonical, ['log', '-1', '--format=%H', '--', sourcePath], { allowFailure: true });
  return result.status === 0 ? result.stdout.trim() : '';
}

function vocabularyRows(repos) {
  const file = join(repos.skills, 'VOCABULARY_SYNC.md');
  if (!existsSync(file)) return [];
  const rows = [];
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    if (!line.startsWith('| `examples/')) continue;
    const cells = line.split('|').map((cell) => cell.trim());
    const source = (cells[1] || '').replace(/`/g, '');
    const consumers = [...(cells[3] || '').matchAll(/`([^`]+)`/g)].map((match) => match[1]);
    if (source) rows.push({ source, consumers });
  }
  return rows;
}

function relatedVocabulary(repos, skill) {
  const consumerPath = `skills/${skill}/SKILL.md`;
  return vocabularyRows(repos).filter((row) => row.consumers.includes(consumerPath));
}

function commandStatus(repos) {
  printRepositoryInfo(repos);
  const sync = engine(repos);
  const vocab = engine(repos, ['--vocab']);
  const parsed = parseStatusLines(`${sync.stdout}\n${vocab.stdout}`);
  const summary = statusSummary(parsed);

  console.log('\nSkill status:');
  if (parsed.items.length === 0) console.log('  (no skill records found)');
  for (const item of parsed.items) {
    console.log(`  ${statusFor(item).padEnd(24)} ${item.name}${item.detail ? ` ${item.detail}` : ''}`);
  }

  console.log('\nSummary:');
  for (const [status, count] of Object.entries(summary).sort()) {
    console.log(`  ${status.padEnd(24)} ${count}`);
  }

  const reviewItems = parsed.items.filter((item) => ['REVIEW_REQUIRED', 'DEFERRED', 'INVALID_METADATA', 'MISSING_SOURCE', 'MISSING_SKILL', 'UNVERIFIED'].includes(statusFor(item)));
  if (reviewItems.length > 0) {
    console.log('\nNext steps:');
    for (const item of reviewItems) {
      console.log(`  npm run sync:diff -- --skill ${item.name}`);
    }
  }
  const vocabReview = parsed.vocabulary.filter((item) => item.label === 'VOCAB REVIEW REQUIRED');
  if (vocabReview.length > 0) {
    console.log('\nShared vocabulary needs review:');
    for (const item of vocabReview) console.log(`  ${item.name}`);
  }

  if (sync.status === 2 || vocab.status === 2) return 2;
  if (sync.status === 1 || vocab.status === 1) return 1;
  return 0;
}

function commandList(repos) {
  const skillsRoot = join(repos.skills, 'skills');
  const skills = readdirSync(skillsRoot).filter((name) => statSync(join(skillsRoot, name)).isDirectory()).sort();
  const parsed = parseStatusLines(engine(repos).stdout);
  const statusByName = new Map(parsed.items.map((item) => [item.name, statusFor(item)]));
  console.log('Skill mappings:');
  for (const skill of skills) {
    const skillFile = join(skillsRoot, skill, 'SKILL.md');
    if (!existsSync(skillFile)) continue;
    const sync = readSyncFile(repos, skill);
    if (!sync) {
      console.log(`  ${skill}\tMISSING SYNC.md`);
      continue;
    }
    const source = sync.fields.canonical_source || '';
    const mode = sync.fields.sync_mode || 'canonical';
    const recorded = sync.fields.last_synced_commit || '';
    const latest = source ? latestCommit(repos, source) : '';
    let status = statusByName.get(skill) || 'UNVERIFIED';
    if (mode === 'not-applicable') status = 'NOT_APPLICABLE';
    else if (mode === 'external') status = 'EXTERNAL';
    console.log(`  ${skill}\t${status}\t${source || '(none)'}\trecorded=${recorded || '(none)'}\tlatest=${latest || '(unknown)'}`);
  }

  console.log('\nShared vocabulary consumers:');
  for (const row of vocabularyRows(repos)) {
    const exists = existsSync(join(repos.canonical, row.source));
    console.log(`  ${row.source}\t${exists ? 'FOUND' : 'MISSING_SOURCE'}`);
    for (const consumer of row.consumers) {
      console.log(`    -> ${consumer}${existsSync(join(repos.skills, consumer)) ? '' : ' [MISSING CONSUMER]'}`);
    }
  }

  console.log('\nUnmapped skill directories:');
  let unmapped = 0;
  for (const skill of skills) {
    if (!existsSync(join(skillsRoot, skill, 'SKILL.md'))) continue;
    if (!existsSync(join(skillsRoot, skill, 'SYNC.md'))) {
      console.log(`  ${skill}`);
      unmapped += 1;
    }
  }
  if (unmapped === 0) console.log('  (none)');
  return 0;
}

function commandDiff(repos, options) {
  const sync = engine(repos);
  const parsed = parseStatusLines(sync.stdout);
  let skills = options.all
    ? parsed.items.map((item) => item.name)
    : options.skill
      ? [options.skill]
      : parsed.items.filter((item) => statusFor(item) === 'REVIEW_REQUIRED').map((item) => item.name);

  if (!options.all && !options.skill) {
    skills = [...new Set(skills)];
  }
  if (skills.length === 0) {
    console.log('No skills currently need review.');
    return 0;
  }

  for (const skill of skills) {
    const syncFile = readSyncFile(repos, skill);
    if (!syncFile) {
      console.log(`\n${skill}: missing SYNC.md`);
      continue;
    }
    const source = syncFile.fields.canonical_source;
    const recorded = syncFile.fields.last_synced_commit;
    const latest = source ? latestCommit(repos, source) : '';
    console.log(`\n=== ${skill} ===`);
    console.log(`canonical source: ${source || '(missing)'}`);
    console.log(`recorded commit:  ${recorded || '(missing)'}`);
    console.log(`current commit:   ${latest || '(unknown)'}`);
    console.log(`skill file:       skills/${skill}/SKILL.md`);
    console.log(`review decision:  ${syncFile.fields.review_decision || '(none)'}`);
    const divergence = syncFile.text.match(/DIVERGENCE:[\s\S]{0,500}/i);
    if (divergence) {
      console.log('documented divergence:');
      console.log(divergence[0].split('\n').slice(0, 8).map((line) => `  ${line}`).join('\n'));
    }

    const related = relatedVocabulary(repos, skill);
    if (related.length > 0) {
      console.log('shared vocabulary dependencies:');
      for (const row of related) {
        const recordedVocab = readFileSync(join(repos.skills, 'VOCABULARY_SYNC.md'), 'utf8')
          .split('\n').find((line) => line.includes(`  ${row.source}:`));
        console.log(`  ${row.source} (${recordedVocab ? recordedVocab.trim() : 'recorded revision not found'})`);
      }
    }

    if (!source || !latest) {
      console.log('Cannot show a diff: source or current commit is unavailable.');
      continue;
    }
    if (!recorded) {
      console.log('Cannot show a diff: no last_synced_commit is recorded.');
      continue;
    }
    const recordedExists = git(repos.canonical, ['cat-file', '-e', `${recorded}^{commit}`], { allowFailure: true }).status === 0;
    if (!recordedExists) {
      console.log(`Recorded commit ${recorded} is not present in this checkout. Fetch full history or provide the correct checkout.`);
      continue;
    }
    if (recorded === latest) {
      console.log('No canonical change since the recorded revision.');
    } else {
      const stat = git(repos.canonical, ['diff', '--stat', recorded, latest, '--', source], { allowFailure: true }).stdout;
      const diff = git(repos.canonical, ['diff', recorded, latest, '--', source], { allowFailure: true }).stdout;
      console.log(stat.trim() || '(no textual diff)');
      console.log('');
      console.log(diff.trim() || '(no textual diff)');
    }
    if (options.showSkill) {
      const skillPath = join(repos.skills, 'skills', skill, 'SKILL.md');
      console.log(`\n--- current SKILL.md (${relative(repos.skills, skillPath)}) ---`);
      console.log(readFileSync(skillPath, 'utf8'));
    }
  }
  return 0;
}

function setField(text, key, value) {
  const line = `${key}: ${value}`;
  const pattern = new RegExp(`^${key}:.*$`, 'm');
  if (pattern.test(text)) return text.replace(pattern, line);
  const anchor = /^last_synced_date:.*$/m;
  if (anchor.test(text)) return text.replace(anchor, (match) => `${match}\n${line}`);
  return text.replace(/^canonical_source:.*$/m, (match) => `${match}\n${line}`);
}

function appendReviewHistory(text, note) {
  const entry = `- ${note}`;
  if (text.includes('## Review history')) {
    return `${text.trimEnd()}\n${entry}\n`;
  }
  return `${text.trimEnd()}\n\n## Review history\n\n${entry}\n`;
}

function recordDecision(repos, skill, decision, note, options) {
  const canonicalDecision = DECISION_MAP[decision];
  if (!canonicalDecision) {
    throw new Error(`Unknown decision: ${decision}. Use update, no-update, divergence, or defer.`);
  }
  if (!note || !note.trim()) throw new Error('--note is required so the review is traceable.');

  const syncFile = readSyncFile(repos, skill);
  if (!syncFile) throw new Error(`No SYNC.md found for ${skill}`);
  const source = syncFile.fields.canonical_source;
  if (!source) throw new Error(`${skill} has no canonical_source`);
  const latest = latestCommit(repos, source);
  if (!latest) throw new Error(`Cannot determine the current canonical commit for ${source}`);

  const canonicalInfo = repoInfo(repos.canonical);
  if (!canonicalInfo.clean) {
    throw new Error(
      'The canonical checkout has uncommitted changes. Commit them before recording a review decision so the reviewed revision is traceable.'
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const info = repoInfo(repos.skills);
  if (!info.clean) {
    console.log(`warning: ${repos.skills} has uncommitted changes; the metadata edit will be mixed with them.`);
  }

  let text = syncFile.text;
  const shortNote = note.replace(/\s+/g, ' ').trim();
  if (canonicalDecision === 'deferred') {
    text = setField(text, 'review_decision', 'deferred');
    text = setField(text, 'deferred_source_commit', `"${latest}"`);
    text = setField(text, 'deferred_date', `"${today}"`);
    text = appendReviewHistory(text, `${today} deferred at ${latest}: ${shortNote}`);
  } else if (canonicalDecision === 'further-review-required') {
    text = appendReviewHistory(text, `${today} deferred at ${latest}: ${shortNote}`);
  } else {
    text = setField(text, 'last_synced_commit', `"${latest}"`);
    text = setField(text, 'last_synced_date', `"${today}"`);
    text = setField(text, 'last_reviewed_commit', `"${latest}"`);
    text = setField(text, 'review_decision', canonicalDecision);
    if (canonicalDecision === 'intentional-divergence') {
      text = setField(text, 'intentional_divergence_note', `"${shortNote.replace(/"/g, '\\"')}"`);
    }
    text = appendReviewHistory(text, `${today} reviewed ${latest}: ${canonicalDecision} - ${shortNote}`);
  }

  if (options.dryRun) {
    console.log(`--- proposed ${relative(repos.skills, syncFile.file)} ---`);
    console.log(text);
    return 0;
  }
  writeFileSync(syncFile.file, text);
  console.log(`Recorded ${canonicalDecision} for ${skill} at ${latest}`);
  if (canonicalDecision === 'further-review-required') {
    console.log('Deferred review: synchronization metadata was not advanced.');
  }
  return 0;
}

async function promptDecision(skill) {
  const readline = await import('node:readline/promises');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await rl.question(`Decision for ${skill} [u]pdate/[n]o change/[i]ntentional divergence/[d]efer/[s]kip: `);
    const map = { u: 'update', n: 'no-update', i: 'divergence', d: 'defer' };
    const decision = map[answer.trim().toLowerCase()];
    if (!decision) return null;
    const note = await rl.question('Review note: ');
    return { decision, note };
  } finally {
    rl.close();
  }
}

async function commandReview(repos, options) {
  const sync = engine(repos);
  const parsed = parseStatusLines(sync.stdout);
  const reviewItems = parsed.items.filter((item) => ['REVIEW_REQUIRED', 'DEFERRED', 'INVALID_METADATA', 'MISSING_SOURCE', 'MISSING_SKILL', 'UNVERIFIED'].includes(statusFor(item)));

  if (options.skill && options.decision) {
    return recordDecision(repos, options.skill, options.decision, options.note, options);
  }
  if (options.skill && !options.decision) {
    throw new Error('--decision is required with --skill when recording a review. Use update, no-update, divergence, or defer.');
  }
  if (reviewItems.length === 0) {
    console.log('No review decisions are required.');
    return 0;
  }
  if (options.interactive && process.stdin.isTTY) {
    for (const item of reviewItems) {
      if (!['REVIEW_REQUIRED', 'DEFERRED', 'INVALID_METADATA'].includes(statusFor(item))) continue;
      const answer = await promptDecision(item.name);
      if (!answer) {
        console.log(`Skipped ${item.name}`);
        continue;
      }
      recordDecision(repos, item.name, answer.decision, answer.note, options);
    }
    return 0;
  }
  console.log('The following skills need a review decision:\n');
  for (const item of reviewItems) {
    console.log(`  ${item.name}: ${item.detail || item.label}`);
  }
  console.log('\nRecord a decision without editing SKILL.md:');
  console.log('  npm run sync:review -- --skill <name> --decision <update|no-update|divergence|defer> --note "..."');
  console.log('Use --dry-run to inspect the metadata change, or --interactive in a terminal.');
  return 1;
}

function runNodeTests(repos, options) {
  const commands = [
    ['node', ['tests/test-sync-check.mjs']],
    ['node', ['tests/test-sync-cli.mjs']],
    ['node', ['tests/test-upsert-issue.mjs']],
    ['node', ['tests/test-repo-invariants.mjs']],
    ['node', ['scripts/validate-evals.mjs']],
  ];
  if (options.noTests) return [];
  const results = [];
  for (const [command, args] of commands) {
    const result = run(command, args, repos.skills, { allowFailure: true });
    results.push({ command: `${command} ${args.join(' ')}`, status: result.status, stdout: result.stdout, stderr: result.stderr });
  }
  return results;
}

function commandValidate(repos, options) {
  printRepositoryInfo(repos);
  const sync = engine(repos);
  const vocab = engine(repos, ['--vocab']);
  process.stdout.write(sync.stdout);
  process.stdout.write(vocab.stdout);
  const tests = runNodeTests(repos, options);
  for (const test of tests) {
    console.log(`\n=== ${test.command} ===`);
    process.stdout.write(test.stdout);
    if (test.stderr) process.stderr.write(test.stderr);
  }
  const failed = sync.status !== 0 || vocab.status !== 0 || tests.some((test) => test.status !== 0);
  console.log(`\nValidation: ${failed ? 'FAILED' : 'PASSED'}`);
  return failed ? 1 : 0;
}

function reportData(repos, options) {
  const sync = engine(repos);
  const vocab = engine(repos, ['--vocab']);
  const parsed = parseStatusLines(`${sync.stdout}\n${vocab.stdout}`);
  const summary = statusSummary(parsed);
  const details = parsed.items.map((item) => {
    const skill = readSyncFile(repos, item.name);
    const source = skill?.fields?.canonical_source || '';
    return {
      name: item.name,
      status: statusFor(item),
      label: item.label,
      detail: item.detail,
      source,
      recorded: skill?.fields?.last_synced_commit || '',
      latest: source ? latestCommit(repos, source) : '',
      decision: skill?.fields?.review_decision || '',
    };
  });
  const validation = options.validate ? runNodeTests(repos, options) : [];
  return {
    generated_at: new Date().toISOString(),
    repositories: {
      canonical: repoInfo(repos.canonical),
      skills: repoInfo(repos.skills),
      config: repos.configPath,
    },
    summary,
    skills: details,
    vocabulary: parsed.vocabulary,
    validation: validation.map((test) => ({ command: test.command, status: test.status })),
  };
}

function markdownReport(data) {
  const lines = [];
  lines.push('# Accessibility skills synchronization report');
  lines.push('');
  lines.push(`Generated: ${data.generated_at}`);
  lines.push('');
  lines.push('## Repositories');
  lines.push('');
  for (const [kind, info] of Object.entries(data.repositories)) {
    if (!info || typeof info !== 'object' || !info.root) continue;
    lines.push(`- **${kind}:** \`${info.root}\` — ${info.branch} @ ${info.head.slice(0, 12)} — ${info.clean ? 'clean' : `dirty (${info.dirty.length} path(s))`}`);
  }
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  for (const [status, count] of Object.entries(data.summary).sort()) {
    lines.push(`- **${status}:** ${count}`);
  }
  lines.push('');
  lines.push('## Skills');
  lines.push('');
  lines.push('| Skill | Status | Canonical source | Recorded | Current | Decision |');
  lines.push('| --- | --- | --- | --- | --- | --- |');
  for (const skill of data.skills) {
    lines.push(`| ${skill.name} | ${skill.status} | ${skill.source || '—'} | ${skill.recorded ? skill.recorded.slice(0, 12) : '—'} | ${skill.latest ? skill.latest.slice(0, 12) : '—'} | ${skill.decision || '—'} |`);
  }
  if (data.vocabulary.length > 0) {
    lines.push('');
    lines.push('## Shared vocabulary');
    lines.push('');
    for (const item of data.vocabulary) lines.push(`- ${item.label}: ${item.name}`);
  }
  if (data.validation.length > 0) {
    lines.push('');
    lines.push('## Validation');
    lines.push('');
    for (const test of data.validation) lines.push(`- ${test.status === 0 ? 'PASS' : 'FAIL'}: \`${test.command}\``);
  }
  lines.push('');
  lines.push('## Next steps');
  lines.push('');
  const review = data.skills.filter((skill) => ['REVIEW_REQUIRED', 'DEFERRED', 'INVALID_METADATA', 'MISSING_SOURCE', 'MISSING_SKILL', 'UNVERIFIED'].includes(skill.status));
  if (review.length === 0) {
    lines.push('No skill review is required.');
  } else {
    for (const skill of review) {
      lines.push(`- \`npm run sync:diff -- --skill ${skill.name}\``);
    }
  }
  lines.push('');
  return `${lines.join('\n')}\n`;
}

function commandReport(repos, options) {
  const data = reportData(repos, options);
  const output = options.format === 'json' ? `${JSON.stringify(data, null, 2)}\n` : markdownReport(data);
  if (options.output) {
    writeFileSync(resolve(options.output), output);
    console.log(`Wrote ${resolve(options.output)}`);
  } else {
    process.stdout.write(output);
  }
  const failed = data.skills.some((skill) => ['REVIEW_REQUIRED', 'DEFERRED', 'INVALID_METADATA', 'MISSING_SOURCE', 'MISSING_SKILL', 'UNVERIFIED'].includes(skill.status));
  return failed ? 1 : 0;
}

async function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    return 2;
  }
  if (options.help) {
    usage();
    return 0;
  }
  let repos;
  try {
    repos = discover(options);
  } catch (error) {
    console.error(error.message);
    return 2;
  }

  try {
    switch (options.command) {
      case 'status': return commandStatus(repos);
      case 'list': return commandList(repos);
      case 'diff': return commandDiff(repos, options);
      case 'review': return await commandReview(repos, options);
      case 'validate': return commandValidate(repos, options);
      case 'report': return commandReport(repos, options);
      default:
        console.error(`Unknown command: ${options.command}`);
        usage();
        return 2;
    }
  } catch (error) {
    console.error(error.message);
    return 2;
  }
}

process.exit(await main());
