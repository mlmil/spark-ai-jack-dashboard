import crypto from 'node:crypto';
import { createSessionToken, verifySessionToken, extractBearerToken } from './_auth-helper.js';

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    const token = extractBearerToken(req);
    const session = verifySessionToken(token);
    if (!session) {
      return res.status(401).json({ authenticated: false });
    }
    return res.status(200).json({ authenticated: true, email: session.email });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const submittedEmail = String(body.email || '').trim().toLowerCase();
    const submittedPassword = String(body.password || '');

    const expectedEmail = String(process.env.JACK_AUTH_EMAIL || '').trim().toLowerCase();
    const expectedPassword = String(process.env.JACK_AUTH_PASSWORD || '');

    if (!expectedEmail || !expectedPassword) {
      return res.status(500).json({ error: 'Server authentication credentials are not configured.' });
    }

    const emailMatch = safeEqual(submittedEmail, expectedEmail);
    const passMatch = safeEqual(submittedPassword, expectedPassword);

    if (!emailMatch || !passMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = createSessionToken(expectedEmail);
    return res.status(200).json({
      ok: true,
      email: expectedEmail,
      token
    });
  } catch (err) {
    return res.status(500).json({ error: 'Authentication error' });
  }
}
