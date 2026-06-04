---
description: Ship the current changes live — review diff, commit, push to main (dual-push), confirm Vercel auto-deploy
---

You are shipping the Spring portfolio site to production. The user has explicitly opted into shipping straight to prod: invoking `/ship` IS the approval. Do NOT pause for a separate "are you sure?" confirmation — commit and push immediately, then report what went out. (Invoking the command is the gate; the user decides when to ship by running it.)

## Context / project quirks (do not skip)
- Two git remotes on `origin`: enterprise (`github.intuit.com:fstekolshch/spring`, fetch + push) AND public (`github.com/felixElOso/Spring`, push only). A single `git push origin` fans out to BOTH (dual-push). Vercel watches the PUBLIC repo and auto-deploys `main`.
- Production branch is `main`. Vercel Git Integration is already connected — pushing `main` to the public repo triggers an automatic production deploy. No `vercel --prod` needed (it's only a fallback).
- We typically work in a git worktree on a `claude/*` feature branch. Shipping means getting the commit onto `main` and pushing.
- NEVER commit `.github/workflows/*` — enterprise rejects it (`NoGitHubSecretsRule`). NEVER commit `.env.local` or Sanity tokens.
- The dev server runs via `preview_start`, not npm (system Node is too old). Irrelevant to shipping but don't confuse the two.

## Steps

1. **Review.** Run `git branch --show-current`, `git fetch origin`, `git status`, and `git diff` (staged + unstaged). Summarize what will ship — files changed and a one-line description of each.

2. **Check main hasn't diverged.** Compare current work against `origin/main`. Confirm the push will be a clean fast-forward (no unexpected commits on `main` we don't have). If `main` has moved, STOP and tell the user — do not force.

3. **Safety sweep (auto-abort, not a confirmation).** Scan the diff for anything that must NOT ship: `.env.local` or any env file, Sanity/API tokens or secrets, `.github/workflows/*` (enterprise rejects these). If found, STOP and tell the user — otherwise proceed without pausing. This is the only thing that halts the ship; it is not an "are you sure" gate.

4. **Commit.** Stage the intended files and commit. End the message with:
   `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

5. **Push to main (dual-push).** From the worktree, `git push origin HEAD:main` (filter out the post-quantum SSH warning noise). This updates BOTH repos. Confirm the public repo got the push (look for the `github.com/felixElOso/Spring` line in output) — that's what triggers the deploy.

6. **Confirm deploy + report.** Print the git-hygiene confirmation block (pushed SHA, commit links for github.intuit.com, changed-file link). Tell the user Vercel is now auto-deploying from `main` and the live URL is https://spring-gamma.vercel.app. Optionally verify with `npx vercel ls spring --yes` that a new git-triggered deployment appeared (look for a `spring-git-main-*` alias).

$ARGUMENTS
