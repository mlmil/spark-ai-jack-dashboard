# Spark AI × Momentum Work Inc. — Master Intern Progress & Time Dashboard Design Spec

**Date:** 2026-10-13  
**Project Workspace:** `/Volumes/VADER/Clients/Jack_Intern`  
**Intern:** Jack (AI & Studio Operations Intern)  
**Host Organization:** Spark AI (Studio 1385 • Supervisor: Mike Miller)  
**Workforce Development Partner:** Momentum Work Inc.  
**Start Date:** Friday, October 16, 2026  

---

## 1. Purpose & Voice-First Two-Dashboard Architecture

This repository powers the **Master Public Internship Dashboard** hosted on **GitHub Pages** for **Momentum Work Inc.'s workforce development team**, **Mike Miller (Spark AI)**, and **Jack**.

### The "Speak to LLMs, Don't Type" Two-Dashboard Model
1. **This Portal = The Master Public Dashboard:**
   - Displays Jack's cumulative hours, work location split (**Studio 1385** in-person vs. **Remote / Home**), active Spark AI projects & milestones, workforce readiness skills, supervisor notes, and one-click **Print / Save PDF Report** + **CSV Export**.
2. **Jack's First Hands-On Project (Project #1) = Voice-First Time-Logger Dashboard Powered by DeepSeek API:**
   - Starting Friday, October 16, 2026 at Studio 1385, Jack learns two core Spark AI principles by building his own personal logger dashboard:
     1. **Speak to LLMs instead of typing:** Jack dictates his work summary naturally into his dashboard (whether at **Studio 1385** or **Remote / Home**).
     2. **DeepSeek API Structured JSON Parsing (`deepseek-chat`):** His spoken transcript is sent to the low-cost DeepSeek API (`https://api.deepseek.com/chat/completions` with `response_format: { type: "json_object" }`), which parses his natural speech into strict structured JSON (`date`, `location`, `hours`, `project`, `summary`, `rawTranscript`) and plugs it directly into this Master Dashboard (`data/jack-feed.json`).
   - **Two-Tier Verification:**
     - Voice entries parsed by DeepSeek from Jack's dashboard appear immediately on the Master Dashboard badged **`🎙️ Voice → DeepSeek`** and **`⏳ Logged by Jack`** (`verificationStatus: "logged_by_jack"`).
     - When Mike reviews/approves them, they display **`✓ Verified • M. Miller`** (`verificationStatus: "verified"`).

---

## 2. Architecture & File Layout

The application is a zero-build static web app (`HTML5` + `CSS3` + vanilla `ES2022 JavaScript`) deployed directly from the repository root to GitHub Pages, accompanied by a ready-to-use DeepSeek Voice Parser module (`scripts/deepseek-voice-parser.mjs`).

```text
/Volumes/VADER/Clients/Jack_Intern/
├── index.html                        # Public Master Dashboard shell + print-only official report header/signature block
├── styles.css                        # Spark AI dark-matte & gold theme + @media print official report stylesheet
├── app.js                            # Master data + Jack's DeepSeek feed merger, KPI calculator, location filter, CSV/print
├── assets/
│   └── spark-ai-plug.png             # Custom SPARK.AI heavy white line-art spark plug emblem (no glow)
├── data/
│   ├── dashboard.json                # Master source of truth (intern profile, projects, verified timeLogs, skills, notes)
│   ├── jack-feed.json                # Incoming feed endpoint where Jack's Voice+DeepSeek Logger writes entries
│   └── dashboard-fallback.js         # Auto-synced JS window fallback so opening index.html via file:// works offline
├── scripts/
│   ├── deepseek-voice-parser.mjs     # DeepSeek API client & system prompt that parses spoken transcripts into jack-feed.json
│   └── verify-dashboard.mjs          # Automated schema, feed merge, math, and DOM integrity verification script
├── JACK_PROJECT_1_GUIDE.md           # Hands-on guide for Jack on Friday showing how to wire Voice -> DeepSeek -> Master Portal
├── .ai/                              # Workspace context & AI_WORKLOG.md for natural-language dashboard updates
└── docs/
    └── superpowers/
        ├── specs/
        │   └── 2026-10-13-intern-dashboard-design.md
        └── plans/
            └── 2026-10-13-intern-dashboard.md
```

---

## 3. Data Schema & DeepSeek Voice Parser Contract

### 3.1 DeepSeek API Parser (`scripts/deepseek-voice-parser.mjs`)
- **Endpoint:** `https://api.deepseek.com/chat/completions` (`model: "deepseek-chat"`, `response_format: { type: "json_object" }`)
- **Input:** Natural spoken transcript from Jack (e.g., *"Hey, I worked from home today for an hour and a half wiring the DeepSeek API parser into my logger dashboard"*) + reference date.
- **Output Schema (Appended to `data/jack-feed.json`):**
```json
{
  "id": "jack-voice-2026-10-19",
  "date": "2026-10-19",
  "displayDate": "Mon, Oct 19, 2026",
  "location": "Remote / Home",
  "hours": 1.5,
  "project": "Voice-First Time Logger (Speech → DeepSeek API → Master Portal)",
  "summary": "Wired DeepSeek API JSON parser into personal voice logger and tested voice-to-JSON extraction from home.",
  "rawTranscript": "Worked from home for an hour and a half wiring the DeepSeek API parser into my logger...",
  "inputMethod": "Voice → DeepSeek API",
  "verificationStatus": "logged_by_jack",
  "verifiedBy": "Logged by Jack"
}
```

### 3.2 Master Data (`data/dashboard.json`)
- **`projects[]`**:
  1. **Project #1 (`voice-deepseek-time-logger`):** *Voice-First Time Logger (Speech → DeepSeek API → Master Portal)* — 4 milestones:
     - `m1`: Voice Capture UI ("Speak, Don't Type")
     - `m2`: DeepSeek API Structured JSON Parser (`deepseek-chat` JSON mode)
     - `m3`: Wire DeepSeek Output to Master Portal (`data/jack-feed.json`)
     - `m4`: Live Voice Check-Ins (Studio 1385 & Remote / Home)
  2. **Track #2 (`studio-onboarding-ai-foundations`):** *Studio Onboarding & AI Tooling Foundations* — Mac Studio setup at Studio 1385, Local LLM & API basics, Prompt Engineering, and Spark AI workflow orientation.

---

## 4. UI Components & Visual Design

- **No Glow on Spark Plug Emblem (`assets/spark-ai-plug.png`):** Displayed in top-left header crest (`#111814` flat card, `#1e2e25` border) and subtle hero watermark (`opacity: 0.06`) with `filter: none`, and inverted (`filter: invert(1)`) in `@media print`.
- **Four KPI Cards:** Total Hours Logged (`🏢 Studio 1385` vs `🏠 Home` split), Sessions & Location Split, Active Projects Progress, and Voice → DeepSeek Feed Status (`X Verified ✓ • Y Logged by Jack`).
- **Voice → DeepSeek → Master Pipeline Panel:** Explains the 3-step voice-to-JSON workflow on the right column of the Master Dashboard.
- **Printable Official Report (`@media print`) & CSV Export:** Produces a clean Momentum Work Inc. report with Date, Work Location (`Studio 1385` vs `Remote / Home`), Hours, Project Track, Activities, Verification Status, and Supervisor Signature block.
