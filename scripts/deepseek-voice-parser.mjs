import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

export const VOICE_PARSER_SYSTEM_PROMPT = `You are the Spark AI Voice-to-Dashboard Parser for intern Jack at Studio 1385.
Your job is to take Jack's spoken voice note (dictated from his phone or workstation) and extract a single strict JSON object representing his work session.

Rules:
1. "location" MUST be exactly one of:
   - "Studio 1385" (if he mentions being in the studio, Studio 1385, in-person, or with Mike at the office)
   - "Remote / Home" (if he mentions working from home, remote, on his phone at home, etc.)
2. "hours" MUST be a positive number (e.g., 1.5, 3, 4.0). Convert phrases like "an hour and a half" to 1.5.
3. "date" MUST be in YYYY-MM-DD format (use the provided referenceDate if he says "today").
4. "project" should match one of Jack's active Spark AI projects:
   - "YCE Inc. — On-Premise LLM Mac Mini Deployment & Training"
   - "Right at Home Healthcare — Phase 2 Admin AI & Marketing Enablement"
   - "Precision Automotive — AI-Powered Website Build"
   - "Voice-First Time Logger (Speech → DeepSeek API → Master Portal)"
5. "summary" MUST be a clean, professional 1-2 sentence summary suitable for his workforce development coordinator at Momentum Work Inc.

Return ONLY valid JSON with keys:
{
  "date": "YYYY-MM-DD",
  "location": "Studio 1385" | "Remote / Home",
  "hours": number,
  "project": "string",
  "summary": "string"
}`;

export function buildDeepSeekPayload(transcript, { referenceDate = new Date().toISOString().slice(0, 10) } = {}) {
  return {
    model: 'deepseek-chat',
    temperature: 0.1,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: VOICE_PARSER_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Reference Date: ${referenceDate}\nSpoken Transcript from Jack: "${transcript}"`
      }
    ]
  };
}

export function formatDisplayDate(isoDate) {
  const [y, m, d] = String(isoDate).split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  return dt.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  });
}

export function normalizeDeepSeekEntry(parsed, rawTranscript = '') {
  const location = parsed.location === 'Studio 1385' ? 'Studio 1385' : 'Remote / Home';
  const hours = Number(Number(parsed.hours || 1).toFixed(1));
  const date = parsed.date || new Date().toISOString().slice(0, 10);

  return {
    id: parsed.id || `jack-voice-${date}-${Date.now().toString().slice(-4)}`,
    date,
    displayDate: parsed.displayDate || formatDisplayDate(date),
    sessionLabel: 'Via Jack\'s Voice Logger',
    location,
    hours,
    project: parsed.project || 'Voice-First Time Logger (Speech → DeepSeek API → Master Portal)',
    summary: String(parsed.summary || '').trim(),
    rawTranscript: String(rawTranscript || parsed.rawTranscript || '').trim(),
    inputMethod: 'Voice → DeepSeek API',
    verificationStatus: parsed.verificationStatus || 'logged_by_jack',
    verifiedBy: parsed.verificationStatus === 'verified' ? 'Mike Miller' : 'Logged by Jack'
  };
}

export async function parseVoiceTranscriptWithDeepSeek(transcript, { apiKey = process.env.DEEPSEEK_API_KEY, referenceDate } = {}) {
  if (!apiKey) {
    throw new Error('Missing DEEPSEEK_API_KEY environment variable');
  }
  const payload = buildDeepSeekPayload(transcript, { referenceDate });
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`DeepSeek API error (${response.status}): ${errText}`);
  }

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content || '{}';
  const parsed = JSON.parse(content);
  return normalizeDeepSeekEntry(parsed, transcript);
}

// CLI usage: node scripts/deepseek-voice-parser.mjs "Worked from home for 2 hours..."
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const transcript = process.argv.slice(2).join(' ').trim();
  if (!transcript) {
    console.log('Usage: DEEPSEEK_API_KEY=sk-... node scripts/deepseek-voice-parser.mjs "<spoken transcript>"');
    process.exit(0);
  }
  const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const feedPath = path.join(rootDir, 'data/jack-feed.json');
  const entry = await parseVoiceTranscriptWithDeepSeek(transcript);
  const feed = JSON.parse(fs.readFileSync(feedPath, 'utf8'));
  feed.entries.unshift(entry);
  feed.lastSynced = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(feedPath, JSON.stringify(feed, null, 2) + '\n', 'utf8');
  console.log('✓ Appended voice entry to data/jack-feed.json:', entry);
}
