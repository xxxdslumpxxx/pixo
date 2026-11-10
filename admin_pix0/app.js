// Pixò Master Fleet Commander - Standalone Admin Logic (v27)
const DEFAULT_MASTER_KEY = "pixo_master_2026";

function getMasterKey() {
  return localStorage.getItem('pixo_custom_master_key') || DEFAULT_MASTER_KEY;
}

const MQTT_CONFIG = {
  brokerUrl: "wss://mqtt.dslumpstudio.com:443/mqtt",
  user: "pixo",
  pass: "projectLavagna!"
};

// State
let mqttClient = null;
let devices = {}; // { [id]: { id, status, lastSeen, ip, ssid, signal, fwVer, freeHeap, uptime_s, otaStatus, pin, lightState } }
let activeFriends = {}; // { [key]: { ts, id } }
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
const statClients = document.getElementById('statClients');
const statMsgCount = document.getElementById('statMsgCount');

const capHwOnline = document.getElementById('capHwOnline');
const capFriendsOnline = document.getElementById('capFriendsOnline');
const capAdminsOnline = document.getElementById('capAdminsOnline');
const capacityLabel = document.getElementById('capacityLabel');
const capacityBar = document.getElementById('capacityBar');

const globalOtaUrl = document.getElementById('globalOtaUrl');
const btnGlobalOta = document.getElementById('btnGlobalOta');
const btnCheckFw = document.getElementById('btnCheckFw');
const latestFwBadge = document.getElementById('latestFwBadge');
const otaTargetCount = document.getElementById('otaTargetCount');
const otaHelperText = document.getElementById('otaHelperText');
const btnGlobalStandby = document.getElementById('btnGlobalStandby');
const btnGlobalClock = document.getElementById('btnGlobalClock');

const searchInput = document.getElementById('searchInput');
const filterTabs = document.querySelectorAll('.filter-tab');
const countAll = document.getElementById('countAll');
const countOnline = document.getElementById('countOnline');
const countOffline = document.getElementById('countOffline');
const deviceList = document.getElementById('deviceList');
const devicesBadgeCount = document.getElementById('devicesBadgeCount');

const logContainer = document.getElementById('logContainer');
const btnClearLog = document.getElementById('btnClearLog');
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
    if (installModal) installModal.classList.remove('hidden');
  }
};

if (btnInstallApp) btnInstallApp.onclick = triggerInstall;
if (btnInstallAuth) btnInstallAuth.onclick = triggerInstall;
if (btnCloseInstallModal) btnCloseInstallModal.onclick = () => installModal.classList.add('hidden');
if (btnDismissInstallModal) btnDismissInstallModal.onclick = () => installModal.classList.add('hidden');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/admin_pix0/sw.js?v=27', { scope: '/admin_pix0/' })
      .then(reg => {
        console.log('[Commander SW] Registrato con successo:', reg.scope);
      })
      .catch(err => console.warn('[Commander SW] Errore registrazione:', err));
  });
}

// --- ACCORDION LOGIC WITH PERSISTENCE ---
const ACCORDION_STORAGE_KEY = 'pixo_commander_accordions_state_v27';

function initAccordions() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  const savedState = JSON.parse(localStorage.getItem(ACCORDION_STORAGE_KEY) || '{"device-fleet":true,"global-actions":true}');

  accordionItems.forEach(item => {
    const secId = item.dataset.section;
    const trigger = item.querySelector('.accordion-trigger');
    if (!trigger) return;

    if (savedState[secId]) {
      item.classList.add('active');
      trigger.setAttribute('aria-expanded', 'true');
    } else {
      item.classList.remove('active');
      trigger.setAttribute('aria-expanded', 'false');
    }

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = item.classList.toggle('active');
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      savedState[secId] = isOpen;
      localStorage.setItem(ACCORDION_STORAGE_KEY, JSON.stringify(savedState));
    });
  });
}

