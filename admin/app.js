// Pixò Master Fleet Commander - Admin Logic
const MASTER_KEY = "pixo_master_2026";

const MQTT_CONFIG = {
  brokerUrl: "wss://e58d8ef9b4cb45b9b8250157f6c5b7c2.s1.eu.hivemq.cloud:8884/mqtt",
  user: "dslump",
  pass: "projectLavagna!"
};

// State
let mqttClient = null;
let devices = {}; // { [id]: { id, status, lastSeen, ip, ssid, signal, fwVer, freeHeap, uptime_s, otaStatus, pin } }
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
const btnGlobalStandby = document.getElementById('btnGlobalStandby');
const btnGlobalFlashLed = document.getElementById('btnGlobalFlashLed');
const btnGlobalClock = document.getElementById('btnGlobalClock');

const searchInput = document.getElementById('searchInput');
const filterPills = document.querySelectorAll('.filter-pill');
const devicesGrid = document.getElementById('devicesGrid');
const emptyFleetState = document.getElementById('emptyFleetState');
const countAll = document.getElementById('countAll');
const countOnline = document.getElementById('countOnline');
const countOffline = document.getElementById('countOffline');

const liveLogsContainer = document.getElementById('liveLogsContainer');
const btnClearLogs = document.getElementById('btnClearLogs');
const chkAutoScroll = document.getElementById('chkAutoScroll');
const toastContainer = document.getElementById('toastContainer');

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
  if (confirm("Vuoi chiudere la sessione amministratore?")) {
    sessionStorage.removeItem('pixo_admin_unlocked');
    localStorage.removeItem('pixo_admin_persistent_unlocked');
    lockConsole();
  }
});

// --- PERSISTENCE & CACHE ---
function loadSavedData() {
  // Dispositivi salvati in cache
  try {
    const cached = localStorage.getItem('pixo_admin_fleet_cache');
    if (cached) {
      devices = JSON.parse(cached);
    }
  } catch(e) {
    devices = {};
  }

  // PIN personalizzati per ciascun dispositivo
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

// --- MQTT CONNECTION ---
function connectMQTT() {
  if (mqttClient && mqttClient.connected) return;

  setCloudStatus('connecting', 'Connessione a HiveMQ Cloud...');

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
    setCloudStatus('connected', 'Connesso al Cloud (TLS)');
    showToast('Connessione MQTT Cloud stabilita', 'success');

    // Sottoscrizione a tutta la flotta Pixò
    mqttClient.subscribe('pixo/device/+/status', { qos: 0 });
    mqttClient.subscribe('pixo/device/+/wifi', { qos: 0 });
    mqttClient.subscribe('pixo/device/+/diag', { qos: 0 });
    mqttClient.subscribe('pixo/device/+/ota/status', { qos: 0 });

    addLog('SYSTEM', 'Sottoscritto ai canali di telemetria dell\'intera flotta Pixò.');
  });

  mqttClient.on('message', (topic, payload) => {
    handleIncomingMessage(topic, payload);
  });

  mqttClient.on('error', (err) => {
    console.error('MQTT Error:', err);
    setCloudStatus('disconnected', 'Errore Connessione Cloud');
  });

  mqttClient.on('offline', () => {
    setCloudStatus('disconnected', 'Disconnesso dal Cloud');
  });
}

function setCloudStatus(state, text) {
  cloudStatusBadge.className = `status-badge ${state}`;
  cloudStatusText.textContent = text;
}

