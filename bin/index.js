#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import process from 'process';

import { fetchTemplate, listTemplates } from '../src/fetcher.js';
import { writeGitignore } from '../src/fileManager.js';
import { getFromCache, saveToCache } from '../src/cache.js';
import { logSuccess, logError, logInfo } from '../src/logger.js';
import { resolveDirectory, mergeTemplates } from '../src/utils.js';

const program = new Command();

program
  .name('fetch-gitignore')
  .description('Fetch official .gitignore templates from GitHub')
  .version('1.0.0');

/**
 * LIST COMMAND
 */
program
  .command('list')
  .description('List available .gitignore templates')
  .action(async () => {
    const spinner = ora('Fetching available templates...').start();
    try {
      const templates = await listTemplates();
      spinner.stop();

      templates.sort().forEach((t) => {
        console.log(chalk.green(t));
      });

      logSuccess(`Total templates: ${templates.length}`);
    } catch (err) {
      spinner.stop();
      logError(err.message);
    }
  });

/**
 * ADD COMMAND
 */
program
  .command('add <templates...>')
  .description('Fetch and save one or more templates')
  .option('-d, --dir <path>', 'Target directory', process.cwd())
  .option('-a, --append', 'Append instead of overwrite', false)
  .option('-f, --force', 'Force overwrite if file exists', false)
  .action(async (templates, options) => {
    const targetDir = resolveDirectory(options.dir);

    const spinner = ora('Fetching template(s)...').start();

    try {
      let contents = [];

      for (const template of templates) {
        let content = getFromCache(template);

        if (!content) {
          content = await fetchTemplate(template);
          saveToCache(template, content);
        }

        contents.push(content);
      }

      spinner.text = 'Writing .gitignore...';

      const merged = mergeTemplates(contents);
      writeGitignore(merged, targetDir, {
        append: options.append,
        force: options.force,
      });

      spinner.stop();
      logSuccess(`.gitignore saved in ${targetDir}`);
    } catch (err) {
      spinner.stop();
      logError(err.message);
    }
  });

program.parse(process.argv);
