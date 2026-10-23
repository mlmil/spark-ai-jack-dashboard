import fs from 'node:fs';
import path from 'node:path';

const GITHUB_REPO = process.env.GITHUB_REPO || 'mlmil/spark-ai-jack-dashboard';
const GITHUB_FILE_PATH = 'data/jack-feed.json';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.GITHUB_TOKEN;

  if (token) {
    try {
      const ghRes = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}?ref=main`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
          },
          cache: 'no-store'
        }
      );

      if (ghRes.ok) {
        const meta = await ghRes.json();
        const contentStr = Buffer.from(meta.content, 'base64').toString('utf8');
        const parsed = JSON.parse(contentStr);
        return res.status(200).json(parsed);
      }
    } catch (_err) {
      // Fall back to local file read below
    }
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'jack-feed.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    return res.status(200).json(JSON.parse(raw));
  } catch (err) {
    return res.status(200).json({
      feedName: "Jack's Voice → DeepSeek Logger Feed",
      lastSynced: new Date().toISOString().slice(0, 10),
      entries: []
    });
  }
}
