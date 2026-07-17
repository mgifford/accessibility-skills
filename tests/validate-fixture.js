#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function validateTabindexFixture() {
  console.log('Validating Positive Tabindex Fixture...');
  console.log('=' .repeat(70));

  const fixturePath = path.join(__dirname, 'evals/fixture-positive-tabindex.md');
  
  if (!fs.existsSync(fixturePath)) {
    console.log('✗ FAIL: Fixture file not found');
    return false;
  }

  const fixtureContent = fs.readFileSync(fixturePath, 'utf8');

  // Check for required ARRM mapping
  const requiredArrmFields = [
    'task_id: INP-016',
    'wcag_sc: "2.4.3"',
    'level: A',
    'primary: ["Front-End Development"]'
  ];

  let missingArrmFields = [];
  for (const field of requiredArrmFields) {
    if (!fixtureContent.includes(field)) {
      missingArrmFields.push(field);
    }
  }

  if (missingArrmFields.length > 0) {
    console.log('✗ FAIL: Missing ARRM mapping fields:');
    for (const field of missingArrmFields) {
      console.log(`  - ${field}`);
    }
    return false;
  }

  console.log('✓ PASS: ARRM mapping correctly fixed');

  // Check for updated decision state
  if (!fixtureContent.includes('human-confirmation-needed') || 
      fixtureContent.includes('auto-fixable')) {
    console.log('✗ FAIL: Decision state should be human-confirmation-needed, not auto-fixable');
    return false;
  }

  console.log('✓ PASS: Decision state correctly updated to human-confirmation-needed');

  // Check for role-aware questions
  const requiredRoleQuestions = [
    'Is this element intended to be interactive?',
    'Should it be reachable in the normal tab sequence?',
    'Is it a custom widget?',
    'What user experience impact will this change cause?'
  ];

  let missingRoleQuestions = [];
  for (const question of requiredRoleQuestions) {
    if (!fixtureContent.includes(question)) {
      missingRoleQuestions.push(question);
    }
  }

  if (missingRoleQuestions.length > 0) {
    console.log('✗ FAIL: Missing role-specific questions:');
    for (const question of missingRoleQuestions) {
      console.log(`  - ${question}`);
    }
    return false;
  }

  console.log('✓ PASS: Role-specific questions correctly added');

  // Check for acceptable resolutions
  const requiredResolutions = [
    'Remove positive tabindex',
    'Use tabindex="0"',
    'Use tabindex="-1"'
  ];

  let missingResolutions = [];
  for (const resolution of requiredResolutions) {
    if (!fixtureContent.includes(resolution)) {
      missingResolutions.push(resolution);
    }
  }

  if (missingResolutions.length > 0) {
    console.log('✗ FAIL: Missing acceptable resolutions:');
    for (const resolution of missingResolutions) {
      console.log(`  - ${resolution}`);
    }
    return false;
  }

  console.log('✓ PASS: Acceptable resolutions correctly listed');

  console.log('\n' + '=' .repeat(70));
  console.log('Validation Summary: All checks passed!');
  console.log('=' .repeat(70));

  return true;
}

if (require.main === module) {
  const success = validateTabindexFixture();
  process.exit(success ? 0 : 1);
}

module.exports = { validateTabindexFixture };