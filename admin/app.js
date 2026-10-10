// Pixò Master Fleet Commander - Standalone Admin Logic
const MASTER_KEY = "pixo_master_2026";

const MQTT_CONFIG = {
  brokerUrl: "wss://e58d8ef9b4cb45b9b8250157f6c5b7c2.s1.eu.hivemq.cloud:8884/mqtt",
  user: "dslump",
  pass: "projectLavagna!"
};

// State
let mqttClient = null;
let devices = {}; // { [id]: { id, status, lastSeen, ip, ssid, signal, fwVer, freeHeap, uptime_s, otaStatus, pin, lightState } }
let totalMsgCount = 0;
let currentFilter = 'all';
let searchQuery = '';

// DOM Elements
const authOverlay = document.getElementById('authOverlay');
const masterKeyInput = document.getElementById('masterKeyInput');
const btnUnlock = document.getElementById('btnUnlock');
const authError = document.getElementById('authError');
const rememberAuth = document.getElementById('rememberAuth');
const adminApp = document.getElementById('adminApp');

const cloudStatusBadge = document.getElementById('cloudStatusBadge');
const cloudStatusText = document.getElementById('cloudStatusText');
const btnRefresh = document.getElementById('btnRefresh');
const btnLogout = document.getElementById('btnLogout');

const statTotal = document.getElementById('statTotal');
const statOnline = document.getElementById('statOnline');
const statOffline = document.getElementById('statOffline');
const statMsgCount = document.getElementById('statMsgCount');

const globalOtaUrl = document.getElementById('globalOtaUrl');
const btnGlobalOta = document.getElementById('btnGlobalOta');
const btnCheckFw = document.getElementById('btnCheckFw');
const latestFwBadge = document.getElementById('latestFwBadge');
const otaTargetCount = document.getElementById('otaTargetCount');
const otaHelperText = document.getElementById('otaHelperText');
const btnGlobalStandby = document.getElementById('btnGlobalStandby');
const btnGlobalClock = document.getElementById('btnGlobalClock');

// Informazioni ultima release GitHub
let latestRelease = {
  tag: '1.1.1',
  rawTag: 'v1.1.1',
  binUrl: 'https://github.com/xxxdslumpxxx/pixo/releases/download/v1.1.1/firmware.bin',
  publishedAt: null
};

const searchInput = document.getElementById('searchInput');
const filterPills = document.querySelectorAll('.filter-pill');
const devicesGrid = document.getElementById('devicesGrid');
const emptyFleetState = document.getElementById('emptyFleetState');
const countAll = document.getElementById('countAll');
const countOnline = document.getElementById('countOnline');
const countOffline = document.getElementById('countOffline');

const logsToggleTitle = document.getElementById('logsToggleTitle');
const logsToggleIcon = document.getElementById('logsToggleIcon');
const liveLogsContainer = document.getElementById('liveLogsContainer');
const btnClearLogs = document.getElementById('btnClearLogs');
const chkAutoScroll = document.getElementById('chkAutoScroll');
const toastContainer = document.getElementById('toastContainer');

// --- PWA SERVICE WORKER REGISTRATION & INSTALL PROMPT ---
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator.standalone === true);
const btnInstallApp = document.getElementById('btnInstallApp');
const btnInstallAuth = document.getElementById('btnInstallAuth');
const installModal = document.getElementById('installModal');
const btnCloseInstallModal = document.getElementById('btnCloseInstallModal');
const btnDismissInstallModal = document.getElementById('btnDismissInstallModal');

function updateInstallButtons() {
  if (isStandalone) {
    if (btnInstallApp) btnInstallApp.style.display = 'none';
    if (btnInstallAuth) btnInstallAuth.style.display = 'none';
  } else {
    if (btnInstallApp) btnInstallApp.style.display = 'inline-flex';
    if (btnInstallAuth) btnInstallAuth.style.display = 'block';
  }
}
updateInstallButtons();

let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  updateInstallButtons();
});

