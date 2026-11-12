#!/usr/bin/env node

// Deterministic tests for scripts/sync.mjs. Each test builds two throwaway Git
// repositories, copies the real engine and CLI, and runs the CLI as a
// subprocess. No network or model call is involved.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmodSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, '..');
const ENGINE = join(REPO_ROOT, 'scripts', 'sync-check.sh');
const CLI = join(REPO_ROOT, 'scripts', 'sync.mjs');

function run(command, args, cwd, options = {}) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0 && !options.allowFailure) {
    throw new Error(`${command} ${args.join(' ')} failed\n${result.stdout}\n${result.stderr}`);
  }
  return result;
}

function git(cwd, ...args) {
  return run('git', args, cwd).stdout.trim();
}

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function commitAll(cwd, message) {
  git(cwd, 'add', '-A');
  git(cwd, 'commit', '-q', '-m', message);
  return git(cwd, 'rev-parse', 'HEAD');
}

function initRepo(cwd) {
  mkdirSync(cwd, { recursive: true });
  git(cwd, 'init', '-q');
  git(cwd, 'config', 'user.email', 'test@example.invalid');
  git(cwd, 'config', 'user.name', 'Sync CLI Test');
}

function makeFixture({ rootName = 'sync-fixture' } = {}) {
  const root = mkdtempSync(join(tmpdir(), `${rootName}-`));
  const canonical = join(root, 'ACCESSIBILITY.md');
  const skills = join(root, 'accessibility-skills');
  initRepo(canonical);
  write(join(canonical, 'AGENTS.md'), '# Agents\n');
  write(join(canonical, 'examples', 'README.md'), '# Examples\n');
  write(join(canonical, 'examples', 'GUIDE.md'), '# Guide\n\nInitial guidance.\n');
  const sha = commitAll(canonical, 'initial canonical');

  initRepo(skills);
  write(join(skills, 'skills', 'alpha', 'SKILL.md'), '# alpha\n');
  write(join(skills, 'skills', 'alpha', 'SYNC.md'), `# Sync Metadata\n\n\`\`\`yaml\ncanonical_source: examples/GUIDE.md\nlast_synced_commit: "${sha}"\nlast_synced_date: "2026-01-01"\nskill_maintainer: ""\nnotes: >\n  DIVERGENCE: intentionally shorter than the canonical guide.\n\`\`\`\n`);
  write(join(skills, 'VOCABULARY_SYNC.md'), '# Canonical Vocabulary Sync\n\n```yaml\nvocab_sync:\n```\n');
  mkdirSync(join(skills, 'scripts'), { recursive: true });
  copyFileSync(ENGINE, join(skills, 'scripts', 'sync-check.sh'));
  copyFileSync(CLI, join(skills, 'scripts', 'sync.mjs'));
  chmodSync(join(skills, 'scripts', 'sync-check.sh'), 0o755);
  commitAll(skills, 'initial skills');
  return { root, canonical, skills, sha };
}

function cli(skills, args, cwd = skills, env = {}) {
  return run('node', [join(skills, 'scripts', 'sync.mjs'), ...args], cwd, {
    allowFailure: true,
    env: { ...process.env, ...env },
  });
}

function changeGuide(canonical, text = '# Guide\n\nUpdated guidance.\n') {
  write(join(canonical, 'examples', 'GUIDE.md'), text);
  return commitAll(canonical, 'change guide');
}

const tests = [];
function test(name, fn) { tests.push({ name, fn }); }

test('status discovers sibling repositories and reports synced', () => {
  const f = makeFixture();
  const result = cli(f.skills, ['status']);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /canonical: .*ACCESSIBILITY\.md/);
  assert.match(result.stdout, /skills: .*accessibility-skills/);
  assert.match(result.stdout, /SYNCED\s+alpha/);
});

test('environment variable discovery works from an unrelated directory', () => {
  const f = makeFixture();
  const elsewhere = mkdtempSync(join(tmpdir(), 'unrelated-cwd-'));
  const result = cli(f.skills, ['status'], elsewhere, { ACCESSIBILITY_MD_DIR: f.canonical });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /SYNCED\s+alpha/);
});

