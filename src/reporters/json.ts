import { Finding, countFindingsBySeverity } from '@replikanti/flowlint-core';

export function formatJson(findings: Finding[], stats: { files: number, errors: number }): string {
  return JSON.stringify({
    findings: findings,
    summary: countFindingsBySeverity(findings),
    filesScanned: stats.files,
    errors: stats.errors,
  }, null, 2);
}