// --- FORM CAMBIO MASTER KEY ---
const formChangeMasterKey = document.getElementById('formChangeMasterKey');
const inputOldMasterKey = document.getElementById('inputOldMasterKey');
const inputNewMasterKey = document.getElementById('inputNewMasterKey');
const inputConfirmMasterKey = document.getElementById('inputConfirmMasterKey');
const masterKeyFeedback = document.getElementById('masterKeyFeedback');

if (formChangeMasterKey) {
  formChangeMasterKey.addEventListener('submit', (e) => {
    e.preventDefault();
    const oldVal = inputOldMasterKey.value.trim();
    const newVal = inputNewMasterKey.value.trim();
    const confirmVal = inputConfirmMasterKey.value.trim();

    if (oldVal !== getMasterKey()) {
      showMasterKeyFeedback('La Master Key attuale inserita non è corretta!', 'error');
      return;
    }
    if (newVal.length < 8) {
      showMasterKeyFeedback('La nuova Master Key deve contenere almeno 8 caratteri!', 'error');
      return;
    }
    if (newVal !== confirmVal) {
      showMasterKeyFeedback('Le due nuove Master Key non corrispondono!', 'error');
      return;
    }

    localStorage.setItem('pixo_custom_master_key', newVal);
    sessionStorage.setItem('pixo_admin_auth', 'true');
    localStorage.setItem('pixo_admin_auth', 'true');
    showMasterKeyFeedback('✅ Master Key aggiornata con successo! Conservala con cura.', 'success');
    formChangeMasterKey.reset();
    showToast('Master Key aggiornata!', 'success');
  });
}

function showMasterKeyFeedback(msg, type) {
  masterKeyFeedback.textContent = msg;
  masterKeyFeedback.className = `sec-feedback ${type}`;
  masterKeyFeedback.classList.remove('hidden');
  setTimeout(() => {
    masterKeyFeedback.classList.add('hidden');
  }, 5000);
}

// --- AUTHENTICATION ---
function checkAuth() {
  const isAuth = sessionStorage.getItem('pixo_admin_auth') === 'true' || localStorage.getItem('pixo_admin_auth') === 'true';
  if (isAuth) {
    unlockApp();
  } else {
    lockApp();
  }
}

function lockApp() {
  authOverlay.classList.remove('hidden');
  adminApp.classList.add('hidden');
  if (mqttClient) {
    try { mqttClient.end(true); } catch(e){}
    mqttClient = null;
  }
}

function unlockApp() {
  authOverlay.classList.add('hidden');
  adminApp.classList.remove('hidden');
  initFleetFromCache();
  initAccordions();
  connectMQTT();
  checkLatestRelease();
}

btnUnlock.onclick = () => {
  const entered = masterKeyInput.value.trim();
  if (entered === getMasterKey()) {
    authError.classList.add('hidden');
    if (rememberAuth.checked) {
      localStorage.setItem('pixo_admin_auth', 'true');
    } else {
      sessionStorage.setItem('pixo_admin_auth', 'true');
    }
    unlockApp();
  } else {
    authError.classList.remove('hidden');
    masterKeyInput.select();
  }
};
masterKeyInput.onkeydown = (e) => { if (e.key === 'Enter') btnUnlock.click(); };

btnLogout.onclick = () => {
  sessionStorage.removeItem('pixo_admin_auth');
  localStorage.removeItem('pixo_admin_auth');
  lockApp();
  showToast('Disconnessione effettuata', 'info');
};

// --- CACHE & PERSISTENZA FLEET ---
function initFleetFromCache() {
  try {
    const cached = localStorage.getItem('pixo_fleet_cache');
    if (cached) devices = JSON.parse(cached);
  } catch(e) { devices = {}; }
  renderDashboard();
}

