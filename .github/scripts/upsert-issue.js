'use strict';

const crypto = require('crypto');

function reportHash(report) {
  return crypto.createHash('sha256').update(report, 'utf8').digest('hex').slice(0, 16);
}

async function ensureLabel(github, context, name, color, description) {
  try {
    await github.rest.issues.getLabel({
      owner: context.repo.owner,
      repo: context.repo.repo,
      name,
    });
  } catch (error) {
    if (error.status !== 404) {
      throw error;
    }
    await github.rest.issues.createLabel({
      owner: context.repo.owner,
      repo: context.repo.repo,
      name,
      color,
      description,
    });
  }
}

/**
 * Create one open issue per title, or update it only when the report changed.
 * Repeated runs with the same report are a no-op, so scheduled checks do not
 * create duplicate issues or comment spam.
 */
async function upsertIssue({
  github,
  context,
  label,
  title,
  report,
  body,
  labelColor = 'f9d0c4',
  labelDescription = 'Tracks synchronization with mgifford/ACCESSIBILITY.md',
}) {
  await ensureLabel(github, context, label, labelColor, labelDescription);

  const hash = reportHash(report);
  const marker = `<!-- sync-report:${hash} -->`;
  const { data: issues } = await github.rest.issues.listForRepo({
    owner: context.repo.owner,
    repo: context.repo.repo,
    state: 'open',
    labels: label,
    per_page: 100,
  });

  const existing = issues.find((issue) => issue.title === title);
  const finalBody = `${marker}\n\n${body}`;

  if (existing) {
    if (typeof existing.body === 'string' && existing.body.includes(marker)) {
      return { action: 'unchanged', number: existing.number, hash };
    }
    await github.rest.issues.update({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: existing.number,
      body: finalBody,
    });
    return { action: 'updated', number: existing.number, hash };
  }

  const { data: created } = await github.rest.issues.create({
    owner: context.repo.owner,
    repo: context.repo.repo,
    title,
    body: finalBody,
    labels: [label],
  });
  return { action: 'created', number: created.number, hash };
}

module.exports = { upsertIssue, reportHash };