// --- MESSAGE DISPATCHER ---
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
    // Recupera eventuale PIN memorizzato
    const pins = JSON.parse(localStorage.getItem('pixo_admin_device_pins') || '{}');
    devices[devId] = {
      id: devId,
      status: 'online',
      lastSeen: Date.now(),
      ip: '',
      ssid: '',
      signal: 0,
      fwVer: '1.0.0',
      freeHeap: 0,
      uptime_s: 0,
      otaStatus: 'ready',
      pin: pins[devId] || ''
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

// Heartbeat check ogni 5s per marcare offline
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

  // Metriche
  statTotal.textContent = allList.length;
  statOnline.textContent = onlineCount;
  statOffline.textContent = offlineCount;
  countAll.textContent = allList.length;
  countOnline.textContent = onlineCount;
  countOffline.textContent = offlineCount;

  // Filtraggio
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

  // Ordina: online prima, poi per contatto recente
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
          <span class="telem-val">v${escapeHtml(dev.fwVer || '1.0.0')}</span>
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

      <!-- Comandi Rapidi su questo Pixò -->
      <div class="card-actions-grid">
        <button class="btn secondary mini" onclick="sendDeviceStandby('${dev.id}')">✨ Standby</button>
        <button class="btn secondary mini" onclick="sendDeviceFlashLed('${dev.id}')">💡 Flash Luce (2s)</button>
        <button class="btn secondary mini" onclick="sendDeviceClock('${dev.id}')">🕒 Mostra Orologio</button>
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

// Helper escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// --- DEVICE ACTIONS ---

window.handleSavePin = function(deviceId) {
  const input = document.getElementById(`pin_${deviceId}`);
  if (!input) return;
  const pin = input.value.trim();
  saveDevicePin(deviceId, pin);
};

function getDevicePin(deviceId) {
  if (devices[deviceId] && devices[deviceId].pin) return devices[deviceId].pin;
  const pins = JSON.parse(localStorage.getItem('pixo_admin_device_pins') || '{}');
  return pins[deviceId] || '';
}

// 1. STANDBY (CLEAR): invia sui topic sia generici che con PIN per superare il check del firmware
window.sendDeviceStandby = function(deviceId) {
  if (!mqttClient || !mqttClient.connected) {
    showToast('MQTT Cloud non connesso!', 'error');
    return;
  }
  const pin = getDevicePin(deviceId);

  // Invia al topic generico (se non attivato con PIN)
  mqttClient.publish(`pixo/device/${deviceId}/draw`, 'CLEAR', { qos: 0 });

  // Invia al topic con PIN proprietario (essenziale se il dispositivo ha un PIN personale)
  if (pin && pin.length > 0) {
    mqttClient.publish(`pixo/device/${deviceId}/${pin}/draw`, 'CLEAR', { qos: 0 });
  }

  // Invia con PIN default "1234"
  if (pin !== '1234') {
    mqttClient.publish(`pixo/device/${deviceId}/1234/draw`, 'CLEAR', { qos: 0 });
  }

  // Sincronizza lo stato corrente retained
  mqttClient.publish(`pixo/device/${deviceId}/current`, 'CLEAR', { qos: 0, retain: true });

  showToast(`Comando Standby inviato a ${deviceId}`, 'success');
  addLog('OUTBOUND', `Inviato CLEAR a [${deviceId}] (PIN usato: '${pin || '1234'}')`);
};

// 2. FLASH LUCE LED (2 SECONDI)
window.sendDeviceFlashLed = function(deviceId) {
  if (!mqttClient || !mqttClient.connected) {
    showToast('MQTT Cloud non connesso!', 'error');
    return;
  }
  const pin = getDevicePin(deviceId);

  // Accensione
  mqttClient.publish(`pixo/device/${deviceId}/led`, 'LIGHT:ON', { qos: 0 });
  mqttClient.publish(`pixo/device/${deviceId}/led`, '100', { qos: 0 });
  if (pin && pin.length > 0) {
    mqttClient.publish(`pixo/device/${deviceId}/${pin}/led`, 'LIGHT:ON', { qos: 0 });
    mqttClient.publish(`pixo/device/${deviceId}/${pin}/led`, '100', { qos: 0 });
  }
  if (pin !== '1234') {
    mqttClient.publish(`pixo/device/${deviceId}/1234/led`, 'LIGHT:ON', { qos: 0 });
    mqttClient.publish(`pixo/device/${deviceId}/1234/led`, '100', { qos: 0 });
  }

  // Spegnimento automatico dopo 2s per dare l'effetto flash di test
  setTimeout(() => {
    if (mqttClient && mqttClient.connected) {
      mqttClient.publish(`pixo/device/${deviceId}/led`, 'LIGHT:OFF', { qos: 0 });
      if (pin && pin.length > 0) mqttClient.publish(`pixo/device/${deviceId}/${pin}/led`, 'LIGHT:OFF', { qos: 0 });
      if (pin !== '1234') mqttClient.publish(`pixo/device/${deviceId}/1234/led`, 'LIGHT:OFF', { qos: 0 });
    }
  }, 2000);

  showToast(`Flash Luce LED (2s) inviato a ${deviceId}`, 'success');
  addLog('OUTBOUND', `Inviato Flash LED a [${deviceId}]`);
};

// 3. MOSTRA OROLOGIO (CLOCK)
window.sendDeviceClock = function(deviceId) {
  if (!mqttClient || !mqttClient.connected) {
    showToast('MQTT Cloud non connesso!', 'error');
    return;
  }
  const pin = getDevicePin(deviceId);

  mqttClient.publish(`pixo/device/${deviceId}/draw`, 'CLOCK', { qos: 0 });
  if (pin && pin.length > 0) {
    mqttClient.publish(`pixo/device/${deviceId}/${pin}/draw`, 'CLOCK', { qos: 0 });
  }
  if (pin !== '1234') {
    mqttClient.publish(`pixo/device/${deviceId}/1234/draw`, 'CLOCK', { qos: 0 });
  }

  // Sincronizza stato retained
  mqttClient.publish(`pixo/device/${deviceId}/current`, 'CLOCK', { qos: 0, retain: true });

  showToast(`Modalità Orologio inviata a ${deviceId}`, 'success');
  addLog('OUTBOUND', `Inviato CLOCK a [${deviceId}]`);
};

// 4. OTA SINGOLO DISPOSITIVO
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

  // Pubblica sul topic con PIN (se presente) e sul topic generico
  if (pin && pin.length > 0) {
    mqttClient.publish(`pixo/device/${deviceId}/${pin}/ota`, payload, { qos: 0 });
  }
  mqttClient.publish(`pixo/device/${deviceId}/ota`, payload, { qos: 0 });

  showToast(`Comando OTA inviato a ${deviceId}!`, 'success');
  addLog('OUTBOUND', `Inviato comando OTA a [${deviceId}] (URL: ${url})`);
};

