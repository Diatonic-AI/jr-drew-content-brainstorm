import fs from 'fs';
const inputPath = 'reports/eslint.json';
const outputPath = 'reports/eslint-tightening.md';

const exists = fs.existsSync(inputPath);
if (!exists) {
  const note = `# ESLint Tightening Report\n\nNo ESLint JSON report found at ${inputPath}. Run \`pnpm run lint:report\` first.`;
  fs.writeFileSync(outputPath, note);
  console.log(`Wrote ${outputPath} (no lint data).`);
  process.exit(0);
}

const payload = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const summary = new Map();
let totalFiles = 0;
let totalErrors = 0;
let totalWarnings = 0;

for (const file of payload) {
  totalFiles += 1;
  for (const message of file.messages || []) {
    const { ruleId, severity, message: text, line } = message;
    if (!ruleId) continue;
    const key = ruleId;
    const record = summary.get(key) || { errors: 0, warnings: 0, examples: [] };
    if (severity === 2) {
      record.errors += 1;
      totalErrors += 1;
    } else {
      record.warnings += 1;
      totalWarnings += 1;
    }
    if (record.examples.length < 5) {
      record.examples.push({ file: file.filePath, line, text, severity });
    }
    summary.set(key, record);
  }
}

const sorted = [...summary.entries()].sort((a, b) => {
  const scoreA = a[1].errors * 5 + a[1].warnings;
  const scoreB = b[1].errors * 5 + b[1].warnings;
  return scoreB - scoreA;
});

let markdown = '';
markdown += '# ESLint Tightening Report\n\n';
markdown += `Generated: ${new Date().toISOString()}\n\n`;
markdown += `- Files analyzed: ${totalFiles}\n`;
markdown += `- Total errors: ${totalErrors}\n`;
markdown += `- Total warnings: ${totalWarnings}\n`;
markdown += '\n## Top Rule Violations\n';

if (!sorted.length) {
  markdown += '\nNo lint violations detected using the baseline configuration. Consider applying the strict config (pnpm run lint:strict).\n';
} else {
  for (const [ruleId, data] of sorted) {
    markdown += `\n### ${ruleId}\n`;
    markdown += `- Impact score: ${data.errors * 5 + data.warnings} (errors: ${data.errors}, warnings: ${data.warnings})\n`;
    markdown += '  - Examples:\n';
    for (const example of data.examples) {
      const label = example.severity === 2 ? 'error' : 'warn';
      markdown += `    - (${label}) ${example.file}:${example.line} — ${example.text}\n`;
    }
  }
}

fs.writeFileSync(outputPath, markdown);
console.log(`Wrote ${outputPath}`);
