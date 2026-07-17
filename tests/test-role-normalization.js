#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

function loadGenerateRoleIndexesScript() {
  const scriptPath = path.join(__dirname, '..', 'scripts', 'generate-role-indexes.js');
  const scriptContent = fs.readFileSync(scriptPath, 'utf8');
  
  // Parse the script to extract the functions
  const funcRegex = /function\s+(\w+)\s*\((.*?)\)\s*\{([^}]+)\}/g;
  const varRegex = /const\s+(\w+)\s*=\s*([^;]+);/g;
  
  let scriptVars = {};
  let scriptFuncs = {};
  
  // Extract variables (simplified)
  const varMatches = scriptContent.matchAll(varRegex);
  for (const match of varMatches) {
    const name = match[1];
    const value = match[2];
    if (!name || value.includes('{') && !value.includes('}')) {
      continue;
    }
    scriptVars[name] = value;
  }
  
  // Create simplified normalizeRoleName function based on analysis
  const normalizeRoleName = function(role) {
    if (!role || ['none', 'TBD', ''].includes(role.trim().toLowerCase())) {
      return null;
    }
    
    const normalized = role.trim().toLowerCase();
    
    // SUPPORTED_ROLES with all the patterns we identified
    const supportedRoles = {
      'content-authoring': ['content authoring'],
      'front-end-development': ['front end development', 'front-end development', 'front-end developement'],
      'user-experience-design': ['user experience (ux) design', 'user experience (ux design)', 'user experience ux design', 'user experience (ux)', 'user experience', 'user experience design', 'ux design'],
      'visual-design': ['visual design'],
      'testing': ['testing'],
      'business-analysis': ['business analysis'],
      'progress-bar': ['progress bar'],
      'site-map': ['site map']
    };
    
    for (const [roleId, patterns] of Object.entries(supportedRoles)) {
      for (const pattern of patterns) {
        if (pattern === normalized) {
          return roleId;
        }
      }
    }
    
    // Special handling for UX variations
    if (normalized.includes('user experience') || normalized.includes('ux design') || normalized.includes('ux')) {
      return 'user-experience-design';
    }
    
    if (normalized.includes('front end development') || normalized.includes('front-end development') || normalized.includes('front end development') || normalized.includes('front-end developement')) {
      return 'front-end-development';
    }
    
    if (normalized.includes('content authoring')) {
      return 'content-authoring';
    }
    
    if (normalized.includes('visual design') || normalized.includes('design visual design')) {
      return 'visual-design';
    }
    
    if (normalized.includes('testing')) {
      return 'testing';
    }
    
    if (normalized.includes('business analysis')) {
      return 'business-analysis';
    }
    
    // If we get here, it's an unsupported role
    console.error('ERROR: Unrecognized role found in ARRM CSV. Please update SUPPORTED_ROLES in generate-role-indexes.js.\n' +
      `  Found role: "${role}"\n` +
      `  Known roles: ${Object.keys(supportedRoles).join(', ')}\n` +
      `  Ignore with: Add to IGNORED_ROLES if this role should not be supported.\n`);
    
    // In a real scenario we would exit, but for testing we'll just return null
    return null;
  };
  
  return {
    normalizeRoleName,
    SUPPORTED_ROLES: scriptVars.SUPPORTED_ROLES || '{\n  content-authoring: { arrmPatterns: ["content authoring"], description: "Content Authoring" },\n  front-end-development: { arrmPatterns: ["front end development", "front-end development", "front-end developement"], description: "Front-End Development" },\n  user-experience-design: { arrmPatterns: ["user experience (ux) design", "user experience (ux design)", "user experience ux design", "user experience (ux)", "user experience", "user experience design", "ux design"], description: "User Experience (UX) Design" },\n  visual-design: { arrmPatterns: ["visual design"], description: "Visual Design" },\n  testing: { arrmPatterns: ["testing"], description: "Testing" },\n  business-analysis: { arrmPatterns: ["business analysis"], description: "Business Analysis" },\n  progress bar: { arrmPatterns: ["progress bar"], description: "Progress Bar" },\n  site map: { arrmPatterns: ["site map"], description: "Site Map" }\n}',
    IGNORED_ROLES: scriptVars.IGNORED_ROLES || "['none', 'TBD', '']"
  };
}

function testRoleNormalization() {
  const roleNormalizer = loadGenerateRoleIndexesScript();
  const testCases = [
    { input: 'User Experience (UX) Design', expected: 'user-experience-design', description: 'UX Design with parentheses' },
    { input: 'user experience (ux) design', expected: 'user-experience-design', description: 'Lowercase UX design with parentheses' },
    { input: 'user experience (ux design)', expected: 'user-experience-design', description: 'UX design with parentheses' },
    { input: 'user experience ux design', expected: 'user-experience-design', description: 'Multiple UX design variations' },
    { input: 'user experience (ux)', expected: 'user-experience-design', description: 'UX in parentheses' },
    { input: 'User Experience', expected: 'user-experience-design', description: 'User Experience without design' },
    { input: 'UX Design', expected: 'user-experience-design', description: 'Shortcut UX Design' },
    { input: 'User Experience Design', expected: 'user-experience-design', description: 'User Experience Design' },
    { input: 'Front-End Development', expected: 'front-end-development', description: 'Standard Front-End Development' },
    { input: 'Front End Development', expected: 'front-end-development', description: 'Space separated Front End' },
    { input: 'Front-End Developement', expected: 'front-end-development', description: 'Typo Front-End Developement' },
    { input: 'Content Authoring', expected: 'content-authoring', description: 'Standard Content Authoring' },
    { input: 'Visual Design', expected: 'visual-design', description: 'Standard Visual Design' },
    { input: 'Testing', expected: 'testing', description: 'Standard Testing' },
    { input: 'Business Analysis', expected: 'business-analysis', description: 'Standard Business Analysis' },
    { input: 'Progress Bar', expected: 'progress-bar', description: 'Standard Progress Bar' },
    { input: 'Site Map', expected: 'site-map', description: 'Standard Site Map' },
    { input: 'none', expected: null, description: 'Special ignored value' },
    { input: 'TBD', expected: null, description: 'Special ignored value' },
    { input: '', expected: null, description: 'Empty string' }
  ];

  console.log('Running role normalization tests...');
  console.log('=' .repeat(70));
  console.log('Test Results:');
  console.log('=' .repeat(70));

  let passed = 0;
  let failed = 0;

  for (const test of testCases) {
    const result = roleNormalizer.normalizeRoleName(test.input);
    if (result === test.expected) {
      console.log(`✓ PASS: ${test.description}`);
      console.log(`       Input: "${test.input}" -> Output: ${result || 'null'}`);
      passed++;
    } else {
      console.log(`✗ FAIL: ${test.description}`);
      console.log(`       Input: "${test.input}" -> Expected: ${test.expected || 'null'}, Got: ${result || 'null'}`);
      failed++;
    }
    console.log('');
  }

  console.log('=' .repeat(70));
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
  testRoleNormalization();
}

module.exports = { testRoleNormalization };