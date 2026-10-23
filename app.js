(function () {
  const state = {
    data: window.SPARK_INTERN_DATA || null,
    feed: window.SPARK_JACK_FEED || { entries: [] },
    mode: 'live', // 'live' or 'sample'
    locationFilter: 'all'
  };

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function mergeTimeLogs(masterLogs, feedEntries) {
    const seen = new Set();
    const merged = [];
    for (const item of [...(feedEntries || []), ...(masterLogs || [])]) {
      if (!item || !item.id || seen.has(item.id)) continue;
      seen.add(item.id);
      merged.push(item);
    }
    return merged.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  }

  function getActiveLogs() {
    if (!state.data) return [];
    if (state.mode === 'sample') {
      return mergeTimeLogs(state.data.sampleTimeLogs || [], []);
    }
    return mergeTimeLogs(state.data.timeLogs || [], state.feed?.entries || []);
  }

  function computeMetrics() {
    const logs = getActiveLogs();
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

    const projects = state.data?.projects || [];
    const allMilestones = projects.flatMap((p) => p.milestones || []);
    const completedMilestones = allMilestones.filter((m) =>
      state.mode === 'sample' ? Boolean(m.sampleCompleted ?? m.completed) : Boolean(m.completed)
    ).length;
    const milestonePct = allMilestones.length > 0
      ? Math.round((completedMilestones / allMilestones.length) * 100)
      : 0;

    return {
      logs,
      totalHours: totalHours.toFixed(1),
      studioHours: studioHours.toFixed(1),
      remoteHours: remoteHours.toFixed(1),
      sessionCount: logs.length,
      studioSessions,
      remoteSessions,
      verifiedCount,
      loggedByJackCount,
      milestonePct
    };
  }

  function renderDashboard() {
    if (!state.data) return;
    const m = computeMetrics();
    const isSample = state.mode === 'sample';

    // Mode bar status
    const modeStatusText = document.getElementById('mode-status-text');
    const btnLive = document.getElementById('btn-mode-live');
    const btnSample = document.getElementById('btn-mode-sample');
    if (btnLive && btnSample) {
      btnLive.classList.toggle('active', !isSample);
      btnSample.classList.toggle('active', isSample);
    }
    if (modeStatusText) {
      modeStatusText.textContent = isSample
        ? 'Viewing Sample Wired Preview (shows how Jack\'s Voice → DeepSeek logs & Studio 1385 / Home split appear)'
        : 'Viewing Live Portal State — Internship starts Friday, Oct 16, 2026 at Studio 1385';
    }

    // Feed status badge & Last Commit stamp
    const feedBadge = document.getElementById('feed-status-badge');
    if (feedBadge) {
      feedBadge.textContent = isSample || m.sessionCount > 0
        ? '🎙️ Voice → DeepSeek API Feed: Connected'
        : '🎙️ Voice → DeepSeek API: Ready for Friday';
    }
    const masterLastCommit = document.getElementById('master-last-commit');
    if (masterLastCommit) {
      masterLastCommit.textContent = state.feed?.lastCommitDisplay
        ? `Last Commit from Jack's Logger: ${state.feed.lastCommitDisplay}`
        : '';
    }

    // KPI Cards
    document.getElementById('kpi-total-hours').innerHTML = `${m.totalHours} <span>hrs total</span>`;
    document.getElementById('kpi-hours-breakdown').innerHTML = `
      <span class="loc-pill-mini loc-studio">🏢 ${m.studioHours}h Studio 1385</span>
      <span class="loc-pill-mini loc-home">🏠 ${m.remoteHours}h Home</span>
    `;

    document.getElementById('kpi-sessions').innerHTML = `${m.sessionCount} <span>${m.sessionCount === 1 ? 'session' : 'sessions'}</span>`;
    document.getElementById('kpi-sessions-sub').textContent = m.sessionCount > 0
      ? `${m.studioSessions} In-Studio (1385) • ${m.remoteSessions} Remote / Home`
      : 'First session: Fri, Oct 16 at Studio 1385';

    document.getElementById('kpi-progress').innerHTML = `${m.milestonePct}% <span>overall</span>`;
    document.getElementById('kpi-feed-count').innerHTML = `${m.sessionCount} <span>voice logs</span>`;
    document.getElementById('kpi-feed-sub').textContent = m.sessionCount > 0
      ? `${m.verifiedCount} Verified ✓ • ${m.loggedByJackCount} Logged by Jack`
      : 'Voice → DeepSeek API Ready for Fri, Oct 16';

    // Projects
    const projectsContainer = document.getElementById('projects-container');
    projectsContainer.innerHTML = (state.data.projects || [])
      .map((proj, idx) => {
        const milestones = proj.milestones || [];
        const doneCount = milestones.filter((ms) =>
          isSample ? Boolean(ms.sampleCompleted ?? ms.completed) : Boolean(ms.completed)
        ).length;
        const pct = !isSample && typeof proj.progressPct === 'number'
          ? proj.progressPct
          : (milestones.length > 0 ? Math.round((doneCount / milestones.length) * 100) : 0);
        const barWidth = pct === 0 ? 6 : pct;
        const badgeColors = ['spark-badge-purple', 'spark-badge-gold', 'spark-badge-emerald', 'spark-badge-sky'];
        const badgeClass = badgeColors[idx % badgeColors.length];
        const headerRightBadge = pct === 100
          ? '⭐ 100% Complete 🎈'
          : (pct > 0 ? `${pct}% Complete` : (proj.status || 'Upcoming'));
        const endEmojiHtml = pct === 100
          ? `<span class="progress-bar-end-emoji" title="Project Completed!">⭐🎈</span>`
          : '';

        const milestonesHtml = milestones
          .map((ms, mIdx) => {
            const done = isSample ? Boolean(ms.sampleCompleted ?? ms.completed) : Boolean(ms.completed);
            const statusText = isSample ? (ms.sampleStatus || ms.status) : ms.status;
            const statusBadge = done
              ? `<span class="spark-badge-emerald" style="font-size:10px;">${escapeHtml(statusText)}</span>`
              : `<span style="font-size:11px;color:#8c9b92;">${escapeHtml(statusText)}</span>`;
            return `
              <li class="milestone-item">
                <div class="milestone-left">
                  <span class="check-circle ${done ? 'check-done' : 'check-todo'}">${done ? '✓' : mIdx + 1}</span>
                  <span><strong>${escapeHtml(ms.title)}</strong> — ${escapeHtml(ms.detail)}</span>
                </div>
                ${statusBadge}
              </li>
            `;
          })
          .join('');

        return `
          <section class="panel">
            <div class="panel-header">
              <div>
                <span class="${badgeClass}" style="font-size:10px;padding:2px 8px;">${escapeHtml(proj.badge || 'ACTIVE TRACK')}</span>
                <h2 class="panel-title" style="margin-top:6px;">${escapeHtml(proj.title)}</h2>
              </div>
              <span class="spark-badge-emerald">${escapeHtml(headerRightBadge)}</span>
            </div>
            <p style="font-size:12.5px;color:#9ca8a1;margin:0 0 8px 0;">${escapeHtml(proj.description)}</p>
            <div class="progress-bar-row">
              <div class="progress-bar-track">
                <div class="progress-bar-fill" style="width: ${barWidth}%;"></div>
              </div>
              ${endEmojiHtml}
            </div>
            <ul class="milestone-list">${milestonesHtml}</ul>
          </section>
        `;
      })
      .join('');

    // Filter pills counts
    const pills = document.querySelectorAll('#location-filter-pills .filter-pill');
    pills.forEach((btn) => {
      const f = btn.getAttribute('data-filter');
      btn.classList.toggle('active', f === state.locationFilter);
      if (f === 'all') btn.textContent = `All (${m.sessionCount})`;
      if (f === 'Studio 1385') btn.textContent = `🏢 Studio 1385 (${m.studioSessions})`;
      if (f === 'Remote / Home') btn.textContent = `🏠 Remote / Home (${m.remoteSessions})`;
    });

    // Timesheet rows
    const filteredLogs = m.logs.filter((item) =>
      state.locationFilter === 'all' ? true : item.location === state.locationFilter
    );
    const tableWrapper = document.getElementById('timesheet-table-wrapper');
    const emptyState = document.getElementById('timesheet-empty-state');
    const tbody = document.getElementById('timesheet-body');

    if (m.logs.length === 0) {
      tableWrapper.style.display = 'none';
      emptyState.style.display = 'block';
    } else {
      tableWrapper.style.display = 'block';
      emptyState.style.display = 'none';
      tbody.innerHTML = filteredLogs
        .map((row) => {
          const isStudio = row.location === 'Studio 1385';
          const remoteLabel = row.locationDetail && row.locationDetail !== 'Studio 1385'
            ? row.locationDetail
            : 'Remote / Home';
          const locBadge = isStudio
            ? `<span class="spark-badge-gold" style="font-size:10.5px;">🏢 Studio 1385</span>`
            : `<span class="spark-badge-sky" style="font-size:10.5px;">📍 ${escapeHtml(remoteLabel)}</span>`;
          const hoursColor = isStudio ? '#e2ba64' : '#38bdf8';
          const verifyBadge = row.verificationStatus === 'verified'
            ? `<span class="spark-badge-emerald" style="font-size:10px;">✓ Verified • M. Miller</span>`
            : `<span class="spark-badge-gold" style="font-size:10px;">⏳ Logged by Jack</span>`;
          const catBadge = row.category
            ? `<span class="spark-badge-emerald" style="font-size:9.5px;margin-left:6px;">${escapeHtml(row.category)}</span>`
            : '';
          const transcriptHtml = row.rawTranscript
            ? `<div class="spoken-quote">Spoken: "${escapeHtml(row.rawTranscript)}"</div>`
            : '';

          return `
            <tr>
              <td>
                <strong>${escapeHtml(row.displayDate || row.date)}</strong><br />
                <span class="spark-badge-purple" style="margin-top:4px;">⚡ ${escapeHtml(row.inputMethod || 'Jack Personal Logger')}</span>
              </td>
              <td>${locBadge}</td>
              <td><strong style="color:${hoursColor};">${Number(row.hours).toFixed(1)} hrs</strong></td>
              <td>
                <div><strong>${escapeHtml(row.project)}</strong>${catBadge}</div>
                <div>${escapeHtml(row.summary)}</div>
                ${transcriptHtml}
              </td>
              <td>${verifyBadge}</td>
            </tr>
          `;
        })
        .join('');
    }

    // Skills
    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = (state.data.skills || [])
      .map((sk) => {
        const st = isSample ? (sk.sampleStatus || sk.status) : sk.status;
        const badgeCls = st === 'Practicing' || st === 'Demonstrated' ? 'spark-badge-emerald' : 'spark-badge-gold';
        return `
          <div class="skill-row">
            <span>${escapeHtml(sk.name)}</span>
            <span class="${badgeCls}" style="font-size:10px;">${escapeHtml(st)}</span>
          </div>
        `;
      })
      .join('');

    // Supervisor Notes
    const notesList = document.getElementById('supervisor-notes-list');
    const visibleNotes = (state.data.supervisorNotes || []).filter((n) => (isSample ? true : !n.sampleOnly));
    notesList.innerHTML = visibleNotes
      .map(
        (n) => `
          <div class="note-card">
            <div class="note-meta">${escapeHtml(n.displayDate || n.date)} • ${escapeHtml(n.context)}</div>
            "${escapeHtml(n.text)}"
          </div>
        `
      )
      .join('');

    // Printable Report Sheet
    renderPrintableReport(m, visibleNotes);
  }

  function renderPrintableReport(m, visibleNotes) {
    const metaEl = document.getElementById('print-meta-summary');
    if (metaEl) {
      metaEl.innerHTML = `
        <div><strong>Intern:</strong> ${escapeHtml(state.data.intern.name)} (${escapeHtml(state.data.intern.role)})</div>
        <div><strong>Supervisor:</strong> ${escapeHtml(state.data.intern.supervisor)} (Spark AI • Studio 1385)</div>
        <div><strong>Start Date:</strong> Fri, Oct 16, 2026</div>
        <div><strong>Total Hours:</strong> ${m.totalHours} hrs (${m.studioHours}h Studio 1385 • ${m.remoteHours}h Remote/Home)</div>
      `;
    }

    const printTbody = document.getElementById('print-timesheet-body');
    if (printTbody) {
      if (m.logs.length === 0) {
        printTbody.innerHTML = `
          <tr>
            <td colspan="6">Internship begins Friday, October 16, 2026 at Studio 1385. No hours logged yet.</td>
          </tr>
        `;
      } else {
        printTbody.innerHTML = m.logs
          .map(
            (r) => `
              <tr>
                <td>${escapeHtml(r.displayDate || r.date)}</td>
                <td><strong>${escapeHtml(r.location)}</strong></td>
                <td><strong>${Number(r.hours).toFixed(1)} hrs</strong></td>
                <td>${escapeHtml(r.project)}</td>
                <td>${escapeHtml(r.summary)}</td>
                <td>${r.verificationStatus === 'verified' ? 'Verified • Mike Miller' : 'Logged by Jack (Pending Sign-Off)'}</td>
              </tr>
            `
          )
          .join('');
      }
    }

    const printProjects = document.getElementById('print-projects-summary');
    if (printProjects) {
      printProjects.innerHTML = (state.data.projects || [])
        .map((p) => `<p style="margin: 0 0 6px 0;"><strong>${escapeHtml(p.title)}:</strong> ${escapeHtml(p.description)}</p>`)
        .join('');
    }

    const printNotes = document.getElementById('print-notes-summary');
    if (printNotes) {
      printNotes.innerHTML = visibleNotes
        .map((n) => `<p style="margin: 0 0 6px 0;"><strong>${escapeHtml(n.displayDate || n.date)} (${escapeHtml(n.context)}):</strong> "${escapeHtml(n.text)}"</p>`)
        .join('');
    }
  }

  window.setDashboardMode = function (mode) {
    state.mode = mode === 'sample' ? 'sample' : 'live';
    renderDashboard();
  };

  window.setLocationFilter = function (loc) {
    state.locationFilter = loc;
    renderDashboard();
  };

  window.exportTimesheetCsv = function () {
    const logs = getActiveLogs();
    const headers = ['Date', 'Location', 'Hours', 'Project', 'Summary', 'InputMethod', 'VerificationStatus', 'VerifiedBy'];
    const rows = logs.map((r) => [
      r.date,
      r.location,
      Number(r.hours).toFixed(1),
      r.project,
      r.summary,
      r.inputMethod || 'Voice → DeepSeek API',
      r.verificationStatus || 'logged_by_jack',
      r.verifiedBy || 'Logged by Jack'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jack-spark-ai-timesheet-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  async function refreshLiveFeed() {
    const feedUrls = [
      '/api/feed',
      'https://spark-ai-jack-dashboard.vercel.app/api/feed',
      `./data/jack-feed.json?t=${Date.now()}`
    ];

    for (const url of feedUrls) {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json && Array.isArray(json.entries)) {
            state.feed = json;
            renderDashboard();
            return;
          }
        }
      } catch (_e) {
        // Try next feed URL
      }
    }
  }

  async function init() {
    try {
      const dashRes = await fetch('./data/dashboard.json', { cache: 'no-store' });
      if (dashRes.ok) state.data = await dashRes.json();
      await refreshLiveFeed();
    } catch (_err) {
      // Offline / file:// protocol fallback already loaded via window.SPARK_INTERN_DATA
    }
    renderDashboard();

    // Auto-refresh live feed every 8 seconds and whenever tab gains focus
    setInterval(refreshLiveFeed, 8000);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) refreshLiveFeed();
    });
    window.addEventListener('focus', refreshLiveFeed);
  }

  init();
})();
