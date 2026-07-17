const fs = require('fs/promises');
const path = require('path');
const process = require('process');
const { parse } = require('csv-parse');

const arrmDataPath = path.join(process.cwd(), 'data/arrm/arrm-all-tasks.csv');
const rolesDir = process.env.ARRM_ROLES_DIR || path.join(process.cwd(), 'roles');

const ARRM_SOURCE_URL = 'https://github.com/w3c/wai-arrm/blob/draft/_data/arrm/arrm-all-tasks.csv';
const ARRM_RETRIEVAL_DATE = '2025-01-01';

const SUPPORTED_ROLES = {
  'content-authoring': {
    arrmPatterns: ['content authoring'],
    description: 'Content Authoring',
    dirName: 'content-authoring'
  },
  'front-end-development': {
    arrmPatterns: [
      'front end development',
      'front-end development',
      'front-end developement'
    ],
    description: 'Front-End Development',
    dirName: 'front-end-development'
  },
  'user-experience-design': {
    arrmPatterns: [
      'user experience (ux) design',
      'user experience (ux design)',
      'user experience ux design',
      'user experience (ux)',
      'user experience',
      'user experience design',
      'ux design'
    ],
    description: 'User Experience (UX) Design',
    dirName: 'user-experience-design'
  },
  'visual-design': {
    arrmPatterns: ['visual design'],
    description: 'Visual Design',
    dirName: 'visual-design'
  },
  'testing': {
    arrmPatterns: ['testing'],
    description: 'Testing',
    dirName: 'testing'
  },
  'business-analysis': {
    arrmPatterns: ['business analysis'],
    description: 'Business Analysis',
    dirName: 'business-analysis'
  },
  'progress-bar': {
    arrmPatterns: ['progress bar'],
    description: 'Progress Bar',
    dirName: 'progress-bar'
  },
  'site-map': {
    arrmPatterns: ['site map'],
    description: 'Site Map',
    dirName: 'site-map'
  }
};

const IGNORED_ROLES = ['none', 'TBD', ''];

const UNKNOWN_ROLE_ERROR = 'ERROR: Unrecognized role found in ARRM CSV. Please update SUPPORTED_ROLES in generate-role-indexes.js.';

function getGeneratedHeader() {
  return `<!-- This file is generated from W3C WAI ARRM data. Do not edit manually. -->
<!-- Source: ${ARRM_SOURCE_URL} -->
<!-- Retrieved: ${ARRM_RETRIEVAL_DATE} -->
`;
}

async function readCSV(filePath) {
  const content = await fs.readFile(filePath, 'utf8');

  return new Promise((resolve, reject) => {
    const records = [];
    const parser = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      skip_header: false,
      cast: true,
      encoding: 'utf8'
    });

    parser.on('data', (record) => {
      records.push(record);
    });

    parser.on('error', (err) => {
      reject(err);
    });

    parser.on('end', () => {
      const tasks = [];
      for (const record of records) {
        const task = {};
        for (const [key, value] of Object.entries(record)) {
          const normalizedKey = key.toLowerCase().replace(/ /g, '_');
          task[normalizedKey] = value;
        }
        tasks.push(task);
      }
      resolve(tasks);
    });
  });
}

function normalizeRoleName(role) {
  if (!role || IGNORED_ROLES.includes(role.trim().toLowerCase())) return null;

  const normalized = role.trim().toLowerCase();

  for (const [roleId, config] of Object.entries(SUPPORTED_ROLES)) {
    for (const pattern of config.arrmPatterns) {
      if (pattern === normalized) {
        return roleId;
      }
    }
  }

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

  console.error(`${UNKNOWN_ROLE_ERROR}\n  Found role: "${role}"\n  Known roles: ${Object.keys(SUPPORTED_ROLES).join(', ')}\n  Ignore with: Add to IGNORED_ROLES if this role should not be supported.\n  `);
  process.exit(1);
}