const triggerInstall = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      if (btnInstallApp) btnInstallApp.style.display = 'none';
      if (btnInstallAuth) btnInstallAuth.style.display = 'none';
      showToast('App Commander installata con successo!', 'success');
    }
    deferredPrompt = null;
  } else {
    // Guida interattiva per l'installazione manuale su Android o iOS
    if (installModal) installModal.classList.remove('hidden');
  }
};

if (btnInstallApp) btnInstallApp.onclick = triggerInstall;
if (btnInstallAuth) btnInstallAuth.onclick = triggerInstall;
if (btnCloseInstallModal) btnCloseInstallModal.onclick = () => installModal.classList.add('hidden');
if (btnDismissInstallModal) btnDismissInstallModal.onclick = () => installModal.classList.add('hidden');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js?v=20', { scope: './' })
      .then(reg => {
        console.log('[Commander SW] Registrato con successo:', reg.scope);
        reg.update();
      })
      .catch(err => console.warn('[Commander SW] Errore registrazione:', err));
  });
}

// --- AUTHENTICATION ---
function checkAuth() {
  const isSessionUnlocked = sessionStorage.getItem('pixo_admin_unlocked') === 'true';
  const isPersistentUnlocked = localStorage.getItem('pixo_admin_persistent_unlocked') === 'true';
  
  if (isSessionUnlocked || isPersistentUnlocked) {
    unlockConsole();
  } else {
    lockConsole();
  }
}

function unlockConsole() {
  authOverlay.classList.add('hidden');
  adminApp.classList.remove('hidden');
  loadSavedData();
  connectMQTT();
  checkLatestGitHubRelease(true);
}

function lockConsole() {
  authOverlay.classList.remove('hidden');
  adminApp.classList.add('hidden');
  if (mqttClient) {
    mqttClient.end(true);
    mqttClient = null;
  }
}

btnUnlock.addEventListener('click', () => {
  const entered = masterKeyInput.value.trim();
  if (entered === MASTER_KEY) {
    authError.classList.add('hidden');
    sessionStorage.setItem('pixo_admin_unlocked', 'true');
    if (rememberAuth.checked) {
      localStorage.setItem('pixo_admin_persistent_unlocked', 'true');
    }
    unlockConsole();
  } else {
    authError.classList.remove('hidden');
    masterKeyInput.select();
  }
});

masterKeyInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') btnUnlock.click();
});

btnLogout.addEventListener('click', () => {
  if (confirm("Vuoi uscire dalla console amministratore?")) {
    sessionStorage.removeItem('pixo_admin_unlocked');
    localStorage.removeItem('pixo_admin_persistent_unlocked');
    lockConsole();
  }
});

// --- PERSISTENZA E CACHE ---
function loadSavedData() {
  try {
    const cached = localStorage.getItem('pixo_admin_fleet_cache');
    if (cached) {
      devices = JSON.parse(cached);
    }
  } catch(e) {
    devices = {};
  }

  try {
    const pins = JSON.parse(localStorage.getItem('pixo_admin_device_pins') || '{}');
    Object.keys(pins).forEach(id => {
      if (devices[id]) devices[id].pin = pins[id];
      else devices[id] = { id: id, pin: pins[id], status: 'offline', lastSeen: 0 };
    });
  } catch(e) {}

  renderDashboard();
}

function saveFleetCache() {
  try {
    localStorage.setItem('pixo_admin_fleet_cache', JSON.stringify(devices));
  } catch(e) {}
}

function saveDevicePin(deviceId, pin) {
  try {
    const pins = JSON.parse(localStorage.getItem('pixo_admin_device_pins') || '{}');
    pins[deviceId] = pin;
    localStorage.setItem('pixo_admin_device_pins', JSON.stringify(pins));
    if (devices[deviceId]) devices[deviceId].pin = pin;
    showToast(`PIN salvato per [${deviceId}]`, 'success');
  } catch(e) {}
}