function saveFleetCache() {
  try {
    localStorage.setItem('pixo_fleet_cache', JSON.stringify(devices));
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
  return '1234';
}

// --- MQTT CONNECTION (DEDICATO ORACLE CLOUD) ---
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
    showToast('Connesso al Broker Cloud Pixò', 'success');

    // Sottoscrizione flotta e telemetria globale
    mqttClient.subscribe('pixo/device/+/status', { qos: 1 });
    mqttClient.subscribe('pixo/live/+/status', { qos: 1 });
    mqttClient.subscribe('pixo/device/+/wifi', { qos: 0 });
    mqttClient.subscribe('pixo/device/+/diag', { qos: 0 });
    mqttClient.subscribe('pixo/device/+/ota/status', { qos: 0 });
    mqttClient.subscribe('pixo/friend/+/lock', { qos: 0 });
    mqttClient.subscribe('pixo/friend/+/meta', { qos: 1 });

    addLog('SYSTEM', 'Sottoscritto a tutta la flotta Pixò e stanze Live.');
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

  const textPayload = new TextDecoder().decode(payload).trim();
  addLog(topic, textPayload);

  // 1. Tracciamento sessioni Amici / Ospiti attive
  if (topic.startsWith('pixo/friend/') && topic.endsWith('/lock')) {
    const parts = topic.split('/');
    const friendKey = parts[2];
    try {
      if (textPayload && textPayload !== "FREE" && textPayload !== "NONE") {
        const lockData = JSON.parse(textPayload);
        if (lockData.status === "ACTIVE" && lockData.id) {
          activeFriends[friendKey] = { ts: Date.now(), id: lockData.id };
        } else {
          delete activeFriends[friendKey];
        }
      } else {
        delete activeFriends[friendKey];
      }
    } catch(e) {
      delete activeFriends[friendKey];
    }
    updateCapacityWidget();
    return;
  }

  // 2. Tracciamento dispositivi hardware Pixò
  const parts = topic.split('/');
  if (parts.length >= 4 && parts[0] === 'pixo' && parts[1] === 'device') {
    const devId = parts[2].toUpperCase();
    const sub = parts.slice(3).join('/');

    if (!devices[devId]) {
      const pins = JSON.parse(localStorage.getItem('pixo_admin_device_pins') || '{}');
      devices[devId] = {
        id: devId,
        status: 'online',
        lastSeen: Date.now(),
        ip: '',
        ssid: '',
        signal: 0,
        fwVer: 'v1.3.6',
        freeHeap: 0,
        uptime_s: 0,
        otaStatus: 'ready',
        pin: pins[devId] || '',
        lightState: false
      };
    }

    const dev = devices[devId];

    try {
      if (sub === 'status') {
        const isOnline = textPayload.toLowerCase().startsWith('online');
        const isOffline = textPayload.toLowerCase().startsWith('offline');
        if (isOnline) {
          dev.status = 'online';
          dev.lastSeen = Date.now();
        } else if (isOffline) {
          dev.status = 'offline';
        }
      } else if (sub === 'wifi') {
        if (textPayload.startsWith('{')) {
          const data = JSON.parse(textPayload);
          if (data.ssid) dev.ssid = data.ssid;
          if (data.ip) dev.ip = data.ip;
          if (typeof data.signal === 'number') dev.signal = data.signal;
          dev.status = 'online';
          dev.lastSeen = Date.now();
        }
      } else if (sub === 'diag') {
        if (textPayload.startsWith('{')) {
          const data = JSON.parse(textPayload);
          if (data.fw_ver) dev.fwVer = `v${data.fw_ver.replace(/^v/, '')}`;
          if (data.free_heap) dev.freeHeap = data.free_heap;
          if (data.uptime_s) dev.uptime_s = data.uptime_s;
          dev.status = 'online';
          dev.lastSeen = Date.now();
        }
      } else if (sub === 'ota/status') {
        if (textPayload.startsWith('{')) {
          const data = JSON.parse(textPayload);
          if (data.status) dev.otaStatus = data.status;
          if (data.version) dev.fwVer = `v${data.version.replace(/^v/, '')}`;
          dev.lastSeen = Date.now();
        }
      }
    } catch(e) {
      console.warn('Errore parsing payload:', e);
    }

    saveFleetCache();
    scheduleRender();
  }
}

