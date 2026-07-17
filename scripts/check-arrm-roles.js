#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const rolesDir = path.join(process.cwd(), 'roles');
const tempDir = path.join(os.tmpdir(), `arrm-check-${Date.now()}`);

async function cleanupTempDir() {
  try {
    await fs.rm(tempDir, { recursive: true, force: true });
  } catch (err) {
    // Ignore cleanup errors
  }
}

async function runCheck() {
  console.log('Running ARRM role integrity checks...');
  console.log('='.repeat(70));

  let exitCode = 0;

  try {
    // Create temp directory
    await fs.mkdir(tempDir, { recursive: true });

    // Run generation into temp directory
    console.log('\n1. Regenerating into temp directory...');
    const generateScript = path.join(__dirname, 'generate-role-indexes.js');
    
    try {
      // Set environment variable to use temp directory
      const env = { ...process.env, ARRM_ROLES_DIR: tempDir };
      execSync(`node ${generateScript}`, { stdio: 'pipe', env });
      console.log('   ✓ Generation completed successfully');
    } catch (err) {
      console.log('   ✗ Generation failed');
      console.log(`   Error: ${err.message}`);
      exitCode = 1;
      return exitCode;
    }

    // Check for unknown roles in generated output
    console.log('\n2. Checking for unknown roles...');
    const tempRoles = await fs.readdir(tempDir);
    const knownRoles = [
      'content-authoring',
      'front-end-development',
      'user-experience-design',
      'visual-design',
      'testing',
      'business-analysis'
    ];
    
    let unknownRoles = [];
    for (const role of tempRoles) {
      if (!knownRoles.includes(role)) {
        unknownRoles.push(role);
      }
    }
    
    if (unknownRoles.length > 0) {
      console.log('   ✗ Unknown roles found in generated output:');
      for (const role of unknownRoles) {
        console.log(`     - ${role}`);
      }
      exitCode = 1;
    } else {
      console.log('   ✓ No unknown roles found');
    }

    // Compare generated files with committed files
    console.log('\n3. Comparing with committed files...');
    for (const role of knownRoles) {
      const committedDir = path.join(rolesDir, role, 'generated');
      const tempRoleDir = path.join(tempDir, role, 'generated');
      
      try {
        // Check if committed directory exists
        await fs.access(committedDir);
        
        // Get list of files in both directories
        const committedFiles = await fs.readdir(committedDir);
        const tempFiles = await fs.readdir(tempRoleDir);
        
        // Check for missing files
        const missingInCommitted = tempFiles.filter(f => !committedFiles.includes(f));
        const missingInTemp = committedFiles.filter(f => !tempFiles.includes(f));
        
        if (missingInCommitted.length > 0) {
          console.log(`   ✗ ${role}: Missing files in committed output:`);
          for (const file of missingInCommitted) {
            console.log(`     - ${file}`);
          }
          exitCode = 1;
        }
        
        if (missingInTemp.length > 0) {
          console.log(`   ✗ ${role}: Extra files in committed output:`);
          for (const file of missingInTemp) {
            console.log(`     - ${file}`);
          }
          exitCode = 1;
        }
        
        // Compare file contents
        for (const file of committedFiles) {
          if (tempFiles.includes(file)) {
            const committedContent = await fs.readFile(path.join(committedDir, file), 'utf8');
            const tempContent = await fs.readFile(path.join(tempRoleDir, file), 'utf8');
            
            if (committedContent !== tempContent) {
              console.log(`   ✗ ${role}/${file}: Content differs`);
              exitCode = 1;
            }
          }
        }
        
        if (missingInCommitted.length === 0 && missingInTemp.length === 0) {
          console.log(`   ✓ ${role}: Files match`);
        }
      } catch (err) {
        if (err.code === 'ENOENT') {
          // Committed directory doesn't exist, check if temp has files
          try {
            const tempFiles = await fs.readdir(tempRoleDir);
            if (tempFiles.length > 0) {
              console.log(`   ✗ ${role}: Missing committed directory`);
              exitCode = 1;
            }
          } catch (tempErr) {
            // Neither exists, that's OK
          }
        } else {
          console.log(`   ✗ ${role}: Error checking files: ${err.message}`);
          exitCode = 1;
        }
      }
    }

    // Check for timestamp-only differences
    console.log('\n4. Checking for timestamp-only differences...');
    let timestampDiffs = 0;
    
    for (const role of knownRoles) {
      const committedDir = path.join(rolesDir, role, 'generated');
      const tempRoleDir = path.join(tempDir, role, 'generated');
      
      try {
        const committedFiles = await fs.readdir(committedDir);
        
        for (const file of committedFiles) {
          const committedContent = await fs.readFile(path.join(committedDir, file), 'utf8');
          const tempContent = await fs.readFile(path.join(tempRoleDir, file), 'utf8');
          
          if (committedContent !== tempContent) {
            // Check if only timestamps differ
            const committedWithoutTimestamp = committedContent.replace(/Generated:.*$/gm, 'Generated: [TIMESTAMP]');
            const tempWithoutTimestamp = tempContent.replace(/Generated:.*$/gm, 'Generated: [TIMESTAMP]');
            
            if (committedWithoutTimestamp === tempWithoutTimestamp) {
              timestampDiffs++;
            }
          }
        }
      } catch (err) {
        // Skip if directory doesn't exist
      }
    }
    
    if (timestampDiffs > 0) {
      console.log(`   ⚠ ${timestampDiffs} files have timestamp-only differences`);
      console.log('   Consider updating ARRM_RETRIEVAL_DATE in generate-role-indexes.js');
    } else {
      console.log('   ✓ No timestamp-only differences found');
    }

    // Check ARRM CSV staleness
    console.log('\n5. Checking ARRM CSV staleness...');
    const csvPath = path.join(process.cwd(), 'data/arrm/arrm-all-tasks.csv');
    try {
      const csvStats = await fs.stat(csvPath);
      const csvAge = Date.now() - csvStats.mtimeMs;
      const daysSinceModified = Math.floor(csvAge / (1000 * 60 * 60 * 24));
      
      if (daysSinceModified > 30) {
        console.log(`   ⚠ ARRM CSV was last modified ${daysSinceModified} days ago`);
        console.log('   Consider updating with latest ARRM data');
      } else {
        console.log(`   ✓ ARRM CSV is recent (${daysSinceModified} days old)`);
      }
    } catch (err) {
      console.log(`   ✗ Could not check ARRM CSV: ${err.message}`);
      exitCode = 1;
    }

    // Summary
    console.log('\n' + '='.repeat(70));
    if (exitCode === 0) {
      console.log('All checks passed!');
    } else {
      console.log('Some checks failed. Please review the issues above.');
    }
    console.log('='.repeat(70));

  } finally {
    await cleanupTempDir();
  }

  return exitCode;
}

if (require.main === module) {
  runCheck().then(exitCode => {
    process.exit(exitCode);
  }).catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
}

module.exports = { runCheck };
