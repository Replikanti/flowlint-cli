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
} from '@flowlint/core';

interface ScanOptions {
  config?: string;
  format: string;
  failOnError: boolean;
}

export const scanCommand = new Command('scan')
  .description('Scan workflow files for issues')
  .argument('[path]', 'Directory or file to scan', '.')
  .option('--config <path>', 'Path to .flowlint.yml config file')
  .option('--format <format>', 'Output format: stylish|json', 'stylish')
  .option('--fail-on-error', 'Exit with code 1 if errors found', false)
  .action(async (scanPath: string, options: ScanOptions) => {
    try {
      const absolutePath = path.resolve(process.cwd(), scanPath);
      
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
        console.log(pc.yellow('No workflow files found.'));
        return;
      }

      console.log(pc.blue('Scanning ' + files.length + ' file(s)...'));

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
        } catch (error) {
          if (error instanceof ValidationError) {
            console.log(pc.red('x ' + path.relative(process.cwd(), file) + ': Validation error'));
            error.errors.forEach(e => {
              console.log(pc.gray('  ' + e.path + ': ' + e.message));
            });
          } else {
            console.log(pc.red('x ' + path.relative(process.cwd(), file) + ': ' + (error instanceof Error ? error.message : String(error))));
          }
          errorCount++;
        }
      }

      // Output results
      if (options.format === 'json') {
        console.log(JSON.stringify({
          findings: allFindings,
          summary: countFindingsBySeverity(allFindings),
          filesScanned: files.length,
          errors: errorCount,
        }, null, 2));
      } else {
        // Stylish format
        printStylishOutput(allFindings);
      }

      // Summary
      const summary = countFindingsBySeverity(allFindings);
      console.log('');
      console.log(pc.bold('Summary:'));
      console.log('  Files scanned: ' + files.length);
      console.log('  ' + pc.red('Errors (must): ' + summary.must));
      console.log('  ' + pc.yellow('Warnings (should): ' + summary.should));
      console.log('  ' + pc.blue('Notes (nit): ' + summary.nit));

      // Exit code
      if (options.failOnError && summary.must > 0) {
        process.exit(1);
      }
    } catch (error) {
      console.error(pc.red('Error:'), error instanceof Error ? error.message : String(error));
      process.exit(2);
    }
  });

function printStylishOutput(findings: Finding[]): void {
  if (findings.length === 0) {
    console.log(pc.green('No issues found!'));
    return;
  }

  // Group by file
  const byFile = new Map<string, Finding[]>();
  for (const finding of findings) {
    const existing = byFile.get(finding.path) || [];
    existing.push(finding);
    byFile.set(finding.path, existing);
  }

  for (const [file, fileFindings] of byFile) {
    console.log('');
    console.log(pc.underline(file));
    
    for (const finding of fileFindings) {
      const severityColor = finding.severity === 'must' 
        ? pc.red 
        : finding.severity === 'should' 
          ? pc.yellow 
          : pc.blue;
      
      const line = finding.line ? ':' + finding.line : '';
      console.log(
        '  ' + severityColor(finding.severity.padEnd(6)) + ' ' + pc.gray(finding.rule) + ' ' + finding.message + pc.gray(line)
      );
    }
  }
}