let renderDebounceTimer = null;
function scheduleRender() {
  if (renderDebounceTimer) return;
  renderDebounceTimer = setTimeout(() => {
    renderDebounceTimer = null;
    renderDashboard();
  }, 250);
}

// Watchdog heartbeat e pulizia sessioni (ogni 4s)
setInterval(() => {
  const now = Date.now();
  let changed = false;

  // Watchdog dispositivi Pixò (offline se nessun segnale per oltre 22s)
  Object.values(devices).forEach(dev => {
    if (dev.status === 'online' && (now - dev.lastSeen) > 22000) {
      dev.status = 'offline';
      changed = true;
    }
  });

  // Watchdog sessioni Amici (rimuovi se nessun heartbeat lock per oltre 45s)
  Object.keys(activeFriends).forEach(k => {
    if ((now - activeFriends[k].ts) > 45000) {
      delete activeFriends[k];
      changed = true;
    }
  });

  if (changed) {
    saveFleetCache();
    renderDashboard();
  } else {
    updateCapacityWidget();
  }
}, 4000);

// --- CAPIENZA SERVER & CONNESSIONI ---
function updateCapacityWidget() {
  const maxBrokerCapacity = 1024;
  const hwOnlineCount = Object.values(devices).filter(d => d.status === 'online').length;
  const friendsCount = Object.keys(activeFriends).length;
  const adminsCount = 1;
  const totalClients = hwOnlineCount + friendsCount + adminsCount;

  if (capHwOnline) capHwOnline.textContent = hwOnlineCount;
  if (capFriendsOnline) capFriendsOnline.textContent = friendsCount;
  if (capAdminsOnline) capAdminsOnline.textContent = adminsCount;

  const pct = Math.min(100, Math.max(0.1, (totalClients / maxBrokerCapacity) * 100));
  if (capacityLabel) capacityLabel.textContent = `${totalClients} / ${maxBrokerCapacity} (${pct.toFixed(1)}%)`;
  if (capacityBar) {
    capacityBar.style.width = `${pct}%`;
    if (pct < 50) capacityBar.style.background = 'var(--green)';
    else if (pct < 80) capacityBar.style.background = 'var(--orange)';
    else capacityBar.style.background = 'var(--red)';
  }
  if (statClients) statClients.textContent = totalClients;
}

