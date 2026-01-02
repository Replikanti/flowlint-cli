import { describe, it, expect } from 'vitest';
import { runCli } from './helpers/run-cli';

describe('CLI Entry Point', () => {
    it('should show help when run without arguments', async () => {
        const result = await runCli([]);

        // CLI shows help and outputs the available commands
        // Help output might be in stderr or stdout depending on commander behavior
        const output = result.stdout + result.stderr;
        expect(output).toContain('flowlint');
        expect(output).toContain('scan');
        expect(output).toContain('init');
    });

    it('should show version information', async () => {
        const result = await runCli(['--version']);

        expect(result.exitCode).toBe(0);
        expect(result.stdout).toMatch(/\d+\.\d+\.\d+/);
    });
});
