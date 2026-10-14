# Spark AI × Momentum Work Inc. Master Intern Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the public **Spark AI × Momentum Work Inc. Master Intern Dashboard** in `/Volumes/VADER/Clients/Jack_Intern` with **Studio 1385 vs. Remote / Home** location tracking, a **Voice → DeepSeek API → Master Portal** feed pipeline (`scripts/deepseek-voice-parser.mjs` + `data/jack-feed.json`), two-tier verification (`⏳ Logged by Jack` → `✓ Verified • M. Miller`), and printable PDF / CSV exports.

**Architecture:** Zero-dependency static web application (`index.html`, `styles.css`, `app.js`) deployed directly to GitHub Pages. Merges master records (`data/dashboard.json`) with Jack's DeepSeek-parsed voice feed (`data/jack-feed.json` or remote URL), includes an offline fallback (`data/dashboard-fallback.js`), a DeepSeek API structured voice parser (`scripts/deepseek-voice-parser.mjs`), a Node verification test suite (`scripts/verify-dashboard.mjs`), and a Friday starter guide for Jack (`JACK_PROJECT_1_GUIDE.md`).

**Tech Stack:** HTML5, CSS3 (`@media print` report view, Spark AI dark-matte `#090d0b` / `#111814` & `#e2ba64` gold theme), Vanilla ES2022 JavaScript, DeepSeek API (`deepseek-chat` JSON mode), Node.js (`node:test`, `node:assert/strict`).

**Spec:** `docs/superpowers/specs/2026-10-13-intern-dashboard-design.md`

## Global Constraints

- **Zero External Build Dependencies:** Deploys directly from root to GitHub Pages.
- **No Glow on Spark Plug Emblem (`assets/spark-ai-plug.png`):** `.spark-plug-crest img` and `.spark-watermark-bg` must use `filter: none;` on screen and `filter: invert(1);` in `@media print`.
- **Work Location Tracking:** Every session entry and KPI card breaks down `"Studio 1385"` vs. `"Remote / Home"`.
- **Voice → DeepSeek API Structured Parser:** `scripts/deepseek-voice-parser.mjs` builds the exact DeepSeek `chat/completions` request (`model: "deepseek-chat"`, `response_format: { type: "json_object" }`), normalizes the parsed JSON into a valid `jack-feed.json` entry (`inputMethod: "Voice → DeepSeek API"`, `verificationStatus: "logged_by_jack"`), and supports both live `DEEPSEEK_API_KEY` calls and deterministic test/mock parsing.

---

### Task 1: Master Data, DeepSeek Voice Parser (`scripts/deepseek-voice-parser.mjs`), Verification Script & Unit Tests

**Files:**
- Create: `data/dashboard.json`
- Create: `data/jack-feed.json`
- Create: `data/dashboard-fallback.js`
- Create: `scripts/deepseek-voice-parser.mjs`
- Create: `scripts/verify-dashboard.mjs`
- Create: `tests/dashboard-data.test.mjs`

- [ ] **Step 1: Write failing tests in `tests/dashboard-data.test.mjs` covering `dashboard.json`, `jack-feed.json`, `computeMetrics`, and `deepseek-voice-parser.mjs` (`buildDeepSeekPayload` & `normalizeDeepSeekEntry`)**
- [ ] **Step 2: Run `node --test tests/dashboard-data.test.mjs` to verify it fails**
- [ ] **Step 3: Implement `data/dashboard.json`, `data/jack-feed.json`, `scripts/deepseek-voice-parser.mjs`, and `scripts/verify-dashboard.mjs`**
- [ ] **Step 4: Run `node scripts/verify-dashboard.mjs && node --test tests/dashboard-data.test.mjs` and verify PASS**
- [ ] **Step 5: Commit Task 1**

---

### Task 2: Master Dashboard UI (`index.html`, `styles.css`, `app.js`) & Printable Report

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `app.js`
- Modify: `tests/dashboard-data.test.mjs`

- [ ] **Step 1: Add UI/CSS/JS integrity tests to `tests/dashboard-data.test.mjs` (verifying no-glow emblem, Voice → DeepSeek pipeline panel, location filter, and `@media print`)**
- [ ] **Step 2: Run `node --test tests/dashboard-data.test.mjs` to verify new test fails**
- [ ] **Step 3: Implement `index.html`, `styles.css`, and `app.js`**
- [ ] **Step 4: Run `node scripts/verify-dashboard.mjs && node --test tests/dashboard-data.test.mjs` and verify PASS**
- [ ] **Step 5: Commit Task 2**

---

### Task 3: Jack's Voice + DeepSeek Starter Guide (`JACK_PROJECT_1_GUIDE.md`), `.ai/` Workspace & GitHub Pages Guide

**Files:**
- Create: `JACK_PROJECT_1_GUIDE.md`
- Create: `.ai/AGENTS.md`
- Create: `.ai/PROJECT_CONTEXT.md`
- Create: `.ai/AI_WORKLOG.md`
- Create: `AI_WORKLOG.md` (symlink)
- Create: `README.md`
- Modify: `tests/dashboard-data.test.mjs`

- [ ] **Step 1: Add test checking `JACK_PROJECT_1_GUIDE.md` (including DeepSeek API instructions), `.ai/` files, and `README.md`**
- [ ] **Step 2: Run `node --test tests/dashboard-data.test.mjs` to verify it fails**
- [ ] **Step 3: Create `JACK_PROJECT_1_GUIDE.md`, `.ai/` workspace files, and `README.md`**
- [ ] **Step 4: Run full verification and test suite**
- [ ] **Step 5: Commit Task 3**
