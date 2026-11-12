#!/usr/bin/env node

// Tests for the issue upsert helper used by the sync workflow. The helper must
// create one issue per title, update it only when the report changes, and never
// add a second issue or a comment for an unchanged report.

import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { upsertIssue, reportHash } = require('../.github/scripts/upsert-issue.js');

function makeClient() {
  const labels = new Map();
  const issues = [];
  const calls = [];
  let nextNumber = 1;

  const github = {
    rest: {
      issues: {
        async getLabel({ name }) {
          if (!labels.has(name)) {
            const error = new Error('Not Found');
            error.status = 404;
            throw error;
          }
          return { data: { name } };
        },
        async createLabel(args) {
          labels.set(args.name, args);
          calls.push({ type: 'createLabel', args });
          return { data: args };
        },
        async listForRepo() {
          return { data: issues.filter((issue) => issue.state === 'open') };
        },
        async update(args) {
          calls.push({ type: 'update', args });
          const issue = issues.find((candidate) => candidate.number === args.issue_number);
          issue.body = args.body;
          return { data: issue };
        },
        async create(args) {
          calls.push({ type: 'create', args });
          const issue = { number: nextNumber++, state: 'open', ...args };
          issues.push(issue);
          return { data: issue };
        },
      },
    },
  };

  return { github, labels, issues, calls };
}

const context = { repo: { owner: 'mgifford', repo: 'accessibility-skills' } };

function baseArgs(client, overrides = {}) {
  return {
    github: client.github,
    context,
    label: 'skill-sync-drift',
    title: 'Skill sync needs review',
    report: 'report one',
    body: 'body one',
    ...overrides,
  };
}

async function run() {
  const tests = [];

  tests.push(['creates one labeled issue and ensures the label', async () => {
    const client = makeClient();
    const result = await upsertIssue(baseArgs(client));
    assert.equal(result.action, 'created');
    assert.equal(client.issues.length, 1);
    assert.ok(client.labels.has('skill-sync-drift'));
    assert.ok(client.issues[0].body.includes('body one'));
    assert.match(client.issues[0].body, /<!-- sync-report:[0-9a-f]{16} -->/);
  }]);

  tests.push(['repeated identical report is a no-op', async () => {
    const client = makeClient();
    await upsertIssue(baseArgs(client));
    const callsAfterFirst = client.calls.filter((call) => call.type !== 'createLabel').length;
    const result = await upsertIssue(baseArgs(client));
    assert.equal(result.action, 'unchanged');
    assert.equal(client.issues.length, 1);
    const callsAfterSecond = client.calls.filter((call) => call.type !== 'createLabel').length;
    assert.equal(callsAfterSecond, callsAfterFirst, 'no update or create call for an unchanged report');
  }]);

  tests.push(['changed report updates the same issue', async () => {
    const client = makeClient();
    await upsertIssue(baseArgs(client));
    const result = await upsertIssue(baseArgs(client, { report: 'report two', body: 'body two' }));
    assert.equal(result.action, 'updated');
    assert.equal(client.issues.length, 1);
    assert.ok(client.issues[0].body.includes('body two'));
    const updates = client.calls.filter((call) => call.type === 'update');
    assert.equal(updates.length, 1);
  }]);

  tests.push(['different title creates a separate issue', async () => {
    const client = makeClient();
    await upsertIssue(baseArgs(client));
    const result = await upsertIssue(baseArgs(client, { title: 'Different finding' }));
    assert.equal(result.action, 'created');
    assert.equal(client.issues.length, 2);
  }]);

  tests.push(['report hashes are stable and content-sensitive', () => {
    assert.equal(reportHash('same'), reportHash('same'));
    assert.notEqual(reportHash('same'), reportHash('different'));
  }]);

  let failed = 0;
  for (const [name, fn] of tests) {
    try {
      await fn();
      console.log(`✓ ${name}`);
    } catch (error) {
      failed += 1;
      console.log(`✗ ${name}`);
      console.log(String(error.message || error).split('\n').map((line) => `    ${line}`).join('\n'));
    }
  }

  console.log(`\n${tests.length - failed}/${tests.length} issue-upsert tests passed`);
  process.exit(failed === 0 ? 0 : 1);
}

run();
