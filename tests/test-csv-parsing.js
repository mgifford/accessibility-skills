#!/usr/bin/env node

const { parse } = require('csv-parse');

function testParsing() {
  console.log('Testing CSV parsing with csv-parse...');
  console.log('=' .repeat(70));

  const testCases = [
    {
      name: 'Simple CSV',
      input: 'ID,Name\n1,John\n2,Jane\n',
      expected: [
        { ID: 1, Name: 'John' },
        { ID: 2, Name: 'Jane' }
      ]
    },
    {
      name: 'CSV with quoted fields',
      input: 'ID,Description\n1,"Hello, world"\n2,"Quote ""test"""\n',
      expected: [
        { ID: 1, Description: 'Hello, world' },
        { ID: 2, Description: 'Quote "test"' }
      ]
    },
    {
      name: 'CSV with multiline quoted fields',
      input: 'ID,Note\n1,"First line\nSecond line\nThird line"\n',
      expected: [
        { ID: 1, Note: 'First line\nSecond line\nThird line' }
      ]
    },
    {
      name: 'CSV with comma as field separator',
      input: 'ID,Primary,Secondary\n1,"User Experience (UX) Design","Content Authoring, Visual Design"\n',
      expected: [
        { ID: 1, Primary: 'User Experience (UX) Design', Secondary: 'Content Authoring, Visual Design' }
      ]
    },
    {
      name: 'Empty fields handling',
      input: 'ID,Status\n1,\n2,none\n3,""\n',
      expected: [
        { ID: 1, Status: '' },
        { ID: 2, Status: 'none' },
        { ID: 3, Status: '' }
      ]
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    console.log(`\nTest: ${testCase.name}`);
    console.log('-' .repeat(70));

    parse(testCase.input, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      skip_header: false,
      cast: true,
      encoding: 'utf8'
    }, async (err, records) => {
      if (err) {
        console.log(`✗ FAIL: Parse error: ${err.message}`);
        failed++;
        return;
      }

      const data = JSON.parse(JSON.stringify(records));
      const match = JSON.stringify(data) === JSON.stringify(testCase.expected);

      if (match) {
        console.log('✓ PASS');
        passed++;
      } else {
        console.log('✗ FAIL');
        console.log('  Expected:', JSON.stringify(testCase.expected, null, 2));
        console.log('  Got:', JSON.stringify(data, null, 2));
        failed++;
      }
    });
  }

  console.log('\n' + '=' .repeat(70));
  console.log('Test Summary: ' + passed + ' passed, ' + failed + ' failed');
  console.log('=' .repeat(70));

  if (failed > 0) {
    console.error('\nFAILED TESTS:');
    process.exit(1);
  } else {
    console.log('\nAll tests passed!');
  }
}

if (require.main === module) {
  testParsing();
}

module.exports = { testParsing };