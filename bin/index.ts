#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import process from "process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { fetchTemplate, listTemplates } from "../src/fetcher.js";
import { writeGitignore } from "../src/fileManager.js";
import { getFromCache, saveToCache } from "../src/cache.js";
import { logSuccess, logError } from "../src/logger.js";
import { resolveDirectory, mergeTemplates } from "../src/utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = fs.existsSync(path.join(__dirname, "../package.json"))
  ? path.join(__dirname, "../package.json")
  : path.join(__dirname, "../../package.json");

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

const program = new Command();

program
  .name("fetch-gitignore")
  .description("Fetch official .gitignore templates from GitHub")
  .version(packageJson.version);

program
  .command("list")
  .description("List available .gitignore templates")
  .option("--no-cache", "Bypass local cache and fetch from GitHub", false)
  .action(async (options: { cache: boolean }) => {
    const spinner = ora("Fetching available templates...").start();
    try {
      let templates: string[];
      const cached = options.cache
        ? getFromCache("templates-list", "json")
        : null;

      if (cached) {
        templates = JSON.parse(cached) as string[];
      } else {
        templates = await listTemplates();
        saveToCache("templates-list", JSON.stringify(templates), "json");
      }

      spinner.stop();

      templates.sort().forEach((template) => {
        console.log(chalk.green(template));
      });

      logSuccess(`Total templates: ${templates.length}`);
    } catch (err: unknown) {
      spinner.stop();
      logError(err instanceof Error ? err.message : String(err));
    }
  });

program
  .command("add <templates...>")
  .description("Fetch and save one or more templates")
  .option("-d, --dir <path>", "Target directory", process.cwd())
  .option("-a, --append", "Append instead of overwrite", false)
  .option("-f, --force", "Force overwrite if file exists", false)
  .option("--no-cache", "Bypass local cache and fetch from GitHub", false)
  .action(
    async (
      templates: string[],
      options: { dir: string; append: boolean; force: boolean; cache: boolean },
    ) => {
      const spinner = ora("Fetching template(s)...").start();

      try {
        const targetDir = resolveDirectory(options.dir);
        const contents: string[] = [];

        for (const template of templates) {
          let content = options.cache ? getFromCache(template) : null;

          if (!content) {
            content = await fetchTemplate(template);
            saveToCache(template, content);
          }

          contents.push(content);
        }

        spinner.text = "Writing .gitignore...";

        const merged = mergeTemplates(contents);
        writeGitignore(merged, targetDir, {
          append: options.append,
          force: options.force,
        });

        spinner.stop();
        logSuccess(`.gitignore saved in ${targetDir}`);
      } catch (err: unknown) {
        spinner.stop();
        logError(err instanceof Error ? err.message : String(err));
      }
    },
  );

program.parse(process.argv);
