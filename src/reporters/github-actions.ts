import type { Finding } from '@replikanti/flowlint-core';

export function formatGithubActions(findings: Finding[]): string {
  return findings.map(f => {
    const level = mapSeverityToGithub(f.severity);
    const file = f.path ? `file=${f.path},` : '';
    const line = f.line ? `line=${f.line},` : '';
    // Escape message for GitHub Actions
    // data.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A')
    const message = f.message.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
    
    return `::${level} ${file}${line}::${message}`;
  }).join('\n');
}

function mapSeverityToGithub(severity: string): string {
  switch (severity) {
    case 'must': return 'error';
    case 'should': return 'warning';
    case 'nit': return 'notice';
    default: return 'warning';
  }
}
