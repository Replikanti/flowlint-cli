import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { program } from '../src/cli';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

describe('CLI Commands Unit Tests', () => {
    let tempDir: string;
    let originalCwd: string;
    let stdoutSpy: any;

    beforeEach(async () => {
        tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'flowlint-unit-test-'));
        originalCwd = process.cwd();
        process.chdir(tempDir);
        stdoutSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        vi.spyOn(process, 'exit').mockImplementation((code?: string | number | null | undefined): never => {
            throw new Error(`Process.exit(${code})`);
        });
    });

    afterEach(async () => {
        process.chdir(originalCwd);
        await fs.promises.rm(tempDir, { recursive: true, force: true });
        vi.restoreAllMocks();
    });

    it('should run init command', async () => {
        await program.parseAsync(['node', 'cli.js', 'init']);
        
        expect(fs.existsSync(path.join(tempDir, '.flowlint.yml'))).toBe(true);
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('Created .flowlint.yml'));
    });

    it('should run scan command on a valid file', async () => {
        const workflow = {
            nodes: [{ id: '1', name: 'Start', type: 'n8n-nodes-base.start', parameters: {} }],
            connections: {}
        };
        const workflowPath = path.join(tempDir, 'test.n8n.json');
        fs.writeFileSync(workflowPath, JSON.stringify(workflow));

        await program.parseAsync(['node', 'cli.js', 'scan', workflowPath]);
        
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('Scanning 1 file(s)'));
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('Summary:'));
    });

    it('should fail with process.exit(1) if --fail-on-error is used and errors found', async () => {
        // Invalid workflow (R12 error branch missing)
        const workflow = {
            nodes: [
                { id: '1', name: 'Start', type: 'n8n-nodes-base.start', parameters: {} },
                { id: '2', name: 'HTTP', type: 'n8n-nodes-base.httpRequest', parameters: {} }
            ],
            connections: {
                'Start': { 'main': [[{ node: 'HTTP', type: 'main', index: 0 }]] }
            }
        };
        const workflowPath = path.join(tempDir, 'fail.n8n.json');
        fs.writeFileSync(workflowPath, JSON.stringify(workflow));

        await expect(program.parseAsync(['node', 'cli.js', 'scan', workflowPath, '--fail-on-error']))
            .rejects.toThrow('Process.exit(1)');
    });

    it('should log message if no workflow files found', async () => {
        const emptyDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'flowlint-empty-'));
        await program.parseAsync(['node', 'cli.js', 'scan', emptyDir]);
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('No workflow files found'));
        await fs.promises.rm(emptyDir, { recursive: true, force: true });
    });

    it('should handle ValidationError during parsing', async () => {
        // Missing required 'nodes' field
        const workflowPath = path.join(tempDir, 'schema-fail.n8n.json');
        fs.writeFileSync(workflowPath, JSON.stringify({ connections: {} }));

        await program.parseAsync(['node', 'cli.js', 'scan', workflowPath]);
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('Validation error'));
    });

    it('should support different output formats', async () => {
        const workflow = {
            nodes: [{ id: '1', name: 'Start', type: 'n8n-nodes-base.start', parameters: {} }],
            connections: {}
        };
        const workflowPath = path.join(tempDir, 'test.n8n.json');
        fs.writeFileSync(workflowPath, JSON.stringify(workflow));

        // Test JSON format
        await program.parseAsync(['node', 'cli.js', 'scan', workflowPath, '--format', 'json']);
        const jsonCall = stdoutSpy.mock.calls.find((call: any[]) => call[0].startsWith('{'));
        expect(jsonCall).toBeDefined();
        expect(JSON.parse(jsonCall[0])).toHaveProperty('findings');

        // Test github-actions format
        stdoutSpy.mockClear();
        await program.parseAsync(['node', 'cli.js', 'scan', workflowPath, '--format', 'github-actions']);
        // If no issues, might be empty or just log "Scanning..."
        // Our Start node is valid, no rules should trigger if single node.
        // Wait, rule R5 requires > 1 node.
    });
});
