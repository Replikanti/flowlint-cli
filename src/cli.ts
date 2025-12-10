/**
 * FlowLint CLI
 *
 * A command-line tool for static analysis of n8n workflow files.
 * Can be used locally, in CI pipelines, or pre-commit hooks.
 */

import { Command } from 'commander';
import { scanCommand } from './commands/scan';
import { initCommand } from './commands/init';

const program = new Command();

program
  .name('flowlint')
  .description('Static analysis tool for n8n workflows')
  .version('0.6.0');

// Register commands
program.addCommand(scanCommand);
program.addCommand(initCommand);

// Parse and execute
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}