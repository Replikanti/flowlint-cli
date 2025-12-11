import { describe, it, expect } from 'vitest';
import { formatJson } from '../src/reporters/json';
import { formatJunit } from '../src/reporters/junit';

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

    it('should format JSON correctly', () => {
        const output = formatJson(mockFindings);
        const parsed = JSON.parse(output);
        expect(parsed).toHaveLength(1);
        expect(parsed[0].ruleId).toBe('test-rule');
    });

    it('should format JUnit correctly', () => {
        const output = formatJunit(mockFindings);
        expect(output).toContain('<?xml version="1.0" encoding="UTF-8"?>');
        expect(output).toContain('testcase');
    });
});