import type { Finding } from '@replikanti/flowlint-core';

export function formatSarif(findings: Finding[]): string {
  const rules = new Set(findings.map(f => f.rule));
  const rulesList = Array.from(rules).map(ruleId => ({
    id: ruleId,
    shortDescription: { text: ruleId },
    helpUri: `https://flowlint.dev/rules/${ruleId}`
  }));

  const results = findings.map(f => ({
    ruleId: f.rule,
    level: mapSeverityToSarif(f.severity),
    message: { text: f.message },
    locations: [{
      physicalLocation: {
        artifactLocation: { uri: f.path || 'unknown' },
        region: {
          startLine: f.line || 1,
          startColumn: 1
        }
      }
    }]
  }));

  const report = {
    version: "2.1.0",
    $schema: "http://json.schemastore.org/sarif-2.1.0-rtm.4",
    runs: [{
      tool: {
        driver: {
          name: "FlowLint",
          informationUri: "https://flowlint.dev",
          rules: rulesList
        }
      },
      results
    }]
  };

  return JSON.stringify(report, null, 2);
}

function mapSeverityToSarif(severity: string): string {
  switch (severity) {
    case 'must': return 'error';
    case 'should': return 'warning';
    case 'nit': return 'note';
    default: return 'warning';
  }
}
