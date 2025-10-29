import fs from 'fs';
import path from 'path';

const firebaseRoot = path.join('infra', 'firebase');
const outputPath = path.join('reports', 'firebase-audit.md');

const resolvePath = (...segments) => path.join(firebaseRoot, ...segments);
const readJson = (relativePath) => {
  const filePath = resolvePath(relativePath);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return { __error: `Failed to parse ${relativePath}: ${error.message}` };
  }
};

const fileExists = (relativePath) => fs.existsSync(resolvePath(relativePath));
const rootFileExists = (relativePath) => fs.existsSync(relativePath);

const firebaseJson = readJson('firebase.json');
const functionsPkg = readJson(path.join('functions', 'package.json'));
const firestoreRulesExists = fileExists('firestore.rules');
const firestoreIndexesExists = fileExists('firestore.indexes.json');
const storageRulesExists = fileExists('storage.rules');
const realtimeRulesExists = fileExists('database.rules.json');
const functionsDirExists = fileExists('functions');
const functionsSrcExists = fileExists(path.join('functions', 'src', 'index.ts')) || fileExists(path.join('functions', 'src', 'index.js'));
const functionsTsConfigExists = fileExists(path.join('functions', 'tsconfig.json'));
const functionsLintScript = functionsPkg?.scripts?.lint;

const readText = (relativePath) => {
  const filePath = resolvePath(relativePath);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
};

const functionSource = readText(path.join('functions', 'src', 'index.ts')) || readText(path.join('functions', 'src', 'index.js')) || '';
const exportedFunctions = Array.from(functionSource.matchAll(/export\s+const\s+(\w+)/g)).map((m) => m[1]);

const md = [];
md.push('# Firebase Backend Audit');
md.push('');
md.push(`Generated: ${new Date().toISOString()}`);
md.push('');

const firebasercPaths = ['.firebaserc', path.join('infra', 'firebase', '.firebaserc')];
const foundFirebaserc = firebasercPaths.find((rel) => rootFileExists(rel));
let firebasercProjects = null;
md.push('## Project Aliases (.firebaserc)');
if (foundFirebaserc) {
  try {
    const content = JSON.parse(fs.readFileSync(foundFirebaserc, 'utf8'));
    firebasercProjects = content.projects || null;
    const projects = firebasercProjects ? Object.entries(firebasercProjects).map(([alias, id]) => `${alias}: ${id}`) : [];
    md.push(`- Found at \`${foundFirebaserc}\``);
    if (projects.length) {
      md.push(`- Aliases: ${projects.join(', ')}`);
    } else {
      md.push('- ⚠️ No project alias map defined. Add dev/staging/prod aliases to avoid deploying to the wrong project.');
    }
  } catch (error) {
    md.push(`- ⚠️ Unable to parse \`${foundFirebaserc}\`: ${error.message}`);
  }
} else {
  md.push('- ❌ No `.firebaserc` found. Create one with `firebase use --add` for dev/staging/prod.');
}
md.push('');

md.push('## Hosting');
if (firebaseJson?.hosting) {
  const { public: publicDir, rewrites = [], headers = [] } = firebaseJson.hosting;
  md.push(`- Public directory: ${publicDir || '(missing)'}`);
  if (publicDir && !fs.existsSync(path.resolve(firebaseRoot, publicDir))) {
    md.push(`  - ⚠️ Directory ${publicDir} is not present relative to ${firebaseRoot}`);
  }
  const hasSpaRewrite = rewrites.some((r) => r.destination === '/index.html');
  md.push(`- SPA rewrite to /index.html: ${hasSpaRewrite ? '✅' : '⚠️ Missing'}`);
  md.push(`- Headers entries: ${headers.length}`);
} else {
  md.push('- ❌ `hosting` block missing from firebase.json.');
}
md.push('');

md.push('## Emulators');
if (firebaseJson?.emulators) {
  const keys = Object.keys(firebaseJson.emulators).sort();
  md.push(`- Configured: ${keys.join(', ')}`);
  for (const [svc, cfg] of Object.entries(firebaseJson.emulators)) {
    const port = cfg.port ? `:${cfg.port}` : '';
    const extra = cfg.enabled ? ' (ui enabled)' : '';
    md.push(`  - ${svc}${port}${extra}`);
  }
} else {
  md.push('- ⚠️ No emulator config detected. Add auth, firestore, functions, hosting, storage, ui.');
}
md.push('');

