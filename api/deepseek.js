export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const message = String(body.message || '').trim();
    const feedSummary = body.feedSummary || {};

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const baseUrl = (process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').replace(/\/$/, '');
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

    if (!apiKey) {
      return res.status(200).json({
        ok: true,
        mode: 'local_fallback',
        reply:
          `I'm online in Local Preview Mode (ready for Mike's DEEPSEEK_API_KEY)! ` +
          `Right now you have ${feedSummary.totalHours || '0.0'} total hrs logged ` +
          `(${feedSummary.studioHours || '0.0'}h at Studio 1385 • ${feedSummary.remoteHours || '0.0'}h Off-Site) ` +
          `across ${feedSummary.sessionCount || 0} sessions. Active tracks: General Spark AI / R&D, Personal Time-Logger, YCE Inc. (Mac Mini LLM), Right at Home Healthcare (Phase 2), and Precision Automotive (AI Website).`
      });
    }

    const systemPrompt = `You are the Spark AI DeepSeek Internship Assistant for Jack (AI Deployment & Technical Operations Intern at Spark AI, Studio 1385, supervised by Mike Miller, partnered with Momentum Work Inc.).
Keep answers concise, friendly, and practical for mobile and studio use.
Current logged metrics:
- Total Hours: ${feedSummary.totalHours || '0.0'} hrs (${feedSummary.studioHours || '0.0'}h Studio 1385, ${feedSummary.remoteHours || '0.0'}h Off-Site/Remote)
- Total Sessions: ${feedSummary.sessionCount || 0}
Active Spark AI Projects:
1. General Spark AI / R&D
2. Personal Time-Logger Dashboard (Functional Build -> Voice Input -> DeepSeek API)
3. YCE Inc. — On-Premise LLM Mac Mini Deployment & Client Training
4. Right at Home Healthcare — Phase 2 Admin AI & Marketing Enablement (Owner: Phil)
5. Precision Automotive — AI-Powered Website Build`;

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(200).json({
        ok: true,
        mode: 'error_fallback',
        reply: `DeepSeek API returned ${response.status}. Local summary: ${feedSummary.totalHours || '0.0'} hrs logged.`
      });
    }

    const payload = await response.json();
    const reply = payload?.choices?.[0]?.message?.content || 'No response from DeepSeek.';
    return res.status(200).json({
      ok: true,
      mode: 'deepseek_live',
      reply
    });
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'DeepSeek assistant error' });
  }
}
