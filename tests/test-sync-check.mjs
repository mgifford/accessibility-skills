#!/usr/bin/env node

// Deterministic regression tests for scripts/sync-check.sh.
//
// Each test builds a throwaway pair of git repositories, copies the real sync
// engine into the fixture, and runs it. No network, model, or clock-dependent
// behavior is involved.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  chmodSync,
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, '..');
const ENGINE = join(REPO_ROOT, 'scripts', 'sync-check.sh');

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed in ${cwd}\n${result.stdout}\n${result.stderr}`);
  }
  return result.stdout.trim();
}

function git(cwd, ...args) {
  return run('git', args, cwd);
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
  git(cwd, 'config', 'user.name', 'Sync Test');
}

function makeRoot() {
  return mkdtempSync(join(tmpdir(), 'a11y-sync-test-'));
}

function installEngine(skillsDir) {
  mkdirSync(join(skillsDir, 'scripts'), { recursive: true });
  copyFileSync(ENGINE, join(skillsDir, 'scripts', 'sync-check.sh'));
  chmodSync(join(skillsDir, 'scripts', 'sync-check.sh'), 0o755);
}

function sync(skillsDir, canonicalDir, args = []) {
  return spawnSync('bash', [join(skillsDir, 'scripts', 'sync-check.sh'), ...args], {
    cwd: skillsDir,
    env: { ...process.env, ACCESSIBILITY_MD_DIR: canonicalDir },
    encoding: 'utf8',
  });
}

function makeSimpleFixture({ syncMd = (sha) => `canonical_source: examples/GUIDE.md\nlast_synced_commit: "${sha}"\nlast_synced_date: "2026-01-01"\n`, skills = ['alpha'] } = {}) {
  const root = makeRoot();
  const canonical = join(root, 'ACCESSIBILITY.md');
  const skillsDir = join(root, 'accessibility-skills');
  initRepo(canonical);
  write(join(canonical, 'examples', 'GUIDE.md'), '# Guide\n\nInitial guidance.\n');
  const sha = commitAll(canonical, 'initial canonical');

  installEngine(skillsDir);
  for (const skill of skills) {
    write(join(skillsDir, 'skills', skill, 'SKILL.md'), `# ${skill}\n`);
    write(join(skillsDir, 'skills', skill, 'SYNC.md'), `# Sync Metadata\n\n\`\`\`yaml\n${syncMd(sha)}skill_maintainer: ""\n\`\`\`\n`);
  }
  initRepo(skillsDir);
  commitAll(skillsDir, 'initial skills');
  return { root, canonical, skillsDir, sha };
}

function changeGuide(canonical, content = '# Guide\n\nUpdated guidance.\n') {
  write(join(canonical, 'examples', 'GUIDE.md'), content);
  return commitAll(canonical, 'change guide');
}

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

test('no source changes reports synced and exits 0', () => {
  const f = makeSimpleFixture();
  const result = sync(f.skillsDir, f.canonical);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /\[SYNCED\]\s+alpha/);
  assert.match(result.stdout, /Review required: 0/);
});

test('one changed canonical guide requires review and exits 1', () => {
  const f = makeSimpleFixture();
  changeGuide(f.canonical);
  const result = sync(f.skillsDir, f.canonical);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /\[REVIEW REQUIRED\] alpha/);
  assert.match(result.stdout, /canonical source changed/);
  assert.match(result.stdout, /review_decision/);
});

test('documented no-update-needed decision is distinguished from drift', () => {
  const f = makeSimpleFixture();
  const latest = changeGuide(f.canonical);
  write(
    join(f.skillsDir, 'skills', 'alpha', 'SYNC.md'),
    `# Sync Metadata\n\n\`\`\`yaml\ncanonical_source: examples/GUIDE.md\nlast_synced_commit: "${latest}"\nlast_synced_date: "2026-01-02"\nlast_reviewed_commit: "${latest}"\nreview_decision: no-update-needed\nskill_maintainer: ""\n\`\`\`\n`,
  );
  const result = sync(f.skillsDir, f.canonical);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /\[SYNCED\]\s+alpha - reviewed .*no skill update needed/);
});

test('documented intentional divergence is reported separately from synced', () => {
  const f = makeSimpleFixture();
  const latest = changeGuide(f.canonical);
  write(
    join(f.skillsDir, 'skills', 'alpha', 'SYNC.md'),
    `# Sync Metadata\n\n\`\`\`yaml\ncanonical_source: examples/GUIDE.md\nlast_synced_commit: "${latest}"\nlast_synced_date: "2026-01-02"\nlast_reviewed_commit: "${latest}"\nreview_decision: intentional-divergence\nskill_maintainer: ""\n\`\`\`\n`,
  );
  const result = sync(f.skillsDir, f.canonical);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /\[INTENTIONAL DIVERGENCE\] alpha/);
  assert.match(result.stdout, /Intentional divergence: 1/);
});