function getDevicePin(deviceId) {
  if (devices[deviceId] && devices[deviceId].pin) return devices[deviceId].pin;
  const pins = JSON.parse(localStorage.getItem('pixo_admin_device_pins') || '{}');
  if (pins[deviceId]) return pins[deviceId];
  const userPin = localStorage.getItem('pixo_device_pin');
  if (userPin) return userPin;
  return '1234';
}

// --- MQTT CONNECTION ---
function connectMQTT() {
  if (mqttClient && mqttClient.connected) return;

  setCloudStatus('connecting', 'Connessione Cloud...');

  const clientId = `pixo_admin_${Math.random().toString(16).substring(2, 8)}`;
  mqttClient = mqtt.connect(MQTT_CONFIG.brokerUrl, {
    clientId: clientId,
    username: MQTT_CONFIG.user,
    password: MQTT_CONFIG.pass,
    clean: true,
    connectTimeout: 7000,
    reconnectPeriod: 3000,
    keepalive: 15
  });

  mqttClient.on('connect', () => {
    setCloudStatus('connected', 'Cloud Connesso (TLS)');
    showToast('Connessione MQTT Cloud stabilita', 'success');

    // Sottoscrizione flotta
    mqttClient.subscribe('pixo/device/+/status', { qos: 0 });
    mqttClient.subscribe('pixo/device/+/wifi', { qos: 0 });
    mqttClient.subscribe('pixo/device/+/diag', { qos: 0 });
    mqttClient.subscribe('pixo/device/+/ota/status', { qos: 0 });

    addLog('SYSTEM', 'Sottoscritto a tutta la flotta Pixò.');
  });

  mqttClient.on('message', (topic, payload) => {
    handleIncomingMessage(topic, payload);
  });

  mqttClient.on('error', (err) => {
    console.error('MQTT Error:', err);
    setCloudStatus('disconnected', 'Errore Cloud');
  });

  mqttClient.on('offline', () => {
    setCloudStatus('disconnected', 'Disconnesso');
  });
}

function setCloudStatus(state, text) {
  cloudStatusBadge.className = `status-badge ${state}`;
  cloudStatusText.textContent = text;
}

// --- DISPATCHER MESSAGGI ---
function handleIncomingMessage(topic, payload) {
  totalMsgCount++;
  statMsgCount.textContent = totalMsgCount;

  const parts = topic.split('/');
  if (parts.length < 4 || parts[0] !== 'pixo' || parts[1] !== 'device') return;

  const devId = parts[2].toUpperCase();
  const sub = parts.slice(3).join('/');

  const textPayload = new TextDecoder().decode(payload).trim();
  addLog(topic, textPayload);

  if (!devices[devId]) {
    const pins = JSON.parse(localStorage.getItem('pixo_admin_device_pins') || '{}');
    devices[devId] = {
      id: devId,
      status: 'online',
      lastSeen: Date.now(),
      ip: '',
      ssid: '',
      signal: 0,
      fwVer: '1.0.1',
      freeHeap: 0,
      uptime_s: 0,
      otaStatus: 'ready',
      pin: pins[devId] || '',
      lightState: false
    };
  }

  const dev = devices[devId];
  dev.lastSeen = Date.now();

  try {
    if (sub === 'status') {
      dev.status = textPayload.toLowerCase();
    } else if (sub === 'wifi') {
      if (textPayload.startsWith('{')) {
        const data = JSON.parse(textPayload);
        if (data.ssid) dev.ssid = data.ssid;
        if (data.ip) dev.ip = data.ip;
        if (typeof data.signal === 'number') dev.signal = data.signal;
        if (data.status === 'online') dev.status = 'online';
      }
    } else if (sub === 'diag') {
      if (textPayload.startsWith('{')) {
        const data = JSON.parse(textPayload);
        if (data.fw_ver) dev.fwVer = data.fw_ver;
        if (data.free_heap) dev.freeHeap = data.free_heap;
        if (data.uptime_s) dev.uptime_s = data.uptime_s;
        dev.status = 'online';
      }
    } else if (sub === 'ota/status') {
      if (textPayload.startsWith('{')) {
        const data = JSON.parse(textPayload);
        if (data.status) dev.otaStatus = data.status;
        if (data.version) dev.fwVer = data.version;
      }
    }
  } catch(e) {
    console.warn('Errore parsing payload:', e);
  }

  saveFleetCache();
  scheduleRender();
}

