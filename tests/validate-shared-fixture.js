#!/usr/bin/env node

// Cross-repo consistency check: this exact finding is also maintained in
// mgifford/ACCESSIBILITY.md (examples/shared-fixtures/) and mgifford/vital-core
// (tests/shared-fixtures/, tests/unit/shared-fixture.test.js). It must
// classify identically wherever obligation/handling/evidence_status are
// computed or documented. This repo has no policy-classification engine of
// its own -- it only documents agent-facing guidance -- so this check
// instead verifies that the guidance in the relevant SKILL.md files states
// the same classification the fixture's own `policy` object declares, and
// would not lead an agent following that guidance to a different answer.

const fs = require('fs');
const path = require('path');

function validateSharedFixtureClassification() {
  console.log('Validating shared cross-repo fixture classification...');
  console.log('='.repeat(70));

  const fixturePath = path.join(__dirname, '..', 'shared-fixtures', 'color-contrast-unreviewed.json');
  if (!fs.existsSync(fixturePath)) {
    console.log('✗ FAIL: shared-fixtures/color-contrast-unreviewed.json not found');
    return false;
  }
  const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

  if (fixture.schema_version !== '2.1') {
    console.log(`✗ FAIL: expected schema_version "2.1", got "${fixture.schema_version}"`);
    return false;
  }
  const obligation = fixture.policy?.standards_obligations?.[0]?.obligation;
  const handling = fixture.policy?.handling;
  const evidenceStatus = fixture.policy?.evidence_status;
  if (obligation !== 'required' || handling !== 'review' || evidenceStatus !== 'automated-indicator') {
    console.log(`✗ FAIL: fixture's own policy object is not required/review/automated-indicator (got ${obligation}/${handling}/${evidenceStatus})`);
    return false;
  }
  console.log('✓ PASS: fixture declares obligation=required, handling=review, evidence_status=automated-indicator');

  // The scenario is: an axe-core rule result at a WCAG AA criterion,
  // unconfirmed by a human. skills/axe-rules/SKILL.md and
  // skills/bug-reporting/SKILL.md must both instruct an agent to land on
  // exactly this classification for that scenario -- not "report" and not
  // "suppress".
  const axeRulesPath = path.join(__dirname, '..', 'skills', 'axe-rules', 'SKILL.md');
  const bugReportingPath = path.join(__dirname, '..', 'skills', 'bug-reporting', 'SKILL.md');
  const normalize = (s) => s.replace(/\s+/g, ' ');
  const axeRules = normalize(fs.readFileSync(axeRulesPath, 'utf8'));
  const bugReporting = normalize(fs.readFileSync(bugReportingPath, 'utf8'));

  const checks = [
    {
      file: 'skills/axe-rules/SKILL.md',
      content: axeRules,
      mustContain: ['evidence_status: automated-indicator', 'handling: review'],
      mustNotContain: ['handling: suppress'],
    },
    {
      file: 'skills/bug-reporting/SKILL.md',
      content: bugReporting,
      mustContain: ['evidence_status: automated-indicator', 'handling: review'],
    },
  ];

  let ok = true;
  for (const check of checks) {
    for (const phrase of check.mustContain ?? []) {
      if (!check.content.includes(phrase)) {
        console.log(`✗ FAIL: ${check.file} does not document "${phrase}" for the unreviewed-automated-result scenario`);
        ok = false;
      }
    }
    // mustNotContain is scoped to this narrow "unreviewed indicator" guidance
    // pattern rather than the whole file, since suppress is a legitimate
    // value elsewhere (e.g. documented exceptions) -- only assert it is not
    // wired to the automated-indicator default in the same rule of thumb.
    for (const phrase of check.mustNotContain ?? []) {
      const badPattern = new RegExp(`automated-indicator[^.]*${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
      if (badPattern.test(check.content)) {
        console.log(`✗ FAIL: ${check.file} appears to wire "automated-indicator" straight to "${phrase}"`);
        ok = false;
      }
    }
  }

  if (!ok) return false;
  console.log('✓ PASS: skills/axe-rules/SKILL.md and skills/bug-reporting/SKILL.md both document automated-indicator -> review for this scenario');

  console.log('\n' + '='.repeat(70));
  console.log('Validation Summary: All checks passed!');
  console.log('='.repeat(70));
  return true;
}

if (require.main === module) {
  const success = validateSharedFixtureClassification();
  process.exit(success ? 0 : 1);
}

module.exports = { validateSharedFixtureClassification };