// --- RENDER DASHBOARD ---
function renderDashboard() {
  const devList = Object.values(devices);
  const total = devList.length;
  const online = devList.filter(d => d.status === 'online').length;
  const offline = total - online;

  statTotal.textContent = total;
  statOnline.textContent = online;
  statOffline.textContent = offline;
  countAll.textContent = total;
  countOnline.textContent = online;
  countOffline.textContent = offline;
  if (devicesBadgeCount) devicesBadgeCount.textContent = total;

  updateCapacityWidget();
  updateOtaTargetCount();

  // Filtraggio lista
  let filtered = devList;
  if (currentFilter === 'online') filtered = filtered.filter(d => d.status === 'online');
  else if (currentFilter === 'offline') filtered = filtered.filter(d => d.status === 'offline');

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(d => d.id.toLowerCase().includes(q) || d.ip.includes(q) || d.ssid.toLowerCase().includes(q));
  }

  // Render cards
  if (filtered.length === 0) {
    deviceList.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-dim); font-size:0.85rem;">Nessun Pixò trovato con i filtri attuali.</div>`;
    return;
  }

  deviceList.innerHTML = filtered.map(dev => {
    const isOnline = dev.status === 'online';
    const statusText = isOnline ? 'ONLINE' : 'OFFLINE';
    const lastSeenSec = dev.lastSeen ? Math.round((Date.now() - dev.lastSeen)/1000) : 999;
    const lastSeenStr = lastSeenSec < 60 ? `${lastSeenSec}s fa` : `${Math.round(lastSeenSec/60)}m fa`;
    const heapStr = dev.freeHeap ? `${Math.round(dev.freeHeap / 1024)} KB` : 'N/D';
    const uptimeStr = dev.uptime_s ? `${Math.round(dev.uptime_s / 60)} min` : 'N/D';
    const signalStr = dev.signal ? `${dev.signal}%` : 'N/D';
    const pin = getDevicePin(dev.id);

    return `
      <div class="device-card ${isOnline ? 'online' : 'offline'}" data-id="${dev.id}">
        <div class="dev-header">
          <div class="dev-id-group">
            <span class="dev-title">${dev.id}</span>
          </div>
          <span class="dev-status-pill ${isOnline ? 'online' : 'offline'}">${statusText}</span>
        </div>

        <div class="dev-info-grid">
          <div class="dev-info-item">
            <span class="dev-info-label">Firmware</span>
            <span class="dev-info-val" style="color:var(--cyan);">${dev.fwVer || 'v1.3.6'}</span>
          </div>
          <div class="dev-info-item">
            <span class="dev-info-label">Wi-Fi (Segnale)</span>
            <span class="dev-info-val">${dev.ssid ? `${dev.ssid} (${signalStr})` : 'N/D'}</span>
          </div>
          <div class="dev-info-item">
            <span class="dev-info-label">IP Locale</span>
            <span class="dev-info-val">${dev.ip || 'N/D'}</span>
          </div>
          <div class="dev-info-item">
            <span class="dev-info-label">RAM Libera (Heap)</span>
            <span class="dev-info-val">${heapStr}</span>
          </div>
          <div class="dev-info-item">
            <span class="dev-info-label">Uptime</span>
            <span class="dev-info-val">${uptimeStr}</span>
          </div>
          <div class="dev-info-item">
            <span class="dev-info-label">Ultimo Segnale</span>
            <span class="dev-info-val">${lastSeenStr}</span>
          </div>
        </div>

        <div class="dev-pin-form">
          <span class="dev-pin-label">PIN Dispositivo:</span>
          <input type="password" class="dev-pin-input" id="pin_${dev.id}" value="${pin}" placeholder="1234">
          <button class="btn secondary mini" onclick="handleSavePin('${dev.id}')">Salva</button>
        </div>

        <div class="dev-actions-grid">
          <button class="btn secondary mini" onclick="sendDeviceStandby('${dev.id}')">✨ Standby</button>
          <button class="btn secondary mini" onclick="sendDeviceClock('${dev.id}')">🕒 Orologio</button>
          <button class="btn danger mini full-width" style="grid-column: span 2;" onclick="sendDeviceOta('${dev.id}')">🚀 Aggiorna OTA</button>
        </div>

        <div class="dev-footer">
          <span class="ota-status-tag">Stato OTA: <strong>${dev.otaStatus || 'ready'}</strong></span>
          <a href="https://pixo.dslumpstudio.com/?device=${dev.id}" target="_blank" class="link-webapp">Apri WebApp Pixò ↗</a>
        </div>
      </div>
    `;
  }).join('');
}

window.handleSavePin = (devId) => {
  const el = document.getElementById(`pin_${devId}`);
  if (el) saveDevicePin(devId, el.value.trim());
};

// --- AZIONI SINGOLO DISPOSITIVO ---
window.sendDeviceStandby = (devId) => {
  if (!mqttClient || !mqttClient.connected) return showToast('Cloud non connesso', 'error');
  const pin = getDevicePin(devId);
  const payload = "CLEAR";
  mqttClient.publish(`pixo/device/${devId}/draw`, payload, { qos: 0 });
  mqttClient.publish(`pixo/device/${devId}/${pin}/draw`, payload, { qos: 0 });
  addLog(`OUTBOUND`, `Inviato STANDBY a [${devId}]`);
  showToast(`Standby inviato a [${devId}]`, 'success');
};

