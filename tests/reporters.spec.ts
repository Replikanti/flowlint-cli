import { describe, it, expect } from 'vitest';
import { formatJson } from '../src/reporters/json';
import { formatJunit } from '../src/reporters/junit';
import { formatSarif } from '../src/reporters/sarif';
import { formatGithubActions } from '../src/reporters/github-actions';
import type { Finding } from '@replikanti/flowlint-core';

describe('CLI Reporters', () => {
    const mockFindings: Finding[] = [
        {
            rule: 'test-rule',
            severity: 'must',
            message: 'Test error',
            path: 'workflow.json',
            line: 1
        }
    ];

    const mockStats = { files: 1, errors: 1 };

    it('should format JSON correctly', () => {
        const output = formatJson(mockFindings, mockStats);
        const parsed = JSON.parse(output);
        
        expect(parsed).toHaveProperty('findings');
        expect(parsed.findings).toHaveLength(1);
        expect(parsed.findings[0].rule).toBe('test-rule');
        expect(parsed.errors).toBe(1);
    });

    it('should format JUnit correctly', () => {
        const output = formatJunit(mockFindings);
        expect(output).toContain('<?xml version="1.0" encoding="UTF-8"?>');
        expect(output).toContain('testcase');
        expect(output).toContain('name="test-rule"');
        expect(output).toContain('workflow.json');
    });

    it('should format SARIF correctly', () => {
        const output = formatSarif(mockFindings);
        const parsed = JSON.parse(output);

        expect(parsed.version).toBe('2.1.0');
        expect(parsed.runs[0].results).toHaveLength(1);
        expect(parsed.runs[0].results[0].ruleId).toBe('test-rule');
        expect(parsed.runs[0].results[0].level).toBe('error');
        expect(parsed.runs[0].results[0].locations[0].physicalLocation.artifactLocation.uri).toBe('workflow.json');
    });

    it('should format GitHub Actions correctly', () => {
        const output = formatGithubActions(mockFindings);
        expect(output).toContain('::error file=workflow.json,line=1,::Test error');
    });
});
