# Spark AI × Momentum Work Inc. Intern Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a zero-dependency, GitHub Pages-ready public dashboard in `/Volumes/VADER/Clients/Jack_Intern` that tracks Jack's internship hours (with explicit **Studio 1385** vs. **Remote / Home** location tracking), active Spark AI project milestones, workforce readiness skills, supervisor notes, and printable/CSV timesheet exports for Momentum Work Inc.

**Architecture:** A static web application (`index.html`, `styles.css`, `app.js`) backed by a single JSON source of truth (`data/dashboard.json`) and an offline JS fallback (`data/dashboard-fallback.js`). Includes a pure calculation & rendering helper module tested via Node's built-in test runner (`node --test`) and a CLI verification/sync script (`scripts/verify-dashboard.mjs`), plus `.ai/` natural-language workspace instructions.

**Tech Stack:** HTML5, CSS3 (`@media print` official report layout, Spark AI dark-matte `#090d0b` / `#111814` & `#e2ba64` gold theme), Vanilla ES2022 JavaScript, Node.js (`node:test`, `node:assert/strict`) for automated verification.

**Spec:** `docs/superpowers/specs/2026-10-13-intern-dashboard-design.md`

## Global Constraints

- **No External Build / Runtime Dependencies:** Must deploy directly from repo root on GitHub Pages without bundling or `npm install`.
- **Spark Plug Emblem (`assets/spark-ai-plug.png`):** Displayed in the top-left header crest (`#111814` flat card, `#1e2e25` border) and subtle hero background watermark (`opacity: 0.06`) with **no glow or drop-shadow (`filter: none`)**, and inverted (`filter: invert(1)`) in `@media print`.
- **Work Location Tracking:** Every timesheet entry and KPI breakdown must distinguish between `"Studio 1385"` (in-person) and `"Remote / Home"` (remote).
- **Start Date & Pre-Start State:** Internship starts **Friday, October 16, 2026** (`2026-10-16`). When `timeLogs` is empty, the dashboard must display `0.0 hrs` cleanly alongside a **Preview Sample Mode** toggle so Momentum Work Inc. can preview how logged Studio 1385 + Remote sessions look and print.

---

### Task 1: Data Schema, Offline Fallback & Verification Script

**Files:**
- Create: `data/dashboard.json`
- Create: `data/dashboard-fallback.js`
- Create: `scripts/verify-dashboard.mjs`
- Test: `tests/dashboard-data.test.mjs`

**Interfaces:**
- Produces:
  - `data/dashboard.json` containing `{ lastUpdated, intern, projects, timeLogs, sampleTimeLogs, skills, supervisorNotes }`
  - `data/dashboard-fallback.js` setting `window.SPARK_INTERN_DATA = ...`
  - `scripts/verify-dashboard.mjs` exporting `computeMetrics(data, useSample)` and `validateDashboardData(data)`

- [ ] **Step 1: Write the failing test (`tests/dashboard-data.test.mjs`)**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { validateDashboardData, computeMetrics } from '../scripts/verify-dashboard.mjs';

const rootDir = path.resolve(import.meta.dirname, '..');

test('dashboard.json validates cleanly and has startDate 2026-10-16', () => {
  const raw = fs.readFileSync(path.join(rootDir, 'data/dashboard.json'), 'utf8');
  const data = JSON.parse(raw);
  const errors = validateDashboardData(data);
  assert.deepEqual(errors, []);
  assert.equal(data.intern.name, 'Jack');
  assert.equal(data.intern.startDate, '2026-10-16');
  assert.equal(data.intern.partnerOrganization, 'Momentum Work Inc.');
});