test('explicit --skills and --canonical use the supplied checkouts', () => {
  const scriptFixture = makeFixture();
  const targetFixture = makeFixture();
  changeGuide(targetFixture.canonical);
  const elsewhere = mkdtempSync(join(tmpdir(), 'explicit-paths-'));
  const result = cli(scriptFixture.skills, [
    'status',
    '--skills', targetFixture.skills,
    '--canonical', targetFixture.canonical,
  ], elsewhere);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /REVIEW_REQUIRED\s+alpha/);
});

test('config file discovery works and paths with spaces are supported', () => {
  const root = mkdtempSync(join(tmpdir(), 'config with spaces-'));
  const canonical = join(root, 'canonical repo');
  const skills = join(root, 'skills repo');
  initRepo(canonical);
  write(join(canonical, 'AGENTS.md'), '# Agents\n');
  write(join(canonical, 'examples', 'README.md'), '# Examples\n');
  write(join(canonical, 'examples', 'GUIDE.md'), '# Guide\n');
  const sha = commitAll(canonical, 'initial');
  initRepo(skills);
  write(join(skills, 'skills', 'alpha', 'SKILL.md'), '# alpha\n');
  write(join(skills, 'skills', 'alpha', 'SYNC.md'), `# Sync Metadata\n\n\`\`\`yaml\ncanonical_source: examples/GUIDE.md\nlast_synced_commit: "${sha}"\nlast_synced_date: "2026-01-01"\n\`\`\`\n`);
  write(join(skills, 'VOCABULARY_SYNC.md'), '# Vocabulary\n\n```yaml\nvocab_sync:\n```\n');
  mkdirSync(join(skills, 'scripts'), { recursive: true });
  copyFileSync(ENGINE, join(skills, 'scripts', 'sync-check.sh'));
  copyFileSync(CLI, join(skills, 'scripts', 'sync.mjs'));
  chmodSync(join(skills, 'scripts', 'sync-check.sh'), 0o755);
  write(join(skills, 'sync.config.yaml'), 'repositories:\n  canonical:\n    path: ../canonical repo\n  skills:\n    path: .\n');
  commitAll(skills, 'initial');

  const result = cli(skills, ['status'], skills);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /SYNCED\s+alpha/);
});

test('diff shows canonical source, commits, and the actual upstream change', () => {
  const f = makeFixture();
  const latest = changeGuide(f.canonical);
  const result = cli(f.skills, ['diff', '--skill', 'alpha']);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /canonical source: examples\/GUIDE\.md/);
  assert.match(result.stdout, /recorded commit:  [0-9a-f]{7,}/);
  assert.match(result.stdout, new RegExp(`current commit:   ${latest.slice(0, 7)}`));
  assert.match(result.stdout, /Updated guidance/);
});

test('review no-update advances the reviewed revision and reports synced', () => {
  const f = makeFixture();
  const latest = changeGuide(f.canonical);
  const review = cli(f.skills, ['review', '--skill', 'alpha', '--decision', 'no-update', '--note', 'No material change']);
  assert.equal(review.status, 0, review.stdout + review.stderr);
  const sync = readFileSync(join(f.skills, 'skills', 'alpha', 'SYNC.md'), 'utf8');
  assert.match(sync, new RegExp(`last_synced_commit: "${latest}"`));
  assert.match(sync, /review_decision: no-update-needed/);
  assert.match(sync, /Review history/);
  const howToUpdate = sync.indexOf('## How to Update');
  assert.ok(howToUpdate === -1 || sync.indexOf('## Review history') < howToUpdate, 'review history must stay in its section');
  const status = cli(f.skills, ['status']);
  assert.equal(status.status, 0, status.stdout + status.stderr);
  assert.match(status.stdout, /SYNCED\s+alpha/);
});

