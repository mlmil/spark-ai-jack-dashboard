# Spark AI × Momentum Work Inc. — Master Intern Progress & Time Portal

Public read-only internship progress and verified timesheet dashboard for **Jack** (**AI & Studio Operations Intern** at **Spark AI • Studio 1385**, partnered with **Momentum Work Inc.**).

## Key Features
- **Studio 1385 vs. Remote / Home Tracking:** Every session entry, KPI card, filter pill, and printable report tracks whether hours were logged in-person at **🏢 Studio 1385** or **🏠 Remote / Home**.
- **Voice → DeepSeek API Feed Bridge (`scripts/deepseek-voice-parser.mjs` & `data/jack-feed.json`):** Supports Jack's Project #1—speaking session updates from his phone or workstation into the **DeepSeek API** (`deepseek-chat` JSON mode) to populate this Master Dashboard automatically.
- **Two-Tier Verification:** Voice entries from Jack's logger appear as **`⏳ Logged by Jack`** and upgrade to **`✓ Verified • M. Miller`** upon supervisor approval.
- **Official Momentum Work Inc. Reports:** Built-in **Print / Save PDF Report** (`@media print`) and **Export Timesheet CSV**.

## Quick Verification & Sync
```bash
node scripts/verify-dashboard.mjs
node --test tests/dashboard-data.test.mjs
```
