const fs = require('fs/promises');
const path = require('path');

const arrmDataPath = path.join(process.cwd(), 'data/arrm/arrm-all-tasks.csv');
const rolesDir = path.join(process.cwd(), 'roles');

async function readCSV(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const lines = content.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  const tasks = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = parseCSVLine(lines[i]);
    const task = {};
    
    headers.forEach((header, index) => {
      const normalizedHeader = header.toLowerCase().replace(/ /g, '_');
      if (values[index] !== undefined) {
        task[normalizedHeader] = values[index];
      }
    });
    
    tasks.push(task);
  }
  
  return tasks;
}

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  
  if (current) {
    values.push(current.trim().replace(/^"|"$/g, ''));
  }
  
  return values;
}

function normalizeRoleName(role) {
  if (!role || role === 'none' || role === 'TBD') return null;
  
  let normalized = role.trim().toLowerCase().replace(/\\(UX Design\\)/g, '(ux design)');
  
  if (normalized.includes('content authoring')) {
    return 'content-authoring';
  } else if (normalized.includes('front end development') || normalized.includes('front-end development')) {
    return 'front-end-development';
  } else if (normalized.includes('user experience ux design') || normalized.includes('user experience (ux design)')) {
    return 'user-experience-design';
  } else if (normalized.includes('visual design')) {
    return 'visual-design';
  } else if (normalized.includes('testing') && !normalized.includes('user experience')) {
    return 'testing';
  } else if (normalized.includes('business analysis')) {
    return 'business-analysis';
  }
  
  return null;
}

