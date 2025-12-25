import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { runCli } from './helpers/run-cli';

describe('CLI Error Handling', () => {
    let tempDir: string;

    beforeEach(async () => {
        tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'flowlint-cli-errors-'));
    });

    afterEach(async () => {
        await fs.promises.rm(tempDir, { recursive: true, force: true });
    });

    it('should show error for non-existent scan path', async () => {
        const result = await runCli(['scan', 'definitely-not-there'], tempDir);
        expect(result.exitCode).toBe(1);
        expect(result.stderr).toContain('Path not found');
    });

    it('should handle invalid workflow file gracefully', async () => {
        const filePath = path.join(tempDir, 'broken.n8n.json');
        fs.writeFileSync(filePath, '{ "broken": ');

        const result = await runCli(['scan', filePath], tempDir);
        expect(result.exitCode).toBe(0); // Scanning continues, findings reported
        
        // Strip ANSI colors for reliable matching
        const cleanStdout = result.stdout.replaceAll(/\x1b\[[0-9;]*m/g, '');
        
        expect(cleanStdout).toMatch(/Validation error|broken\.n8n\.json/);
        expect(cleanStdout).toContain('Errors (must): 1');
    });

    it('should exit with 1 if --fail-on-error is used and validation fails', async () => {
        const filePath = path.join(tempDir, 'broken.n8n.json');
        fs.writeFileSync(filePath, '{ "broken": ');

        const result = await runCli(['scan', filePath, '--fail-on-error'], tempDir);
        expect(result.exitCode).toBe(1);
    });
});
