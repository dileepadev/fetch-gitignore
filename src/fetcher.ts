import fetch, { type Response } from "node-fetch";

const RAW_BASE = "https://raw.githubusercontent.com/github/gitignore/main";
const API_BASE = "https://api.github.com/repos/github/gitignore/contents";

type GitHubContentItem = {
  name: string;
};

async function handleResponse(
  res: Response,
  errorMessage?: string,
): Promise<Response> {
  if (res.status === 403 || res.status === 429) {
    const resetTime = res.headers.get("x-ratelimit-reset");
    if (resetTime) {
      const date = new Date(Number.parseInt(resetTime, 10) * 1000);
      const waitMinutes = Math.ceil((date.getTime() - Date.now()) / 60000);
      throw new Error(
        `GitHub API rate limit exceeded. Please try again in ${waitMinutes} minute(s).`,
      );
    }
  }

  if (!res.ok) {
    throw new Error(errorMessage ?? `Request failed with status ${res.status}`);
  }

  return res;
}

export async function fetchTemplate(name: string): Promise<string> {
  const url = `${RAW_BASE}/${name}.gitignore`;

  const res = await fetch(url);
  await handleResponse(res, `Template "${name}" not found.`);

  return await res.text();
}

export async function listTemplates(): Promise<string[]> {
  const res = await fetch(API_BASE);
  await handleResponse(res, "Failed to fetch template list from GitHub.");

  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) {
    throw new Error("Unexpected response format from GitHub API.");
  }

  return (data as GitHubContentItem[])
    .filter(
      (file) =>
        typeof file.name === "string" && file.name.endsWith(".gitignore"),
    )
    .map((file) => file.name.replace(".gitignore", ""));
}
