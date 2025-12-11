/**
 * scan command - Analyze n8n workflow files in a directory
 */

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import pc from 'picocolors';
import {
  parseN8n, 
  runAllRules,
  loadConfig,
  ValidationError,
  countFindingsBySeverity,
  type Finding,
  type FlowLintConfig
} from '@replikanti/flowlint-core';
import { formatJunit } from '../reporters/junit';
import { formatSarif } from '../reporters/sarif';
import { formatJson } from '../reporters/json';

interface ScanOptions {
  config?: string;
  format: string;
  failOnError: boolean;
}

export const scanCommand = new Command('scan')
  .description('Scan workflow files for issues')
  .argument('[path]', 'Directory or file to scan', '.')
  .option('--config <path>', 'Path to .flowlint.yml config file')
  .option('--format <format>', 'Output format: stylish|json|junit|sarif', 'stylish')
  .option('--fail-on-error', 'Exit with code 1 if errors found', false)
  .action(async (scanPath: string, options: ScanOptions) => {
    try {
      const absolutePath = path.resolve(process.cwd(), scanPath);
      const isStylish = options.format === 'stylish';

      // Load configuration
      const config: FlowLintConfig = options.config
        ? loadConfig(options.config)
        : loadConfig();

      // Find workflow files
      const patterns = config.files.include.map(p =>
        path.join(absolutePath, p).replace(/\\/g, '/')
      );

      const ignorePatterns = config.files.ignore.map(p =>
        path.join(absolutePath, p).replace(/\\/g, '/')
      );

      const files = await glob(patterns, {
        ignore: ignorePatterns,
        nodir: true
      });

      if (files.length === 0) {
        if (isStylish) console.log(pc.yellow('No workflow files found.'));
        return;
      }

      if (isStylish) {
        console.log(pc.blue('Scanning ' + files.length + ' file(s)...'));
        console.log('');
      }

      // Analyze files
      const allFindings: Finding[] = [];
      let errorCount = 0;

      for (const file of files) {
        try {
          const content = fs.readFileSync(file, 'utf-8');
          const relativePath = path.relative(process.cwd(), file);

          const graph = parseN8n(content);
          const findings = runAllRules(graph, {
            path: relativePath,
            cfg: config,
            nodeLines: graph.meta.nodeLines as Record<string, number> | undefined,
          });

          allFindings.push(...findings);

          if (isStylish && findings.length > 0) {
            console.log(pc.underline(relativePath));
            findings.forEach(f => {
              const color = f.severity === 'must' ? pc.red : (f.severity === 'should' ? pc.yellow : pc.gray);
              const line = f.line ? `:${f.line}` : '';
              console.log(`  ${color(f.severity.padEnd(6))} ${f.rule} ${f.message}${pc.gray(line)}`);
            });
            console.log('');
          }
          
          if (findings.some(f => f.severity === 'must')) {
              errorCount++;
          }

        } catch (error) {
          allFindings.push({
             rule: 'validation-error',
             message: error instanceof Error ? error.message : String(error),
             severity: 'must',
             path: path.relative(process.cwd(), file),
             line: 0
          });
          errorCount++;
          
          if (isStylish) {
            if (error instanceof ValidationError) {
                console.log(pc.red('x ' + path.relative(process.cwd(), file) + ': Validation error'));
                error.errors.forEach(e => {
                console.log(pc.gray('  ' + e.path + ': ' + e.message));
                });
            } else {
                console.log(pc.red('x ' + path.relative(process.cwd(), file) + ': ' + (error instanceof Error ? error.message : String(error))));
            }
          }
        }
      }

      // Output results
      switch (options.format) {
        case 'json':
          console.log(formatJson(allFindings, { files: files.length, errors: errorCount }));
          break;
        case 'junit':
          console.log(formatJunit(allFindings));
          break;
        case 'sarif':
          console.log(formatSarif(allFindings));
          break;
        case 'stylish':
        default:
          const summary = countFindingsBySeverity(allFindings);
          console.log('Summary:');
          console.log(`  Files scanned: ${files.length}`);
          console.log(`  Errors (must): ${pc.red(summary.must)}`);
          console.log(`  Warnings (should): ${pc.yellow(summary.should)}`);
          console.log(`  Notes (nit): ${pc.gray(summary.nit)}`);
          break;
      }

      if (options.failOnError && errorCount > 0) {
        process.exit(1);
      }

    } catch (error) {
      console.error(pc.red('Error: ' + (error instanceof Error ? error.message : String(error))));
      process.exit(1);
    }
  });
