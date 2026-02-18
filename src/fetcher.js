import fetch from 'node-fetch';

const BASE_URL =
  'https://raw.githubusercontent.com/github/gitignore/main';

export async function fetchTemplate(name) {
  const url = `${BASE_URL}/${name}.gitignore`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Template "${name}" not found.`);
  }

  return await response.text();
}
