#!/usr/bin/env node
/**
 * Deploy the built site to the gh-pages branch (GitHub Pages).
 *
 * Usage:  npm run build && node scripts/deploy-gh-pages.mjs [--no-push] [--message "..."]
 *
 * Why a script: GitHub Pages caches index.html for ~10 minutes. If a deploy
 * deletes the previous main-*.js, visitors with a cached index see a blank
 * page until the cache expires. This script copies the new build over the
 * gh-pages checkout but KEEPS the previous deploy's hashed bundles
 * (main-*.js, chunk-*.js, polyfills-*.js, styles-*.css) so both generations
 * load. Older generations are pruned so the branch does not grow forever.
 */
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const push = !args.includes('--no-push');
const msgIdx = args.indexOf('--message');
const message = msgIdx >= 0 ? args[msgIdx + 1] : `Deploy ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`;

const repo = resolve(new URL('..', import.meta.url).pathname);
const dist = join(repo, 'dist', 'nagina-social-welfare-website', 'browser');
if (!existsSync(join(dist, 'index.html'))) {
  console.error(`No build at ${dist}. Run \`npm run build\` first.`);
  process.exit(1);
}

const sh = (cmd, cwd = repo) => execSync(cmd, { cwd, stdio: 'inherit' });
const out = (cmd, cwd = repo) => execSync(cmd, { cwd, encoding: 'utf8' }).trim();

const worktree = mkdtempSync(join(tmpdir(), 'nsw-gh-pages-'));
try {
  sh('git fetch origin gh-pages');
  sh(`git worktree add --detach "${worktree}" origin/gh-pages`);

  const BUNDLE = /^(main|chunk|polyfills)-[A-Za-z0-9_-]+\.js$|^styles-[A-Za-z0-9_-]+\.css$/;
  const MANIFEST = 'deploy-manifest.json';

  // Generations are tracked in a manifest committed with the site. File
  // mtimes are useless here: a fresh checkout stamps every old file "now".
  const readManifest = () => {
    try {
      return JSON.parse(readFileSync(join(worktree, MANIFEST), 'utf8'));
    } catch {
      return null;
    }
  };
  const bundlesIn = (dir) => readdirSync(dir).filter((f) => BUNDLE.test(f)).sort();
  const previous = readManifest();
  // First run without a manifest: treat everything on the branch as the previous generation.
  const previousGeneration = previous?.generations?.[0]?.files ?? bundlesIn(worktree);
  const currentGeneration = bundlesIn(dist);
  const keep = new Set([...currentGeneration, ...previousGeneration]);

  // Remove everything except .git and the bundles we keep, then lay the new build on top.
  for (const entry of readdirSync(worktree)) {
    if (entry === '.git' || (BUNDLE.test(entry) && keep.has(entry))) continue;
    rmSync(join(worktree, entry), { recursive: true, force: true });
  }
  cpSync(dist, worktree, { recursive: true });

  const indexMain = (readFileSync(join(dist, 'index.html'), 'utf8').match(/main-[A-Za-z0-9_-]+\.js/) ?? [''])[0];
  writeFileSync(
    join(worktree, MANIFEST),
    JSON.stringify(
      {
        generations: [
          { main: indexMain, deployedAt: new Date().toISOString(), files: currentGeneration },
          ...(previous?.generations?.[0] ? [previous.generations[0]] : [{ main: 'legacy', files: previousGeneration }]),
        ],
      },
      null,
      2,
    ) + '\n',
  );

  sh('git add -A', worktree);
  const status = out('git status --porcelain', worktree);
  if (!status) {
    console.log('Nothing to deploy — gh-pages already matches the build.');
  } else {
    sh(`git commit -q -m ${JSON.stringify(message)}`, worktree);
    if (push) {
      sh('git push origin HEAD:gh-pages', worktree);
      console.log('Deployed to gh-pages.');
    } else {
      console.log(`Committed in ${worktree} (not pushed).`);
    }
  }
} finally {
  if (push) {
    try {
      sh(`git worktree remove --force "${worktree}"`);
    } catch {
      /* leave for inspection */
    }
  }
}
