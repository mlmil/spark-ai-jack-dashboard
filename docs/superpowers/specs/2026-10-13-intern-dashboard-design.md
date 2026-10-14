# Spark AI × Momentum Work Inc. — Master Intern Progress & Time Dashboard Design Spec

**Date:** 2026-10-13  
**Project Workspace:** `/Volumes/VADER/Clients/Jack_Intern`  
**Intern:** Jack (AI & Studio Operations Intern)  
**Host Organization:** Spark AI (Studio 1385 • Supervisor: Mike Miller)  
**Workforce Development Partner:** Momentum Work Inc.  
**Start Date:** Friday, October 16, 2026  

---

## 1. Purpose & Two-Dashboard Architecture

This repository powers the **Master Public Internship Dashboard** hosted on **GitHub Pages** for **Momentum Work Inc.'s workforce development team**, **Mike Miller (Spark AI)**, and **Jack**.

### The Two-Dashboard Mentorship Model
1. **This Portal = The Master Public Dashboard:**
   - Displays Jack's cumulative hours, work location split (**Studio 1385** in-person vs. **Remote / Home**), active Spark AI projects & milestones, workforce readiness skills, supervisor notes, and one-click **Print / Save PDF Report** + **CSV Export**.
2. **Jack's First Hands-On Project (Project #1) = Jack's Personal Time-Logger Dashboard:**
   - Starting Friday, October 16, 2026 at Studio 1385, Jack will learn how Spark AI builds dashboards by building his own input dashboard strictly for entering his hours, location (`Studio 1385` vs `Remote / Home`), projects, and daily work summaries.
   - **Feed Bridge (`data/jack-feed.json` / `feedConfig.feedUrl`):** Jack's input dashboard outputs structured session entries that wire directly into this Master Dashboard.
   - **Two-Tier Verification:**
     - Entries submitted from Jack's dashboard appear immediately on the Master Dashboard badged **`⏳ Logged by Jack`** (`verificationStatus: "logged_by_jack"`).
     - When Mike reviews/approves them (via natural language or updating the status), they display **`✓ Verified • M. Miller`** (`verificationStatus: "verified"`).

---

## 2. Architecture & File Layout

The application is a zero-build static web app (`HTML5` + `CSS3` + vanilla `ES2022 JavaScript`) deployed directly from the repository root to GitHub Pages.

```text
/Volumes/VADER/Clients/Jack_Intern/
├── index.html                  # Public Master Dashboard shell + print-only official report header/signature block
├── styles.css                  # Spark AI dark-matte & gold theme + @media print official report stylesheet
├── app.js                      # Master data + Jack's feed merger, live KPI calculator, location filter, CSV/print
├── assets/
│   └── spark-ai-plug.png       # Custom SPARK.AI heavy white line-art spark plug emblem (no glow)
├── data/
│   ├── dashboard.json          # Master source of truth (intern profile, projects, verified timeLogs, skills, notes)
│   ├── jack-feed.json          # Incoming feed endpoint where Jack's Personal Logger Dashboard writes entries
│   └── dashboard-fallback.js   # Auto-synced JS window fallback so opening index.html via file:// works offline
├── scripts/
│   └── verify-dashboard.mjs    # Automated schema, feed merge, math, and DOM integrity verification script
├── JACK_PROJECT_1_GUIDE.md     # Hands-on guide for Jack on Friday showing how to build & wire his Logger Dashboard
├── .ai/                        # Workspace context & AI_WORKLOG.md for natural-language dashboard updates
└── docs/
    └── superpowers/
        ├── specs/
        │   └── 2026-10-13-intern-dashboard-design.md
        └── plans/
            └── 2026-10-13-intern-dashboard.md
```

---

## 3. Data Schema (`data/dashboard.json` & `data/jack-feed.json`)

### 3.1 Master Data (`data/dashboard.json`)
- **`feedConfig`**:
  - `status`: `"Ready for Friday (Project #1)"` | `"Connected"`
  - `localFeedPath`: `"./data/jack-feed.json"`
  - `remoteFeedUrl`: `""` (optional URL if Jack hosts his logger dashboard on a separate GitHub Pages repo or endpoint; `app.js` fetches and merges both!)
