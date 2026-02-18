import fetch from 'node-fetch';

const RAW_BASE =
  'https://raw.githubusercontent.com/github/gitignore/main';

const API_BASE =
  'https://api.github.com/repos/github/gitignore/contents';

/**
 * Fetch a single template by name
 */
export async function fetchTemplate(name) {
  const url = `${RAW_BASE}/${name}.gitignore`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Template "${name}" not found.`);
  }

  return await res.text();
}

/**
 * List available templates via GitHub API
 */
export async function listTemplates() {
  const res = await fetch(API_BASE);

  if (!res.ok) {
    throw new Error('Failed to fetch template list from GitHub.');
  }

  const data = await res.json();

  return data
    .filter((file) => file.name.endsWith('.gitignore'))
    .map((file) => file.name.replace('.gitignore', ''));
}
