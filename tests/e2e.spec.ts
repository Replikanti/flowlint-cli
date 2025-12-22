import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { runCli } from './helpers/run-cli';

describe('CLI E2E Tests', () => {
    const fixturesDir = path.resolve(__dirname, 'fixtures');

    it('should exit with code 0 for a valid workflow directory', async () => {
        const validDir = path.join(fixturesDir, 'clean');
        const result = await runCli(['scan', validDir]);

        expect(result.exitCode).toBe(0);
        // Expect summary to show 0 errors
        expect(result.stdout).toContain('Errors (must): \u001b[31m0\u001b[39m');
    });

    it('should exit with code 1 for a workflow with violations when --fail-on-error is used', async () => {
        const invalidDir = path.join(fixturesDir, 'dirty');
        // We must pass --fail-on-error to ensure exit code 1 on findings
        const result = await runCli(['scan', invalidDir, '--fail-on-error']);

        expect(result.exitCode).toBe(1);
        expect(result.stdout).toContain('Errors (must):');
        // R2 or R12 should trigger 'must' severity for basic unsafe http request or similar
    }, 10000);
});