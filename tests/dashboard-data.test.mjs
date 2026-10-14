import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  validateDashboardData,
  mergeTimeLogs,
  computeMetrics
} from '../scripts/verify-dashboard.mjs';
import {
  buildDeepSeekPayload,
  normalizeDeepSeekEntry
} from '../scripts/deepseek-voice-parser.mjs';

const rootDir = path.resolve(import.meta.dirname, '..');

test('dashboard.json and jack-feed.json validate cleanly with Friday Oct 16, 2026 start date', () => {
  const data = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/dashboard.json'), 'utf8'));
  const feed = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/jack-feed.json'), 'utf8'));

  const errors = validateDashboardData(data, feed);
  assert.deepEqual(errors, []);
  assert.equal(data.intern.name, 'Jack');
  assert.equal(data.intern.startDate, '2026-10-16');
  assert.equal(data.intern.partnerOrganization, 'Momentum Work Inc.');
  assert.equal(data.projects[0].id, 'voice-deepseek-time-logger');
});

test('mergeTimeLogs and computeMetrics handle launch state and sample wired state accurately', () => {
  const data = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/dashboard.json'), 'utf8'));
  const feed = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/jack-feed.json'), 'utf8'));

  const launchMetrics = computeMetrics(data, feed, false);
  assert.equal(launchMetrics.totalHours, 0);
  assert.equal(launchMetrics.studioHours, 0);
  assert.equal(launchMetrics.remoteHours, 0);
  assert.equal(launchMetrics.sessionCount, 0);

  const sampleMetrics = computeMetrics(data, feed, true);
  assert.equal(sampleMetrics.totalHours, 5.5);
  assert.equal(sampleMetrics.studioHours, 4.0);
  assert.equal(sampleMetrics.remoteHours, 1.5);
  assert.equal(sampleMetrics.sessionCount, 2);
  assert.equal(sampleMetrics.studioSessions, 1);
  assert.equal(sampleMetrics.remoteSessions, 1);
  assert.equal(sampleMetrics.verifiedCount, 1);
  assert.equal(sampleMetrics.loggedByJackCount, 1);

  const mergedSample = mergeTimeLogs(data.sampleTimeLogs, []);
  assert.equal(mergedSample.length, 2);
});

test('deepseek-voice-parser builds deepseek-chat JSON payload and normalizes spoken transcripts', () => {
  const transcript = 'Hey, I worked from home on my phone today for an hour and a half wiring the DeepSeek API parser into my logger.';
  const payload = buildDeepSeekPayload(transcript, { referenceDate: '2026-10-19' });

  assert.equal(payload.model, 'deepseek-chat');
  assert.deepEqual(payload.response_format, { type: 'json_object' });
  assert.equal(Array.isArray(payload.messages), true);
  assert.match(payload.messages[0].content, /Studio 1385/);
  assert.match(payload.messages[0].content, /Remote \/ Home/);

  const entry = normalizeDeepSeekEntry(
    {
      date: '2026-10-19',
      location: 'Remote / Home',
      hours: 1.5,
      project: 'Voice-First Time Logger (Speech → DeepSeek API → Master Portal)',
      summary: 'Wired DeepSeek API JSON parser into personal voice logger from home.'
    },
    transcript
  );

  assert.equal(entry.location, 'Remote / Home');
  assert.equal(entry.hours, 1.5);
  assert.equal(entry.inputMethod, 'Voice → DeepSeek API');
  assert.equal(entry.verificationStatus, 'logged_by_jack');
  assert.equal(entry.verifiedBy, 'Logged by Jack');
  assert.equal(entry.rawTranscript, transcript);
});
