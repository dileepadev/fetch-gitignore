import fetch from 'node-fetch';

const RAW_BASE =
  'https://raw.githubusercontent.com/github/gitignore/main';

const API_BASE =
  'https://api.github.com/repos/github/gitignore/contents';

/**
 * Handle HTTP Response and check for rate limits
 */
async function handleResponse(res, errorMessage) {
  if (res.status === 403 || res.status === 429) {
    const resetTime = res.headers.get('x-ratelimit-reset');
    if (resetTime) {
      const date = new Date(parseInt(resetTime) * 1000);
      const waitMinutes = Math.ceil((date.getTime() - Date.now()) / 60000);
      throw new Error(
        `GitHub API rate limit exceeded. Please try again in ${waitMinutes} minute(s).`
      );
    }
  }

  if (!res.ok) {
    throw new Error(errorMessage || `Request failed with status ${res.status}`);
  }

  return res;
}

/**
 * Fetch a single template by name
 */
export async function fetchTemplate(name) {
  const url = `${RAW_BASE}/${name}.gitignore`;

  const res = await fetch(url);
  await handleResponse(res, `Template "${name}" not found.`);

  return await res.text();
}

/**
 * List available templates via GitHub API
 */
export async function listTemplates() {
  const res = await fetch(API_BASE);
  await handleResponse(res, 'Failed to fetch template list from GitHub.');

  const data = await res.json();

  return data
    .filter((file) => file.name.endsWith('.gitignore'))
    .map((file) => file.name.replace('.gitignore', ''));
}
