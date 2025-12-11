import type { Finding } from '@replikanti/flowlint-core';
import * as path from 'path';

export function formatJunit(findings: Finding[]): string {
  const byFile = findings.reduce((acc, finding) => {
    const file = finding.location?.file || 'unknown';
    if (!acc[file]) acc[file] = [];
    acc[file].push(finding);
    return acc;
  }, {} as Record<string, Finding[]>);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<testsuites>\n';

  for (const [file, fileFindings] of Object.entries(byFile)) {
    const filename = path.basename(file);
    const failures = fileFindings.length;

    xml += `  <testsuite name="${filename}" tests="${failures}" failures="${failures}" errors="0" skipped="0" timestamp="${new Date().toISOString()}" time="0" hostname="flowlint">\n`;

    for (const finding of fileFindings) {
      const line = finding.location?.range?.start?.line || 0;
      const rule = finding.ruleId || 'unknown-rule';
      const msg = finding.message || '';
      
      xml += `    <testcase classname="${file}" name="${rule}" time="0">\n`;
      xml += `      <failure message="${escapeXml(msg)}" type="${finding.severity}">Line ${line}: ${escapeXml(msg)}</failure>\n`;
      xml += `    </testcase>\n`;
    }

    xml += `  </testsuite>\n`;
  }

  xml += '</testsuites>';
  return xml;
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}