import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { runCli } from './helpers/run-cli';

describe('CLI Init Command', () => {
    let tempDir: string;

    beforeEach(async () => {
        // Create a unique temp directory for each test
        tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'flowlint-cli-test-'));
    });

    afterEach(async () => {
        // Cleanup temp directory
        await fs.promises.rm(tempDir, { recursive: true, force: true });
    });

    it('should create .flowlint.yml if it does not exist', async () => {
        const result = await runCli(['init'], tempDir);
        
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toContain('Created .flowlint.yml');
        
        const configPath = path.join(tempDir, '.flowlint.yml');
        expect(fs.existsSync(configPath)).toBe(true);
        
        const content = fs.readFileSync(configPath, 'utf-8');
        expect(content).toContain('files:');
        expect(content).toContain('rules:');
    });

    it('should not overwrite existing config without --force', async () => {
        // Create dummy config
        const configPath = path.join(tempDir, '.flowlint.yml');
        fs.writeFileSync(configPath, 'dummy: true');

        const result = await runCli(['init'], tempDir);
        
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toContain('already exists');
        expect(result.stdout).toContain('Use --force to overwrite');
        
        const content = fs.readFileSync(configPath, 'utf-8');
        expect(content).toBe('dummy: true');
    });

    it('should overwrite existing config with --force', async () => {
        // Create dummy config
        const configPath = path.join(tempDir, '.flowlint.yml');
        fs.writeFileSync(configPath, 'dummy: true');

        const result = await runCli(['init', '--force'], tempDir);

        expect(result.exitCode).toBe(0);
        expect(result.stdout).toContain('Created .flowlint.yml');

        const content = fs.readFileSync(configPath, 'utf-8');
        expect(content).not.toBe('dummy: true');
        expect(content).toContain('files:');
    });

    it('should create config when using --force flag even if file does not exist', async () => {
        const result = await runCli(['init', '--force'], tempDir);

        expect(result.exitCode).toBe(0);
        expect(result.stdout).toContain('Created .flowlint.yml');

        const configPath = path.join(tempDir, '.flowlint.yml');
        expect(fs.existsSync(configPath)).toBe(true);
    });
});