let renderDebounceTimer = null;
function scheduleRender() {
  if (renderDebounceTimer) return;
  renderDebounceTimer = setTimeout(() => {
    renderDebounceTimer = null;
    renderDashboard();
  }, 250);
}

// Heartbeat check ogni 5s
setInterval(() => {
  const now = Date.now();
  let changed = false;
  Object.values(devices).forEach(dev => {
    if (dev.status === 'online' && (now - dev.lastSeen) > 35000) {
      dev.status = 'offline';
      changed = true;
    }
  });
  if (changed) {
    renderDashboard();
    saveFleetCache();
  }
}, 5000);

// --- RENDERING DASHBOARD ---
function renderDashboard() {
  const allList = Object.values(devices);
  const now = Date.now();

  let onlineCount = 0;
  let offlineCount = 0;

  allList.forEach(d => {
    if (d.status === 'online' && (now - (d.lastSeen || 0)) <= 35000) {
      onlineCount++;
    } else {
      offlineCount++;
    }
  });

  // Calcolo dispositivi online che necessitano di aggiornamento
  const targetTag = (latestRelease.tag || '').replace(/^v/, '');
  const outdatedOnline = allList.filter(d => {
    const isOnline = (d.status === 'online' && (now - (d.lastSeen || 0)) <= 35000);
    const dVer = (d.fwVer || '').replace(/^v/, '');
    return isOnline && targetTag && dVer !== targetTag;
  });

  if (otaTargetCount) {
    otaTargetCount.textContent = outdatedOnline.length;
  }
  if (otaHelperText) {
    if (outdatedOnline.length > 0) {
      const devNames = outdatedOnline.map(d => `${d.id} (v${d.fwVer || '?'})`).join(', ');
      otaHelperText.innerHTML = `⚠️ <strong style="color:var(--accent-orange);">${outdatedOnline.length} dispositivo/i online</strong> da aggiornare a v${targetTag}: <code>${devNames}</code>`;
    } else if (onlineCount > 0) {
      otaHelperText.innerHTML = `✅ Tutti i <strong>${onlineCount}</strong> dispositivi online sono già aggiornati all'ultima versione (v${targetTag}).`;
    } else {
      otaHelperText.innerHTML = `Nessun dispositivo attualmente online. Ultima versione disponibile: <strong>v${targetTag}</strong>.`;
    }
  }

  statTotal.textContent = allList.length;
  statOnline.textContent = onlineCount;
  statOffline.textContent = offlineCount;
  countAll.textContent = allList.length;
  countOnline.textContent = onlineCount;
  countOffline.textContent = offlineCount;

  let filtered = allList.filter(d => {
    const isOnline = (d.status === 'online' && (now - (d.lastSeen || 0)) <= 35000);
    if (currentFilter === 'online' && !isOnline) return false;
    if (currentFilter === 'offline' && isOnline) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = (d.id || '').toLowerCase().includes(q);
      const matchIp = (d.ip || '').toLowerCase().includes(q);
      const matchSsid = (d.ssid || '').toLowerCase().includes(q);
      if (!matchId && !matchIp && !matchSsid) return false;
    }
    return true;
  });

  filtered.sort((a, b) => {
    const aOn = (a.status === 'online' && (now - (a.lastSeen || 0)) <= 35000);
    const bOn = (b.status === 'online' && (now - (b.lastSeen || 0)) <= 35000);
    if (aOn && !bOn) return -1;
    if (bOn && !aOn) return 1;
    return (b.lastSeen || 0) - (a.lastSeen || 0);
  });

  if (filtered.length === 0) {
    devicesGrid.innerHTML = '';
    emptyFleetState.classList.remove('hidden');
    return;
  }

  emptyFleetState.classList.add('hidden');
  devicesGrid.innerHTML = '';

  filtered.forEach(dev => {
    const isOnline = (dev.status === 'online' && (now - (dev.lastSeen || 0)) <= 35000);
    const uptimeMin = Math.round((dev.uptime_s || 0) / 60);
    const uptimeStr = uptimeMin > 60 ? `${Math.floor(uptimeMin/60)}h ${uptimeMin%60}m` : `${uptimeMin} min`;
    const heapKb = Math.round((dev.freeHeap || 0) / 1024);
    const lastSeenSec = dev.lastSeen ? Math.round((now - dev.lastSeen) / 1000) : null;
    const lastSeenStr = lastSeenSec !== null ? `${lastSeenSec}s fa` : 'Mai';
    const isLightOn = !!dev.lightState;

    const card = document.createElement('div');
    card.className = `device-card ${isOnline ? 'is-online' : 'is-offline'}`;

    card.innerHTML = `
      <div class="card-top">
        <div class="device-id-title">
          <span class="device-id-text">${escapeHtml(dev.id)}</span>
        </div>
        <span class="status-pill ${isOnline ? 'online' : 'offline'}">${isOnline ? 'ONLINE' : 'OFFLINE'}</span>
      </div>

      <div class="telemetry-grid">
        <div class="telemetry-item">
          <span class="telem-label">Firmware</span>
          <span class="telem-val">v${escapeHtml(dev.fwVer || '1.0.1')}</span>
        </div>
        <div class="telemetry-item">
          <span class="telem-label">Wi-Fi (Segnale)</span>
          <span class="telem-val">${dev.ssid ? escapeHtml(dev.ssid) + ' (' + (dev.signal || 0) + '%)' : 'N/D'}</span>
        </div>
        <div class="telemetry-item">
          <span class="telem-label">IP Locale</span>
          <span class="telem-val">${dev.ip ? escapeHtml(dev.ip) : 'N/D'}</span>
        </div>
        <div class="telemetry-item">
          <span class="telem-label">RAM Libera (Heap)</span>
          <span class="telem-val">${heapKb > 0 ? heapKb + ' KB' : 'N/D'}</span>
        </div>
        <div class="telemetry-item">
          <span class="telem-label">Uptime</span>
          <span class="telem-val">${uptimeMin > 0 ? uptimeStr : 'N/D'}</span>
        </div>
        <div class="telemetry-item">
          <span class="telem-label">Ultimo Segnale</span>
          <span class="telem-val">${lastSeenStr}</span>
        </div>
      </div>

      <!-- Configurazione PIN del Dispositivo -->
      <div class="pin-config-row">
        <span class="pin-label">PIN Dispositivo:</span>
        <input type="text" class="pin-input" id="pin_${dev.id}" value="${escapeHtml(dev.pin || '')}" placeholder="es. 1234">
        <button class="btn secondary mini" onclick="handleSavePin('${dev.id}')">Salva</button>
      </div>

      <!-- Griglia Comandi su questo Pixò -->
      <div class="card-actions-grid">
        <button class="btn secondary mini" onclick="sendDeviceStandby('${dev.id}')">✨ Standby</button>
        <button class="btn secondary mini" onclick="sendDeviceClock('${dev.id}')">🕒 Orologio</button>
        <button class="btn danger mini" onclick="sendDeviceOta('${dev.id}')">🚀 Aggiorna OTA</button>
      </div>

      <div class="card-bottom-link">
        <span>Stato OTA: <strong>${escapeHtml(dev.otaStatus || 'ready')}</strong></span>
        <a href="../?device=${encodeURIComponent(dev.id)}" target="_blank" rel="noopener">Apri WebApp Pixò ↗</a>
      </div>
    `;

    devicesGrid.appendChild(card);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// --- AZIONI DISPOSITIVO ---

window.handleSavePin = function(deviceId) {
  const input = document.getElementById(`pin_${deviceId}`);
  if (!input) return;
  const pin = input.value.trim();
  saveDevicePin(deviceId, pin);
};

// 1. STANDBY (CLEAR)
window.sendDeviceStandby = function(deviceId) {
  if (!mqttClient || !mqttClient.connected) {
    showToast('MQTT Cloud non connesso!', 'error');
    return;
  }
  const pin = getDevicePin(deviceId);

  // Invia a topic con PIN
  if (pin && pin.length > 0) {
    mqttClient.publish(`pixo/device/${deviceId}/${pin}/draw`, 'CLEAR', { qos: 0 });
  }
  if (pin !== '1234') {
    mqttClient.publish(`pixo/device/${deviceId}/1234/draw`, 'CLEAR', { qos: 0 });
  }
  mqttClient.publish(`pixo/device/${deviceId}/draw`, 'CLEAR', { qos: 0 });

  showToast(`Standby inviato a ${deviceId}`, 'success');
  addLog('OUTBOUND', `Inviato CLEAR a [${deviceId}] (PIN: '${pin}')`);
};

// 2. OROLOGIO (CLOCK)
window.sendDeviceClock = function(deviceId) {
  if (!mqttClient || !mqttClient.connected) {
    showToast('MQTT Cloud non connesso!', 'error');
    return;
  }
  const pin = getDevicePin(deviceId);

  if (pin && pin.length > 0) {
    mqttClient.publish(`pixo/device/${deviceId}/${pin}/draw`, 'CLOCK', { qos: 0 });
  }
  if (pin !== '1234') {
    mqttClient.publish(`pixo/device/${deviceId}/1234/draw`, 'CLOCK', { qos: 0 });
  }
  mqttClient.publish(`pixo/device/${deviceId}/draw`, 'CLOCK', { qos: 0 });

  showToast(`Orologio inviato a ${deviceId}`, 'success');
  addLog('OUTBOUND', `Inviato CLOCK a [${deviceId}]`);
};

// 5. OTA SINGOLO DISPOSITIVO
window.sendDeviceOta = function(deviceId) {
  const pin = getDevicePin(deviceId);
  const defaultUrl = globalOtaUrl.value.trim() || "https://raw.githubusercontent.com/xxxdslumpxxx/pixo/main/firmware/Lavagna_ESP32C3.ino.bin";
  const url = prompt(`🚀 Inserisci l'URL del pacchetto firmware (.bin) per Pixò [${deviceId}]:`, defaultUrl);
  if (!url) return;

  if (!mqttClient || !mqttClient.connected) {
    showToast('MQTT Cloud non connesso!', 'error');
    return;
  }

  const payload = JSON.stringify({
    url: url.trim(),
    version: "single_ota",
    pin: pin || "1234",
    master_pin: MASTER_KEY
  });

  if (pin && pin.length > 0) {
    mqttClient.publish(`pixo/device/${deviceId}/${pin}/ota`, payload, { qos: 0 });
  }
  mqttClient.publish(`pixo/device/${deviceId}/ota`, payload, { qos: 0 });

  showToast(`Comando OTA inviato a ${deviceId}!`, 'success');
  addLog('OUTBOUND', `Inviato comando OTA a [${deviceId}] (URL: ${url})`);
};

// --- CONTROLLO RELEASE GITHUB & GESTIONE VERSIONI ---
async function checkLatestGitHubRelease(silent = false) {
  if (latestFwBadge) {
    latestFwBadge.textContent = 'Controllo FW...';
    latestFwBadge.className = 'badge info';
  }

  try {
    const res = await fetch('https://api.github.com/repos/xxxdslumpxxx/pixo/releases/latest', {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const rawTag = data.tag_name || 'v1.1.1';
    const cleanTag = rawTag.replace(/^v/, '');

    let binUrl = '';
    if (data.assets && Array.isArray(data.assets)) {
      const binAsset = data.assets.find(a => a.name && a.name.endsWith('.bin'));
      if (binAsset && binAsset.browser_download_url) {
        binUrl = binAsset.browser_download_url;
      }
    }
    if (!binUrl) {
      binUrl = `https://github.com/xxxdslumpxxx/pixo/releases/download/${rawTag}/firmware.bin`;
    }

    latestRelease = {
      tag: cleanTag,
      rawTag: rawTag,
      binUrl: binUrl,
      publishedAt: data.published_at
    };

    if (globalOtaUrl) {
      globalOtaUrl.value = binUrl;
    }
    if (latestFwBadge) {
      latestFwBadge.textContent = `Disp: v${cleanTag}`;
      latestFwBadge.className = 'badge success';
      latestFwBadge.title = `Release ${rawTag} rilasciata il ${new Date(data.published_at).toLocaleString()}`;
    }

    if (!silent) {
      showToast(`Ultimo firmware disponibile: v${cleanTag}`, 'info');
    }
    scheduleRender();
  } catch (err) {
    console.warn('[GITHUB] Impossibile verificare ultima release:', err);
    if (latestFwBadge) {
      latestFwBadge.textContent = `Disp: v${latestRelease.tag}`;
      latestFwBadge.className = 'badge warning';
    }
    if (!silent) {
      showToast(`Controllo GitHub fallito, uso v${latestRelease.tag}`, 'warning');
    }
  }
}

if (btnCheckFw) {
  btnCheckFw.addEventListener('click', () => {
    checkLatestGitHubRelease(false);
  });
}

// --- AZIONI GLOBALI FLOTTA ---

btnGlobalOta.addEventListener('click', () => {
  const url = globalOtaUrl.value.trim();
  if (!url) {
    alert("Inserisci l'URL completo del file firmware .bin.");
    return;
  }

  if (!mqttClient || !mqttClient.connected) {
    showToast('MQTT Cloud non connesso!', 'error');
    return;
  }

  const now = Date.now();
  const allList = Object.values(devices);
  const targetTag = (latestRelease.tag || '1.1.1').replace(/^v/, '');

  // Trova tutti i dispositivi ONLINE che NON hanno installata la nuova versione
  const outdatedOnline = allList.filter(d => {
    const isOnline = (d.status === 'online' && (now - (d.lastSeen || 0)) <= 35000);
    const dVer = (d.fwVer || '').replace(/^v/, '');
    return isOnline && dVer !== targetTag;
  });

  const allOnline = allList.filter(d => (d.status === 'online' && (now - (d.lastSeen || 0)) <= 35000));

  if (allOnline.length === 0) {
    alert("⚠️ Nessun Pixò risulta attualmente ONLINE!\n\nAttendi che i dispositivi si colleghino prima di avviare l'aggiornamento.");
    return;
  }

  let confirmMsg = "";
  if (outdatedOnline.length > 0) {
    const devDetails = outdatedOnline.map(d => `• ${d.id} (versione attuale: v${d.fwVer || 'ignota'} -> nuova: v${targetTag})`).join('\n');
    confirmMsg = `🚀 AGGIORNAMENTO FLOTTA A v${targetTag}\n\n` +
                 `Trovati ${outdatedOnline.length} dispositivo/i online da aggiornare:\n` +
                 `${devDetails}\n\n` +
                 `Firmware binary:\n${url}\n\n` +
                 `I dispositivi già aggiornati a v${targetTag} verranno preservati.\n` +
                 `Confermi l'avvio dell'aggiornamento OTA?`;
  } else {
    confirmMsg = `ℹ️ Tutti i ${allOnline.length} dispositivi online risultano GIÀ AGGIORNATI all'ultima versione (v${targetTag})!\n\n` +
                 `Vuoi forzare comunque una reinstallazione globale su tutta la flotta?\n\n` +
                 `URL: ${url}`;
  }

  const ok = confirm(confirmMsg);
  if (!ok) return;

  const targetDevices = (outdatedOnline.length > 0) ? outdatedOnline : allOnline;

  // 1. Invio mirato su ciascun dispositivo obsoleto (garantisce PIN e ricezione)
  targetDevices.forEach(d => {
    const devPin = getDevicePin(d.id);
    const devPayload = JSON.stringify({
      url: url,
      version: targetTag,
      pin: devPin || "1234",
      master_pin: MASTER_KEY
    });

    if (devPin && devPin.length > 0) {
      mqttClient.publish(`pixo/device/${d.id}/${devPin}/ota`, devPayload, { qos: 0 });
    }
    mqttClient.publish(`pixo/device/${d.id}/ota`, devPayload, { qos: 0 });
    addLog('OUTBOUND', `OTA inviato a [${d.id}] (v${d.fwVer} -> v${targetTag})`);
  });

  // 2. Invio broadcast su pixo/global/ota con Master PIN
  const globalPayload = JSON.stringify({
    url: url,
    version: targetTag,
    pin: MASTER_KEY,
    master_pin: MASTER_KEY
  });
  mqttClient.publish("pixo/global/ota", globalPayload, { qos: 0 });
  addLog('OUTBOUND', `BROADCAST MASTER OTA inviato su 'pixo/global/ota' (target v${targetTag})`);

  showToast(`🚀 OTA avviato su ${targetDevices.length} Pixò!`, "success");
});

btnGlobalStandby.addEventListener('click', () => {
  const ids = Object.keys(devices);
  if (ids.length === 0) return showToast('Nessun dispositivo rilevato!', 'info');
  if (!confirm(`Inviare STANDBY a tutti i ${ids.length} dispositivi Pixò rilevati?`)) return;
  ids.forEach(id => window.sendDeviceStandby(id));
  showToast(`Standby inviato a ${ids.length} dispositivi!`, 'success');
});

btnGlobalClock.addEventListener('click', () => {
  const ids = Object.keys(devices);
  if (ids.length === 0) return showToast('Nessun dispositivo rilevato!', 'info');
  ids.forEach(id => window.sendDeviceClock(id));
  showToast(`Orologio inviato a ${ids.length} dispositivi!`, 'success');
});

// --- RICERCA & FILTRI ---
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value.trim();
  renderDashboard();
});

filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    currentFilter = pill.dataset.filter;
    renderDashboard();
  });
});

