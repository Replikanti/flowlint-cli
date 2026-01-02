import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { runCli } from './helpers/run-cli';

describe('Single File Scanning', () => {
    const fixturesDir = path.resolve(__dirname, 'fixtures');

    it('should scan directory by default (regression)', async () => {
        // Run scan on 'clean' directory without arguments (implicit '.')
        // We pass cwd as the directory to scan
        const targetDir = path.join(fixturesDir, 'clean');
        const result = await runCli(['scan'], targetDir);

        expect(result.exitCode).toBe(0);
        expect(result.stdout).toContain('Files scanned:');
    });

    it('should scan a single valid file', async () => {
        const file = path.join(fixturesDir, 'clean', 'valid.json');
        const result = await runCli(['scan', file]);

        expect(result.exitCode).toBe(0);
        expect(result.stdout).toContain('Scanning 1 file(s)');
    });

    it('should fail when file does not exist', async () => {
        const file = path.join(fixturesDir, 'non-existent.json');
        const result = await runCli(['scan', file]);

        expect(result.exitCode).toBe(1);
        // Error is printed to stderr or stdout depending on implementation?
        // In scan.ts: console.error(pc.red(...)) -> stderr?
        // runCli captures stdout and stderr.
        // Usually console.error goes to stderr.
        expect(result.stderr).toContain('Path not found');
    });

    it('should warn when file does not match patterns', async () => {
        // README.md is in flowlint-cli root
        const file = path.resolve(__dirname, '../README.md');
        const result = await runCli(['scan', file]);

        expect(result.stdout).toContain('Warning: File');
        expect(result.stdout).toContain('does not match configured patterns');
    });

    it('should exit with code 1 for single file with errors when --fail-on-error is used', async () => {
        const file = path.join(fixturesDir, 'dirty', 'invalid.json');
        const result = await runCli(['scan', file, '--fail-on-error']);

        expect(result.exitCode).toBe(1);
        expect(result.stdout).toContain('Errors (must):');
    });

    it('should scan single file with junit format', async () => {
        const file = path.join(fixturesDir, 'dirty', 'invalid.json');
        const result = await runCli(['scan', file, '--format', 'junit']);

        expect(result.stdout).toContain('<?xml');
        expect(result.stdout).toContain('testsuites');
    });

    it('should scan single file with sarif format', async () => {
        const file = path.join(fixturesDir, 'dirty', 'invalid.json');
        const result = await runCli(['scan', file, '--format', 'sarif']);

        expect(result.stdout).toContain('"version"');
        expect(result.stdout).toContain('2.1.0');
    });
});
