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

    it('should map all severity levels for GitHub Actions', () => {
        const findings: Finding[] = [
            { rule: 'r1', severity: 'must', message: 'Error', path: 'a.json', line: 1 },
            { rule: 'r2', severity: 'should', message: 'Warning', path: 'b.json', line: 2 },
            { rule: 'r3', severity: 'nit', message: 'Note', path: 'c.json', line: 3 },
            { rule: 'r4', severity: 'unknown' as any, message: 'Default', path: 'd.json', line: 4 }
        ];

        const output = formatGithubActions(findings);
        expect(output).toContain('::error file=a.json,line=1,::Error');
        expect(output).toContain('::warning file=b.json,line=2,::Warning');
        expect(output).toContain('::notice file=c.json,line=3,::Note');
        expect(output).toContain('::warning file=d.json,line=4,::Default');
    });

    it('should escape special characters for GitHub Actions', () => {
        const findings: Finding[] = [{
            rule: 'test',
            severity: 'must',
            message: 'Line with %percent\nNewline\rCarriage',
            path: 'test.json',
            line: 1
        }];

        const output = formatGithubActions(findings);
        expect(output).toContain('%25percent');
        expect(output).toContain('%0A');
        expect(output).toContain('%0D');
    });

    it('should map all severity levels for SARIF', () => {
        const findings: Finding[] = [
            { rule: 'r1', severity: 'must', message: 'Error', path: 'a.json', line: 1 },
            { rule: 'r2', severity: 'should', message: 'Warning', path: 'b.json', line: 2 },
            { rule: 'r3', severity: 'nit', message: 'Note', path: 'c.json', line: 3 },
            { rule: 'r4', severity: 'unknown' as any, message: 'Default', path: 'd.json', line: 4 }
        ];

        const output = formatSarif(findings);
        const parsed = JSON.parse(output);

        expect(parsed.runs[0].results[0].level).toBe('error');
        expect(parsed.runs[0].results[1].level).toBe('warning');
        expect(parsed.runs[0].results[2].level).toBe('note');
        expect(parsed.runs[0].results[3].level).toBe('warning');
    });

    it('should escape XML special characters in JUnit', () => {
        const findings: Finding[] = [
            { rule: 'test', severity: 'must', message: '<tag>&"\'special', path: 'test.json', line: 1 }
        ];

        const output = formatJunit(findings);
        expect(output).toContain('&lt;tag&gt;&amp;&quot;&apos;special');
    });

    it('should handle empty strings in JUnit XML escaping', () => {
        const findings: Finding[] = [
            { rule: 'test', severity: 'must', message: '', path: 'test.json', line: 1 }
        ];

        const output = formatJunit(findings);
        expect(output).toContain('testcase');
        expect(output).not.toContain('undefined');
    });

    it('should handle findings without path or line for GitHub Actions', () => {
        const findings: Finding[] = [
            { rule: 'test', severity: 'must', message: 'No path or line', path: undefined, line: undefined } as any
        ];

        const output = formatGithubActions(findings);
        expect(output).toContain('::error');
        expect(output).toContain('No path or line');
    });

    it('should handle findings without path or line for SARIF', () => {
        const findings: Finding[] = [
            { rule: 'test', severity: 'must', message: 'Test', path: undefined, line: undefined } as any
        ];

        const output = formatSarif(findings);
        const parsed = JSON.parse(output);
        expect(parsed.runs[0].results[0].locations[0].physicalLocation.artifactLocation.uri).toBe('unknown');
        expect(parsed.runs[0].results[0].locations[0].physicalLocation.region.startLine).toBe(1);
    });

    it('should handle all characters in XML escaping function', () => {
        const findings: Finding[] = [
            { rule: 'test', severity: 'must', message: 'Test with < > & \' " all chars', path: 'test.json', line: 1 }
        ];

        const output = formatJunit(findings);
        expect(output).toContain('&lt;');
        expect(output).toContain('&gt;');
        expect(output).toContain('&amp;');
        expect(output).toContain('&apos;');
        expect(output).toContain('&quot;');
    });
});
