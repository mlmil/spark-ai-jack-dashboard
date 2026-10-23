import fs from 'node:fs';
import path from 'node:path';
import { verifySessionToken, extractBearerToken } from './_auth-helper.js';

const GITHUB_REPO = process.env.GITHUB_REPO || 'mlmil/spark-ai-jack-dashboard';
const GITHUB_FILE_PATH = 'data/jack-feed.json';

function formatDisplayDate(isoDate) {
  try {
    const [y, m, d] = String(isoDate).split('-').map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1);
    return dt.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return isoDate;
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authSession = verifySessionToken(extractBearerToken(req));
  if (!authSession) {
    return res.status(401).json({ error: 'Unauthorized. Please sign in with your Spark AI credentials.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const project = String(body.project || 'General Spark AI / R&D').trim();
    const category = String(body.category || 'General Spark AI / R&D').trim();
    const location = body.location === 'Studio 1385' ? 'Studio 1385' : 'Remote / Home';
    const locationDetail = location === 'Studio 1385'
      ? 'Studio 1385'
      : String(body.locationDetail || 'Home').trim();
    const hoursNum = Number(body.hours);
    if (!Number.isFinite(hoursNum) || hoursNum <= 0 || hoursNum > 24) {
      return res.status(400).json({ error: 'Hours must be between 0.5 and 24.' });
    }
    const date = /^\d{4}-\d{2}-\d{2}$/.test(String(body.date || ''))
      ? String(body.date)
      : new Date().toISOString().slice(0, 10);
    const summary = String(body.summary || '').trim();
    if (!summary) {
      return res.status(400).json({ error: 'Please enter a short description of what you worked on.' });
    }

    const commitTimestamp = String(body.commitTimestamp || new Date().toISOString());
    const commitDisplay = String(body.commitDisplay || '');

    const newEntry = {
      id: `jack-log-${Date.now()}`,
      date,
      displayDate: formatDisplayDate(date),
      location,
      locationDetail,
      hours: Number(hoursNum.toFixed(1)),
      project,
      category,
      summary,
      inputMethod: body.inputMethod || 'Jack Personal Logger',
      verificationStatus: 'logged_by_jack',
      verifiedBy: 'Logged by Jack',
      committedAt: commitTimestamp,
      commitDisplay
    };

    const token = process.env.GITHUB_TOKEN;
    let currentFeed = {
      feedName: "Jack's Voice → DeepSeek Logger Feed",
      lastSynced: date,
      lastCommitAt: commitTimestamp,
      lastCommitDisplay: commitDisplay,
      entries: []
    };
    let githubSha = null;

    if (token) {
      const ghGet = await fetch(
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

      if (ghGet.ok) {
        const meta = await ghGet.json();
        githubSha = meta.sha;
        const rawContent = Buffer.from(meta.content, 'base64').toString('utf8');
        currentFeed = JSON.parse(rawContent);
      }
    } else {
      try {
        const localPath = path.join(process.cwd(), 'data', 'jack-feed.json');
        currentFeed = JSON.parse(fs.readFileSync(localPath, 'utf8'));
      } catch (_e) {
        // Use default feed object
      }
    }

    currentFeed.lastSynced = date;
    currentFeed.lastCommitAt = commitTimestamp;
    currentFeed.lastCommitDisplay = commitDisplay;
    currentFeed.entries = [newEntry, ...(currentFeed.entries || [])];

    const updatedJsonString = JSON.stringify(currentFeed, null, 2) + '\n';
    let committedToGitHub = false;

    if (token && githubSha) {
      const ghPut = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `Log ${newEntry.hours}h for Jack on ${newEntry.project} (${newEntry.locationDetail})`,
            content: Buffer.from(updatedJsonString, 'utf8').toString('base64'),
            sha: githubSha,
            branch: 'main'
          })
        }
      );
      committedToGitHub = ghPut.ok;
    }

    // Also write to local disk if writable (e.g. local dev server)
    try {
      const localPath = path.join(process.cwd(), 'data', 'jack-feed.json');
      fs.writeFileSync(localPath, updatedJsonString, 'utf8');
    } catch (_writeErr) {
      // Read-only serverless filesystem on Vercel is expected
    }

    return res.status(200).json({
      ok: true,
      committedToGitHub,
      entry: newEntry,
      feed: currentFeed
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message || 'Failed to log session'
    });
  }
}
