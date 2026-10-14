import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const VALID_LOCATIONS = new Set(['Studio 1385', 'Remote / Home']);
const VALID_VERIFICATION = new Set(['logged_by_jack', 'verified']);

export function mergeTimeLogs(masterLogs = [], feedEntries = []) {
  const seen = new Set();
  const merged = [];
  for (const item of [...feedEntries, ...masterLogs]) {
    if (!item || !item.id || seen.has(item.id)) continue;
    seen.add(item.id);
    merged.push(item);
  }
  return merged.sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

export function validateDashboardData(data, feed = { entries: [] }) {
  const errors = [];
  if (!data || typeof data !== 'object') {
    return ['Dashboard data must be a JSON object'];
  }
  if (!data.intern?.name) errors.push('Missing intern.name');
  if (!data.intern?.startDate) errors.push('Missing intern.startDate');
  if (!Array.isArray(data.projects) || data.projects.length === 0) {
    errors.push('projects must be a non-empty array');
  }
  if (!feed || !Array.isArray(feed.entries)) {
    errors.push('jack-feed.json must have an entries array');
  }

  const listsToCheck = [
    ['timeLogs', data.timeLogs],
    ['sampleTimeLogs', data.sampleTimeLogs],
    ['jack-feed.entries', feed?.entries || []]
  ];

  for (const [listName, list] of listsToCheck) {
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
      if (entry.verificationStatus && !VALID_VERIFICATION.has(entry.verificationStatus)) {
        errors.push(`Invalid verificationStatus "${entry.verificationStatus}" in ${listName} (${entry.id})`);
      }
    }
  }
  return errors;
}

export function computeMetrics(data, feed = { entries: [] }, useSample = false) {
  const logs = useSample
    ? mergeTimeLogs(data.sampleTimeLogs || [], [])
    : mergeTimeLogs(data.timeLogs || [], feed?.entries || []);

  let totalHours = 0;
  let studioHours = 0;
  let remoteHours = 0;
  let studioSessions = 0;
  let remoteSessions = 0;
  let verifiedCount = 0;
  let loggedByJackCount = 0;

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
    if (item.verificationStatus === 'verified') {
      verifiedCount += 1;
    } else {
      loggedByJackCount += 1;
    }
  }

  const allMilestones = (data.projects || []).flatMap((p) => p.milestones || []);
  const completedMilestones = allMilestones.filter((m) =>
    useSample ? Boolean(m.sampleCompleted ?? m.completed) : Boolean(m.completed)
  ).length;
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
    verifiedCount,
    loggedByJackCount,
    milestonePct
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const jsonPath = path.join(rootDir, 'data/dashboard.json');
  const feedPath = path.join(rootDir, 'data/jack-feed.json');
  const fallbackPath = path.join(rootDir, 'data/dashboard-fallback.js');

  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const feed = JSON.parse(fs.readFileSync(feedPath, 'utf8'));
  const errors = validateDashboardData(data, feed);
  if (errors.length > 0) {
    console.error('Validation errors:', errors);
    process.exit(1);
  }
  const fallbackJs = `// Auto-generated from data/dashboard.json and data/jack-feed.json\nwindow.SPARK_INTERN_DATA = ${JSON.stringify(data, null, 2)};\nwindow.SPARK_JACK_FEED = ${JSON.stringify(feed, null, 2)};\n`;
  fs.writeFileSync(fallbackPath, fallbackJs, 'utf8');
  console.log('✓ dashboard.json & jack-feed.json validated and data/dashboard-fallback.js synced.');
}
