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

export async function listTemplates() {
  const res = await fetch(
    'https://api.github.com/repos/github/gitignore/contents'
  );

  const data = await res.json();

  return data
    .filter(file => file.name.endsWith('.gitignore'))
    .map(file => file.name.replace('.gitignore', ''));
}