window.sendDeviceClock = (devId) => {
  if (!mqttClient || !mqttClient.connected) return showToast('Cloud non connesso', 'error');
  const pin = getDevicePin(devId);
  const payload = "CLOCK:ON";
  mqttClient.publish(`pixo/device/${devId}/draw`, payload, { qos: 0 });
  mqttClient.publish(`pixo/device/${devId}/${pin}/draw`, payload, { qos: 0 });
  addLog(`OUTBOUND`, `Inviato CLOCK a [${devId}]`);
  showToast(`Orologio inviato a [${devId}]`, 'success');
};

window.sendDeviceOta = (devId) => {
  if (!mqttClient || !mqttClient.connected) return showToast('Cloud non connesso', 'error');
  const url = globalOtaUrl.value.trim();
  if (!url) return showToast('URL Firmware mancante', 'error');
  const pin = getDevicePin(devId);
  const payload = `OTA:${url}`;
  mqttClient.publish(`pixo/device/${devId}/ota`, payload, { qos: 1 });
  mqttClient.publish(`pixo/device/${devId}/${pin}/ota`, payload, { qos: 1 });
  addLog(`OUTBOUND`, `Inviato OTA a [${devId}] -> ${url}`);
  showToast(`OTA avviato per [${devId}]`, 'info');
};

// --- AZIONI GLOBALI BROADCAST ---
btnGlobalStandby.onclick = () => {
  if (!mqttClient || !mqttClient.connected) return showToast('Cloud non connesso', 'error');
  Object.keys(devices).forEach(devId => {
    const pin = getDevicePin(devId);
    mqttClient.publish(`pixo/device/${devId}/draw`, "CLEAR", { qos: 0 });
    mqttClient.publish(`pixo/device/${devId}/${pin}/draw`, "CLEAR", { qos: 0 });
  });
  addLog(`BROADCAST`, `Inviato STANDBY a tutta la flotta`);
  showToast('Standby inviato a tutti i dispositivi', 'success');
};

btnGlobalClock.onclick = () => {
  if (!mqttClient || !mqttClient.connected) return showToast('Cloud non connesso', 'error');
  Object.keys(devices).forEach(devId => {
    const pin = getDevicePin(devId);
    mqttClient.publish(`pixo/device/${devId}/draw`, "CLOCK:ON", { qos: 0 });
    mqttClient.publish(`pixo/device/${devId}/${pin}/draw`, "CLOCK:ON", { qos: 0 });
  });
  addLog(`BROADCAST`, `Inviato CLOCK a tutta la flotta`);
  showToast('Orologio inviato a tutti i dispositivi', 'success');
};

btnGlobalOta.onclick = () => {
  if (!mqttClient || !mqttClient.connected) return showToast('Cloud non connesso', 'error');
  const url = globalOtaUrl.value.trim();
  if (!url) return showToast('URL Firmware non valido', 'error');
  const targetVer = latestRelease.rawTag;
  const onlineDevs = Object.values(devices).filter(d => d.status === 'online');
  if (onlineDevs.length === 0) return showToast('Nessun Pixò online da aggiornare', 'warning');

  const confirmMsg = `Confermi l'aggiornamento OTA broadcast verso TUTTI i Pixò accesi (${onlineDevs.length}) alla versione ${targetVer}?\n\nSorgente: ${url}`;
  if (!confirm(confirmMsg)) return;

  const masterPin = getMasterKey();
  const payload = `OTA:${url}#${masterPin}`;
  mqttClient.publish('pixo/global/ota', payload, { qos: 1 });

  onlineDevs.forEach(dev => {
    const pin = getDevicePin(dev.id);
    mqttClient.publish(`pixo/device/${dev.id}/ota`, `OTA:${url}`, { qos: 1 });
    mqttClient.publish(`pixo/device/${dev.id}/${pin}/ota`, `OTA:${url}`, { qos: 1 });
  });

  addLog(`OTA-BROADCAST`, `Comando inviato a flotta con Master Key: ${url}`);
  showToast(`Aggiornamento globale avviato su ${onlineDevs.length} Pixò!`, 'success');
};

