# Spark AI × Momentum Work Inc. — Intern Progress & Time Dashboard Design Spec

**Date:** 2026-10-13  
**Project Workspace:** `/Volumes/VADER/Clients/Jack_Intern`  
**Intern:** Jack (AI & Studio Operations Intern)  
**Host Organization:** Spark AI (Studio 1385 • Supervisor: Mike Miller)  
**Workforce Development Partner:** Momentum Work Inc.  
**Start Date:** Friday, October 16, 2026  

---

## 1. Purpose & Goals

Build a public, read-only web dashboard hosted on **GitHub Pages** that transparently tracks Jack's internship hours, work location (**Studio 1385** in-person vs. **Remote / Home**), active Spark AI learning tracks/projects, workforce readiness competencies, and supervisor check-in notes.

The dashboard serves two primary audiences:
1. **Momentum Work Inc. Workforce Development Team & External Viewers:** Needs a live, trustworthy view of Jack's cumulative hours, in-studio vs. remote attendance, skill progression, and project milestones, plus one-click **Print / Save PDF Report** and **CSV Export** for official program documentation.
2. **Mike Miller (Spark AI Supervisor):** Needs frictionless natural-language updates (via Antigravity/CLI in `/Volumes/VADER/Clients/Jack_Intern`) backed by a single structured data file (`data/dashboard.json`) with zero build steps or complex database maintenance.

---

## 2. Architecture & File Layout

The application is a zero-build static web app (`HTML5` + `CSS3` + vanilla `ES2022 JavaScript`) deployed directly from the repository root to GitHub Pages.

```text
/Volumes/VADER/Clients/Jack_Intern/
├── index.html                  # Public dashboard shell + print-only official report header/signature block
├── styles.css                  # Spark AI dark-matte & gold theme + @media print official report stylesheet
├── app.js                      # Data loader, live KPI calculator, location filter, CSV exporter, print handler
├── assets/
│   └── spark-ai-plug.png       # Custom SPARK.AI line-art spark plug emblem (used in header badge, hero watermark, and print report)
├── data/
│   ├── dashboard.json          # Single source of truth for intern profile, timeLogs, projects, skills, notes
│   └── dashboard-fallback.js   # Auto-synced JS window fallback so opening index.html via file:// works offline
├── scripts/
│   └── verify-dashboard.mjs    # Automated schema, math, and DOM/file integrity verification script
├── .ai/                        # Workspace context & AI_WORKLOG.md for natural-language dashboard updates
└── docs/
    └── superpowers/
        ├── specs/
        │   └── 2026-10-13-intern-dashboard-design.md
        └── plans/
            └── 2026-10-13-intern-dashboard.md
```

---

## 3. Data Schema (`data/dashboard.json`)

All dashboard metrics are dynamically calculated from `data/dashboard.json` so manual totals never drift out of sync.

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
      "description": "Hands-on orientation covering Mac studio workstation setup at Studio 1385, running local language models, prompt engineering fundamentals, and Spark AI project workflows.",
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
      "context": "Onboarding Preparation",
      "author": "Mike Miller",
      "text": "Welcome aboard! Jack's internship officially begins this Friday, October 16, 2026 with a flexible schedule (~3–5 hrs/week) combining in-person sessions at Studio 1385 and remote work from home."
    }
  ]
}
```

### `timeLogs[]` Entry Schema
Each logged work session in `timeLogs` follows this structure:
- `id` (`string`): Unique identifier (e.g., `"log-2026-10-16"`)
- `date` (`string`, `YYYY-MM-DD`): Date of session
- `location` (`"Studio 1385"` | `"Remote / Home"`): Explicit work location enum
- `timeWindow` (`string`, optional): e.g., `"3:00 PM – 5:00 PM"` or `"Flexible Session"`
- `hours` (`number`): Decimal hours worked (e.g., `3.5`)
- `project` (`string`): Project or track name
- `summary` (`string`): Concise description of tasks accomplished and skills practiced
- `verifiedBy` (`string`): `"Mike Miller"`

---

## 4. UI Components & Visual Design

### 4.1 Visual Theme (Spark AI Dark Matte & Gold)
- **Backgrounds:** Deep onyx `#090d0b` page canvas, elevated `#111814` card surfaces, `#0c120f` inset rows, `#1e2e25` subtle borders.
- **Accents & Semantic Badges:**
  - **Studio 1385 / Brand Primary:** Warm Gold/Amber `#e2ba64` (`🏢 Studio 1385`)
  - **Remote / Home Location:** Sky Blue `#38bdf8` (`🏠 Remote / Home`)
  - **Verified / Completed / Partner Badge:** Emerald `#34d399` (`MOMENTUM WORK INC. • WORKFORCE PARTNER`)

