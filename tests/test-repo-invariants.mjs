#!/usr/bin/env node

// Repo-level invariants that keep the cross-repository model honest:
// one canonical registry, complete skill mappings, real vocabulary consumers,
// and no network dependency in the sync engine.

import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const CANONICAL_REGISTRY = 'https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/TRUSTED_SOURCES.yaml';

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

function read(path) {
  return readFileSync(join(ROOT, path), 'utf8');
}

test('does not keep a second trusted-source registry', () => {
  assert.equal(existsSync(join(ROOT, 'TRUSTED_SOURCES.yaml')), false);
  assert.equal(existsSync(join(ROOT, 'examples', 'TRUSTED_SOURCES.yaml')), false);
});

test('documentation points to the canonical registry', () => {
  for (const path of ['README.md', 'AGENTS.md', 'skills/ACCESSIBILITY-general/SKILL.md']) {
    assert.match(read(path), new RegExp(CANONICAL_REGISTRY.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${path} does not link the canonical registry`);
  }
});

test('every skill has SYNC metadata with a source or a documented mode', () => {
  const skillsDir = join(ROOT, 'skills');
  const skills = readdirSync(skillsDir).filter((name) => statSync(join(skillsDir, name)).isDirectory());
  for (const skill of skills) {
    const skillFile = join(skillsDir, skill, 'SKILL.md');
    if (!existsSync(skillFile)) continue;
    const syncFile = join(skillsDir, skill, 'SYNC.md');
    assert.ok(existsSync(syncFile), `${skill} has no SYNC.md`);
    const sync = readFileSync(syncFile, 'utf8');
    const hasSource = /^canonical_source:/m.test(sync);
    const mode = sync.match(/^sync_mode:\s*(\S+)/m)?.[1];
    assert.ok(hasSource || mode === 'external' || mode === 'not-applicable', `${skill} has neither canonical_source nor a documented sync_mode`);
    if (mode === 'external') {
      assert.match(sync, /^external_url:/m, `${skill} external mode needs external_url`);
      assert.match(sync, /^review_after:\s*["']?\d{4}-\d{2}-\d{2}/m, `${skill} external mode needs review_after`);
    }
    if (mode === 'not-applicable') {
      assert.match(sync, /^not_applicable_reason:/m, `${skill} not-applicable mode needs a reason`);
    }
  }
});

test('shared vocabulary consumer paths exist', () => {
  const vocab = read('VOCABULARY_SYNC.md');
  const sourceRows = vocab.split('\n').filter((line) => line.startsWith('| `examples/'));
  assert.ok(sourceRows.length > 0, 'no vocabulary consumer rows found');
  for (const row of sourceRows) {
    const columns = row.split('|');
    const consumers = columns[3] || '';
    const paths = [...consumers.matchAll(/`([^`]+)`/g)].map((match) => match[1]);
    assert.ok(paths.length > 0, `no consumers parsed from row: ${row}`);
    for (const path of paths) {
      assert.ok(existsSync(join(ROOT, path)), `missing vocabulary consumer: ${path}`);
    }
  }
});

test('sync engine has no network dependency', () => {
  const engine = read('scripts/sync-check.sh');
  assert.doesNotMatch(engine, /\b(curl|wget)\b/);
  assert.doesNotMatch(engine, /raw\.githubusercontent\.com/);
  assert.doesNotMatch(engine, /\bcp\s+.*examples\//, 'engine must not tell maintainers to copy the canonical guide');
});

test('README does not install skills from the wrong repository', () => {
  const readme = read('README.md');
  assert.doesNotMatch(readme, /ACCESSIBILITY\.md\/raw\/main\/skills/);
  assert.match(readme, /accessibility-skills\/raw\/main\/skills/);
});


test('sync workflow uses the shared engine, full history, and deduplication', () => {
  const workflow = read('.github/workflows/skill-sync-check.yml');
  assert.match(workflow, /scripts\/sync-check\.sh/);
  assert.equal((workflow.match(/fetch-depth: 0/g) || []).length >= 2, true, 'both checkouts need full history');
  assert.match(workflow, /upsert-issue\.js/);
  assert.doesNotMatch(workflow, /raw\.githubusercontent\.com/);
  assert.match(workflow, /concurrency:/);
});

test('CI runs the new deterministic checks', () => {
  const ci = read('.github/workflows/ci.yml');
  for (const script of ['test:sync', 'test:issues', 'test:invariants']) {
    assert.match(ci, new RegExp(script.replace(':', '\\:')), `CI does not run ${script}`);
  }
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

console.log(`\n${tests.length - failed}/${tests.length} repo-invariant tests passed`);
process.exit(failed === 0 ? 0 : 1);