// --- GLOBAL ACTIONS ---

// Master OTA Broadcast a tutta la flotta
btnGlobalOta.addEventListener('click', () => {
  const url = globalOtaUrl.value.trim();
  if (!url) {
    alert("Inserisci l'URL completo del file firmware .bin.");
    return;
  }

  const ok = confirm(`⚠️ ATTENZIONE MASTER BROADCAST:\n\nSei sicuro di voler forzare l'aggiornamento OTA su TUTTI i dispositivi Pixò connessi?\n\n• Sorgente: ${url}\n• Tutti i dispositivi scaricheranno e installeranno il pacchetto contemporaneamente.\n\nProcedere?`);
  if (!ok) return;

  if (!mqttClient || !mqttClient.connected) {
    showToast('MQTT Cloud non connesso!', 'error');
    return;
  }

  const payload = JSON.stringify({
    url: url,
    version: "fleet_update",
    master_pin: MASTER_KEY
  });

  mqttClient.publish("pixo/global/ota", payload, { qos: 0 });
  showToast("🚀 Master OTA inviato su tutta la flotta!", "success");
  addLog('OUTBOUND', `BROADCAST MASTER OTA su 'pixo/global/ota' (URL: ${url})`);
});

// Standby su tutti i dispositivi rilevati
btnGlobalStandby.addEventListener('click', () => {
  const ids = Object.keys(devices);
  if (ids.length === 0) {
    showToast('Nessun dispositivo rilevato!', 'info');
    return;
  }
  if (!confirm(`Vuoi inviare il comando STANDBY a tutti i ${ids.length} dispositivi Pixò rilevati?`)) return;

  ids.forEach(id => window.sendDeviceStandby(id));
  showToast(`Standby inviato a ${ids.length} dispositivi!`, 'success');
});

// Flash LED su tutti i dispositivi rilevati
btnGlobalFlashLed.addEventListener('click', () => {
  const ids = Object.keys(devices);
  if (ids.length === 0) {
    showToast('Nessun dispositivo rilevato!', 'info');
    return;
  }
  ids.forEach(id => window.sendDeviceFlashLed(id));
  showToast(`Flash LED inviato a ${ids.length} dispositivi!`, 'success');
});

// Mostra Orologio su tutti
btnGlobalClock.addEventListener('click', () => {
  const ids = Object.keys(devices);
  if (ids.length === 0) {
    showToast('Nessun dispositivo rilevato!', 'info');
    return;
  }
  ids.forEach(id => window.sendDeviceClock(id));
  showToast(`Modalità Orologio inviata a ${ids.length} dispositivi!`, 'success');
});

// --- SEARCH & FILTERS ---
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
  showToast('Dashboard aggiornata', 'info');
});

// --- LOGGING ---
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

  // Mantieni massimo 150 elementi per performance
  if (liveLogsContainer.childNodes.length > 150) {
    liveLogsContainer.removeChild(liveLogsContainer.firstChild);
  }

  if (chkAutoScroll.checked) {
    liveLogsContainer.scrollTop = liveLogsContainer.scrollHeight;
  }
}

btnClearLogs.addEventListener('click', () => {
  liveLogsContainer.innerHTML = '';
});

// --- TOAST NOTIFICATIONS ---
function showToast(message, type = 'info') {
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3200);
}

// Inizializzazione all'avvio
checkAuth();
