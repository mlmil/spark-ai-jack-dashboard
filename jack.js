(function () {
  const LAST_ENTRY_STORAGE_KEY = 'spark_jack_last_entry_v1';
  const AUTH_TOKEN_STORAGE_KEY = 'spark_jack_auth_token_v1';

  const state = {
    feed: {
      feedName: "Jack's Voice → DeepSeek Logger Feed",
      lastSynced: '',
      lastCommitAt: '',
      lastCommitDisplay: '',
      entries: []
    },
    currentLoc: 'Studio 1385',
    viewportMode: window.innerWidth <= 768 ? 'mobile' : 'desktop',
    activeMobileTab: 'log',
    authToken: ''
  };

  function getStoredAuthToken() {
    try {
      return (
        localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ||
        sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ||
        ''
      );
    } catch (_e) {
      return '';
    }
  }

  function saveAuthToken(token, remember) {
    state.authToken = token;
    try {
      if (remember) {
        localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
      } else {
        sessionStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
      }
    } catch (_e) {
      // ignore storage errors
    }
  }

  function clearAuthToken() {
    state.authToken = '';
    try {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    } catch (_e) {
      // ignore
    }
  }

  function unlockDashboardUI() {
    const gate = document.getElementById('auth-gate');
    const shell = document.getElementById('jack-shell');
    const previewBar = document.getElementById('desktop-preview-bar');
    if (gate) gate.style.display = 'none';
    if (shell) shell.style.display = 'block';
    if (previewBar && window.innerWidth > 768) {
      previewBar.style.display = 'flex';
    }
  }

  function lockDashboardUI() {
    const gate = document.getElementById('auth-gate');
    const shell = document.getElementById('jack-shell');
    const previewBar = document.getElementById('desktop-preview-bar');
    if (gate) gate.style.display = 'flex';
    if (shell) shell.style.display = 'none';
    if (previewBar) previewBar.style.display = 'none';
  }

  window.togglePasswordVisibility = function () {
    const pw = document.getElementById('auth-password');
    const btn = document.getElementById('pw-toggle-btn');
    if (!pw || !btn) return;
    if (pw.type === 'password') {
      pw.type = 'text';
      btn.textContent = 'Hide';
    } else {
      pw.type = 'password';
      btn.textContent = 'Show';
    }
  };

  window.submitSignIn = async function () {
    const emailEl = document.getElementById('auth-email');
    const passEl = document.getElementById('auth-password');
    const rememberEl = document.getElementById('auth-remember');
    const errBox = document.getElementById('auth-error-box');
    const btn = document.getElementById('btn-auth-submit');

    const email = (emailEl?.value || '').trim();
    const password = passEl?.value || '';
    const remember = Boolean(rememberEl?.checked);

    if (errBox) errBox.style.display = 'none';
    if (btn) {
      btn.disabled = true;
      btn.textContent = '⏳ Verifying Credentials...';
    }

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok || !data.ok || !data.token) {
        if (errBox) {
          errBox.textContent = data.error || 'Invalid email or password.';
          errBox.style.display = 'block';
        }
        return;
      }

      saveAuthToken(data.token, remember);
      if (passEl) passEl.value = '';
      unlockDashboardUI();
    } catch (_err) {
      if (errBox) {
        errBox.textContent = 'Unable to reach authentication server. Please try again.';
        errBox.style.display = 'block';
      }
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = '🔒 Sign In to Time Logger';
      }
    }
  };

  window.signOutLogger = function () {
    clearAuthToken();
    lockDashboardUI();
  };

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function todayIso() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function formatCommitTimestamp(dateObj) {
    const dateStr = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const shortDateStr = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    const timeStr = dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
    return {
      full: `${dateStr} • ${timeStr}`,
      short: `${shortDateStr} • ${timeStr}`
    };
  }

  function computeSummary() {
    const entries = state.feed?.entries || [];
    let studioHrs = 0;
    let remoteHrs = 0;
    for (const item of entries) {
      const h = Number(item.hours) || 0;
      if (item.location === 'Studio 1385') {
        studioHrs += h;
      } else {
        remoteHrs += h;
      }
    }
    const totalHrs = studioHrs + remoteHrs;
    return {
      entries,
      studioHours: studioHrs.toFixed(1),
      remoteHours: remoteHrs.toFixed(1),
      totalHours: totalHrs.toFixed(1),
      sessionCount: entries.length
    };
  }

  function renderUI() {
    const s = computeSummary();

    const totalEl = document.getElementById('jack-total-hrs');
    if (totalEl) totalEl.innerHTML = `${s.totalHours} <span>hrs</span>`;

    const studioEl = document.getElementById('jack-studio-hrs');
    if (studioEl) studioEl.textContent = `🏢 ${s.studioHours}h`;

    const remoteEl = document.getElementById('jack-remote-hrs');
    if (remoteEl) remoteEl.textContent = `📍 ${s.remoteHours}h`;

    const countEl = document.getElementById('jack-entry-count');
    if (countEl) countEl.innerHTML = `${s.sessionCount} <span>${s.sessionCount === 1 ? 'log' : 'logs'}</span>`;

    const mtabHist = document.getElementById('mtab-history');
    if (mtabHist) mtabHist.textContent = `📋 History (${s.sessionCount})`;

    const topCommitEl = document.getElementById('last-commit-top');
    const kpiCommitEl = document.getElementById('jack-last-commit-kpi');
    if (state.feed.lastCommitDisplay) {
      if (topCommitEl) topCommitEl.textContent = `Last Commit: ${state.feed.lastCommitDisplay}`;
      if (kpiCommitEl) {
        // Shorten year for KPI card if present
        kpiCommitEl.textContent = state.feed.lastCommitDisplay.replace(/,\s*\d{4}/, '');
      }
    } else if (s.entries.length > 0 && s.entries[0].commitDisplay) {
      if (topCommitEl) topCommitEl.textContent = `Last Commit: ${s.entries[0].commitDisplay}`;
      if (kpiCommitEl) kpiCommitEl.textContent = s.entries[0].commitDisplay.replace(/,\s*\d{4}/, '');
    }

    const emptyEl = document.getElementById('history-empty');
    const tableWrap = document.getElementById('history-table-wrap');
    const tbody = document.getElementById('jack-log-tbody');

    if (s.entries.length === 0) {
      if (emptyEl) emptyEl.style.display = 'block';
      if (tableWrap) tableWrap.style.display = 'none';
    } else {
      if (emptyEl) emptyEl.style.display = 'none';
      if (tableWrap) tableWrap.style.display = 'block';
      if (tbody) {
        tbody.innerHTML = s.entries
          .map((row) => {
            const isStudio = row.location === 'Studio 1385';
            const detail = isStudio ? '1385' : (row.locationDetail || 'Remote');
            const locBadge = isStudio
              ? `<span class="spark-badge-gold" style="font-size:9.5px;">🏢 ${escapeHtml(detail)}</span>`
              : `<span class="spark-badge-sky" style="font-size:9.5px;">📍 ${escapeHtml(detail)}</span>`;
            const catBadge = row.category
              ? `<span class="spark-badge-emerald" style="font-size:9px;margin-left:4px;">${escapeHtml(row.category)}</span>`
              : '';
            const shortProj = String(row.project || '').split('—')[0].trim();
            return `
              <tr>
                <td><strong>${escapeHtml(row.displayDate || row.date)}</strong></td>
                <td>${locBadge}</td>
                <td><strong style="color:${isStudio ? '#e2ba64' : '#38bdf8'};">${Number(row.hours).toFixed(1)}h</strong></td>
                <td><strong>${escapeHtml(shortProj)}</strong> ${catBadge} — ${escapeHtml(row.summary)}</td>
              </tr>
            `;
          })
          .join('');
      }
    }
  }

  function restoreLastEntryToForm() {
    let saved = null;
    try {
      const raw = localStorage.getItem(LAST_ENTRY_STORAGE_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch (_e) {
      // ignore storage errors
    }

    if (!saved && state.feed?.entries?.length > 0) {
      saved = state.feed.entries[0];
    }

    const dateInput = document.getElementById('input-date');
    if (dateInput && !dateInput.value) {
      dateInput.value = todayIso();
    }

    if (!saved) return;

    const projSelect = document.getElementById('input-project');
    if (projSelect && saved.project) {
      for (let i = 0; i < projSelect.options.length; i++) {
        if (projSelect.options[i].value === saved.project) {
          projSelect.selectedIndex = i;
          break;
        }
      }
      window.onProjectChange();
    }

    const catSelect = document.getElementById('input-category');
    if (catSelect && saved.category) {
      for (let i = 0; i < catSelect.options.length; i++) {
        if (catSelect.options[i].value === saved.category) {
          catSelect.selectedIndex = i;
          break;
        }
      }
    }

    if (saved.location) {
      window.selectLocation(saved.location);
    }
    if (saved.locationDetail && document.getElementById('input-location-detail')) {
      document.getElementById('input-location-detail').value = saved.locationDetail;
    }
    if (saved.hours && document.getElementById('input-hours')) {
      document.getElementById('input-hours').value = Number(saved.hours).toFixed(1);
    }
    if (saved.date && document.getElementById('input-date')) {
      document.getElementById('input-date').value = saved.date;
    }
    if (saved.summary && document.getElementById('input-summary')) {
      document.getElementById('input-summary').value = saved.summary;
    }
  }

  window.onProjectChange = function () {
    const sel = document.getElementById('input-project');
    const kpiProj = document.getElementById('jack-current-proj');
    if (sel && kpiProj) {
      kpiProj.textContent = sel.options[sel.selectedIndex].text.split('—')[0].trim();
    }
  };

  window.selectLocation = function (loc) {
    state.currentLoc = loc === 'Studio 1385' ? 'Studio 1385' : 'Remote / Home';
    const btnStudio = document.getElementById('btn-loc-studio');
    const btnRemote = document.getElementById('btn-loc-remote');
    const detailBox = document.getElementById('remote-detail-box');
    if (state.currentLoc === 'Studio 1385') {
      btnStudio.className = 'loc-btn active-studio';
      btnStudio.children[1].textContent = '✓';
      btnRemote.className = 'loc-btn';
      btnRemote.children[1].textContent = '';
      detailBox.style.display = 'none';
    } else {
      btnStudio.className = 'loc-btn';
      btnStudio.children[1].textContent = '';
      btnRemote.className = 'loc-btn active-remote';
      btnRemote.children[1].textContent = '✓';
      detailBox.style.display = 'block';
    }
  };

  window.setLocDetail = function (val, chipEl) {
    const inp = document.getElementById('input-location-detail');
    if (inp) inp.value = val;
    if (chipEl && chipEl.parentElement) {
      chipEl.parentElement.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
      chipEl.classList.add('active');
    }
  };

  window.clearLoggerForm = function () {
    const projSelect = document.getElementById('input-project');
    const catSelect = document.getElementById('input-category');
    if (projSelect) projSelect.selectedIndex = 0;
    if (catSelect) catSelect.selectedIndex = 0;
    window.onProjectChange();
    window.selectLocation('Studio 1385');
    document.getElementById('input-hours').value = '1.0';
    document.getElementById('input-date').value = todayIso();
    const sum = document.getElementById('input-summary');
    sum.value = '';
    sum.placeholder = 'Ready for a fresh session — describe what you worked on...';
    sum.focus();
  };

  window.setViewportMode = function (mode) {
    state.viewportMode = mode;
    const shell = document.getElementById('jack-shell');
    const btnMob = document.getElementById('vp-mobile-btn');
    const btnDesk = document.getElementById('vp-desktop-btn');
    if (btnMob) btnMob.classList.toggle('active', mode === 'mobile');
    if (btnDesk) btnDesk.classList.toggle('active', mode === 'desktop');

    if (mode === 'mobile') {
      shell.classList.add('android-sim-frame');
      window.switchMobileTab(state.activeMobileTab || 'log');
    } else {
      shell.classList.remove('android-sim-frame');
      document.getElementById('panel-logger').style.display = 'block';
      document.getElementById('panel-history').style.display = 'block';
      document.getElementById('panel-ai').style.display = 'block';
    }
  };

  window.switchMobileTab = function (tab) {
    state.activeMobileTab = tab;
    const isMobileActive = window.innerWidth <= 768 || state.viewportMode === 'mobile';
    if (!isMobileActive) return;

    document.getElementById('mtab-log').classList.toggle('active', tab === 'log');
    document.getElementById('mtab-ai').classList.toggle('active', tab === 'ai');
    document.getElementById('mtab-history').classList.toggle('active', tab === 'history');

    document.getElementById('panel-logger').style.display = tab === 'log' ? 'block' : 'none';
    document.getElementById('panel-ai').style.display = tab === 'ai' ? 'block' : 'none';
    document.getElementById('panel-history').style.display = tab === 'history' ? 'block' : 'none';
  };

  window.submitSession = async function () {
    const btn = document.getElementById('btn-submit-session');
    const project = document.getElementById('input-project').value;
    const category = document.getElementById('input-category').value;
    const hours = parseFloat(document.getElementById('input-hours').value) || 1.0;
    const date = document.getElementById('input-date').value || todayIso();
    const summary = document.getElementById('input-summary').value.trim();
    const locationDetail = state.currentLoc === 'Studio 1385'
      ? 'Studio 1385'
      : (document.getElementById('input-location-detail').value.trim() || 'Home');

    if (!summary) {
      alert('Please enter a short description in "5. What Did You Do?" before logging.');
      document.getElementById('input-summary').focus();
      return;
    }

    const now = new Date();
    const stamp = formatCommitTimestamp(now);

    const payload = {
      project,
      category,
      location: state.currentLoc,
      locationDetail,
      hours,
      date,
      summary,
      inputMethod: 'Jack Personal Logger',
      commitTimestamp: now.toISOString(),
      commitDisplay: stamp.full
    };

    // Save last entry locally so form retains it until Clear Form is pressed
    try {
      localStorage.setItem(LAST_ENTRY_STORAGE_KEY, JSON.stringify(payload));
    } catch (_e) {
      // ignore
    }

    const origText = btn.textContent;
    btn.disabled = true;
    btn.textContent = '⏳ Committing to Master Dashboard...';

    try {
      const res = await fetch('/api/log-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.authToken || getStoredAuthToken()}`
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 401) {
        clearAuthToken();
        lockDashboardUI();
        return;
      }

      if (res.ok) {
        const data = await res.json();
        if (data.feed) {
          state.feed = data.feed;
        }
      } else {
        throw new Error('Failed to log session');
      }
    } catch (_err) {
      alert('Could not reach the server to commit your session. Please check your connection and try again.');
      return;
    } finally {
      btn.disabled = false;
      btn.textContent = origText;
    }

    renderUI();

    const toast = document.getElementById('submit-toast');
    if (toast) {
      toast.textContent = `✓ Committed to Master Dashboard (${stamp.short})! Last entry kept in form.`;
      toast.style.display = 'block';
      setTimeout(() => {
        toast.style.display = 'none';
      }, 4500);
    }
  };

  window.sendQuickPrompt = function (text) {
    const inp = document.getElementById('chat-input');
    if (inp) {
      inp.value = text;
      window.sendChatMessage();
    }
  };

  window.sendChatMessage = async function () {
    const inp = document.getElementById('chat-input');
    const box = document.getElementById('chat-box');
    const message = (inp?.value || '').trim();
    if (!message || !box) return;

    box.innerHTML += `<div class="chat-msg user">${escapeHtml(message)}</div>`;
    inp.value = '';
    box.scrollTop = box.scrollHeight;

    const summary = computeSummary();

    try {
      const res = await fetch('/api/deepseek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.authToken || getStoredAuthToken()}`
        },
        body: JSON.stringify({
          message,
          feedSummary: summary
        })
      });
      if (res.status === 401) {
        clearAuthToken();
        lockDashboardUI();
        return;
      }
      if (res.ok) {
        const data = await res.json();
        box.innerHTML += `<div class="chat-msg assistant"><strong style="color:#c084fc;">DeepSeek:</strong> ${escapeHtml(data.reply)}</div>`;
      } else {
        throw new Error('Offline');
      }
    } catch (_err) {
      box.innerHTML += `<div class="chat-msg assistant"><strong style="color:#c084fc;">DeepSeek:</strong> You currently have <strong>${summary.totalHours} hrs</strong> logged (${summary.studioHours}h Studio 1385 • ${summary.remoteHours}h Off-Site) across ${summary.sessionCount} sessions.</div>`;
    }
    box.scrollTop = box.scrollHeight;
  };

  async function init() {
    const dateInput = document.getElementById('input-date');
    if (dateInput) dateInput.value = todayIso();

    // Check stored session token
    const storedToken = getStoredAuthToken();
    if (storedToken) {
      try {
        const authRes = await fetch('/api/auth', {
          method: 'GET',
          headers: { Authorization: `Bearer ${storedToken}` },
          cache: 'no-store'
        });
        if (authRes.ok) {
          state.authToken = storedToken;
          unlockDashboardUI();
        } else {
          clearAuthToken();
          lockDashboardUI();
        }
      } catch (_e) {
        lockDashboardUI();
      }
    } else {
      lockDashboardUI();
    }

    try {
      // Try live Vercel GitHub API feed first, then static json fallback
      let loaded = false;
      try {
        const apiRes = await fetch('/api/feed', { cache: 'no-store' });
        if (apiRes.ok) {
          state.feed = await apiRes.json();
          loaded = true;
        }
      } catch (_e) {
        // ignore
      }
      if (!loaded) {
        const staticRes = await fetch('./data/jack-feed.json', { cache: 'no-store' });
        if (staticRes.ok) {
          state.feed = await staticRes.json();
        }
      }
    } catch (_err) {
      // keep default state.feed
    }

    restoreLastEntryToForm();
    renderUI();

    if (window.innerWidth <= 768) {
      window.switchMobileTab('log');
    }
  }

  init();
})();
