/**
 * init command - Initialize FlowLint configuration
 */

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import pc from 'picocolors';
import { defaultConfig } from '@replikanti/flowlint-core';
import YAML from 'yaml';

export const initCommand = new Command('init')
  .description('Initialize FlowLint configuration in the current directory')
  .option('--force', 'Overwrite existing config file', false)
  .action((options: { force: boolean }) => {
    const configPath = path.join(process.cwd(), '.flowlint.yml');

    if (fs.existsSync(configPath) && !options.force) {
      console.log(pc.yellow('.flowlint.yml already exists. Use --force to overwrite.'));
      return;
    }

    // Create a simplified config for user
    const userConfig = {
      files: {
        include: defaultConfig.files.include,
        ignore: defaultConfig.files.ignore,
      },
      rules: Object.fromEntries(
        Object.entries(defaultConfig.rules).map(([key, value]) => [
          key,
          { enabled: value.enabled },
        ])
      ),
    };

    const yamlContent = YAML.stringify(userConfig);
    fs.writeFileSync(configPath, yamlContent, 'utf-8');

    console.log(pc.green('Created .flowlint.yml'));
    console.log(pc.gray('Edit this file to customize FlowLint behavior.'));
  });


