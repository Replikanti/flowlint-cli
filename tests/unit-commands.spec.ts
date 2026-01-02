import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { program } from '../src/cli';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

describe('CLI Commands Unit Tests', () => {
    let tempDir: string;
    let originalCwd: string;
    let stdoutSpy: any;

    // Helper to create a simple workflow file
    const createWorkflow = (nodes: any[], connections: any = {}) => {
        const workflow = { nodes, connections };
        const workflowPath = path.join(tempDir, 'test.n8n.json');
        fs.writeFileSync(workflowPath, JSON.stringify(workflow));
        return workflowPath;
    };

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
        const workflowPath = createWorkflow([
            { id: '1', name: 'Start', type: 'n8n-nodes-base.start', parameters: {} }
        ]);

        await program.parseAsync(['node', 'cli.js', 'scan', workflowPath]);

        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('Scanning 1 file(s)'));
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('Summary:'));
    });

    it('should fail with process.exit(1) if --fail-on-error is used and errors found', async () => {
        // Invalid workflow (R12 error branch missing)
        const workflowPath = createWorkflow([
            { id: '1', name: 'Start', type: 'n8n-nodes-base.start', parameters: {} },
            { id: '2', name: 'HTTP', type: 'n8n-nodes-base.httpRequest', parameters: {} }
        ], {
            'Start': { 'main': [[{ node: 'HTTP', type: 'main', index: 0 }]] }
        });

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
        const workflowPath = createWorkflow([
            { id: '1', name: 'Start', type: 'n8n-nodes-base.start', parameters: {} }
        ]);

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

    it('should show warning when scanning file not matching configured patterns', async () => {
        const workflow = { nodes: [{ id: '1', name: 'Start', type: 'n8n-nodes-base.start', parameters: {} }], connections: {} };
        const workflowPath = path.join(tempDir, 'not-matching.txt');
        fs.writeFileSync(workflowPath, JSON.stringify(workflow));

        await program.parseAsync(['node', 'cli.js', 'scan', workflowPath]);
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('does not match configured patterns'));
    });

    it('should support junit output format', async () => {
        const workflowPath = createWorkflow([
            { id: '1', name: 'Start', type: 'n8n-nodes-base.start', parameters: {} }
        ]);

        await program.parseAsync(['node', 'cli.js', 'scan', workflowPath, '--format', 'junit']);
        const junitCall = stdoutSpy.mock.calls.find((call: any[]) => call[0].includes('<?xml'));
        expect(junitCall).toBeDefined();
        expect(junitCall[0]).toContain('testsuites');
    });

    it('should support sarif output format', async () => {
        const workflowPath = createWorkflow([
            { id: '1', name: 'Start', type: 'n8n-nodes-base.start', parameters: {} }
        ]);

        await program.parseAsync(['node', 'cli.js', 'scan', workflowPath, '--format', 'sarif']);
        const sarifCall = stdoutSpy.mock.calls.find((call: any[]) => call[0].includes('"version"'));
        expect(sarifCall).toBeDefined();
        const parsed = JSON.parse(sarifCall[0]);
        expect(parsed.version).toBe('2.1.0');
    });

    it('should support github-actions output format', async () => {
        const workflowPath = createWorkflow([
            { id: '1', name: 'Start', type: 'n8n-nodes-base.start', parameters: {} },
            { id: '2', name: 'HTTP', type: 'n8n-nodes-base.httpRequest', parameters: {} }
        ], {
            'Start': { 'main': [[{ node: 'HTTP', type: 'main', index: 0 }]] }
        });

        await program.parseAsync(['node', 'cli.js', 'scan', workflowPath, '--format', 'github-actions']);
        const output = stdoutSpy.mock.calls.map((call: any[]) => call[0]).join('\n');
        // Should output github actions format (::error or ::warning)
        expect(output).toMatch(/::(?:error|warning|notice)/);
    });

    it('should handle generic errors (non-ValidationError) in stylish mode', async () => {
        // Create a file that will cause a parsing error (invalid JSON)
        const workflowPath = path.join(tempDir, 'invalid.n8n.json');
        fs.writeFileSync(workflowPath, 'not valid json at all');

        await program.parseAsync(['node', 'cli.js', 'scan', workflowPath]);
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringMatching(/invalid\.n8n\.json/));
    });
});