md.push('## Functions');
if (functionsDirExists) {
  md.push('- `infra/firebase/functions` exists.');
  if (functionsPkg?.dependencies) {
    const deps = Object.keys(functionsPkg.dependencies).join(', ') || '(none)';
    md.push(`  - Dependencies: ${deps}`);
  }
  if (!functionsTsConfigExists) {
    md.push('  - ❌ Missing `tsconfig.json` (required for type-safe builds).');
  }
  if (!functionsSrcExists) {
    md.push('  - ❌ No `src/index.ts` found. Seed a handler entry point.');
  } else {
    md.push(`  - Exported functions (${exportedFunctions.length}): ${exportedFunctions.join(', ') || '(none)'}`);
  }
  const runtime = firebaseJson?.functions?.runtime || firebaseJson?.functions?.runtimeName;
  md.push(`  - Runtime: ${runtime || '⚠️ Not pinned (defaults to CLI version)'}`);
  if (!functionsPkg?.engines?.node) {
    md.push('  - ⚠️ functions/package.json missing `engines.node`. Set to "20".');
  }
  if (!functionsLintScript) {
    md.push('  - ⚠️ Add `pnpm lint` (or npm) script for Cloud Functions linting.');
  }
} else {
  md.push('- ❌ `infra/firebase/functions` directory not found.');
}
md.push('');

md.push('## Security Rules');
if (firestoreRulesExists) {
  md.push('- ✅ `firestore.rules` present.');
} else {
  md.push('- ❌ `firestore.rules` missing.');
}
if (storageRulesExists) {
  md.push('- ✅ `storage.rules` present.');
} else {
  md.push('- ❌ `storage.rules` missing.');
}
if (realtimeRulesExists) {
  md.push('- ✅ `database.rules.json` present.');
} else {
  md.push('- ℹ️ No Realtime Database rules file (only needed if Realtime DB is used).');
}
md.push('');

md.push('## Firestore Indexes');
if (firestoreIndexesExists) {
  const indexes = readJson('firestore.indexes.json');
  const count = indexes?.indexes?.length || 0;
  md.push(`- Index definitions: ${count}`);
  if (!count) {
    md.push('  - ⚠️ No composite indexes defined. Capture query requirements once the data model is finalized.');
  }
} else {
  md.push('- ❌ `firestore.indexes.json` missing.');
}
md.push('');

md.push('## Action Items');
const actions = [];
if (!foundFirebaserc) {
  actions.push({ level: 'High', text: 'Create `.firebaserc` with dev/staging/prod aliases to prevent accidental prod deploys.' });
} else if (firebasercProjects && Object.keys(firebasercProjects).length < 3) {
  actions.push({ level: 'Medium', text: 'Add staging/prod project aliases in `.firebaserc` for safer multi-env deploys.' });
}
if (!functionsTsConfigExists) {
  actions.push({ level: 'High', text: 'Add `infra/firebase/functions/tsconfig.json` and enable strict compilation (outDir `lib`).' });
}
if (!functionsLintScript) {
  actions.push({ level: 'Medium', text: 'Add a lint script in `infra/firebase/functions/package.json` tied into CI.' });
}
if (exportedFunctions.length === 0) {
  actions.push({ level: 'Medium', text: 'Seed at least one health check function (e.g., `health` endpoint) to validate deployment pipeline.' });
}
if (!firebaseJson?.emulators) {
  actions.push({ level: 'Medium', text: 'Configure Emulator Suite (auth, firestore, functions, storage, ui) to support local integration tests.' });
}
if (firebaseJson?.hosting && firebaseJson.hosting.public && !fs.existsSync(path.resolve(firebaseRoot, firebaseJson.hosting.public))) {
  actions.push({ level: 'Medium', text: `Create/build the hosting output directory ${firebaseJson.hosting.public} or fix the path.` });
}
if (!firestoreIndexesExists || (readJson('firestore.indexes.json')?.indexes || []).length === 0) {
  actions.push({ level: 'Low', text: 'Document required Firestore composite indexes based on planned queries.' });
}
if (storageRulesExists) {
  const storageRules = readText('storage.rules') || '';
  const storageReadAny = /allow\s+read:\s+if\s+request\.auth\s*!=\s*null;/.test(storageRules);
  const storageWriteAny = /allow\s+write:\s+if\s+request\.auth\s*!=\s*null;/.test(storageRules);
  const storageReadWriteAny = /allow\s+read,\s*write:\s*if\s*request\.auth\s*!=\s*null;/.test(storageRules);
  if ((storageReadAny && storageWriteAny) || storageReadWriteAny) {
    actions.push({ level: 'Medium', text: 'Tighten Storage rules – limit write access to scoped paths/roles instead of any authenticated user.' });
  }
}
if (firestoreRulesExists) {
  const firestoreRules = readText('firestore.rules') || '';
  if (!/allow\s+write:/.test(firestoreRules) || /allow\s+read:\s+if\s+true/.test(firestoreRules)) {
    actions.push({ level: 'Medium', text: 'Review Firestore rules for least-privilege (ensure read/write are role scoped and add tests).' });
  }
  actions.push({ level: 'Low', text: 'Add emulator-based unit tests for Firestore/Storage rules to prevent regressions.' });
}

if (actions.length) {
  for (const { level, text } of actions) {
    md.push(`- ${level}: ${text}`);
  }
} else {
  md.push('- ✅ No immediate blocking issues detected.');
}
md.push('');

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, md.join('\n'));
console.log(`Wrote ${outputPath}`);