test('further-review-required remains a review item', () => {
  const f = makeSimpleFixture();
  const latest = changeGuide(f.canonical);
  write(
    join(f.skillsDir, 'skills', 'alpha', 'SYNC.md'),
    `# Sync Metadata\n\n\`\`\`yaml\ncanonical_source: examples/GUIDE.md\nlast_synced_commit: "${latest}"\nlast_synced_date: "2026-01-02"\nlast_reviewed_commit: "${latest}"\nreview_decision: further-review-required\nskill_maintainer: ""\n\`\`\`\n`,
  );
  const result = sync(f.skillsDir, f.canonical);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /further review is required/);
});

test('removed canonical source is an orphan configuration error', () => {
  const f = makeSimpleFixture();
  rmSync(join(f.canonical, 'examples', 'GUIDE.md'));
  commitAll(f.canonical, 'remove guide');
  const result = sync(f.skillsDir, f.canonical);
  assert.equal(result.status, 2, result.stdout + result.stderr);
  assert.match(result.stdout, /\[ORPHAN\]\s+alpha/);
});

test('skill without SYNC.md is a missing mapping error', () => {
  const f = makeSimpleFixture();
  write(join(f.skillsDir, 'skills', 'unmapped', 'SKILL.md'), '# unmapped\n');
  const result = sync(f.skillsDir, f.canonical);
  assert.equal(result.status, 2, result.stdout + result.stderr);
  assert.match(result.stdout, /\[MISSING SYNC\] unmapped/);
});

test('external source is not fetched and a due review is reported', () => {
  const f = makeSimpleFixture({
    skills: ['external'],
    syncMd: () => 'sync_mode: external\nlast_synced_date: "2026-01-01"\nexternal_url: "https://example.invalid/external"\nreview_after: "2020-01-01"\nlast_reviewed: "2020-01-01"\n',
  });
  const result = sync(f.skillsDir, f.canonical);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /\[EXTERNAL REVIEW DUE\] external/);
});

test('not-applicable skill requires a reason and does not fail', () => {
  const f = makeSimpleFixture({
    skills: ['wrapper'],
    syncMd: () => 'sync_mode: not-applicable\nlast_synced_date: "2026-01-01"\nnot_applicable_reason: "Wraps a tool; no single canonical prose source."\n',
  });
  const result = sync(f.skillsDir, f.canonical);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /\[N\/A\]\s+wrapper/);
  assert.match(result.stdout, /Not applicable: 1/);
});

test('shared vocabulary source reports every consumer', () => {
  const root = makeRoot();
  const canonical = join(root, 'ACCESSIBILITY.md');
  const skillsDir = join(root, 'accessibility-skills');
  initRepo(canonical);
  write(join(canonical, 'examples', 'ACCESSIBILITY_FINDING_TRACKING.md'), '# Tracking\n\nInitial.\n');
  const sha = commitAll(canonical, 'initial canonical');

  installEngine(skillsDir);
  write(join(skillsDir, 'skills', 'consumer-a', 'SKILL.md'), '# a\n');
  write(join(skillsDir, 'skills', 'consumer-b', 'SKILL.md'), '# b\n');
  write(join(skillsDir, 'VOCABULARY_SYNC.md'), `# Canonical Vocabulary Sync\n\n| Canonical source | Defines | Consumed by |\n| --- | --- | --- |\n| \`examples/ACCESSIBILITY_FINDING_TRACKING.md\` | terminology | \`skills/consumer-a/SKILL.md\`, \`skills/consumer-b/SKILL.md\` |\n\n\`\`\`yaml\nvocab_sync:\n  examples/ACCESSIBILITY_FINDING_TRACKING.md: "${sha}"\n\`\`\`\n`);
  initRepo(skillsDir);
  commitAll(skillsDir, 'initial skills');

  const noChange = sync(skillsDir, canonical, ['--vocab']);
  assert.equal(noChange.status, 0, noChange.stdout + noChange.stderr);
  assert.match(noChange.stdout, /\[VOCAB SYNCED\]/);

  write(join(canonical, 'examples', 'ACCESSIBILITY_FINDING_TRACKING.md'), '# Tracking\n\nChanged.\n');
  commitAll(canonical, 'change vocabulary');
  const changed = sync(skillsDir, canonical, ['--vocab']);
  assert.equal(changed.status, 1, changed.stdout + changed.stderr);
  assert.match(changed.stdout, /\[VOCAB REVIEW REQUIRED\]/);
  assert.match(changed.stdout, /skills\/consumer-a\/SKILL\.md/);
  assert.match(changed.stdout, /skills\/consumer-b\/SKILL\.md/);
});