test('computeMetrics handles empty timeLogs and sampleTimeLogs accurately', () => {
  const raw = fs.readFileSync(path.join(rootDir, 'data/dashboard.json'), 'utf8');
  const data = JSON.parse(raw);

  const launchMetrics = computeMetrics(data, false);
  assert.equal(launchMetrics.totalHours, 0);
  assert.equal(launchMetrics.studioHours, 0);
  assert.equal(launchMetrics.remoteHours, 0);
  assert.equal(launchMetrics.sessionCount, 0);

  const sampleMetrics = computeMetrics(data, true);
  assert.equal(sampleMetrics.totalHours, 5.5);
  assert.equal(sampleMetrics.studioHours, 4.0);
  assert.equal(sampleMetrics.remoteHours, 1.5);
  assert.equal(sampleMetrics.sessionCount, 2);
  assert.equal(sampleMetrics.studioSessions, 1);
  assert.equal(sampleMetrics.remoteSessions, 1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/dashboard-data.test.mjs`
Expected: FAIL (`Cannot find module '../scripts/verify-dashboard.mjs'`)

- [ ] **Step 3: Create `data/dashboard.json`, `data/dashboard-fallback.js`, and `scripts/verify-dashboard.mjs`**

Create `data/dashboard.json`:
```json
{
  "lastUpdated": "2026-10-13",
  "intern": {
    "name": "Jack",
    "role": "AI & Studio Operations Intern",
    "hostOrganization": "Spark AI",
    "primaryLocation": "Studio 1385",
    "supervisor": "Mike Miller",
    "partnerOrganization": "Momentum Work Inc.",
    "startDate": "2026-10-16",
    "scheduleNote": "Flexible Schedule (~3–5 hrs/week • Studio 1385 & Remote)",
    "status": "Active — Starts Fri, Oct 16, 2026"
  },
  "projects": [
    {
      "id": "studio-onboarding-ai-foundations",
      "title": "Studio Onboarding & AI Tooling Foundations",
      "status": "Active",
      "description": "Hands-on orientation covering Mac studio workstation setup at Studio 1385, running local language models, prompt engineering fundamentals, and remote/in-studio project workflows.",
      "milestones": [
        {
          "id": "m1",
          "title": "Mac Studio Setup & Environment",
          "detail": "Studio 1385 workstation orientation, tools, and privacy/security guidelines",
          "status": "Upcoming",
          "completed": false
        },
        {
          "id": "m2",
          "title": "Local LLM Basics",
          "detail": "Running and testing local AI models on Apple Silicon hardware",
          "status": "Upcoming",
          "completed": false
        },
        {
          "id": "m3",
          "title": "Prompt Engineering Fundamentals",
          "detail": "Structured prompting, source grounding, and output quality verification",
          "status": "Upcoming",
          "completed": false
        },
        {
          "id": "m4",
          "title": "Spark AI Workflow Orientation",
          "detail": "Assisting with client discovery prep, documentation, and studio operations",
          "status": "Upcoming",
          "completed": false
        }
      ]
    }
  ],
  "timeLogs": [],
  "sampleTimeLogs": [
    {
      "id": "sample-2026-10-19",
      "date": "2026-10-19",
      "displayDate": "Mon, Oct 19, 2026",
      "sessionLabel": "Sample Session #2",
      "location": "Remote / Home",
      "timeWindow": "Flexible Remote Session",
      "hours": 1.5,
      "project": "Studio Onboarding & AI Tooling Foundations",
      "summary": "Reviewed prompt engineering reference materials and documented local model test observations from home.",
      "verifiedBy": "Mike Miller"
    },
    {
      "id": "sample-2026-10-16",
      "date": "2026-10-16",
      "displayDate": "Fri, Oct 16, 2026",
      "sessionLabel": "Sample Session #1",
      "location": "Studio 1385",
      "timeWindow": "In-Studio Session",
      "hours": 4.0,
      "project": "Studio Onboarding & AI Tooling Foundations",
      "summary": "In-person onboarding at Studio 1385: Mac workstation setup, local environment orientation, and initial local LLM test runs.",
      "verifiedBy": "Mike Miller"
    }
  ],
  "skills": [
    {
      "name": "Mac Studio & Hardware Setup",
      "category": "Technical & Studio",
      "status": "Introduced"
    },
    {
      "name": "Local LLM Operations",
      "category": "AI Tooling",
      "status": "Introduced"
    },
    {
      "name": "Prompt Engineering & QA",
      "category": "AI Tooling",
      "status": "Introduced"
    },
    {
      "name": "Studio 1385 & Remote Workflow Communication",
      "category": "Workforce Readiness",
      "status": "Introduced"
    }
  ],
  "supervisorNotes": [
    {
      "id": "note-2026-10-13",
      "date": "2026-10-13",
      "displayDate": "Tuesday, Oct 13, 2026",
      "context": "Onboarding Preparation",
      "author": "Mike Miller",
      "text": "Welcome aboard! Jack's internship officially begins this Friday, October 16, 2026 with a flexible schedule (~3–5 hrs/week) combining in-person sessions at Studio 1385 and remote work from home."
    }
  ]
}
```

Create `scripts/verify-dashboard.mjs` (which also syncs `data/dashboard-fallback.js` when invoked from CLI):
```javascript
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const VALID_LOCATIONS = new Set(['Studio 1385', 'Remote / Home']);

export function validateDashboardData(data) {
  const errors = [];
  if (!data || typeof data !== 'object') {
    return ['Dashboard data must be a JSON object'];
  }
  if (!data.intern?.name) errors.push('Missing intern.name');
  if (!data.intern?.startDate) errors.push('Missing intern.startDate');
  if (!Array.isArray(data.projects) || data.projects.length === 0) {
    errors.push('projects must be a non-empty array');
  }
  for (const listName of ['timeLogs', 'sampleTimeLogs']) {
    const list = data[listName];
    if (!Array.isArray(list)) {
      errors.push(`${listName} must be an array`);
      continue;
    }
    for (const entry of list) {
      if (!VALID_LOCATIONS.has(entry.location)) {
        errors.push(`Invalid location "${entry.location}" in ${listName} (${entry.id})`);
      }
      if (typeof entry.hours !== 'number' || entry.hours <= 0) {
        errors.push(`Invalid hours "${entry.hours}" in ${listName} (${entry.id})`);
      }
    }
  }
  return errors;
}

export function computeMetrics(data, useSample = false) {
  const logs = useSample ? (data.sampleTimeLogs || []) : (data.timeLogs || []);
  let totalHours = 0;
  let studioHours = 0;
  let remoteHours = 0;
  let studioSessions = 0;
  let remoteSessions = 0;

  for (const item of logs) {
    const h = Number(item.hours) || 0;
    totalHours += h;
    if (item.location === 'Studio 1385') {
      studioHours += h;
      studioSessions += 1;
    } else if (item.location === 'Remote / Home') {
      remoteHours += h;
      remoteSessions += 1;
    }
  }

  const allMilestones = (data.projects || []).flatMap((p) => p.milestones || []);
  const completedMilestones = allMilestones.filter((m) => m.completed).length;
  const milestonePct = allMilestones.length > 0
    ? Math.round((completedMilestones / allMilestones.length) * 100)
    : 0;

  return {
    totalHours: Number(totalHours.toFixed(1)),
    studioHours: Number(studioHours.toFixed(1)),
    remoteHours: Number(remoteHours.toFixed(1)),
    sessionCount: logs.length,
    studioSessions,
    remoteSessions,
    milestonePct: useSample && milestonePct === 0 ? 50 : milestonePct
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const jsonPath = path.join(rootDir, 'data/dashboard.json');
  const fallbackPath = path.join(rootDir, 'data/dashboard-fallback.js');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const errors = validateDashboardData(data);
  if (errors.length > 0) {
    console.error('Validation errors:', errors);
    process.exit(1);
  }
  const fallbackJs = `// Auto-generated from data/dashboard.json\nwindow.SPARK_INTERN_DATA = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(fallbackPath, fallbackJs, 'utf8');
  console.log('✓ dashboard.json validated and data/dashboard-fallback.js synced.');
}
```

- [ ] **Step 4: Run verification script and test suite**

Run: `node scripts/verify-dashboard.mjs && node --test tests/dashboard-data.test.mjs`
Expected: PASS (2 passing tests and `data/dashboard-fallback.js` generated)

- [ ] **Step 5: Commit Task 1**

```bash
git add data/dashboard.json data/dashboard-fallback.js scripts/verify-dashboard.mjs tests/dashboard-data.test.mjs
git commit -m "feat(data): add intern dashboard data schema, fallback sync, and tests"
```

---

### Task 2: Public Dashboard HTML, Spark AI No-Glow Styling & Print Report Layout

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `app.js`
- Modify: `tests/dashboard-data.test.mjs`

**Interfaces:**
- Consumes: `data/dashboard.json` and `window.SPARK_INTERN_DATA` from `data/dashboard-fallback.js`, plus `assets/spark-ai-plug.png`
- Produces: Complete browser UI + `@media print` official Momentum Work Inc. report + CSV export

- [ ] **Step 1: Add DOM/UI & CSS integrity tests to `tests/dashboard-data.test.mjs`**

Append to `tests/dashboard-data.test.mjs`:
```javascript
test('index.html, styles.css, and app.js contain required Spark AI & Momentum Work Inc. hooks and no-glow emblem rules', () => {
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(rootDir, 'styles.css'), 'utf8');
  const js = fs.readFileSync(path.join(rootDir, 'app.js'), 'utf8');

  assert.match(html, /assets\/spark-ai-plug\.png/);
  assert.match(html, /MOMENTUM WORK INC\./i);
  assert.match(html, /id="kpi-total-hours"/);
  assert.match(html, /id="timesheet-body"/);
  assert.match(html, /id="print-report-sheet"/);

  // Verify no glow on spark plug crest image and @media print exists
  assert.match(css, /\.spark-plug-crest\s+img\s*\{[^}]*filter:\s*none/s);
  assert.match(css, /@media\s+print/);

  // Verify CSV export and location filter support in app.js
  assert.match(js, /exportTimesheetCsv/);
  assert.match(js, /Studio 1385/);
  assert.match(js, /Remote \/ Home/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/dashboard-data.test.mjs`
Expected: FAIL (`ENOENT: no such file or directory, open '.../index.html'`)

- [ ] **Step 3: Implement `index.html`, `styles.css`, and `app.js`**

Create `index.html`, `styles.css` (with dark matte `#090d0b` / `#111814`, `#e2ba64` gold, `#38bdf8` sky-blue remote badge, `filter: none` on `.spark-plug-crest img`, and `@media print` black-on-white official timesheet report), and `app.js` (handling live data rendering, launch vs. sample preview mode toggle, location filtering `All` / `Studio 1385` / `Remote / Home`, `window.print()`, and CSV download).

- [ ] **Step 4: Run tests and verification**

Run: `node scripts/verify-dashboard.mjs && node --test tests/dashboard-data.test.mjs`
Expected: PASS (all 3 tests passing)

- [ ] **Step 5: Commit Task 2**

```bash
git add index.html styles.css app.js tests/dashboard-data.test.mjs
git commit -m "feat(ui): build Spark AI x Momentum Work Inc. intern dashboard and print/CSV report"
```

---

### Task 3: Workspace `.ai/` Natural-Language Instructions & GitHub Pages Deployment Setup

**Files:**
- Create: `.ai/AGENTS.md`
- Create: `.ai/PROJECT_CONTEXT.md`
- Create: `.ai/AI_WORKLOG.md`
- Create: `AI_WORKLOG.md` (symlink to `.ai/AI_WORKLOG.md`)
- Create: `README.md`

**Interfaces:**
- Consumes: `data/dashboard.json`, `scripts/verify-dashboard.mjs`
- Produces: Complete natural-language update documentation and GitHub Pages readiness

- [ ] **Step 1: Write test verifying `.ai/` workspace files and `README.md` exist**

Append to `tests/dashboard-data.test.mjs`:
```javascript
test('workspace .ai files and README document natural-language update workflow', () => {
  assert.equal(fs.existsSync(path.join(rootDir, '.ai/AGENTS.md')), true);
  assert.equal(fs.existsSync(path.join(rootDir, '.ai/AI_WORKLOG.md')), true);
  assert.equal(fs.existsSync(path.join(rootDir, 'README.md')), true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/dashboard-data.test.mjs`
Expected: FAIL

- [ ] **Step 3: Create `.ai/AGENTS.md`, `.ai/PROJECT_CONTEXT.md`, `.ai/AI_WORKLOG.md`, `AI_WORKLOG.md` symlink, and `README.md`**

Document exact natural-language update rules (how to add a `"Studio 1385"` or `"Remote / Home"` session to `data/dashboard.json`, run `node scripts/verify-dashboard.mjs`, and `git push` to update GitHub Pages).

- [ ] **Step 4: Run full test suite**

Run: `node scripts/verify-dashboard.mjs && node --test tests/dashboard-data.test.mjs`
Expected: PASS (4/4 tests passing)

- [ ] **Step 5: Commit Task 3**

```bash
git add .ai README.md AI_WORKLOG.md tests/dashboard-data.test.mjs
git commit -m "docs(workspace): add .ai worklog system and GitHub Pages guide"
```
