import { readFile, readdir, stat } from 'node:fs/promises';
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

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string' && item.length > 0);
}

const manifestPaths = (await exists(evalsRoot)) ? await walk(evalsRoot) : [];
const errors = [];

if (manifestPaths.length === 0) {
  console.log('No eval manifests found under evals/.');
  process.exit(0);
}

for (const manifestPath of manifestPaths) {
  const manifestDir = path.dirname(manifestPath);
  let manifest;

  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  } catch (error) {
    errors.push(`${path.relative(repoRoot, manifestPath)}: invalid JSON (${error.message})`);
    continue;
  }

  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    errors.push(`${path.relative(repoRoot, manifestPath)}: manifest must be a JSON object`);
    continue;
  }

  if (typeof manifest.skill_name !== 'string' || !manifest.skill_name.trim()) {
    errors.push(`${path.relative(repoRoot, manifestPath)}: missing skill_name`);
  }

  if (typeof manifest.skill_file !== 'string' || !manifest.skill_file.trim()) {
    errors.push(`${path.relative(repoRoot, manifestPath)}: missing skill_file`);
  } else {
    const skillFilePath = path.join(repoRoot, manifest.skill_file);
    if (!(await exists(skillFilePath))) {
      errors.push(`${path.relative(repoRoot, manifestPath)}: skill_file does not exist: ${manifest.skill_file}`);
    }
  }

  if (!Array.isArray(manifest.evals) || manifest.evals.length === 0) {
    errors.push(`${path.relative(repoRoot, manifestPath)}: evals must be a non-empty array`);
    continue;
  }

  for (const [index, evalCase] of manifest.evals.entries()) {
    const prefix = `${path.relative(repoRoot, manifestPath)}[${index}]`;

    if (!evalCase || typeof evalCase !== 'object' || Array.isArray(evalCase)) {
      errors.push(`${prefix}: eval entry must be a JSON object`);
      continue;
    }

    if (!Number.isInteger(evalCase.id)) {
      errors.push(`${prefix}: id must be an integer`);
    }

    if (typeof evalCase.prompt !== 'string' || !evalCase.prompt.trim()) {
      errors.push(`${prefix}: prompt must be a non-empty string`);
    }

    if (typeof evalCase.expected_output !== 'string' || !evalCase.expected_output.trim()) {
      errors.push(`${prefix}: expected_output must be a non-empty string`);
    }

    if (!Array.isArray(evalCase.expectations) || evalCase.expectations.length === 0 || !evalCase.expectations.every((item) => typeof item === 'string' && item.trim())) {
      errors.push(`${prefix}: expectations must be a non-empty array of strings`);
    }

    for (const optionalField of ['files', 'must_contain_any', 'must_not_contain']) {
      if (optionalField in evalCase && !isStringArray(evalCase[optionalField])) {
        errors.push(`${prefix}: ${optionalField} must be an array of non-empty strings when present`);
      }
    }

    if (Array.isArray(evalCase.files)) {
      for (const fileEntry of evalCase.files) {
        const resolvedFile = path.resolve(manifestDir, fileEntry);
        if (!(await exists(resolvedFile))) {
          errors.push(`${prefix}: referenced file does not exist: ${fileEntry}`);
        }
      }
    }
  }
}

if (errors.length > 0) {
  console.error('Eval validation failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Validated ${manifestPaths.length} eval manifest(s).`);