async function generateRoleIndexes(tasks) {
  const roleDirectories = [
    'content-authoring',
    'front-end-development',
    'user-experience-design',
    'visual-design',
    'testing',
    'business-analysis'
  ];

  for (const role of roleDirectories) {
    const generatedPath = path.join(rolesDir, role, 'generated');
    try {
      await fs.mkdir(generatedPath, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }
  }

  const roleGroups = {
    'content-authoring': { primary: [], secondary: [], contributor: [] },
    'front-end-development': { primary: [], secondary: [], contributor: [] },
    'user-experience-design': { primary: [], secondary: [], contributor: [] },
    'visual-design': { primary: [], secondary: [], contributor: [] },
    'testing': { primary: [], secondary: [], contributor: [] },
    'business-analysis': { primary: [], secondary: [], contributor: [] }
  };

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

  for (const [role, data] of Object.entries(roleGroups)) {
    const roleNameCapitalized = role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const generatedDir = path.join(rolesDir, role, 'generated');
    const generatedDate = ARRM_RETRIEVAL_DATE;

    const taskSummary = `${getGeneratedHeader()}
# ${roleNameCapitalized} — Task Summary

> **This file is generated from W3C WAI ARRM data. Do not edit manually.**
>
> Source: [W3C WAI ARRM](${ARRM_SOURCE_URL})
> Retrieved: ${ARRM_RETRIEVAL_DATE}

## Primary Ownership Tasks (${data.primary.length})

${data.primary.length > 0 ? data.primary.map(task => `- ${task.task} (ID: ${task.id})`).join('\n') : '(None)'}

## Secondary Ownership Tasks (${data.secondary.length})

${data.secondary.length > 0 ? data.secondary.map(task => `- ${task.task} (ID: ${task.id})`).join('\n') : '(None)'}

## Contributor Tasks (${data.contributor.length})

${data.contributor.length > 0 ? data.contributor.map(task => `- ${task.task} (ID: ${task.id})`).join('\n') : '(None)'}

---
Generated: ${generatedDate}
`;

    await fs.writeFile(path.join(generatedDir, 'task-summary.md'), taskSummary);

    if (data.primary.length > 0) {
      let csvContent = `${getGeneratedHeader()}"ID","WCAG SC","Level","Task","Main Role","Primary Ownership","Secondary Ownership","Contributor","Status"\n`;
      for (const task of data.primary) {
        const escapedTask = task.task.replace(/"/g, '""');
        csvContent += `"${task.id}","${task.wcag_sc}","${task.level}","${escapedTask}","${task.main_role}","${task.primary_ownership}","${task.secondary_ownership}","${task.contributor}","${task.status}"\n`;
      }
      await fs.writeFile(path.join(generatedDir, 'primary-tasks.csv'), csvContent);
    }

    if (data.secondary.length > 0) {
      let csvContent = `${getGeneratedHeader()}"ID","WCAG SC","Level","Task","Main Role","Primary Ownership","Secondary Ownership","Contributor","Status"\n`;
      for (const task of data.secondary) {
        const escapedTask = task.task.replace(/"/g, '""');
        csvContent += `"${task.id}","${task.wcag_sc}","${task.level}","${escapedTask}","${task.main_role}","${task.primary_ownership}","${task.secondary_ownership}","${task.contributor}","${task.status}"\n`;
      }
      await fs.writeFile(path.join(generatedDir, 'secondary-tasks.csv'), csvContent);
    }

    if (data.contributor.length > 0) {
      let csvContent = `${getGeneratedHeader()}"ID","WCAG SC","Level","Task","Main Role","Primary Ownership","Secondary Ownership","Contributor","Status"\n`;
      for (const task of data.contributor) {
        const escapedTask = task.task.replace(/"/g, '""');
        csvContent += `"${task.id}","${task.wcag_sc}","${task.level}","${escapedTask}","${task.main_role}","${task.primary_ownership}","${task.secondary_ownership}","${task.contributor}","${task.status}"\n`;
      }
      await fs.writeFile(path.join(generatedDir, 'contributor-tasks.csv'), csvContent);
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

  console.log('\nDone! Role indexes have been generated in roles/*/generated/ directories.');
  console.log('Note: Curated ROLE.md files are never overwritten by this generator.');
}

main().catch(console.error);