test('lockfile-only change in a directory source is not vocabulary drift', () => {
  const root = makeRoot();
  const canonical = join(root, 'ACCESSIBILITY.md');
  const skillsDir = join(root, 'accessibility-skills');
  initRepo(canonical);
  write(join(canonical, 'examples', 'schemas', 'README.md'), '# Schema\n');
  write(join(canonical, 'examples', 'schemas', 'package-lock.json'), '{"version": 1}\n');
  const sha = commitAll(canonical, 'initial canonical');

  installEngine(skillsDir);
  write(join(skillsDir, 'VOCABULARY_SYNC.md'), `# Canonical Vocabulary Sync\n\n| Canonical source | Defines | Consumed by |\n| --- | --- | --- |\n| \`examples/schemas/\` | schema | \`skills/consumer-a/SKILL.md\` |\n\n\`\`\`yaml\nvocab_sync:\n  examples/schemas/: "${sha}"\n\`\`\`\n`);
  write(join(skillsDir, 'skills', 'consumer-a', 'SKILL.md'), '# a\n');
  initRepo(skillsDir);
  commitAll(skillsDir, 'initial skills');

  write(join(canonical, 'examples', 'schemas', 'package-lock.json'), '{"version": 2}\n');
  commitAll(canonical, 'bump dependency');
  const result = sync(skillsDir, canonical, ['--vocab']);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /\[VOCAB SYNCED\]\s+examples\/schemas\//);
});

test('deferred review is reported without advancing synchronization metadata', () => {
  const f = makeSimpleFixture();
  const latest = changeGuide(f.canonical);
  write(
    join(f.skillsDir, 'skills', 'alpha', 'SYNC.md'),
    `# Sync Metadata\n\n\`\`\`yaml\ncanonical_source: examples/GUIDE.md\nlast_synced_commit: "${f.sha}"\nlast_synced_date: "2026-01-01"\nreview_decision: deferred\ndeferred_source_commit: "${latest}"\n\`\`\`\n`,
  );
  const result = sync(f.skillsDir, f.canonical);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /\[DEFERRED\] alpha/);
  assert.match(result.stdout, /Deferred: 1/);
});

test('a deferred review becomes stale when the canonical source changes again', () => {
  const f = makeSimpleFixture();
  const first = changeGuide(f.canonical, '# Guide\n\nFirst change.\n');
  write(
    join(f.skillsDir, 'skills', 'alpha', 'SYNC.md'),
    `# Sync Metadata\n\n\`\`\`yaml\ncanonical_source: examples/GUIDE.md\nlast_synced_commit: "${f.sha}"\nlast_synced_date: "2026-01-01"\nreview_decision: deferred\ndeferred_source_commit: "${first}"\n\`\`\`\n`,
  );
  changeGuide(f.canonical, '# Guide\n\nSecond change.\n');
  const result = sync(f.skillsDir, f.canonical);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /deferred review is stale/);
});

test('invalid review_decision is invalid metadata', () => {
  const f = makeSimpleFixture({
    syncMd: (sha) => `canonical_source: examples/GUIDE.md\nlast_synced_commit: "${sha}"\nlast_synced_date: "2026-01-01"\nreview_decision: maybe\n`,
  });
  const result = sync(f.skillsDir, f.canonical);
  assert.equal(result.status, 2, result.stdout + result.stderr);
  assert.match(result.stdout, /\[INVALID METADATA\] alpha/);
});

test('missing last_synced_date is a stale-metadata error', () => {
  const f = makeSimpleFixture({
    syncMd: (sha) => `canonical_source: examples/GUIDE.md\nlast_synced_commit: "${sha}"\n`,
  });
  const result = sync(f.skillsDir, f.canonical);
  assert.equal(result.status, 2, result.stdout + result.stderr);
  assert.match(result.stdout, /\[STALE METADATA\] alpha/);
});

test('repeated runs are deterministic', () => {
  const f = makeSimpleFixture();
  changeGuide(f.canonical);
  const first = sync(f.skillsDir, f.canonical);
  const second = sync(f.skillsDir, f.canonical);
  assert.equal(first.status, second.status);
  assert.equal(first.stdout, second.stdout);
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

console.log(`\n${tests.length - failed}/${tests.length} sync-check tests passed`);
process.exit(failed === 0 ? 0 : 1);