test('deferred review does not advance synchronization metadata', () => {
  const f = makeFixture();
  const latest = changeGuide(f.canonical);
  const review = cli(f.skills, ['review', '--skill', 'alpha', '--decision', 'defer', '--note', 'Need specialist review']);
  assert.equal(review.status, 0, review.stdout + review.stderr);
  const sync = readFileSync(join(f.skills, 'skills', 'alpha', 'SYNC.md'), 'utf8');
  assert.match(sync, new RegExp(`last_synced_commit: "${f.sha}"`));
  assert.doesNotMatch(sync, new RegExp(`last_synced_commit: "${latest}"`));
  assert.match(sync, /review_decision: deferred/);
  assert.match(sync, new RegExp(`deferred_source_commit: "${latest}"`));
  assert.match(sync, /deferred at/);
  const status = cli(f.skills, ['status']);
  assert.equal(status.status, 1, status.stdout + status.stderr);
  assert.match(status.stdout, /DEFERRED\s+alpha/);
});

test('recording a decision refuses an uncommitted canonical change', () => {
  const f = makeFixture();
  write(join(f.canonical, 'examples', 'GUIDE.md'), '# Guide\n\nUncommitted.\n');
  const review = cli(f.skills, ['review', '--skill', 'alpha', '--decision', 'no-update', '--note', 'Should not record']);
  assert.equal(review.status, 2, review.stdout + review.stderr);
  assert.match(review.stderr, /uncommitted changes/);
  const sync = readFileSync(join(f.skills, 'skills', 'alpha', 'SYNC.md'), 'utf8');
  assert.match(sync, new RegExp(`last_synced_commit: "${f.sha}"`));
});

test('intentional divergence is recorded without claiming synced', () => {
  const f = makeFixture();
  changeGuide(f.canonical);
  const review = cli(f.skills, ['review', '--skill', 'alpha', '--decision', 'divergence', '--note', 'Different presentation is intentional']);
  assert.equal(review.status, 0, review.stdout + review.stderr);
  const status = cli(f.skills, ['status']);
  assert.equal(status.status, 0, status.stdout + status.stderr);
  assert.match(status.stdout, /INTENTIONAL_DIVERGENCE\s+alpha/);
});

test('report produces machine-readable JSON with exact revisions', () => {
  const f = makeFixture();
  changeGuide(f.canonical);
  const result = cli(f.skills, ['report', '--format', 'json']);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  const data = JSON.parse(result.stdout);
  assert.equal(data.skills[0].name, 'alpha');
  assert.equal(data.skills[0].status, 'REVIEW_REQUIRED');
  assert.match(data.skills[0].recorded, /^[0-9a-f]{7,}$/);
  assert.match(data.skills[0].latest, /^[0-9a-f]{7,}$/);
});

test('list exposes mappings and unmapped skills', () => {
  const f = makeFixture();
  write(join(f.skills, 'skills', 'unmapped', 'SKILL.md'), '# unmapped\n');
  const result = cli(f.skills, ['list']);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /alpha\tSYNCED/);
  assert.match(result.stdout, /unmapped/);
  assert.match(result.stdout, /MISSING SYNC/);
});

test('invalid repository path fails clearly instead of substituting another checkout', () => {
  const f = makeFixture();
  const result = cli(f.skills, ['status', '--canonical', '/tmp']);
  assert.equal(result.status, 2);
  assert.match(result.stderr, /not inside a Git checkout|does not look like mgifford\/ACCESSIBILITY\.md/);
});

test('validate without tests checks engine and vocabulary deterministically', () => {
  const f = makeFixture();
  const result = cli(f.skills, ['validate', '--no-tests']);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /Validation: PASSED/);
});

let failed = 0;
for (const { name, fn } of tests) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    failed += 1;
    console.log(`✗ ${name}`);
    console.log(String(error.message || error).split('\n').map((line) => `    ${line}`).join('\n'));
  }
}

console.log(`\n${tests.length - failed}/${tests.length} sync-cli tests passed`);
process.exit(failed === 0 ? 0 : 1);
