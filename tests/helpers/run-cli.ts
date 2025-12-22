import { exec } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

// Path to the CLI entry point
const CLI_PATH = path.resolve(__dirname, '../../src/cli.ts');

export interface CliResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

/**
 * Runs the FlowLint CLI against arguments.
 * Uses 'tsx' to run the source directly.
 */
export async function runCli(args: string[], cwd?: string): Promise<CliResult> {
  const command = `npx tsx ${CLI_PATH} ${args.join(' ')}`;
  
  try {
    const { stdout, stderr } = await execAsync(command, { 
      cwd: cwd || path.resolve(__dirname, '../../'),
      env: { ...process.env, CI: 'true' } // Force CI mode if applicable
    });
    
    return { stdout, stderr, exitCode: 0 };
  } catch (error: any) {
    // exec throws an error if exit code is not 0
    return {
      stdout: error.stdout || '',
      stderr: error.stderr || '',
      exitCode: error.code || 1,
    };
  }
}