async function generateRoleIndexes(tasks) {
  // Create role directories if they don't exist
  const roleDirectories = [
    'content-authoring',
    'front-end-development', 
    'user-experience-design',
    'visual-design',
    'testing',
    'business-analysis'
  ];
  
  for (const role of roleDirectories) {
    const rolePath = path.join(rolesDir, role);
    try {
      await fs.mkdir(rolePath, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }
  }
  
  // Group tasks by role
  const roleGroups = {
    'content-authoring': {
      primary: [],
      secondary: [],
      contributor: []
    },
    'front-end-development': {
      primary: [],
      secondary: [],
      contributor: []
    },
    'user-experience-design': {
      primary: [],
      secondary: [],
      contributor: []
    },
    'visual-design': {
      primary: [],
      secondary: [],
      contributor: []
    },
    'testing': {
      primary: [],
      secondary: [],
      contributor: []
    },
    'business-analysis': {
      primary: [],
      secondary: [],
      contributor: []
    }
  };
  
  // Process each task
  for (const task of tasks) {
    const primaryRole = normalizeRoleName(task.primary_ownership);
    const secondaryRoles = (task.secondary_ownership || '')
      .split(',')
      .map(r => r.trim())
      .filter(Boolean)
      .map(normalizeRoleName)
      .filter(Boolean);
    const contributorRoles = (task.contributor || '')
      .split(',')
      .map(r => r.trim())
      .filter(Boolean)
      .map(normalizeRoleName)
      .filter(Boolean);
    
    if (primaryRole && roleGroups[primaryRole]) {
      roleGroups[primaryRole].primary.push(task);
    }
    
    for (const secondaryRole of secondaryRoles) {
      if (secondaryRole && roleGroups[secondaryRole]) {
        roleGroups[secondaryRole].secondary.push(task);
      }
    }
    
    for (const contributorRole of contributorRoles) {
      if (contributorRole && roleGroups[contributorRole]) {
        roleGroups[contributorRole].contributor.push(task);
      }
    }
  }
  
  // Generate files for each role
  for (const [role, data] of Object.entries(roleGroups)) {
    const roleNameCapitalized = role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const primaryTasks = data.primary.length > 0 ? data.primary.map(task => `  - ${task.task} (ID: ${task.id})`).join('\n') : '  (None)';
    const secondaryTasks = data.secondary.length > 0 ? data.secondary.map(task => `  - ${task.task} (ID: ${task.id})`).join('\n') : '  (None)';
    const contributorTasks = data.contributor.length > 0 ? data.contributor.map(task => `  - ${task.task} (ID: ${task.id})`).join('\n') : '  (None)';
    const generatedDate = new Date().toISOString();
    
    const roleMd = `## ${roleNameCapitalized}

## Primary Ownership
- *Derived from ARRM CSV*

Primary Tasks:
${primaryTasks}

## Secondary Ownership
- *Derived from ARRM CSV*

Secondary Tasks:
${secondaryTasks}

## Contributor
- *Derived from ARRM CSV*

Contributor Tasks:
${contributorTasks}

## ARRM Task Mapping
Source: W3C WAI ARRM (https://github.com/w3c/wai-arrm/blob/draft/_data/arrm/arrm-all-tasks.csv)

Note: This role file is generated from the ARRM dataset and should not be manually edited.

Generated: ${generatedDate}
`;
    
    await fs.writeFile(path.join(rolesDir, role, 'ROLE.md'), roleMd);
    
    // Generate primary-tasks.csv
    if (data.primary.length > 0) {
      let csvContent = '"ID","WCAG SC","Level","Task","Main Role","Primary Ownership","Secondary Ownership","Contributor","Status"\n';
      for (const task of data.primary) {
        const escapedTask = task.task.replace(/"/g, '"');
        csvContent += `"${task.id}",\"${task.wcag_sc}\",\"${task.level}\",\"${escapedTask}\",\"${task.main_role}\",\"${task.primary_ownership}\",\"${task.secondary_ownership}\",\"${task.contributor}\",\"${task.status}\"\n`;
      }
      await fs.writeFile(path.join(rolesDir, role, 'primary-tasks.csv'), csvContent);
    }
    
    // Generate secondary-tasks.csv  
    if (data.secondary.length > 0) {
      let csvContent = '"ID","WCAG SC","Level","Task","Main Role","Primary Ownership","Secondary Ownership","Contributor","Status"\n';
      for (const task of data.secondary) {
        const escapedTask = task.task.replace(/"/g, '"');
        csvContent += `"${task.id}",\"${task.wcag_sc}\",\"${task.level}\",\"${escapedTask}\",\"${task.main_role}\",\"${task.primary_ownership}\",\"${task.secondary_ownership}\",\"${task.contributor}\",\"${task.status}\"\n`;
      }
      await fs.writeFile(path.join(rolesDir, role, 'secondary-tasks.csv'), csvContent);
    }
    
    // Generate contributor-tasks.csv
    if (data.contributor.length > 0) {
      let csvContent = '"ID","WCAG SC","Level","Task","Main Role","Primary Ownership","Secondary Ownership","Contributor","Status"\n';
      for (const task of data.contributor) {
        const escapedTask = task.task.replace(/"/g, '"');
        csvContent += `"${task.id}",\"${task.wcag_sc}\",\"${task.level}\",\"${escapedTask}\",\"${task.main_role}\",\"${task.primary_ownership}\",\"${task.secondary_ownership}\",\"${task.contributor}\",\"${task.status}\"\n`;
      }
      await fs.writeFile(path.join(rolesDir, role, 'contributor-tasks.csv'), csvContent);
    }
    
    console.log(`Generated role indexes for ${role} (${data.primary.length} primary, ${data.secondary.length} secondary, ${data.contributor.length} contributor tasks)`);
  }
}

async function main() {
  console.log('Reading ARRM CSV data...');
  const tasks = await readCSV(arrmDataPath);
  console.log(`Found ${tasks.length} ARRM tasks`);
  
  console.log('Generating role-specific indexes...');
  await generateRoleIndexes(tasks);
  
  console.log('\nDone! Role indexes have been generated in roles/ directory.');
}

main().catch(console.error);