### 4.2 Header, Spark Plug Emblem & Actions
- **SPARK.AI Spark Plug Emblem (`assets/spark-ai-plug.png`):**
  1. **Brand Mark Badge:** Displayed prominently on the left side of the top header inside a dark onyx & gold-bordered crest (`#111814` with subtle `#e2ba64` drop-shadow glow so the white `SPARK.AI` line art stands out sharply).
  2. **Subtle Hero Watermark:** Positioned on the right background of the top hero/active-track banner at low opacity (`~7%`) for a custom studio feel.
  3. **Print / PDF Adaptation:** Automatically applies `filter: invert(1) contrast(1.4)` inside `@media print` so the white line-art emblem prints cleanly in dark ink on white paper.
- Dual-brand pills (`SPARK AI • STUDIO 1385` and `MOMENTUM WORK INC. • WORKFORCE PARTNER`).
- Title (`Jack — Internship Progress & Time Portal`) and metadata subtitle (Role, Supervisor, Start Date, Schedule).
- Action buttons:
  1. **Print / Save PDF Report** (`window.print()`)
  2. **Export Timesheet CSV** (downloads `jack-spark-ai-timesheet-YYYY-MM-DD.csv` including the `Location` column)
  3. **Preview Sample Mode Toggle** (optional subtle toggle when `timeLogs` is empty prior to Friday, Oct 16, allowing viewers to preview how logged Studio 1385 + Remote sessions look without polluting real data).

### 4.3 Four KPI Summary Cards
1. **Total Hours Logged:** Cumulative hours (`0.0 hrs` at launch), plus split badges showing **`🏢 X.Xh Studio 1385`** and **`🏠 Y.Yh Home`**.
2. **Sessions & Location Split:** Total completed sessions + breakdown (`X In-Studio (1385) • Y Remote / Home`, or `"First session: Fri, Oct 16 at Studio 1385"` when `0`).
3. **Active Track Progress:** Percentage of completed milestones across active projects (with progress bar).
4. **Skills & Competencies:** Count of tracked workforce skills broken down by `Demonstrated`, `Practicing`, and `Introduced`.

### 4.4 Main Two-Column Content Grid
- **Left Column:**
  - **Active Projects & Milestones Card:** Shows project title, description, visual progress bar, and milestone checklist items with status badges (`Completed`, `In Progress`, `Upcoming`).
  - **Verified Time & Location Log:**
    - Interactive filter pills: `All` | `🏢 Studio 1385` | `🏠 Remote / Home`.
    - Table columns: `Date`, `Location` (badged `🏢 Studio 1385` vs `🏠 Remote / Home`), `Hours`, `Work Accomplished`, `Verified`.
    - Graceful empty state prior to first shift: highlights Friday, October 16, 2026 start date at Studio 1385.
- **Right Column:**
  - **Workforce Skills & Competencies:** Grouped list with status pills (`Introduced` / `Practicing` / `Demonstrated`).
  - **Supervisor Notes & Check-Ins:** Timestamped notes from Mike Miller for Momentum Work Inc.

### 4.5 Printable Official Report View (`@media print`)
When a user or Momentum Work Inc. coordinator clicks **Print / Save PDF Report**, `@media print` rules:
- Switch to a crisp black-on-white document layout.
- Hide interactive buttons and filter controls.
- Display an official header with Intern Name, Host (`Spark AI — Studio 1385`), Partner (`Momentum Work Inc.`), Total Hours, and Studio 1385 vs. Remote/Home hour breakdown.
- Render the full timesheet table (including `Work Location`), active milestones, and supervisor notes, followed by a **Supervisor Signature & Date** verification block at the bottom.

---

## 5. Error Handling, Offline Fallback & Verification

1. **Dual Loading (`fetch` + Offline Fallback):** `app.js` fetches `./data/dashboard.json` (with `cache: "no-store"` so GitHub Pages updates appear immediately) and falls back to `window.SPARK_INTERN_DATA` from `data/dashboard-fallback.js` if opened directly via `file://`.
2. **Safe Math & Zero-Session Handling:** Division by zero is guarded when `milestones` or `timeLogs` are empty; hours are formatted to 1 decimal place (`toFixed(1)`).
3. **Verification Script (`scripts/verify-dashboard.mjs`):** Validates that `data/dashboard.json` parses cleanly, matches `data/dashboard-fallback.js`, enforces valid location values (`"Studio 1385"` or `"Remote / Home"`), verifies non-negative hours, and checks that all required DOM hooks exist in `index.html`.
