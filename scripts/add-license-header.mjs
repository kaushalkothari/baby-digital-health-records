import fs from 'node:fs/promises';
import path from 'node:path';

const HEADER = `/**\n * BabyBloomCare\n * Copyright (c) 2026 Kaushal Kothari. All rights reserved.\n * Unauthorized copying, modification or distribution\n * of this software is strictly prohibited.\n */\n\n`;

const HEADER_MARKER = 'BabyBloomCare';

const exts = new Set(['.ts', '.tsx']);
const roots = [
  path.resolve('src'),
  path.resolve('vite.config.ts'),
  path.resolve('vitest.config.ts'),
];

async function isDirectory(p) {
  try {
    return (await fs.stat(p)).isDirectory();
  } catch {
    return false;
  }
}

async function exists(p) {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === 'dist' || e.name === '.git') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

function shouldTouch(filePath) {
  const ext = path.extname(filePath);
  if (!exts.has(ext)) return false;
  const base = path.basename(filePath);
  if (base.endsWith('.generated.ts')) return false;
  return true;
}

function addHeaderIfMissing(content) {
  if (content.includes(HEADER_MARKER)) return content;
  return HEADER + content;
}

async function processFile(filePath) {
  const before = await fs.readFile(filePath, 'utf8');
  const after = addHeaderIfMissing(before);
  if (after !== before) {
    await fs.writeFile(filePath, after, 'utf8');
    return true;
  }
  return false;
}

async function main() {
  let changed = 0;

  for (const root of roots) {
    if (!(await exists(root))) continue;
    if (await isDirectory(root)) {
      const files = await walk(root);
      for (const f of files) {
        if (!shouldTouch(f)) continue;
        if (await processFile(f)) changed += 1;
      }
    } else {
      if (shouldTouch(root)) {
        if (await processFile(root)) changed += 1;
      }
    }
  }

  // eslint-disable-next-line no-console
  console.log(`License header applied. Files changed: ${changed}`);
}

await main();

