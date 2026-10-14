# Welcome to Spark AI, Jack! — Project #1 Starter Guide
## Build Your Voice-First Time Logger (Phone / Studio Speech → DeepSeek API → Master Dashboard)

Welcome to **Studio 1385**! At Spark AI, one of our core principles is **speaking to Large Language Models rather than typing**.

Instead of filling out tedious timesheet text boxes by hand, your very first hands-on project is to build your own **mobile-friendly Voice Time-Logger Dashboard** and wire it directly into the **Master Internship Portal** (`index.html` in this repository) that Mike and your team at **Momentum Work Inc.** view.

---

## 1. How Your Pipeline Works

1. **Speak From Your Phone or Studio 1385 Workstation:**
   - You tap the microphone on your logger dashboard (using iOS/Android voice dictation or Web Speech API) and speak naturally:
     > *"Hey, I worked from home today for an hour and a half testing prompt engineering and wiring the DeepSeek API into my logger."*
     or
     > *"I was in Studio 1385 today for four hours with Mike setting up the Mac workstation."*
2. **DeepSeek API (`deepseek-chat` JSON Mode) Parses Your Speech:**
   - Your spoken transcript is sent to the **DeepSeek API** (`https://api.deepseek.com/chat/completions`), which turns your voice note into a structured JSON object.
   - Check out [`scripts/deepseek-voice-parser.mjs`](./scripts/deepseek-voice-parser.mjs) — it already has the exact system prompt and API request built for you!
3. **Plugs Into the Master Dashboard (`data/jack-feed.json`):**
   - Your parsed entry is added to `data/jack-feed.json` (or fetched from your hosted logger's `remoteFeedUrl`).
   - It immediately appears on the **Master Dashboard** badged **`🎙️ Voice → DeepSeek`** and **`⏳ Logged by Jack`**, and upgrades to **`✓ Verified • M. Miller`** once Mike signs off on it.

---

## 2. Exact JSON Schema Your Logger Must Produce

Every entry in [`data/jack-feed.json`](./data/jack-feed.json) under `"entries"` must follow this structure:

```json
{
  "id": "jack-voice-2026-10-16-001",
  "date": "2026-10-16",
  "displayDate": "Fri, Oct 16, 2026",
  "sessionLabel": "Via Jack's Voice Logger",
  "location": "Studio 1385",
  "hours": 4.0,
  "project": "Voice-First Time Logger (Speech → DeepSeek API → Master Portal)",
  "summary": "In-person onboarding at Studio 1385: Mac workstation setup and started building the Voice + DeepSeek Time Logger.",
  "rawTranscript": "I was in Studio 1385 today for four hours with Mike setting up the Mac workstation...",
  "inputMethod": "Voice → DeepSeek API",
  "verificationStatus": "logged_by_jack",
  "verifiedBy": "Logged by Jack"
}
```

### Important Field Rules:
- **`location`** MUST be either `"Studio 1385"` (in-person) or `"Remote / Home"` (working from home).
- **`hours`** MUST be a positive number (e.g., `1.5`, `3.0`, `4.0`).
- **`verificationStatus`** starts as `"logged_by_jack"` and becomes `"verified"` when Mike approves it.

---

## 3. Quick CLI Test (Try It on Friday!)

Once Mike gives you your `DEEPSEEK_API_KEY`, you can test the voice parser right from the terminal:

```bash
DEEPSEEK_API_KEY=sk-your-key node scripts/deepseek-voice-parser.mjs \
  "I worked at Studio 1385 today for 3.5 hours learning how dashboards work and testing DeepSeek JSON parsing."

# Sync the offline fallback & verify everything passes:
node scripts/verify-dashboard.mjs
node --test tests/dashboard-data.test.mjs
```
