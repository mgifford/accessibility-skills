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

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

// A concept group is { label: string, any_of: string[] } where any_of is
// non-empty. Used for both required_concepts and prohibited_concepts.
function validateConceptGroups(prefix, fieldName, groups, errors) {
  if (!(fieldName in groups)) {
    return;
  }

  const value = groups[fieldName];

  if (!Array.isArray(value)) {
    errors.push(`${prefix}: ${fieldName} must be an array when present`);
    return;
  }

  const seenLabels = new Set();

  for (const [groupIndex, group] of value.entries()) {
    const groupPrefix = `${prefix}: ${fieldName}[${groupIndex}]`;

    if (!group || typeof group !== 'object' || Array.isArray(group)) {
      errors.push(`${groupPrefix} must be a JSON object`);
      continue;
    }

    if (!isNonEmptyString(group.label)) {
      errors.push(`${groupPrefix}: label must be a non-empty string`);
    } else if (seenLabels.has(group.label)) {
      errors.push(`${groupPrefix}: duplicate concept label "${group.label}" within this eval`);
    } else {
      seenLabels.add(group.label);
    }

    if (!isStringArray(group.any_of) || group.any_of.length === 0) {
      errors.push(`${groupPrefix}: any_of must be a non-empty array of non-empty strings`);
    }
  }
}

function hasExecutableAssertions(evalCase) {
  const hasLegacy = (Array.isArray(evalCase.must_contain_any) && evalCase.must_contain_any.length > 0)
    || (Array.isArray(evalCase.must_not_contain) && evalCase.must_not_contain.length > 0);
  const hasGrouped = (Array.isArray(evalCase.required_concepts) && evalCase.required_concepts.length > 0)
    || (Array.isArray(evalCase.prohibited_concepts) && evalCase.prohibited_concepts.length > 0);
  return hasLegacy || hasGrouped;
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

  const seenIds = new Set();

  for (const [index, evalCase] of manifest.evals.entries()) {
    const prefix = `${path.relative(repoRoot, manifestPath)}[${index}]`;

    if (!evalCase || typeof evalCase !== 'object' || Array.isArray(evalCase)) {
      errors.push(`${prefix}: eval entry must be a JSON object`);
      continue;
    }

    if (!Number.isInteger(evalCase.id)) {
      errors.push(`${prefix}: id must be an integer`);
    } else if (seenIds.has(evalCase.id)) {
      errors.push(`${prefix}: duplicate eval id ${evalCase.id} within this manifest`);
    } else {
      seenIds.add(evalCase.id);
    }

    if (typeof evalCase.prompt !== 'string' || !evalCase.prompt.trim()) {
      errors.push(`${prefix}: prompt must be a non-empty string`);
    }

    // expected_output / expectations are legacy descriptive fields. They are
    // not executed by the runner, so they are optional; when present they
    // must actually contain something, so a manifest cannot carry a
    // normative-looking field that is silently ignored.
    if ('expected_output' in evalCase && !isNonEmptyString(evalCase.expected_output)) {
      errors.push(`${prefix}: expected_output must be a non-empty string when present`);
    }

    if ('expectations' in evalCase && (!isStringArray(evalCase.expectations) || evalCase.expectations.length === 0)) {
      errors.push(`${prefix}: expectations must be a non-empty array of strings when present`);
    }

    for (const optionalField of ['files', 'must_contain_any', 'must_not_contain']) {
      if (optionalField in evalCase && !isStringArray(evalCase[optionalField])) {
        errors.push(`${prefix}: ${optionalField} must be an array of non-empty strings when present`);
      }
    }

    validateConceptGroups(prefix, 'required_concepts', evalCase, errors);
    validateConceptGroups(prefix, 'prohibited_concepts', evalCase, errors);

    if (!hasExecutableAssertions(evalCase)) {
      errors.push(`${prefix}: must have at least one executable assertion (required_concepts, prohibited_concepts, must_contain_any, or must_not_contain) — descriptive-only expectations are not sufficient`);
    }

    if ('covers' in evalCase && !isStringArray(evalCase.covers)) {
      errors.push(`${prefix}: covers must be an array of non-empty strings when present`);
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