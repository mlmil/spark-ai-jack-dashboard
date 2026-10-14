# AGENTS.md — Spark AI × Momentum Work Inc. Master Intern Dashboard

## Startup & Source of Truth
1. Read `.ai/PROJECT_CONTEXT.md`, `.ai/AI_WORKLOG.md`, and `data/dashboard.json` (plus `data/jack-feed.json`).
2. Keep changes small, verifiable, and reversible.

## Natural-Language Dashboard Operations (For Mike Miller)
When Mike gives a natural-language instruction (e.g., *"Verify Jack's latest hours"*, *"Log 3.5 hours for Jack at Studio 1385 today"*, *"Mark milestone 1 complete"*, or *"Add a supervisor note"*):
1. Update `data/dashboard.json` or `data/jack-feed.json`.
   - Always set `location` to either `"Studio 1385"` or `"Remote / Home"`.
   - When Mike logs or approves an entry, set `"verificationStatus": "verified"` and `"verifiedBy": "Mike Miller"`.
2. Run `node scripts/verify-dashboard.mjs` to validate the schema and sync `data/dashboard-fallback.js`.
3. Run `node --test tests/dashboard-data.test.mjs` to confirm all checks pass.
4. Record the update in `.ai/AI_WORKLOG.md`, commit, and `git push` to update the public GitHub Pages site.