- **`projects[]`**:
  1. **Project #1 (`build-personal-time-logger`):** *Build & Wire Personal Time-Logger Dashboard* — 4 milestones:
     - `m1`: Design Input UI (Date, Location `Studio 1385` / `Remote / Home`, Hours, Project, Work Summary)
     - `m2`: Structured JSON Feed Output (Emit standardized records matching `jack-feed.json` schema)
     - `m3`: Wire into Master Portal (Connect Jack's Logger output into the Master Dashboard feed)
     - `m4`: End-to-End Live Session Log (Submit & verify first Studio 1385 and Remote entries)
  2. **Track #2 (`studio-onboarding-ai-foundations`):** *Studio Onboarding & AI Tooling Foundations* — 4 milestones covering Mac Studio setup at Studio 1385, Local LLM basics, Prompt Engineering fundamentals, and Spark AI workflow orientation.

### 3.2 Time Log & Feed Entry Schema
Each entry in `dashboard.json -> timeLogs[]` or `jack-feed.json -> entries[]`:
- `id` (`string`): Unique ID (e.g., `"jack-2026-10-16-1"`)
- `date` (`string`, `YYYY-MM-DD`): Session date
- `displayDate` (`string`): Formatted date (e.g., `"Fri, Oct 16, 2026"`)
- `location` (`"Studio 1385"` | `"Remote / Home"`): Explicit work location enum
- `hours` (`number`): Decimal hours worked (e.g., `4.0`)
- `project` (`string`): Project or track worked on
- `summary` (`string`): Description of work accomplished
- `verificationStatus` (`"logged_by_jack"` | `"verified"`): Defaults to `"logged_by_jack"` when coming from Jack's feed; `"verified"` once approved by Mike Miller
- `verifiedBy` (`string`): `"Mike Miller"` when verified, or `"Logged by Jack"` when pending sign-off

---

## 4. UI Components & Visual Design

### 4.1 Visual Theme & Spark Plug Emblem (No Glow)
- **Backgrounds:** Deep onyx `#090d0b` page canvas, elevated `#111814` card surfaces, `#0c120f` inset rows, `#1e2e25` borders.
- **SPARK.AI Spark Plug Emblem (`assets/spark-ai-plug.png`):**
  - Displayed in the top-left header crest (`#111814` flat card, `#1e2e25` border) and subtle hero background watermark (`opacity: 0.06`) with **no glow or drop-shadow (`filter: none`)**.
  - Automatically inverted (`filter: invert(1)`) inside `@media print` for crisp dark ink on white paper.
- **Semantic Badges:**
  - **Studio 1385 / Logged by Jack:** Gold/Amber `#e2ba64`
  - **Remote / Home / Feed Bridge:** Sky Blue `#38bdf8`
  - **Supervisor Verified / Partner Badge:** Emerald `#34d399`

### 4.2 Four KPI Summary Cards
1. **Total Hours Logged:** Cumulative hours + split pills (`🏢 X.Xh Studio 1385` • `🏠 Y.Yh Home`).
2. **Sessions & Location Split:** Total sessions + breakdown (`X In-Studio (1385) • Y Remote / Home`).
3. **Active Projects Progress:** Overall milestone completion % across Project #1 and Track #2.
4. **Verification & Feed Status:** Shows total entries (`X Verified ✓ • Y Logged by Jack`) and feed connection state.

### 4.3 Two-Column Main Grid + Printable Official Report
- **Left Column:** Project #1 card (*Build & Wire Personal Time-Logger Dashboard*), Track #2 card (*Studio Onboarding & AI Tooling Foundations*), and the **Master Time & Location Log** with `All` / `🏢 Studio 1385` / `🏠 Remote / Home` filter pills.
- **Right Column:** **Jack's Logger → Master Feed Bridge** status panel, **Workforce Skills & Competencies** (for Momentum Work Inc.), and **Supervisor Notes & Check-Ins**.
- **Printable Report (`@media print`):** Crisp black-on-white Momentum Work Inc. official timesheet report with Location column, Verification Status column, and Supervisor Signature block.
