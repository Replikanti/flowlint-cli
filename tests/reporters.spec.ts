import { describe, it, expect } from 'vitest';
import { formatJson } from '../src/reporters/json';
import { formatJunit } from '../src/reporters/junit';
import type { Finding } from '@replikanti/flowlint-core';

describe('CLI Reporters', () => {
    const mockFindings: any[] = [
        {
            ruleId: 'test-rule',
            severity: 'error',
            message: 'Test error',
            location: {
                file: 'workflow.json',
                path: 'nodes/0',
                range: { start: { line: 1, character: 1 }, end: { line: 1, character: 10 } }
            }
        }
    ];

    const mockStats = { files: 1, errors: 1 };

    it('should format JSON correctly', () => {
        // Pass missing stats argument
        const output = formatJson(mockFindings, mockStats);
        const parsed = JSON.parse(output);
        
        expect(parsed).toHaveProperty('findings');
        expect(parsed.findings).toHaveLength(1);
        expect(parsed.findings[0].ruleId).toBe('test-rule');
        expect(parsed.filesScanned).toBe(1);
    });

    it('should format JUnit correctly', () => {
        const output = formatJunit(mockFindings);
        expect(output).toContain('<?xml version="1.0" encoding="UTF-8"?>');
        expect(output).toContain('testcase');
        expect(output).toContain('name="test-rule"');
        expect(output).toContain('workflow.json');
    });
});