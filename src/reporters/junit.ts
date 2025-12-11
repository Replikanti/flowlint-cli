import type { Finding } from '@replikanti/flowlint-core';
import * as path from 'path';

export function formatJunit(findings: Finding[]): string {
  const byFile = findings.reduce((acc, finding) => {
    const file = finding.path || 'unknown';
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
      xml += `    <testcase classname="${file}" name="${finding.rule}" time="0">\n`;
      xml += `      <failure message="${escapeXml(finding.message)}" type="${finding.severity}">Line ${finding.line || 0}: ${escapeXml(finding.raw_details || '')}</failure>\n`;
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