// --- GITHUB RELEASES VERIFICATION ---
let latestRelease = {
  rawTag: 'v1.3.6',
  binUrl: 'https://github.com/xxxdslumpxxx/pixo/releases/download/v1.3.6/firmware.bin'
};

async function checkLatestRelease() {
  btnCheckFw.disabled = true;
  btnCheckFw.textContent = '...';
  try {
    const resp = await fetch('https://api.github.com/repos/xxxdslumpxxx/pixo/releases/latest');
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    latestRelease.rawTag = data.tag_name;
    const asset = data.assets && data.assets.find(a => a.name === 'firmware.bin');
    if (asset && asset.browser_download_url) {
      latestRelease.binUrl = asset.browser_download_url;
      globalOtaUrl.value = asset.browser_download_url;
    }
    latestFwBadge.textContent = `Disp: ${latestRelease.rawTag}`;
    updateOtaTargetCount();
    showToast(`Ultimo firmware GitHub: ${latestRelease.rawTag}`, 'info');
  } catch(e) {
    console.warn('Verifica GitHub fallita:', e);
  } finally {
    btnCheckFw.disabled = false;
    btnCheckFw.textContent = '🔍 Verifica';
  }
}
btnCheckFw.onclick = checkLatestRelease;

function updateOtaTargetCount() {
  const onlineDevs = Object.values(devices).filter(d => d.status === 'online');
  const targetVer = latestRelease.rawTag.replace(/^v/, '');
  const obsolete = onlineDevs.filter(d => {
    const cur = (d.fwVer || '').replace(/^v/, '');
    return cur && cur !== targetVer;
  });
  otaTargetCount.textContent = obsolete.length;
  if (onlineDevs.length === 0) {
    otaHelperText.textContent = `Nessun dispositivo attualmente online. Ultima versione: ${latestRelease.rawTag}.`;
  } else if (obsolete.length === 0) {
    otaHelperText.textContent = `Tutti i Pixò online (${onlineDevs.length}) sono già aggiornati all'ultima versione (${latestRelease.rawTag})!`;
  } else {
    otaHelperText.textContent = `${obsolete.length} dispositivo/i online su ${onlineDevs.length} hanno una versione obsoleta e richiedono l'aggiornamento.`;
  }
}

// --- FILTRI & RICERCA ---
filterTabs.forEach(tab => {
  tab.onclick = () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    renderDashboard();
  };
});

searchInput.oninput = (e) => {
  searchQuery = e.target.value.trim();
  renderDashboard();
};

btnRefresh.onclick = () => {
  if (mqttClient && mqttClient.connected) {
    mqttClient.subscribe('pixo/device/+/status', { qos: 1 });
    mqttClient.subscribe('pixo/live/+/status', { qos: 1 });
    mqttClient.subscribe('pixo/device/+/wifi', { qos: 0 });
    mqttClient.subscribe('pixo/device/+/diag', { qos: 0 });
    mqttClient.subscribe('pixo/device/+/ota/status', { qos: 0 });
    mqttClient.subscribe('pixo/friend/+/lock', { qos: 0 });
    mqttClient.subscribe('pixo/friend/+/meta', { qos: 1 });
  }
  showToast('Scansione cloud aggiornata', 'info');
};

// --- LOG CONSOLE ---
function addLog(prefix, msg) {
  const time = new Date().toLocaleTimeString();
  const line = `[${time}] ${prefix} ${msg}\n`;
  logContainer.textContent += line;
  if (chkAutoScroll.checked) logContainer.scrollTop = logContainer.scrollHeight;
}
btnClearLog.onclick = () => { logContainer.textContent = ''; };

// --- TOAST HELPER ---
function showToast(msg, type = 'info') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  toastContainer.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-8px)';
    setTimeout(() => el.remove(), 300);
  }, 3200);
}

// --- BOOTSTRAP ---
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
});