btnRefresh.addEventListener('click', () => {
  renderDashboard();
  showToast('Scansione aggiornata', 'info');
});

// --- LOG TELEMETRIA COLLAPSIBLE ---
if (logsToggleTitle) {
  logsToggleTitle.addEventListener('click', () => {
    liveLogsContainer.classList.toggle('collapsed');
    logsToggleIcon.textContent = liveLogsContainer.classList.contains('collapsed') ? '▲' : '▼';
  });
}

function addLog(topic, text) {
  if (!liveLogsContainer) return;
  const timeStr = new Date().toLocaleTimeString();

  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML = `
    <span class="log-time">[${timeStr}]</span>
    <span class="log-topic">${escapeHtml(topic)}</span>
    <span class="log-payload">${escapeHtml(text)}</span>
  `;

  liveLogsContainer.appendChild(entry);

  if (liveLogsContainer.childNodes.length > 150) {
    liveLogsContainer.removeChild(liveLogsContainer.firstChild);
  }

  if (chkAutoScroll && chkAutoScroll.checked) {
    liveLogsContainer.scrollTop = liveLogsContainer.scrollHeight;
  }
}

btnClearLogs.addEventListener('click', () => {
  liveLogsContainer.innerHTML = '';
});

// --- TOAST NOTIFICHE ---
function showToast(message, type = 'info') {
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.25s ease';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 250);
  }, 2800);
}

// Inizializzazione
checkAuth();
checkLatestGitHubRelease(true);
