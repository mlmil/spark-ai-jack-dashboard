# Spark AI × Momentum Work Inc. Master Intern Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the public **Spark AI × Momentum Work Inc. Master Intern Dashboard** in `/Volumes/VADER/Clients/Jack_Intern` with **Studio 1385 vs. Remote / Home** location tracking, a live **Feed Bridge** (`data/jack-feed.json` + optional remote `feedUrl`) so Jack can wire his own Time-Logger Dashboard into this Master Portal as **Project #1**, two-tier verification (`⏳ Logged by Jack` → `✓ Verified • M. Miller`), and printable PDF / CSV exports.

**Architecture:** Zero-dependency static web application (`index.html`, `styles.css`, `app.js`) deployed directly to GitHub Pages. Merges master records (`data/dashboard.json`) with Jack's incoming feed (`data/jack-feed.json` or remote URL), includes an offline fallback (`data/dashboard-fallback.js`), a Node test & verification suite (`scripts/verify-dashboard.mjs`), and a hands-on starter guide for Jack (`JACK_PROJECT_1_GUIDE.md`).

**Tech Stack:** HTML5, CSS3 (`@media print` report view, Spark AI dark-matte `#090d0b` / `#111814` & `#e2ba64` gold theme), Vanilla ES2022 JavaScript, Node.js (`node:test`, `node:assert/strict`).

**Spec:** `docs/superpowers/specs/2026-10-13-intern-dashboard-design.md`

## Global Constraints

- **Zero External Dependencies / No Build Step:** Deploys directly from root to GitHub Pages.
- **No Glow on Spark Plug Emblem (`assets/spark-ai-plug.png`):** `.spark-plug-crest img` and `.spark-watermark-bg` must use `filter: none;` on screen and `filter: invert(1);` in `@media print`.
- **Work Location Tracking:** Every session entry and KPI card breaks down `"Studio 1385"` vs. `"Remote / Home"`.
- **Two-Tier Verification & Feed Bridge:** Merges `data/dashboard.json` and `data/jack-feed.json`, supporting `"logged_by_jack"` (`⏳ Logged by Jack`) and `"verified"` (`✓ Verified • M. Miller`).

---

### Task 1: Master Data, Jack's Feed Endpoint, Verification Script & Unit Tests

**Files:**
- Create: `data/dashboard.json`
- Create: `data/jack-feed.json`
- Create: `data/dashboard-fallback.js`
- Create: `scripts/verify-dashboard.mjs`
- Create: `tests/dashboard-data.test.mjs`

**Interfaces:**
- Produces:
  - `data/dashboard.json` (Master config + Project #1 *Build & Wire Personal Time-Logger Dashboard* + Track #2 *Studio Onboarding & AI Tooling Foundations*)
  - `data/jack-feed.json` (Incoming feed file where Jack's dashboard writes session entries)
  - `scripts/verify-dashboard.mjs` exporting `mergeTimeLogs(masterLogs, feedEntries)`, `computeMetrics(data, feedData, useSample)`, and `validateDashboardData(data, feedData)`

- [ ] **Step 1: Write the failing test (`tests/dashboard-data.test.mjs`)**
- [ ] **Step 2: Run `node --test tests/dashboard-data.test.mjs` to verify it fails**
- [ ] **Step 3: Create `data/dashboard.json`, `data/jack-feed.json`, and `scripts/verify-dashboard.mjs`**
- [ ] **Step 4: Run `node scripts/verify-dashboard.mjs && node --test tests/dashboard-data.test.mjs` and verify PASS**
- [ ] **Step 5: Commit Task 1**

---

### Task 2: Master Dashboard UI (`index.html`, `styles.css`, `app.js`) & Printable Report

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `app.js`
- Modify: `tests/dashboard-data.test.mjs`

**Interfaces:**
- Consumes: `data/dashboard.json`, `data/jack-feed.json`, `data/dashboard-fallback.js`, `assets/spark-ai-plug.png`
- Produces: Full Master Dashboard with Sample Wired View / Launch State toggle, Location filter (`All` / `Studio 1385` / `Remote / Home`), two-tier verification badges, CSV export, and `@media print` Momentum Work Inc. report.

- [ ] **Step 1: Add UI/CSS/JS integrity tests to `tests/dashboard-data.test.mjs`**
- [ ] **Step 2: Run `node --test tests/dashboard-data.test.mjs` to verify new test fails**
- [ ] **Step 3: Implement `index.html`, `styles.css`, and `app.js`**
- [ ] **Step 4: Run `node scripts/verify-dashboard.mjs && node --test tests/dashboard-data.test.mjs` and verify PASS**
- [ ] **Step 5: Commit Task 2**

---

### Task 3: Jack's Project #1 Guide (`JACK_PROJECT_1_GUIDE.md`), `.ai/` Workspace & GitHub Pages Setup

**Files:**
- Create: `JACK_PROJECT_1_GUIDE.md`
- Create: `.ai/AGENTS.md`
- Create: `.ai/PROJECT_CONTEXT.md`
- Create: `.ai/AI_WORKLOG.md`
- Create: `AI_WORKLOG.md` (symlink)
- Create: `README.md`
- Modify: `tests/dashboard-data.test.mjs`

**Interfaces:**
- Produces: Step-by-step developer guide for Jack on Friday to build his personal Time-Logger Dashboard and wire it into `data/jack-feed.json` / `remoteFeedUrl`, plus `.ai/` natural-language instructions for Mike.

- [ ] **Step 1: Add test checking `JACK_PROJECT_1_GUIDE.md`, `.ai/AGENTS.md`, `.ai/AI_WORKLOG.md`, and `README.md`**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Create `JACK_PROJECT_1_GUIDE.md`, `.ai/` files, and `README.md`**
- [ ] **Step 4: Run full verification and test suite**
- [ ] **Step 5: Commit Task 3**
