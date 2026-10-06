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
import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync, statSync, unlinkSync } from 'node:fs';
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

  const BUNDLE = /^(main|chunk|polyfills)-[A-Z0-9]+\.js$|^styles-[A-Z0-9]+\.css$/;
  const KEEP_GENERATIONS = 2;

  // Previous bundles, newest first (by mtime in the checkout is unreliable; use git log order).
  const previousBundles = readdirSync(worktree).filter((f) => BUNDLE.test(f));

  // Remove everything except .git and previous bundles.
  for (const entry of readdirSync(worktree)) {
    if (entry === '.git' || BUNDLE.test(entry)) continue;
    rmSync(join(worktree, entry), { recursive: true, force: true });
  }

  cpSync(dist, worktree, { recursive: true });

  // Prune bundle generations older than KEEP_GENERATIONS. A generation is
  // identified by its main-*.js; anything not referenced by a kept index or
  // the previous main is dropped.
  const mains = readdirSync(worktree)
    .filter((f) => /^main-[A-Z0-9]+\.js$/.test(f))
    .map((f) => ({ f, t: statSync(join(worktree, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t);
  const drop = mains.slice(KEEP_GENERATIONS).map((m) => m.f);
  for (const f of drop) unlinkSync(join(worktree, f));
  // Keep chunk/styles files only if they were in this build or were among the
  // previous deploy's files (we cannot map chunks to mains cheaply, so keep
  // the previous set once and let the next deploy prune).
  const current = new Set(readdirSync(dist));
  for (const f of readdirSync(worktree)) {
    if (!BUNDLE.test(f) || current.has(f)) continue;
    if (!previousBundles.includes(f)) unlinkSync(join(worktree, f));
  }

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
