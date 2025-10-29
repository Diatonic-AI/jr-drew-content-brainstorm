import fs from 'fs';
import fg from 'fast-glob';

const outputPath = 'reports/frontend-inventory.md';
const files = await fg(['apps/web/src/**/*.{ts,tsx}'], { dot: false });

const lines = ['# Frontend Data Inventory', '', `Generated: ${new Date().toISOString()}`, ''];

for (const file of files.sort()) {
  const source = fs.readFileSync(file, 'utf8');
  const usesFirebase = /from\s+['"]firebase\/.+['"]/g.test(source);
  const usesFirestore = /(collection|doc|getFirestore)\(/g.test(source);
  const usesReactQuery = /useQuery|useMutation/.test(source);
  const usesHttp = /(fetch\()|(axios\.)|(api\.)/.test(source);
  if (!usesFirebase && !usesHttp) continue;

  const collections = [...source.matchAll(/collection\(\s*[^,]+,\s*['"`]([^'"`]+)['"`]\s*\)/g)].map((match) => match[1]);
  const docPaths = [...source.matchAll(/doc\(\s*[^,]+,\s*['"`]([^'"`]+)['"`]\s*(?:,\s*['"`]([^'"`]+)['"`])?/g)].map((match) => match.slice(1).filter(Boolean).join('/'));

  lines.push(`- ${file}`);
  const tags = [];
  if (usesFirebase) tags.push('firebase');
  if (usesFirestore) tags.push('firestore');
  if (usesReactQuery) tags.push('react-query');
  if (usesHttp) tags.push('http');
  if (tags.length) lines.push(`  - Tags: ${tags.join(', ')}`);
  if (collections.length) lines.push(`  - Collections: ${[...new Set(collections)].join(', ')}`);
  if (docPaths.length) lines.push(`  - Doc refs: ${[...new Set(docPaths)].join(', ')}`);
}

if (lines.length === 4) {
  lines.push('No Firebase or HTTP integrations detected in `apps/web/src`.');
}

fs.mkdirSync('reports', { recursive: true });
fs.writeFileSync(outputPath, lines.join('\n'));
console.log(`Wrote ${outputPath}`);
