/* ==========================================================================
   PIXÒ CLOUD - LOGICA APPLICATIVA JAVASCRIPT
   ========================================================================== */

// --- CONFIGURAZIONE PREDEFINITA BROKER MQTT ---
const DEFAULT_CONFIG = {
  brokerUrl: "wss://e58d8ef9b4cb45b9b8250157f6c5b7c2.s1.eu.hivemq.cloud:8884/mqtt",
  brokerUser: "dslump",
  brokerPass: "projectLavagna!",
  defaultDeviceId: "",
  defaultDeviceName: "Il mio Pixò",
  jpegQuality: 0.60, // Ottimizzato: ~4-6 KB per invio istantaneo in meno di 100ms!
  defaultCity: "Roma",
  defaultTheme: "dark", // "dark" (Nero/Bianco) oppure "light" (Bianco/Nero)
  defaultLang: "it",
  defaultBrightness: 100,
  defaultPin: "1234"
};

// 28 Sticker ed Emoji
const STICKERS = [
  '☀️', '⛅', '🌧️', '❄️', '⚡', '🌈',
  '❤️', '😊', '😂', '😎', '🥳', '😴', '💩',
  '☕', '🍕', '🎂', '🏠', '🔔', '⚠️', '💡', '🚀',
  '🐱', '🐶', '🌸', '⭐', '🎮', '🎵', '⏰'
];

// Dizionario Multilingua (i18n)
const TRANSLATIONS = {
  it: {
    appTitle: "Pixò",
    undo: "Undo",
    clear: "Pulisci",
    standby: "Standby",
    text: "Testo",
    stickers: "Sticker",
    photo: "Foto",
    weather: "Meteo",
    news: "News",
    clock: "Orologio",
    light: "Luce",
    save: "Salva",
    gallery: "Disegni",
    share: "Condividi",
    chooseSticker: "Scegli uno Sticker (28 disponibili)",
    stickerSize: "Dimensione Sticker:",
    sendToDisplay: "Invia a Display",
    settingsTitle: "Impostazioni Pixò",
    deviceNameLabel: "Nome del tuo Pixò:",
    brightnessLabel: "☀️ Luminosità Schermo:",
    cityLabel: "Città Predefinita per il Meteo:",
    langLabel: "Lingua / Language:",
    canvasThemeLabel: "Tema Lavagna:",
    themeDark: "Nero (Scritta Bianca)",
    themeLight: "Bianco (Scritta Nera)",
    hardwareId: "ID Hardware:",
    directLinkLabel: "Link Diretto per Disegnare su questo Pixò:",
    copy: "Copia",
    saveSettings: "Salva Impostazioni",
    addTextTitle: "Aggiungi Testo",
    textSize: "Dimensione Testo:",
    quickPresets: "Preset:",
    insertOnCanvas: "Inserisci sul Canvas",
    galleryTitle: "📁 I Miei Disegni Salvati",
    shareTitle: "🔗 Condivisione Dispositivo Pixò",
    screensaverLabel: "Screensaver Standby (30 min)",
    screensaverSub: "Torna alla faccina animata dopo 30 min di inattività",
    ledLabel: "💡 Lampeggio LED alla ricezione (GPIO 5)",
    ledSub: "Fa lampeggiare il LED quando ricevi un nuovo disegno o messaggio",
    allowGuestsTitle: "Consenti Invio da Ospiti",
    guestStatusSub: "Gli invitati possono inviare disegni a Pixò",
    guestLinkLabel: "Link di Invito per Ospiti:",
    toastCleared: "Lavagna pulita",
    toastStandby: "Pixò è tornato in Standby!",
    toastTextInserted: "Testo inserito al centro",
    toastStickerReady: "Tocca il canvas per posizionare lo sticker",
    toastPhotoApplied: "Foto caricata sul canvas!",
    toastVideoApplied: "Fotogramma video caricato sul canvas!",
    toastWeatherSent: "Meteo di {city} inviato a Pixò!",
    toastNewsSent: "Notizia inviata a Pixò!",
    toastClockSent: "Orologio Digitale Nativo avviato su Pixò!",
    toastDrawingSaved: "Disegno salvato nei preferiti!",
    toastDrawingLoaded: "Disegno caricato sul canvas!",
    toastDrawingDeleted: "Disegno eliminato dalla galleria!",
    toastGuestDisabled: "Accesso ospiti inibito!",
    toastGuestEnabled: "Accesso ospiti riabilitato!",
    toastKeyRevoked: "Chiave rigenerata! I vecchi link sono stati revocati.",
    toastLinkCopied: "Link copiato negli appunti!",
    toastSettingsSaved: "Impostazioni salvate",
    toastConnected: "Connesso a Pixò Cloud",
    toastSentSuccess: "Inviato a {name} ({kb} KB in {ms}ms)!",
    confirmClear: "Vuoi davvero cancellare tutto il disegno?",
    feedWeatherActive: "🌦️ Meteo attivo ({city}) • Aggiornamento automatico ogni 15 min",
    feedNewsActive: "📰 Notizia {current} di {total} su Pixò (prossima tra 15s)...",
    feedClockActive: "⏰ Orologio Digitale attivo sul Display (Nativo)",
    feedStopped: "Modalità automatica fermata"
  },
  en: {
    appTitle: "Pixò",
    undo: "Undo",
    clear: "Clear",
    standby: "Standby",
    text: "Text",
    stickers: "Stickers",
    photo: "Photo",
    weather: "Weather",
    news: "News",
    clock: "Clock",
    light: "Light",
    save: "Save",
    gallery: "Drawings",
    share: "Share",
    chooseSticker: "Choose a Sticker (28 available)",
    stickerSize: "Sticker Size:",
    sendToDisplay: "Send to Display",
    settingsTitle: "Pixò Settings",
    deviceNameLabel: "Your Pixò Name:",
    brightnessLabel: "☀️ Screen Brightness:",
    cityLabel: "Default Weather City:",
    langLabel: "Language / Lingua:",
    canvasThemeLabel: "Canvas Theme:",
    themeDark: "Black (White Pen)",
    themeLight: "White (Black Pen)",
    hardwareId: "Hardware ID:",
    directLinkLabel: "Direct Link to Draw on this Pixò:",
    copy: "Copy",
    saveSettings: "Save Settings",
    addTextTitle: "Add Text",
    textSize: "Text Size:",
    quickPresets: "Presets:",
    insertOnCanvas: "Place on Canvas",
    galleryTitle: "📁 My Saved Drawings",
    shareTitle: "🔗 Pixò Device Sharing",
    screensaverLabel: "Standby Screensaver (30 min)",
    screensaverSub: "Return to cartoon face after 30 min of inactivity",
    ledLabel: "💡 Notification LED Blink (GPIO 5)",
    ledSub: "Blinks the LED when receiving a new drawing or message",
    allowGuestsTitle: "Allow Guest Submissions",
    guestStatusSub: "Guests can send drawings to Pixò",
    guestLinkLabel: "Guest Invitation Link:",
    toastCleared: "Canvas cleared",
    toastStandby: "Pixò returned to Standby!",
    toastTextInserted: "Text placed in center",
    toastStickerReady: "Tap canvas to place sticker",
    toastPhotoApplied: "Photo applied to canvas!",
    toastVideoApplied: "Video frame loaded onto canvas!",
    toastWeatherSent: "Weather for {city} sent to Pixò!",
    toastNewsSent: "News story sent to Pixò!",
    toastClockSent: "Native Digital Clock started on Pixò!",
    toastDrawingSaved: "Drawing saved to favorites!",
    toastDrawingLoaded: "Drawing loaded to canvas!",
    toastDrawingDeleted: "Drawing deleted from gallery!",
    toastGuestDisabled: "Guest access blocked!",
    toastGuestEnabled: "Guest access re-enabled!",
    toastKeyRevoked: "Key revoked! Old invitation links are now invalid.",
    toastLinkCopied: "Link copied to clipboard!",
    toastSettingsSaved: "Settings saved",
    toastConnected: "Connected to Pixò Cloud",
    toastSentSuccess: "Sent to {name} ({kb} KB in {ms}ms)!",
    confirmClear: "Do you really want to clear the entire canvas?",
    feedWeatherActive: "🌦️ Weather active ({city}) • Auto-refresh every 15 min",
    feedNewsActive: "📰 Story {current} of {total} on Pixò (next in 15s)...",
    feedClockActive: "⏰ Digital Clock active on Display (Native)",
    feedStopped: "Mode stopped"
  }
};

// --- STATO DELL'APPLICAZIONE ---
const state = {
  deviceId: "",
  deviceName: "",
  brokerUrl: "",
  brokerUser: "",
  brokerPass: "",
  lang: DEFAULT_CONFIG.defaultLang,
  canvasTheme: DEFAULT_CONFIG.defaultTheme,
  weatherCity: DEFAULT_CONFIG.defaultCity,
  brightness: DEFAULT_CONFIG.defaultBrightness,
  currentColor: "#ffffff",
  currentStroke: 2,
  isEraser: false,
  isDrawing: false,
  isSending: false,
  
  // Elemento interattivo su schermo (Foto, Sticker o Testo con pinch-to-zoom e drag)
  interactiveElement: {
    active: false,
    type: 'sticker', // 'sticker', 'text', o 'image'
    content: '',
    imageObj: null,
    aspectRatio: 1,
    x: 120,
    y: 120,
    size: 44,
    color: '#ffffff'
  },

  // Gestione Feed Automatici (Meteo & Orologio)
  activeFeedType: null, // "weather" o "clock"
  feedTimer: null,

  // Modalità Ospite & Condivisione
  isGuestMode: false,
  guestKey: "pixo123",
  guestKeys: [],
  allowGuests: true,

  // Screensaver & LED
  screensaverEnabled: true,
  ledEnabled: true,
  lightOn: false,
  savedDrawings: [],

  lastX: 0,
  lastY: 0,
  undoStack: [],
  maxUndo: 20,
  mqttClient: null,
  mqttConnected: false,
  mqttConnecting: false,
  devicePin: DEFAULT_CONFIG.defaultPin,
  textSize: 24,
  userHasDrawnLocally: false,
  lastDisplayPayload: null,
  wifiSsid: "",
  wifiSignal: 0,
  wifiIp: "",
  deviceStatus: "unknown", // "online" | "offline" | "unknown"
  guestAuthorized: null, // null = verifica in corso, true = autorizzato, false = revocato/non autorizzato
  lastKnownGuestKeys: null
};

// --- RIFERIMENTI DOM ---
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const statusDot = document.getElementById('statusDot');
const deviceIdDisplay = document.getElementById('deviceIdDisplay');
const deviceSubtitle = document.getElementById('deviceSubtitle');
const payloadSizeBadge = document.getElementById('payloadSizeBadge');

// Header
const openSettingsBtn = document.getElementById('openSettingsBtn');
const devicePill = document.getElementById('devicePill');

// Elemento Interattivo a Schermo & Toolbar di Ingrandimento
const elementOverlay = document.getElementById('elementOverlay');
const floatingElement = document.getElementById('floatingElement');
const floatingContent = document.getElementById('floatingContent');
const floatingImage = document.getElementById('floatingImage');
const overlayToolbar = document.getElementById('overlayToolbar');
const confirmOverlayBtn = document.getElementById('confirmOverlayBtn');
const cancelOverlayBtn = document.getElementById('cancelOverlayBtn');
const overlayHintText = document.getElementById('overlayHintText');

// Feed Banner
const feedBanner = document.getElementById('feedBanner');
const feedStatusText = document.getElementById('feedStatusText');
const stopFeedBtn = document.getElementById('stopFeedBtn');

// Device Status Alert Banner
const deviceOfflineBanner = document.getElementById('deviceOfflineBanner');
const deviceOfflineText = document.getElementById('deviceOfflineText');
const dismissOfflineBannerBtn = document.getElementById('dismissOfflineBannerBtn');

// Overlay Blocco Ospiti Revocati
const guestRevokedOverlay = document.getElementById('guestRevokedOverlay');
const guestRevokedReason = document.getElementById('guestRevokedReason');
const retryGuestAuthBtn = document.getElementById('retryGuestAuthBtn');

// Top Bar Action Buttons
const undoBtn = document.getElementById('undoBtn');
const clearBtn = document.getElementById('clearBtn');
const standbyBtn = document.getElementById('standbyBtn');
const textToolBtn = document.getElementById('textToolBtn');
const stickerToggleBtn = document.getElementById('stickerToggleBtn');
const photoBtn = document.getElementById('photoBtn');
const photoInput = document.getElementById('photoInput');
const weatherBtn = document.getElementById('weatherBtn');
const clockBtn = document.getElementById('clockBtn');
const lightToggleBtn = document.getElementById('lightToggleBtn');
const saveCanvasBtn = document.getElementById('saveCanvasBtn');
const galleryBtn = document.getElementById('galleryBtn');
const shareBtn = document.getElementById('shareBtn');

// Modali & Drawers
const settingsModal = document.getElementById('settingsModal');
const closeSettingsModal = document.getElementById('closeSettingsModal');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const deviceNameInput = document.getElementById('deviceNameInput');
const devicePinInput = document.getElementById('devicePinInput');
const brightnessSlider = document.getElementById('brightnessSlider');
const brightnessVal = document.getElementById('brightnessVal');
const hardwareIdDisplay = document.getElementById('hardwareIdDisplay');
const langSelect = document.getElementById('langSelect');
const themeSelect = document.getElementById('themeSelect');
const weatherCityInput = document.getElementById('weatherCityInput');
const screensaverToggle = document.getElementById('screensaverToggle');
const ledToggle = document.getElementById('ledToggle');
const changeDeviceBtn = document.getElementById('changeDeviceBtn');
const factoryResetBtn = document.getElementById('factoryResetBtn');
const factoryResetSection = document.getElementById('factoryResetSection');

// Gestione Wi-Fi Pixò
const wifiManagementSection = document.getElementById('wifiManagementSection');
const currentWifiDesc = document.getElementById('currentWifiDesc');
const currentWifiBadge = document.getElementById('currentWifiBadge');
const btnToggleNewWifi = document.getElementById('btnToggleNewWifi');
const btnOpenWifiPortal = document.getElementById('btnOpenWifiPortal');
const newWifiFormBox = document.getElementById('newWifiFormBox');
const newWifiSsidInput = document.getElementById('newWifiSsidInput');
const newWifiPassInput = document.getElementById('newWifiPassInput');
const btnCancelNewWifi = document.getElementById('btnCancelNewWifi');
const btnApplyNewWifi = document.getElementById('btnApplyNewWifi');

// Modal Onboarding e Connessione Pixò
const onboardingModal = document.getElementById('onboardingModal');
const tabOnboardLogin = document.getElementById('tabOnboardLogin');
const tabOnboardActivate = document.getElementById('tabOnboardActivate');
const sectionOnboardLogin = document.getElementById('sectionOnboardLogin');
const sectionOnboardActivate = document.getElementById('sectionOnboardActivate');
const onboardLoginDeviceId = document.getElementById('onboardLoginDeviceId');
const onboardLoginPin = document.getElementById('onboardLoginPin');
const submitLoginBtn = document.getElementById('submitLoginBtn');
const onboardDeviceId = document.getElementById('onboardDeviceId');
const onboardFactoryPin = document.getElementById('onboardFactoryPin');
const onboardNewPin = document.getElementById('onboardNewPin');
const onboardConfirmPin = document.getElementById('onboardConfirmPin');
const onboardErrorText = document.getElementById('onboardErrorText');
const submitOnboardingBtn = document.getElementById('submitOnboardingBtn');

// Galleria Disegni
const galleryModal = document.getElementById('galleryModal');
const closeGalleryModal = document.getElementById('closeGalleryModal');
const saveCurrentFromGalleryBtn = document.getElementById('saveCurrentFromGalleryBtn');
const galleryCountText = document.getElementById('galleryCountText');
const galleryGrid = document.getElementById('galleryGrid');
const galleryEmptyMessage = document.getElementById('galleryEmptyMessage');

// Condivisione & Ospiti
const shareModal = document.getElementById('shareModal');
const closeShareModal = document.getElementById('closeShareModal');
const allowGuestsToggle = document.getElementById('allowGuestsToggle');
const guestStatusSub = document.getElementById('guestStatusSub');
const revokeGuestsBtn = document.getElementById('revokeGuestsBtn');
const newGuestNameInput = document.getElementById('newGuestNameInput');
const createGuestKeyBtn = document.getElementById('createGuestKeyBtn');
const guestKeysCountBadge = document.getElementById('guestKeysCountBadge');
const guestKeysList = document.getElementById('guestKeysList');
const guestKeysEmpty = document.getElementById('guestKeysEmpty');

const textModal = document.getElementById('textModal');
const closeTextModal = document.getElementById('closeTextModal');
const customTextInput = document.getElementById('customTextInput');
const textSizeSlider = document.getElementById('textSizeSlider');
const textSizeVal = document.getElementById('textSizeVal');
const applyTextBtn = document.getElementById('applyTextBtn');

const stickerDrawer = document.getElementById('stickerDrawer');
const closeStickerBtn = document.getElementById('closeStickerBtn');
const stickerSizeSlider = document.getElementById('stickerSizeSlider');
const stickerSizeVal = document.getElementById('stickerSizeVal');
const stickerGrid = document.getElementById('stickerGrid');

// Tools & Send
const eraserBtn = document.getElementById('eraserBtn');
const sendBtn = document.getElementById('sendBtn');
const toastContainer = document.getElementById('toastContainer');

// ==========================================================================
//  1. INTERNAZIONALIZZAZIONE (i18n)
// ==========================================================================
function setLanguage(lang) {
  state.lang = lang;
  localStorage.setItem('pixo_lang', lang);
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.it;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  const themeOptDark = themeSelect.querySelector('option[value="dark"]');
  const themeOptLight = themeSelect.querySelector('option[value="light"]');
  if (themeOptDark) themeOptDark.textContent = dict.themeDark;
  if (themeOptLight) themeOptLight.textContent = dict.themeLight;

  langSelect.value = lang;
}

function t(key, params = {}) {
  const dict = TRANSLATIONS[state.lang] || TRANSLATIONS.it;
  let str = dict[key] || key;
  for (const [k, v] of Object.entries(params)) {
    str = str.replace(`{${k}}`, v);
  }
  return str;
}

// Generatore token casuale per condivisione sicura
function generateRandomGuestKey() {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let token = 'g_';
  for (let i = 0; i < 6; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Restituisce il topic corretto per l'invio al display (gestisce Ospite vs Proprietario con PIN)
function getDrawTopic() {
  if (state.isGuestMode) {
    const key = state.guestKey || 'pixo123';
    return `pixo/device/${state.deviceId}/guest/${key}/draw`;
  }
  const pin = state.devicePin || localStorage.getItem('pixo_device_pin') || DEFAULT_CONFIG.defaultPin || "1234";
  return `pixo/device/${state.deviceId}/${pin}/draw`;
}

function initDeviceAndSettings() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlId = urlParams.get('id');

  if (urlId && urlId.trim() !== '') {
    state.deviceId = urlId.trim().toUpperCase();
    localStorage.setItem('pixo_device_id', state.deviceId);
  } else {
    state.deviceId = (localStorage.getItem('pixo_device_id') || 
                      localStorage.getItem('lavagna_device_id') || 
                      "").trim().toUpperCase();
  }

  // Verifica se l'app è aperta come ospite
  if (urlParams.get('guest') === '1') {
    state.isGuestMode = true;
    state.guestKey = urlParams.get('key') || 'pixo123';
    state.devicePin = ""; // L'ospite NON ha e NON vede il PIN proprietario
  } else {
    state.isGuestMode = false;
    try {
      const stored = localStorage.getItem('pixo_guest_keys');
      if (stored) {
        state.guestKeys = JSON.parse(stored);
      } else {
        const legacyKey = localStorage.getItem('pixo_guest_key') || 'pixo123';
        state.guestKeys = [
          {
            id: 'key_default',
            name: 'Link Principale (pixo123)',
            key: legacyKey,
            created: Date.now()
          }
        ];
        localStorage.setItem('pixo_guest_keys', JSON.stringify(state.guestKeys));
      }
    } catch(e) {
      state.guestKeys = [
        {
          id: 'key_default',
          name: 'Link Principale (pixo123)',
          key: 'pixo123',
          created: Date.now()
        }
      ];
    }
    state.guestKey = state.guestKeys.length > 0 ? state.guestKeys[0].key : 'pixo123';
    
    const urlPin = urlParams.get('pin');
    if (urlPin && urlPin.trim() !== '') {
      state.devicePin = urlPin.trim();
      localStorage.setItem('pixo_device_pin', state.devicePin);
    } else {
      state.devicePin = localStorage.getItem('pixo_device_pin') || DEFAULT_CONFIG.defaultPin || "1234";
    }
  }

  state.allowGuests = localStorage.getItem('pixo_allow_guests') !== 'false';
  state.screensaverEnabled = localStorage.getItem('pixo_screensaver') !== 'false';
  state.ledEnabled = localStorage.getItem('pixo_led') !== 'false';

  state.deviceName = localStorage.getItem('pixo_device_name') || DEFAULT_CONFIG.defaultDeviceName;
  state.brightness = parseInt(localStorage.getItem('pixo_brightness') || DEFAULT_CONFIG.defaultBrightness, 10);

  // Broker fisso e sicuro (non esposto agli utenti finali)
  state.brokerUrl = DEFAULT_CONFIG.brokerUrl;
  state.brokerUser = DEFAULT_CONFIG.brokerUser;
  state.brokerPass = DEFAULT_CONFIG.brokerPass;

  state.lang = localStorage.getItem('pixo_lang') || DEFAULT_CONFIG.defaultLang;
  state.canvasTheme = localStorage.getItem('pixo_canvas_theme') || DEFAULT_CONFIG.defaultTheme;
  state.weatherCity = localStorage.getItem('pixo_weather_city') || DEFAULT_CONFIG.defaultCity;

  setLanguage(state.lang);
  updateSettingsUI();
  renderGuestKeysList();
}

function updateSettingsUI() {
  if (state.isGuestMode) {
    deviceIdDisplay.textContent = `${state.deviceName || state.deviceId || "Pixò"} (Ospite)`;
    if (openSettingsBtn) openSettingsBtn.style.display = 'none';
    if (shareBtn) shareBtn.style.display = 'none';
    if (devicePill) {
      devicePill.style.cursor = 'default';
      devicePill.removeAttribute('title');
    }
    if (devicePinInput) devicePinInput.value = "";
    if (factoryResetSection) factoryResetSection.style.display = 'none';
    if (wifiManagementSection) wifiManagementSection.style.display = 'none';

    // Agli ospiti nascondiamo i controlli hardware (Luce stanza, Feed meteo/orologio, Impostazioni)
    if (lightToggleBtn) lightToggleBtn.style.display = 'none';
    if (weatherBtn) weatherBtn.style.display = 'none';
    if (clockBtn) clockBtn.style.display = 'none';
    const settingsTab = document.querySelector('.tab-item[data-tab="panelSettings"]');
    if (settingsTab) settingsTab.style.display = 'none';
    const galleryTab = document.querySelector('.tab-item[data-tab="panelGallery"]');
    if (galleryTab) galleryTab.style.display = 'none';
  } else {
    deviceIdDisplay.textContent = state.deviceName || state.deviceId || "Collega Pixò";
    if (openSettingsBtn) openSettingsBtn.style.display = 'none';
    if (shareBtn) shareBtn.style.display = '';
    if (devicePill) {
      devicePill.style.cursor = 'pointer';
      devicePill.title = "Clicca per aprire le impostazioni";
    }
    if (devicePinInput) devicePinInput.value = state.devicePin;
    if (factoryResetSection) factoryResetSection.style.display = 'block';
    if (wifiManagementSection) wifiManagementSection.style.display = 'flex';

    if (lightToggleBtn) lightToggleBtn.style.display = '';
    if (weatherBtn) weatherBtn.style.display = '';
    if (clockBtn) clockBtn.style.display = '';
    const settingsTab = document.querySelector('.tab-item[data-tab="panelSettings"]');
    if (settingsTab) settingsTab.style.display = '';
    const galleryTab = document.querySelector('.tab-item[data-tab="panelGallery"]');
    if (galleryTab) galleryTab.style.display = '';
  }

  deviceNameInput.value = state.deviceName;
  if (devicePinInput) devicePinInput.value = state.devicePin;
  if (hardwareIdDisplay) hardwareIdDisplay.textContent = state.deviceId || "(Non collegato)";
  brightnessSlider.value = state.brightness;
  brightnessVal.textContent = `${state.brightness}%`;
  langSelect.value = state.lang;
  themeSelect.value = state.canvasTheme;
  weatherCityInput.value = state.weatherCity;

  if (state.wifiSsid && currentWifiDesc) {
    currentWifiDesc.innerHTML = `<strong style="color:#fff;">${escapeHtml(state.wifiSsid)}</strong> <span style="color:var(--text-secondary); font-size:0.75rem;">(${state.wifiSignal || 0}% segnale${state.wifiIp ? ' • IP: ' + state.wifiIp : ''})</span>`;
    if (currentWifiBadge) {
      currentWifiBadge.style.display = 'inline-block';
      currentWifiBadge.textContent = 'Collegato';
    }
  }

  if (screensaverToggle) screensaverToggle.checked = state.screensaverEnabled;
  if (ledToggle) ledToggle.checked = state.ledEnabled;
  if (allowGuestsToggle) allowGuestsToggle.checked = state.allowGuests;
}

function buildGuestUrl(key) {
  const baseUrl = window.location.origin + window.location.pathname;
  const url = new URL(baseUrl);
  url.searchParams.set('id', state.deviceId);
  url.searchParams.set('key', key);
  url.searchParams.set('guest', '1');
  return url.toString();
}

// ==========================================================================
//  3. GESTIONE CANVAS & TEMI
// ==========================================================================
function getCanvasBgColor() {
  return state.canvasTheme === "light" ? "#ffffff" : "#000000";
}

function getDefaultPenColor() {
  return state.canvasTheme === "light" ? "#000000" : "#ffffff";
}

function initCanvas() {
  const bg = getCanvasBgColor();
  canvas.style.backgroundColor = bg;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  state.currentColor = getDefaultPenColor();
  document.querySelectorAll('.color-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.color.toLowerCase() === state.currentColor.toLowerCase());
  });

  state.undoStack = [];
  saveState();
  updatePayloadPreview();

  canvas.addEventListener('pointerdown', startDrawing);
  canvas.addEventListener('pointermove', draw);
  canvas.addEventListener('pointerup', stopDrawing);
  canvas.addEventListener('pointercancel', stopDrawing);
  canvas.addEventListener('pointerleave', stopDrawing);
}

function applyThemeChange(newTheme) {
  state.canvasTheme = newTheme;
  localStorage.setItem('pixo_canvas_theme', newTheme);
  const bg = getCanvasBgColor();
  canvas.style.backgroundColor = bg;

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  state.currentColor = getDefaultPenColor();
  document.querySelectorAll('.color-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.color.toLowerCase() === state.currentColor.toLowerCase());
  });

  saveState();
  updatePayloadPreview();
}

function getCanvasCoordinates(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: Math.round((e.clientX - rect.left) * scaleX),
    y: Math.round((e.clientY - rect.top) * scaleY)
  };
}

function startDrawing(e) {
  stopAutomaticFeed(); // Se l'utente disegna, ferma l'eventuale rassegna automatica
  if (state.interactiveElement.active) return;

  e.preventDefault();
  canvas.setPointerCapture(e.pointerId);

  const coords = getCanvasCoordinates(e);

  state.isDrawing = true;
  state.userHasDrawnLocally = true;
  state.lastX = coords.x;
  state.lastY = coords.y;

  const bg = getCanvasBgColor();
  const radius = (state.isEraser ? state.currentStroke * 2.5 : state.currentStroke) / 2;

  ctx.beginPath();
  ctx.arc(coords.x, coords.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = state.isEraser ? bg : state.currentColor;
  ctx.fill();
}

function draw(e) {
  if (!state.isDrawing || state.interactiveElement.active) return;
  e.preventDefault();

  const coords = getCanvasCoordinates(e);
  const bg = getCanvasBgColor();

  ctx.beginPath();
  ctx.moveTo(state.lastX, state.lastY);
  ctx.lineTo(coords.x, coords.y);
  ctx.strokeStyle = state.isEraser ? bg : state.currentColor;
  ctx.lineWidth = state.isEraser ? state.currentStroke * 2.5 : state.currentStroke;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();

  state.lastX = coords.x;
  state.lastY = coords.y;
}

function stopDrawing(e) {
  if (state.isDrawing) {
    state.isDrawing = false;
    saveState();
    updatePayloadPreview();
  }
}

function saveState() {
  if (state.undoStack.length >= state.maxUndo) {
    state.undoStack.shift();
  }
  state.undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

function undo() {
  stopAutomaticFeed();
  if (state.undoStack.length > 1) {
    state.undoStack.pop();
    const previousState = state.undoStack[state.undoStack.length - 1];
    ctx.putImageData(previousState, 0, 0);
    updatePayloadPreview();
    showToast(t("undo"));
  }
}

function clearCanvas() {
  stopAutomaticFeed();
  if (confirm(t("confirmClear"))) {
    const bg = getCanvasBgColor();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    state.userHasDrawnLocally = false;
    saveState();
    updatePayloadPreview();
    showToast(t("toastCleared"));
  }
}

// ==========================================================================
//  5. SISTEMA DI INGRANDIMENTO & POSIZIONAMENTO INTERATTIVO A SCHERMO
//     (Pinch-to-Zoom con 2 dita, Spostamento con 1 dito, Maniglie angolari)
// ==========================================================================

function startInteractiveOverlay(type, content, initialSize = null) {
  stopAutomaticFeed();
  state.interactiveElement.active = true;
  state.interactiveElement.type = type;
  state.interactiveElement.x = 120;
  state.interactiveElement.y = 120;

  if (type === 'image') {
    state.interactiveElement.imageObj = content;
    state.interactiveElement.content = '';
    const nw = content.naturalWidth || content.width || 200;
    const nh = content.naturalHeight || content.height || 200;
    const ar = nw / nh;
    state.interactiveElement.aspectRatio = ar;

    let initW = 180;
    if (ar < 1) { // orientamento verticale
      initW = Math.round(180 * ar);
    }
    state.interactiveElement.size = initialSize || Math.max(90, Math.min(220, initW));

    floatingContent.style.display = 'none';
    floatingImage.src = content.src;
    floatingImage.classList.remove('hidden');
    overlayHintText.textContent = "🖐️ Sposta e pizzica con 2 dita • Premi 'Invia a Display' quando pronto";
  } else if (type === 'sticker') {
    state.interactiveElement.imageObj = null;
    state.interactiveElement.content = content;
    state.interactiveElement.aspectRatio = 1;
    state.interactiveElement.size = initialSize || 48;

    floatingImage.classList.add('hidden');
    floatingContent.style.display = 'inline-block';
    floatingContent.textContent = content;
    floatingContent.style.color = '';
    floatingContent.style.fontWeight = 'normal';
    floatingContent.style.fontFamily = 'sans-serif';
    floatingContent.style.whiteSpace = 'nowrap';
    overlayHintText.textContent = "🖐️ Sposta e pizzica con 2 dita • Premi 'Invia a Display' quando pronto";
  } else if (type === 'text') {
    state.interactiveElement.imageObj = null;
    state.interactiveElement.content = content;
    state.interactiveElement.aspectRatio = 1;
    state.interactiveElement.size = initialSize || 26;

    floatingImage.classList.add('hidden');
    floatingContent.style.display = 'inline-block';
    floatingContent.textContent = content;
    const bg = getCanvasBgColor();
    let col = state.currentColor;
    if (col.toLowerCase() === bg.toLowerCase()) col = getDefaultPenColor();
    state.interactiveElement.color = col;
    floatingContent.style.color = col;
    floatingContent.style.fontWeight = 'bold';
    floatingContent.style.fontFamily = '-apple-system, sans-serif';
    floatingContent.style.whiteSpace = 'pre-wrap';
    overlayHintText.textContent = "🖐️ Sposta e pizzica con 2 dita • Premi 'Invia a Display' quando pronto";
  }

  elementOverlay.classList.remove('hidden');
  overlayToolbar.classList.remove('hidden');

  updateFloatingElementPosition();
  updateFloatingElementDisplay();

  // Secondo passaggio asincrono per garantire calcolo esatto del boundingClientRect
  requestAnimationFrame(() => {
    updateFloatingElementPosition();
    updateFloatingElementDisplay();
  });
}

function updateFloatingElementPosition() {
  const percentX = (state.interactiveElement.x / 240) * 100;
  const percentY = (state.interactiveElement.y / 240) * 100;
  floatingElement.style.left = `${percentX}%`;
  floatingElement.style.top = `${percentY}%`;
}

function updateFloatingElementDisplay() {
  const rect = elementOverlay.getBoundingClientRect();
  if (!rect.width) return;
  const scale = rect.width / 240;
  const { type, size, aspectRatio } = state.interactiveElement;

  if (type === 'image') {
    const dispW = Math.round(size * scale);
    const dispH = Math.round((size / aspectRatio) * scale);
    floatingImage.style.width = `${dispW}px`;
    floatingImage.style.height = `${dispH}px`;
  } else {
    const dispFont = Math.round(size * scale);
    floatingContent.style.fontSize = `${dispFont}px`;
    if (type === 'text') {
      floatingContent.style.maxWidth = `${Math.round(220 * scale)}px`;
      floatingContent.style.lineHeight = '1.25';
    }
  }
}

function closeInteractiveOverlay() {
  state.interactiveElement.active = false;
  elementOverlay.classList.add('hidden');
  overlayToolbar.classList.add('hidden');
  floatingElement.classList.remove('active-drag');
}

function confirmInteractiveOverlay(silent = false) {
  if (!state.interactiveElement.active) return;
  const { type, content, imageObj, x, y, size, aspectRatio, color } = state.interactiveElement;

  if (type === 'image' && imageObj) {
    const w = size;
    const h = Math.round(w / aspectRatio);
    const drawX = Math.round(x - w / 2);
    const drawY = Math.round(y - h / 2);
    ctx.drawImage(imageObj, drawX, drawY, w, h);
    if (!silent) showToast("Foto posizionata sul disegno!", "success");
  } else if (type === 'sticker') {
    ctx.font = `${size}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(content, x, y);
    if (!silent) showToast("Icona inserita sul disegno!", "success");
  } else if (type === 'text') {
    ctx.font = `bold ${size}px -apple-system, sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const lines = wrapText(ctx, content, 220);
    const lineHeight = Math.round(size * 1.25);
    const totalH = lines.length * lineHeight;
    let startY = y - (totalH / 2) + (lineHeight / 2);
    lines.forEach((l) => {
      ctx.fillText(l, x, startY);
      startY += lineHeight;
    });
    if (!silent) showToast("Testo inserito sul disegno!", "success");
  }

  saveState();
  updatePayloadPreview();
  closeInteractiveOverlay();
}

function setupOverlayInteraction() {
  let mode = null; // 'drag', 'pinch', 'handle'
  let activeHandle = null;

  let startTouch1 = { x: 0, y: 0 };
  let startDistance = 0;
  let startSize = 0;
  let startElemPos = { x: 120, y: 120 };
  let handleStartDist = 0;

  function getScale() {
    const rect = elementOverlay.getBoundingClientRect();
    return {
      scaleX: 240 / (rect.width || 240),
      scaleY: 240 / (rect.height || 240),
      rect: rect
    };
  }

  function clampSize(size, type) {
    if (type === 'image') return Math.max(30, Math.min(360, size));
    if (type === 'sticker') return Math.max(16, Math.min(180, size));
    return Math.max(12, Math.min(120, size)); // text
  }

  let cachedScale = null;

  // GESTIONE EVENTI TOUCH (Smartphone / Tablet)
  elementOverlay.addEventListener('touchstart', (e) => {
    if (!state.interactiveElement.active) return;
    cachedScale = getScale();
    const { rect } = cachedScale;

    if (e.touches.length === 2) {
      mode = 'pinch';
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      startDistance = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      startSize = state.interactiveElement.size;
      startTouch1 = { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
      startElemPos = { x: state.interactiveElement.x, y: state.interactiveElement.y };
      floatingElement.classList.add('active-drag');
      if (e.cancelable) e.preventDefault();
      return;
    }

    if (e.touches.length === 1) {
      const t = e.touches[0];
      const target = document.elementFromPoint(t.clientX, t.clientY);

      if (target && target.classList.contains('resize-handle')) {
        mode = 'handle';
        activeHandle = target.dataset.handle;
        startSize = state.interactiveElement.size;
        const centerScreenX = rect.left + (state.interactiveElement.x / 240) * rect.width;
        const centerScreenY = rect.top + (state.interactiveElement.y / 240) * rect.height;
        handleStartDist = Math.max(10, Math.hypot(t.clientX - centerScreenX, t.clientY - centerScreenY));
      } else {
        mode = 'drag';
        startTouch1 = { x: t.clientX, y: t.clientY };
        startElemPos = { x: state.interactiveElement.x, y: state.interactiveElement.y };
      }
      floatingElement.classList.add('active-drag');
      if (e.cancelable) e.preventDefault();
    }
  }, { passive: false });

  elementOverlay.addEventListener('touchmove', (e) => {
    if (!state.interactiveElement.active || !mode || !cachedScale) return;
    const { scaleX, scaleY, rect } = cachedScale;

    if (mode === 'pinch' && e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const curDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const scale = curDist / Math.max(10, startDistance);
      state.interactiveElement.size = clampSize(Math.round(startSize * scale), state.interactiveElement.type);

      const curMid = { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
      const dx = (curMid.x - startTouch1.x) * scaleX;
      const dy = (curMid.y - startTouch1.y) * scaleY;
      state.interactiveElement.x = Math.round(Math.max(-40, Math.min(280, startElemPos.x + dx)));
      state.interactiveElement.y = Math.round(Math.max(-40, Math.min(280, startElemPos.y + dy)));

      updateFloatingElementPosition();
      updateFloatingElementDisplay();
      if (e.cancelable) e.preventDefault();
    } else if (mode === 'drag' && e.touches.length === 1) {
      const t = e.touches[0];
      const dx = (t.clientX - startTouch1.x) * scaleX;
      const dy = (t.clientY - startTouch1.y) * scaleY;
      state.interactiveElement.x = Math.round(Math.max(-40, Math.min(280, startElemPos.x + dx)));
      state.interactiveElement.y = Math.round(Math.max(-40, Math.min(280, startElemPos.y + dy)));

      updateFloatingElementPosition();
      if (e.cancelable) e.preventDefault();
    } else if (mode === 'handle' && e.touches.length === 1) {
      const t = e.touches[0];
      const centerScreenX = rect.left + (state.interactiveElement.x / 240) * rect.width;
      const centerScreenY = rect.top + (state.interactiveElement.y / 240) * rect.height;
      const curDist = Math.hypot(t.clientX - centerScreenX, t.clientY - centerScreenY);
      const scale = curDist / handleStartDist;
      state.interactiveElement.size = clampSize(Math.round(startSize * scale), state.interactiveElement.type);

      updateFloatingElementDisplay();
      if (e.cancelable) e.preventDefault();
    }
  }, { passive: false });

  const endTouch = () => {
    mode = null;
    activeHandle = null;
    cachedScale = null;
    floatingElement.classList.remove('active-drag');
  };
  elementOverlay.addEventListener('touchend', endTouch);
  elementOverlay.addEventListener('touchcancel', endTouch);

  // GESTIONE EVENTI MOUSE (Desktop / PC)
  let isMouseDown = false;
  elementOverlay.addEventListener('mousedown', (e) => {
    if (!state.interactiveElement.active) return;
    cachedScale = getScale();
    const { rect } = cachedScale;
    isMouseDown = true;

    if (e.target && e.target.classList.contains('resize-handle')) {
      mode = 'handle';
      activeHandle = e.target.dataset.handle;
      startSize = state.interactiveElement.size;
      const centerScreenX = rect.left + (state.interactiveElement.x / 240) * rect.width;
      const centerScreenY = rect.top + (state.interactiveElement.y / 240) * rect.height;
      handleStartDist = Math.max(10, Math.hypot(e.clientX - centerScreenX, e.clientY - centerScreenY));
    } else {
      mode = 'drag';
      startTouch1 = { x: e.clientX, y: e.clientY };
      startElemPos = { x: state.interactiveElement.x, y: state.interactiveElement.y };
    }
    floatingElement.classList.add('active-drag');
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!state.interactiveElement.active || !isMouseDown || !mode || !cachedScale) return;
    const { scaleX, scaleY, rect } = cachedScale;

    if (mode === 'drag') {
      const dx = (e.clientX - startTouch1.x) * scaleX;
      const dy = (e.clientY - startTouch1.y) * scaleY;
      state.interactiveElement.x = Math.round(Math.max(-40, Math.min(280, startElemPos.x + dx)));
      state.interactiveElement.y = Math.round(Math.max(-40, Math.min(280, startElemPos.y + dy)));
      updateFloatingElementPosition();
    } else if (mode === 'handle') {
      const centerScreenX = rect.left + (state.interactiveElement.x / 240) * rect.width;
      const centerScreenY = rect.top + (state.interactiveElement.y / 240) * rect.height;
      const curDist = Math.hypot(e.clientX - centerScreenX, e.clientY - centerScreenY);
      const scale = curDist / handleStartDist;
      state.interactiveElement.size = clampSize(Math.round(startSize * scale), state.interactiveElement.type);
      updateFloatingElementDisplay();
    }
  });

  window.addEventListener('mouseup', () => {
    if (isMouseDown) {
      isMouseDown = false;
      mode = null;
      activeHandle = null;
      floatingElement.classList.remove('active-drag');
    }
  });

  // Zoom tramite rotellina del mouse
  elementOverlay.addEventListener('wheel', (e) => {
    if (!state.interactiveElement.active) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 4 : -4;
    state.interactiveElement.size = clampSize(state.interactiveElement.size + delta, state.interactiveElement.type);
    updateFloatingElementDisplay();
  }, { passive: false });

  // Ridimensionamento viewport / rotazione schermo
  window.addEventListener('resize', () => {
    if (state.interactiveElement.active) {
      updateFloatingElementPosition();
      updateFloatingElementDisplay();
    }
  });

  // Conferma & Annulla
  confirmOverlayBtn.addEventListener('click', confirmInteractiveOverlay);
  cancelOverlayBtn.addEventListener('click', closeInteractiveOverlay);
}

function initStickers() {
  stickerGrid.innerHTML = '';
  STICKERS.forEach(emoji => {
    const el = document.createElement('button');
    el.className = 'sticker-item';
    el.textContent = emoji;
    el.title = emoji;
    el.addEventListener('click', () => {
      stickerDrawer.classList.add('hidden');
      startInteractiveOverlay('sticker', emoji, 48);
    });
    stickerGrid.appendChild(el);
  });
}

function wrapText(context, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine.length === 0 ? word : currentLine + ' ' + word;
    const metrics = context.measureText(testLine);
    if (metrics.width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  return lines;
}

function applyCustomText() {
  stopAutomaticFeed();
  const text = customTextInput.value.trim();
  if (!text) return;

  textModal.classList.add('hidden');
  customTextInput.value = '';
  startInteractiveOverlay('text', text, state.textSize || 24);
}

// ==========================================================================
//  6. METEO AUTOMATICO (INVIO IMMEDIATO + AGGIORNAMENTO OGNI 15 MIN)
// ==========================================================================
async function activateWeatherMode() {
  stopAutomaticFeed();
  state.activeFeedType = "weather";
  await connectMQTT();
  await fetchAndRenderWeather();

  // Imposta auto-aggiornamento ogni 15 minuti
  state.feedTimer = setInterval(async () => {
    if (state.activeFeedType === "weather") {
      await fetchAndRenderWeather();
    }
  }, 15 * 60 * 1000);
}

async function fetchAndRenderWeather() {
  const city = state.weatherCity || "Roma";

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=${state.lang}&format=json`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      showToast(`Città "${city}" non trovata!`, "error");
      stopAutomaticFeed();
      return;
    }

    const { latitude, longitude, name, country_code } = geoData.results[0];
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
    const wRes = await fetch(weatherUrl);
    const wData = await wRes.json();

    const curr = wData.current;
    const daily = wData.daily;
    const temp = Math.round(curr.temperature_2m);
    const humidity = Math.round(curr.relative_humidity_2m);
    const wind = Math.round(curr.wind_speed_10m);
    const tMin = Math.round(daily.temperature_2m_min[0]);
    const tMax = Math.round(daily.temperature_2m_max[0]);
    const wCode = curr.weather_code;

    let icon = "☀️";
    let desc = state.lang === 'it' ? "Sereno" : "Clear";
    if (wCode === 1 || wCode === 2) { icon = "⛅"; desc = state.lang === 'it' ? "Poco Nuvoloso" : "Partly Cloudy"; }
    else if (wCode === 3) { icon = "☁️"; desc = state.lang === 'it' ? "Nuvoloso" : "Overcast"; }
    else if (wCode >= 45 && wCode <= 48) { icon = "🌫️"; desc = state.lang === 'it' ? "Nebbia" : "Fog"; }
    else if ((wCode >= 51 && wCode <= 67) || (wCode >= 80 && wCode <= 82)) { icon = "🌧️"; desc = state.lang === 'it' ? "Pioggia" : "Rain"; }
    else if (wCode >= 71 && wCode <= 77) { icon = "❄️"; desc = state.lang === 'it' ? "Neve" : "Snow"; }
    else if (wCode >= 95) { icon = "⚡"; desc = state.lang === 'it' ? "Temporale" : "Storm"; }

    // Disegno Scheda Meteo
    ctx.fillStyle = "#0c101c";
    ctx.fillRect(0, 0, 240, 240);

    ctx.fillStyle = "#4361ee";
    ctx.fillRect(0, 0, 240, 42);
    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`📍 ${name.toUpperCase()} (${country_code})`, 120, 21);

    ctx.font = "58px sans-serif";
    ctx.fillText(icon, 120, 88);

    ctx.font = "bold 40px sans-serif";
    ctx.fillStyle = "#f1f3f7";
    ctx.fillText(`${temp}°C`, 120, 140);

    ctx.font = "bold 16px sans-serif";
    ctx.fillStyle = "#ffd166";
    ctx.fillText(desc, 120, 170);

    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#8c93a0";
    ctx.fillText(`Min: ${tMin}°C  •  Max: ${tMax}°C`, 120, 196);

    ctx.font = "13px sans-serif";
    ctx.fillStyle = "#06d6a0";
    ctx.fillText(`💧 ${humidity}%   💨 ${wind} km/h`, 120, 220);

    saveState();
    updatePayloadPreview();

    // INVIO IMMEDIATO A PIXÒ!
    await sendCanvasMqtt(false);

    // Mostra banner attivo
    feedStatusText.textContent = t("feedWeatherActive", { city: name });
    feedBanner.classList.remove('hidden');
    showToast(t("toastWeatherSent", { city: name }), "success");
  } catch (err) {
    console.error("Errore meteo:", err);
    showToast("Errore caricamento meteo", "error");
    stopAutomaticFeed();
  }
}



function stopAutomaticFeed() {
  if (state.feedTimer) {
    clearInterval(state.feedTimer);
    state.feedTimer = null;
  }
  if (state.activeFeedType) {
    state.activeFeedType = null;
    feedBanner.classList.add('hidden');
    showToast(t("feedStopped"));
  }
}

// ==========================================================================
//  7b. OROLOGIO DIGITALE NATIVO (STILE SMART WEATHER CLOCK)
// ==========================================================================
async function activateClockMode() {
  stopAutomaticFeed();
  state.activeFeedType = "clock";
  await connectMQTT();

  // Invia il comando nativo CLOCK al display ESP32-C3!
  await sendClockCommand();

  // Avvia l'anteprima animata sul canvas locale con separatore ':' lampeggiante a 1Hz
  renderClockCanvas();
  state.feedTimer = setInterval(() => {
    if (state.activeFeedType === "clock") {
      renderClockCanvas();
    }
  }, 1000);

  feedStatusText.textContent = t("feedClockActive");
  feedBanner.classList.remove('hidden');
  showToast(t("toastClockSent"), "success");
}

let webColonVisible = true;
function renderClockCanvas() {
  webColonVisible = !webColonVisible;
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const daysIt = ['DOM', 'LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB'];
  const daysEn = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthsIt = ['GEN', 'FEB', 'MAR', 'APR', 'MAG', 'GIU', 'LUG', 'AGO', 'SET', 'OTT', 'NOV', 'DIC'];
  const monthsEn = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  const dayName = state.lang === 'it' ? daysIt[now.getDay()] : daysEn[now.getDay()];
  const monthName = state.lang === 'it' ? monthsIt[now.getMonth()] : monthsEn[now.getMonth()];
  const dateStr = `${now.getDate()} ${monthName} ${now.getFullYear()}`;
  const headerDate = `${dayName} ${String(now.getDate()).padStart(2, '0')}`;

  // Sfondo nero puro identico all'orologio fisico
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 240, 240);

  // Barra superiore Navy / Dark Cyan
  ctx.fillStyle = "#0d1b2a";
  ctx.fillRect(0, 0, 240, 36);

  ctx.font = "bold 15px -apple-system, sans-serif";
  ctx.fillStyle = "#00b4d8";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("PIXÒ CLOCK", 12, 18);

  ctx.fillStyle = "#ffd166";
  ctx.textAlign = "right";
  ctx.fillText(headerDate, 228, 18);

  // Linea divisoria sottile
  ctx.strokeStyle = "#0077b6";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 36);
  ctx.lineTo(240, 36);
  ctx.stroke();

  // Cifre Ore (grandi a sinistra)
  ctx.font = "bold 56px -apple-system, monospace, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText(hours, 65, 88);

  // Separatore due punti ':' lampeggiante a 1Hz
  if (webColonVisible) {
    ctx.fillStyle = "#f77f00";
    ctx.fillRect(115, 68, 8, 11);
    ctx.fillRect(115, 93, 8, 11);
  }

  // Cifre Minuti (grandi a destra)
  ctx.fillStyle = "#ffffff";
  ctx.fillText(minutes, 175, 88);

  // Data per esteso centrale
  ctx.font = "bold 15px sans-serif";
  ctx.fillStyle = "#06d6a0";
  ctx.fillText(dateStr, 120, 148);

  // Cornice barra avanzamento secondi
  ctx.strokeStyle = "#415a77";
  ctx.strokeRect(18, 178, 204, 10);

  // Barra avanzamento secondi (0-59s)
  const barW = Math.round((now.getSeconds() / 59) * 200);
  ctx.fillStyle = "#00b4d8";
  ctx.fillRect(20, 180, barW, 6);

  // Secondi numerici in basso
  ctx.font = "bold 16px monospace, sans-serif";
  ctx.fillStyle = "#00b4d8";
  ctx.fillText(`:${seconds}`, 120, 212);

  saveState();
  updatePayloadPreview();
}

async function sendClockCommand() {
  if (!state.deviceId) return;
  if (!state.mqttConnected || !state.mqttClient || !state.mqttClient.connected) {
    await connectMQTT();
    if (!state.mqttConnected) return;
  }
  const topic = getDrawTopic();
  const cmd = new TextEncoder().encode("CLOCK");
  if (state.mqttClient && state.mqttClient.connected) {
    state.mqttClient.publish(topic, cmd, { qos: 0, retain: false }, (err) => {
      if (!err) {
        console.log("[MQTT] Comando CLOCK inviato con successo a Pixò!");
      }
    });

    const currentTopic = `pixo/device/${state.deviceId}/current`;
    state.mqttClient.publish(currentTopic, cmd, { qos: 0, retain: true });
  }
}

// ==========================================================================
//  7c. GESTIONE SALVATAGGIO DISEGNI & GALLERIA PERSONALE
// ==========================================================================
function getSavedDrawings() {
  try {
    return JSON.parse(localStorage.getItem('pixo_saved_drawings')) || [];
  } catch(e) {
    return [];
  }
}

function saveCurrentCanvas() {
  if (state.interactiveElement && state.interactiveElement.active) {
    confirmInteractiveOverlay(true);
  }
  const drawings = getSavedDrawings();
  const now = new Date();
  const defaultName = `Pixò ${now.toLocaleDateString([], {day:'2-digit', month:'2-digit'})} ${now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`;
  const name = prompt(state.lang === 'it' ? "Inserisci un nome per questo disegno:" : "Enter a name for this drawing:", defaultName);
  if (!name) return;

  const item = {
    id: Date.now(),
    name: name.trim(),
    date: now.toLocaleString(),
    dataUrl: canvas.toDataURL("image/png")
  };

  drawings.unshift(item);
  localStorage.setItem('pixo_saved_drawings', JSON.stringify(drawings));
  showToast(t("toastDrawingSaved"), "success");
  if (!galleryModal.classList.contains('hidden')) {
    renderGallery();
  }
}

function renderGallery() {
  const drawings = getSavedDrawings();
  galleryCountText.textContent = `${drawings.length} ${state.lang === 'it' ? 'disegni' : 'drawings'}`;

  if (drawings.length === 0) {
    galleryEmptyMessage.style.display = 'flex';
    galleryGrid.innerHTML = '';
    return;
  }

  galleryEmptyMessage.style.display = 'none';
  galleryGrid.innerHTML = '';

  drawings.forEach((d) => {
    const card = document.createElement('div');
    card.className = 'gallery-thumb-card';

    const img = document.createElement('img');
    img.src = d.dataUrl;
    img.alt = d.name;
    img.title = `${d.name} (${d.date})`;
    card.onclick = () => loadSavedDrawing(d.id);

    const delBtn = document.createElement('button');
    delBtn.className = 'gallery-card-del-btn';
    delBtn.innerHTML = '🗑️';
    delBtn.title = state.lang === 'it' ? 'Elimina disegno' : 'Delete drawing';
    delBtn.onclick = (e) => {
      e.stopPropagation();
      deleteSavedDrawing(d.id);
    };

    card.appendChild(img);
    card.appendChild(delBtn);
    galleryGrid.appendChild(card);
  });
}

function loadSavedDrawing(id) {
  const drawings = getSavedDrawings();
  const found = drawings.find(d => d.id === id);
  if (!found) return;

  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0, 240, 240);
    saveState();
    updatePayloadPreview();
    // Torna alla tab del disegno per vederlo subito
    document.querySelector('.tab-item[data-tab="panelDraw"]')?.click();
    showToast(t("toastDrawingLoaded"), "success");
  };
  img.src = found.dataUrl;
}


function sendSavedDrawingDirect(id) {
  const drawings = getSavedDrawings();
  const found = drawings.find(d => d.id === id);
  if (!found) return;

  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0, 240, 240);
    saveState();
    updatePayloadPreview();
    galleryModal.classList.add('hidden');
    sendCanvasMqtt(false);
  };
  img.src = found.dataUrl;
}

function deleteSavedDrawing(id) {
  const confirmMsg = state.lang === 'it' ? "Vuoi eliminare questo disegno?" : "Delete this drawing?";
  if (!confirm(confirmMsg)) return;

  let drawings = getSavedDrawings();
  drawings = drawings.filter(d => d.id !== id);
  localStorage.setItem('pixo_saved_drawings', JSON.stringify(drawings));
  showToast(t("toastDrawingDeleted"), "success");
  renderGallery();
}

// ==========================================================================
//  7d. GESTIONE CONFIGURAZIONI SCREENSAVER, LED E CONTROLLO ACCESSI MQTT
// ==========================================================================
function sendScreensaverConfig(enabled) {
  state.screensaverEnabled = enabled;
  localStorage.setItem('pixo_screensaver', enabled ? 'true' : 'false');
  if (!state.mqttConnected || !state.deviceId) return;
  const topic = `pixo/device/${state.deviceId}/screensaver`;
  const cmd = enabled ? "SCREENSAVER:ON" : "SCREENSAVER:OFF";
  state.mqttClient.publish(topic, cmd, { qos: 0, retain: false });
  showToast(enabled ? "Screensaver 30m ATTIVATO" : "Screensaver DISATTIVATO", "success");
}

async function sendLedConfig(enabled) {
  state.ledEnabled = enabled;
  localStorage.setItem('pixo_led', enabled ? 'true' : 'false');
  if (!state.mqttConnected || !state.mqttClient || !state.mqttClient.connected) {
    await connectMQTT();
  }
  if (!state.deviceId) return;
  const topic = `pixo/device/${state.deviceId}/led`;
  const cmd = enabled ? "NOTIF:ON" : "NOTIF:OFF";
  if (state.mqttClient && state.mqttClient.connected) {
    state.mqttClient.publish(topic, cmd, { qos: 0, retain: false });
  }
  showToast(enabled 
    ? (state.lang === 'it' ? "Lampeggio LED notifica ATTIVATO" : "Notification LED blink ENABLED") 
    : (state.lang === 'it' ? "Lampeggio LED notifica DISATTIVATO" : "Notification LED blink DISABLED"), 
    "success");
}

async function toggleContinuousLight() {
  if (state.isGuestMode) {
    showToast(state.lang === 'it' ? "Solo il proprietario può controllare la luce LED" : "Only the owner can control the LED light", "warning");
    return;
  }
  if (!state.mqttConnected || !state.mqttClient || !state.mqttClient.connected) {
    await connectMQTT();
  }
  state.lightOn = !state.lightOn;
  if (!state.deviceId) return;

  const topic = (state.devicePin && state.devicePin !== "1234")
    ? `pixo/device/${state.deviceId}/${state.devicePin}/led`
    : `pixo/device/${state.deviceId}/led`;
  const cmd = state.lightOn ? "LIGHT:ON" : "LIGHT:OFF";
  if (state.mqttClient && state.mqttClient.connected) {
    state.mqttClient.publish(topic, cmd, { qos: 0, retain: false });
  }

  const btn = document.getElementById('lightToggleBtn');
  if (btn) {
    if (state.lightOn) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  }

  showToast(state.lightOn 
    ? (state.lang === 'it' ? "Luce continua ACCESA 💡" : "Continuous Light ON 💡") 
    : (state.lang === 'it' ? "Luce continua SPENTA 🌑" : "Continuous Light OFF 🌑"), 
    "success");
}

function sendGuestAccessConfig(enabled) {
  state.allowGuests = enabled;
  localStorage.setItem('pixo_allow_guests', enabled ? 'true' : 'false');
  if (!state.mqttConnected || !state.deviceId) return;
  const status = enabled ? "ENABLE" : "DISABLE";
  state.mqttClient.publish(`pixo/device/${state.deviceId}/access/status`, status, { qos: 0, retain: true });
  state.mqttClient.publish(`pixo/device/${state.deviceId}/access`, `GUEST:${status}`, { qos: 0, retain: true });
  showToast(enabled ? t("toastGuestEnabled") : t("toastGuestDisabled"), enabled ? "success" : "error");
}

function renderGuestKeysList() {
  if (!guestKeysList) return;
  guestKeysList.innerHTML = '';

  const count = state.guestKeys ? state.guestKeys.length : 0;
  if (guestKeysCountBadge) {
    guestKeysCountBadge.textContent = `${count} ${count === 1 ? 'attivo' : 'attivi'}`;
  }

  if (count === 0) {
    if (guestKeysEmpty) guestKeysEmpty.style.display = 'flex';
    return;
  }
  if (guestKeysEmpty) guestKeysEmpty.style.display = 'none';

  state.guestKeys.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'guest-key-card';

    const header = document.createElement('div');
    header.className = 'guest-card-header';

    const title = document.createElement('div');
    title.className = 'guest-card-title';
    title.innerHTML = `<span>👤</span> <span>${escapeHtml(item.name || 'Ospite')}</span>`;

    const meta = document.createElement('div');
    meta.className = 'guest-card-meta';

    if (item.created) {
      const d = new Date(item.created);
      const dateSpan = document.createElement('span');
      dateSpan.className = 'guest-card-date';
      dateSpan.textContent = d.toLocaleDateString(state.lang === 'it' ? 'it-IT' : 'en-US', { day: '2-digit', month: 'short' });
      meta.appendChild(dateSpan);
    }

    const delBtn = document.createElement('button');
    delBtn.className = 'guest-card-delete-btn';
    delBtn.title = state.lang === 'it' ? 'Revoca ed elimina questo link' : 'Revoke and delete this link';
    delBtn.innerHTML = '🗑️ Revoca';
    delBtn.addEventListener('click', () => {
      deleteGuestKey(item.id, item.name);
    });
    meta.appendChild(delBtn);

    header.appendChild(title);
    header.appendChild(meta);

    const linkRow = document.createElement('div');
    linkRow.className = 'guest-card-link-row';

    const fullUrl = buildGuestUrl(item.key);
    const linkInput = document.createElement('input');
    linkInput.type = 'text';
    linkInput.value = fullUrl;
    linkInput.readOnly = true;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn mini-btn';
    copyBtn.innerHTML = '📋 Copia';
    copyBtn.addEventListener('click', () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullUrl).then(() => {
          showToast(`Link per "${item.name}" copiato!`, 'success');
        }).catch(() => {
          linkInput.select();
          document.execCommand('copy');
          showToast(`Link per "${item.name}" copiato!`, 'success');
        });
      } else {
        linkInput.select();
        document.execCommand('copy');
        showToast(`Link per "${item.name}" copiato!`, 'success');
      }
    });

    linkRow.appendChild(linkInput);
    linkRow.appendChild(copyBtn);

    card.appendChild(header);
    card.appendChild(linkRow);
    guestKeysList.appendChild(card);
  });
}

function addNewGuestKey(name) {
  const cleanName = (name || '').trim();
  if (!cleanName) {
    showToast(state.lang === 'it' ? "Inserisci un nome per il link (es. Roberto)" : "Enter a name for the link", "warning");
    if (newGuestNameInput) newGuestNameInput.focus();
    return;
  }

  const token = generateRandomGuestKey();
  const newEntry = {
    id: 'k_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    name: cleanName,
    key: token,
    created: Date.now()
  };

  if (!state.guestKeys) state.guestKeys = [];
  state.guestKeys.unshift(newEntry);
  localStorage.setItem('pixo_guest_keys', JSON.stringify(state.guestKeys));

  if (newGuestNameInput) newGuestNameInput.value = '';

  syncGuestKeysToDevice();
  renderGuestKeysList();
  showToast(state.lang === 'it' ? `Link creato per "${cleanName}"!` : `Link created for "${cleanName}"!`, "success");
}

function deleteGuestKey(id, name) {
  const confirmMsg = state.lang === 'it'
    ? `Vuoi revocare l'accesso per "${name}"?\nChi possiede questo link non potrà più inviare disegni a Pixò.`
    : `Revoke access for "${name}"?\nAnyone with this link will no longer be able to send drawings to Pixò.`;
  if (!confirm(confirmMsg)) return;

  state.guestKeys = state.guestKeys.filter(k => k.id !== id);
  localStorage.setItem('pixo_guest_keys', JSON.stringify(state.guestKeys));

  syncGuestKeysToDevice();
  renderGuestKeysList();
  showToast(state.lang === 'it' ? `Accesso per "${name}" revocato!` : `Access for "${name}" revoked!`, "success");
}

function revokeAllGuestKeys() {
  const confirmMsg = state.lang === 'it'
    ? "⚠️ Vuoi davvero revocare ed eliminare TUTTI i link ospite?\nTutti i link distribuiti smetteranno immediatamente di funzionare."
    : "⚠️ Really revoke and delete ALL guest links?\nAll distributed links will stop working immediately.";
  if (!confirm(confirmMsg)) return;

  state.guestKeys = [];
  localStorage.setItem('pixo_guest_keys', JSON.stringify([]));

  syncGuestKeysToDevice();
  renderGuestKeysList();
  showToast(state.lang === 'it' ? "Tutti i link ospite sono stati revocati!" : "All guest links revoked!", "success");
}

function syncGuestKeysToDevice(forcePublishData = true) {
  if (!state.deviceId) return;
  const keysArray = (state.guestKeys || []).map(k => (k.key || '').trim()).filter(Boolean);
  const keysStr = keysArray.length > 0 ? keysArray.join(',') : 'NONE';

  if (state.mqttConnected && state.mqttClient && state.mqttClient.connected) {
    // 1. Topic hardware per la WebApp e client cloud
    state.mqttClient.publish(`pixo/device/${state.deviceId}/access/keys`, keysStr, { qos: 0, retain: true });
    // Retrocompatibilità con firmware legacy
    const firstKey = keysArray.length > 0 ? keysArray[0] : 'NONE';
    state.mqttClient.publish(`pixo/device/${state.deviceId}/access/key`, firstKey, { qos: 0, retain: true });

    // 2. FONDAMENTALE PER ESP32: L'ESP32 è sottoscritto al topic base `access`!
    // Invia il comando GUEST:KEYS:<elenco> che aggiorna la memoria NVS dell'ESP32 in tempo reale
    state.mqttClient.publish(`pixo/device/${state.deviceId}/access`, `GUEST:KEYS:${keysStr}`, { qos: 0, retain: true });
    if (firstKey !== 'NONE') {
      state.mqttClient.publish(`pixo/device/${state.deviceId}/access`, `GUEST:KEY:${firstKey}`, { qos: 0, retain: false });
    }

    // Assicura che l'accesso ospiti sia abilitato sull'ESP32 se impostato su true
    if (state.allowGuests !== false) {
      state.mqttClient.publish(`pixo/device/${state.deviceId}/access/status`, "ENABLE", { qos: 0, retain: true });
      state.mqttClient.publish(`pixo/device/${state.deviceId}/access`, "GUEST:ENABLE", { qos: 0, retain: false });
    }

    // 3. Topic Cloud con nomi ed etichette per sincronizzare tutti i dispositivi del proprietario (PC, cellulare)
    if (forcePublishData) {
      const keysJson = JSON.stringify(state.guestKeys || []);
      state.mqttClient.publish(`pixo/device/${state.deviceId}/access/keys_data`, keysJson, { qos: 0, retain: true });
    }
  }
}

function handleGuestKeysSyncFromCloud(payload) {
  try {
    const uint8 = (payload instanceof Uint8Array) 
      ? new Uint8Array(payload.buffer, payload.byteOffset, payload.byteLength)
      : new Uint8Array(payload);
    const text = new TextDecoder().decode(uint8).trim();
    if (!text || text === "NONE" || text === "[]") return;
    const cloudKeys = JSON.parse(text);
    if (Array.isArray(cloudKeys) && cloudKeys.length > 0) {
      state.guestKeys = cloudKeys;
      localStorage.setItem('pixo_guest_keys', JSON.stringify(cloudKeys));
      renderGuestKeysList();
      console.log('[SYNC] Sincronizzate', cloudKeys.length, 'chiavi ospiti nominative dal Cloud!');
    }
  } catch (e) {
    console.warn('[SYNC] Errore sync chiavi ospiti dal cloud:', e);
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ==========================================================================
//  GESTIONE WI-FI PIXÒ (TELEMETRIA, CAMBIO REMOTO & PORTALE AP)
// ==========================================================================
function handleWifiStatusSync(payload) {
  try {
    const uint8 = (payload instanceof Uint8Array)
      ? new Uint8Array(payload.buffer, payload.byteOffset, payload.byteLength)
      : new Uint8Array(payload);
    const text = new TextDecoder().decode(uint8).trim();
    if (!text) return;
    const data = JSON.parse(text);

    if (data.status === 'connecting') {
      if (currentWifiDesc) {
        currentWifiDesc.innerHTML = `<span style="color:var(--accent-orange);">⏳ Connessione a <strong>${escapeHtml(data.ssid || '')}</strong>...</span>`;
      }
      if (currentWifiBadge) {
        currentWifiBadge.style.display = 'inline-block';
        currentWifiBadge.textContent = 'In corso...';
        currentWifiBadge.style.background = 'rgba(255,149,0,0.15)';
        currentWifiBadge.style.color = 'var(--accent-orange)';
      }
    } else if (data.ssid) {
      state.wifiSsid = data.ssid;
      state.wifiSignal = data.signal || 0;
      state.wifiIp = data.ip || '';
      if (currentWifiDesc) {
        currentWifiDesc.innerHTML = `<strong style="color:#fff;">${escapeHtml(data.ssid)}</strong> <span style="color:var(--text-secondary); font-size:0.75rem;">(${data.signal || 0}% segnale${data.ip ? ' • IP: ' + data.ip : ''})</span>`;
      }
      if (currentWifiBadge) {
        currentWifiBadge.style.display = 'inline-block';
        currentWifiBadge.textContent = 'Collegato';
        currentWifiBadge.style.background = 'rgba(52,199,89,0.15)';
        currentWifiBadge.style.color = 'var(--accent-green)';
      }
    }
  } catch (err) {
    console.warn('[WiFi] Errore parsing stato Wi-Fi:', err);
  }
}

function handleApplyNewWifi() {
  if (state.isGuestMode) {
    alert("Operazione non consentita in modalità ospite.");
    return;
  }
  const newSsid = (newWifiSsidInput ? newWifiSsidInput.value.trim() : "");
  const newPass = (newWifiPassInput ? newWifiPassInput.value : "");

  if (!newSsid) {
    alert("Inserisci il nome della nuova rete Wi-Fi (SSID).");
    return;
  }

  const confirmMsg = `Confermi di voler collegare Pixò alla rete Wi-Fi "${newSsid}"?\n\nPixò proverà a connettersi per 15 secondi. In caso di errore o password errata, ripristinerà automaticamente la rete attuale.`;
  if (!confirm(confirmMsg)) return;

  if (state.mqttClient && state.mqttClient.connected && state.deviceId) {
    const payload = JSON.stringify({
      ssid: newSsid,
      pass: newPass,
      pin: state.devicePin || "1234"
    });

    const pin = state.devicePin || "1234";
    state.mqttClient.publish(`pixo/device/${state.deviceId}/${pin}/setwifi`, payload, { qos: 0 });
    state.mqttClient.publish(`pixo/device/${state.deviceId}/setwifi`, payload, { qos: 0 });

    showToast(`Comando inviato! Pixò si connette a ${newSsid}...`, "info");
    if (newWifiFormBox) newWifiFormBox.style.display = 'none';
    if (currentWifiDesc) {
      currentWifiDesc.innerHTML = `<span style="color:var(--accent-orange);">⏳ Cambio rete in corso verso <strong>${escapeHtml(newSsid)}</strong>...</span>`;
    }
    if (newWifiPassInput) newWifiPassInput.value = "";
  } else {
    showToast("Disconnesso dal Cloud. Impossibile inviare.", "error");
  }
}

function handleOpenWifiPortal() {
  if (state.isGuestMode) {
    alert("Operazione non consentita in modalità ospite.");
    return;
  }
  const confirmMsg = "Pixò riavvierà il modulo Wi-Fi e attiverà la rete hotspot 'Pixo-Setup' per 3 minuti.\n\nPotrai collegarti col cellulare all'hotspot e scansionare le reti vicine per selezionare quella desiderata.\n\nVuoi avviare la procedura?";
  if (!confirm(confirmMsg)) return;

  if (state.mqttClient && state.mqttClient.connected && state.deviceId) {
    const pin = state.devicePin || "1234";
    state.mqttClient.publish(`pixo/device/${state.deviceId}/${pin}/wifi_portal`, "WIFI:PORTAL", { qos: 0 });
    state.mqttClient.publish(`pixo/device/${state.deviceId}/wifi_portal`, "WIFI:PORTAL", { qos: 0 });

    showToast("Hotspot Pixo-Setup attivato su Pixò!", "info");
    if (currentWifiDesc) {
      currentWifiDesc.innerHTML = `<span style="color:var(--accent-orange);">📶 Hotspot <strong>Pixo-Setup</strong> attivo. Collegati col cellulare!</span>`;
    }
  } else {
    showToast("Disconnesso dal Cloud. Impossibile inviare.", "error");
  }
}

// ==========================================================================
//  8. CONTROLLO LUMINOSITÀ HARDWARE (PWM VIA MQTT)
// ==========================================================================
function sendBrightness(percent) {
  state.brightness = percent;
  localStorage.setItem('pixo_brightness', percent);
  brightnessVal.textContent = `${percent}%`;

  if (!state.mqttConnected || !state.deviceId) return;

  const topic = `pixo/device/${state.deviceId}/brightness`;
  const payload = new TextEncoder().encode(percent.toString());
  state.mqttClient.publish(topic, payload, { qos: 0, retain: false });
}

// ==========================================================================
//  9. TRASMISSIONE MQTT (QoS 0 CON LOCK DI CONCORRENZA)
// ==========================================================================
function getCanvasJpegBlob() {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg', DEFAULT_CONFIG.jpegQuality);
  });
}

async function updatePayloadPreview() {
  const blob = await getCanvasJpegBlob();
  const kb = (blob.size / 1024).toFixed(1);
  payloadSizeBadge.textContent = `Payload: ~${kb} KB`;
}

let mqttConnectPromise = null;
let hasShownConnectedToast = false;

function connectMQTT() {
  if (state.mqttConnected && state.mqttClient && state.mqttClient.connected) {
    return Promise.resolve(true);
  }
  if (mqttConnectPromise) return mqttConnectPromise;

  state.mqttConnecting = true;
  statusDot.className = "status-pulse status-dot connecting";
  statusDot.title = "Connessione a Pixò Cloud...";

  const clientId = "WebPixo_" + Math.random().toString(16).substr(2, 8);
  const options = {
    clientId: clientId,
    clean: true,
    connectTimeout: 7000,
    reconnectPeriod: 2000,
    keepalive: 60,
    username: state.brokerUser,
    password: state.brokerPass
  };

  mqttConnectPromise = new Promise((resolve) => {
    try {
      if (!state.mqttClient) {
        state.mqttClient = mqtt.connect(state.brokerUrl, options);

        state.mqttClient.on('connect', () => {
          console.log('[MQTT] Connesso via WebSocket a Pixò Cloud!');
          state.mqttConnected = true;
          state.mqttConnecting = false;
          mqttConnectPromise = null;
          statusDot.className = "status-pulse status-dot online";
          statusDot.title = "Connesso a Pixò Cloud";

          // Mostra il toast di benvenuto una sola volta all'avvio, mai in loop
          if (!hasShownConnectedToast) {
            hasShownConnectedToast = true;
            showToast(t("toastConnected"), "success");
          }

          // Invia la luminosità memorizzata all'avvio solo se proprietario
          if (!state.isGuestMode) {
            sendBrightness(state.brightness);
          }

          if (state.deviceId) {
            if (state.isGuestMode) {
              // IN MODALITÀ OSPITE:
              // 1. Sottoscrizione alle chiavi autorizzate e allo stato di abilitazione
              const accessKeysTopic = `pixo/device/${state.deviceId}/access/keys`;
              const accessStatusTopic = `pixo/device/${state.deviceId}/access/status`;
              const guestAckTopic = `pixo/device/${state.deviceId}/guest/${state.guestKey}/ack`;
              state.mqttClient.subscribe(accessKeysTopic, { qos: 1 });
              state.mqttClient.subscribe(accessStatusTopic, { qos: 1 });
              state.mqttClient.subscribe(guestAckTopic, { qos: 0 });

              // Timer di timeout verifica: se entro 4s non riceve conferma autorizzazione, blocca
              if (guestAuthTimeout) clearTimeout(guestAuthTimeout);
              guestAuthTimeout = setTimeout(() => {
                if (state.guestAuthorized === null) {
                  setGuestAccessAuthorized(false, state.lang === 'it' 
                    ? "Impossibile verificare l'autorizzazione di questo link di invito." 
                    : "Unable to verify this invitation link.");
                }
              }, 4000);
            } else {
              // IN MODALITÀ PROPRIETARIO:
              // Sottoscrizione allo stato hardware di Pixò (LWT online/offline)
              const statusTopic = `pixo/device/${state.deviceId}/status`;
              state.mqttClient.subscribe(statusTopic, { qos: 1 });

              // Sottoscrizione al topic di sincronizzazione disegno attuale
              const currentTopic = `pixo/device/${state.deviceId}/current`;
              state.mqttClient.subscribe(currentTopic, { qos: 0 });

              // Sottoscrizione al topic cloud chiavi ospiti con etichette se proprietario
              const keysDataTopic = `pixo/device/${state.deviceId}/access/keys_data`;
              state.mqttClient.subscribe(keysDataTopic, { qos: 1 });
              syncGuestKeysToDevice(false);

              // Sottoscrizione al topic di telemetria Wi-Fi
              const wifiTopic = `pixo/device/${state.deviceId}/wifi`;
              state.mqttClient.subscribe(wifiTopic, { qos: 0 });

              // Timer di fallback all'avvio: se Pixò non invia online entro 3.5s, avvisa che è spento
              scheduleStartupOfflineCheck();
            }
          }
          resolve(true);
        });

        // Ricezione messaggi Cloud (es. stato hardware, disegno a schermo, chiavi, telemetria)
        state.mqttClient.on('message', (topic, payload) => {
          if (!state.deviceId) return;
          const statusTopic = `pixo/device/${state.deviceId}/status`;
          const currentTopic = `pixo/device/${state.deviceId}/current`;
          const keysDataTopic = `pixo/device/${state.deviceId}/access/keys_data`;
          const accessKeysTopic = `pixo/device/${state.deviceId}/access/keys`;
          const accessStatusTopic = `pixo/device/${state.deviceId}/access/status`;
          const guestAckTopic = `pixo/device/${state.deviceId}/guest/${state.guestKey}/ack`;
          const wifiTopic = `pixo/device/${state.deviceId}/wifi`;

          if (topic === accessKeysTopic && state.isGuestMode) {
            handleGuestAccessKeysMessage(payload);
          } else if (topic === accessStatusTopic && state.isGuestMode) {
            handleGuestAccessStatusMessage(payload);
          } else if (topic === guestAckTopic && state.isGuestMode) {
            const ack = new TextDecoder().decode(payload).trim();
            if (ack.startsWith("REJECTED")) {
              setGuestAccessAuthorized(false, "Disegno rifiutato da Pixò: il link è stato revocato!");
            }
          } else if (topic === statusTopic) {
            if (!state.isGuestMode || state.guestAuthorized === true) {
              handleDeviceStatusSync(payload);
            }
          } else if (topic === currentTopic && (!state.isGuestMode || state.guestAuthorized === true)) {
            handleCurrentDisplaySync(payload);
          } else if (topic === keysDataTopic && !state.isGuestMode) {
            handleGuestKeysSyncFromCloud(payload);
          } else if (topic === wifiTopic && !state.isGuestMode) {
            handleWifiStatusSync(payload);
          }
        });

        state.mqttClient.on('error', (err) => {
          console.error('[MQTT] Errore MQTT:', err);
          state.mqttConnected = false;
          state.mqttConnecting = false;
          mqttConnectPromise = null;
          statusDot.className = "status-pulse status-dot";
          resolve(false);
        });

        state.mqttClient.on('offline', () => {
          state.mqttConnected = false;
          state.mqttConnecting = false;
          statusDot.className = "status-pulse status-dot";
        });

        state.mqttClient.on('close', () => {
          state.mqttConnected = false;
          state.mqttConnecting = false;
          statusDot.className = "status-pulse status-dot";
        });
      } else {
        // Se il client esiste già ed è disconnesso, riconnetti senza abortire la promessa attiva
        if (!state.mqttClient.connected) {
          try {
            state.mqttClient.reconnect();
          } catch(e) {
            state.mqttClient.end(true);
            state.mqttClient = null;
            mqttConnectPromise = null;
            return resolve(connectMQTT());
          }
        }

        const check = setInterval(() => {
          if (state.mqttConnected && state.mqttClient && state.mqttClient.connected) {
            clearInterval(check);
            mqttConnectPromise = null;
            resolve(true);
          }
        }, 100);
        setTimeout(() => {
          clearInterval(check);
          mqttConnectPromise = null;
          resolve(Boolean(state.mqttConnected && state.mqttClient && state.mqttClient.connected));
        }, 5000);
      }
    } catch (err) {
      console.error('[MQTT] Eccezione avvio:', err);
      state.mqttConnected = false;
      state.mqttConnecting = false;
      state.mqttClient = null;
      mqttConnectPromise = null;
      statusDot.className = "status-dot";
      resolve(false);
    }
  });

  return mqttConnectPromise;
}

let lastLocalSendTime = 0;

// ==========================================================================
//  SINCRONIZZAZIONE STATO HARDWARE PIXO' (ONLINE / OFFLINE LWT)
// ==========================================================================
let startupOfflineTimer = null;
let hasShownOfflineAlert = false;

function updateDeviceStatusUI(isOnline) {
  if (isOnline) {
    statusDot.className = "status-pulse status-dot online";
    statusDot.title = "Pixò Online e Connesso";
    if (deviceSubtitle) {
      deviceSubtitle.textContent = "Online";
      deviceSubtitle.style.color = "var(--accent-green)";
    }
    deviceOfflineBanner?.classList.add('hidden');
  } else {
    statusDot.className = "status-pulse status-dot offline";
    statusDot.title = "Il Pixò è spento o non collegato";
    if (deviceSubtitle) {
      deviceSubtitle.textContent = "Spento / Offline";
      deviceSubtitle.style.color = "var(--accent-red)";
    }
    deviceOfflineBanner?.classList.remove('hidden');
  }
}

function handleDeviceStatusSync(payload) {
  const status = (typeof payload === 'string')
    ? payload.trim().toLowerCase()
    : new TextDecoder().decode(payload).trim().toLowerCase();

  console.log(`[MQTT] Stato hardware Pixò ricevuto: ${status}`);

  if (startupOfflineTimer) {
    clearTimeout(startupOfflineTimer);
    startupOfflineTimer = null;
  }

  if (status === 'online') {
    state.deviceStatus = 'online';
    updateDeviceStatusUI(true);
    if (hasShownOfflineAlert) {
      showToast("🟢 Pixò è ora acceso e collegato!", "success");
      hasShownOfflineAlert = false;
    }
  } else if (status === 'offline') {
    state.deviceStatus = 'offline';
    updateDeviceStatusUI(false);
    if (!hasShownOfflineAlert) {
      hasShownOfflineAlert = true;
      showToast("⚠️ Il Pixò è spento o non collegato", "warning");
    }
  }
}

function scheduleStartupOfflineCheck() {
  if (startupOfflineTimer) clearTimeout(startupOfflineTimer);
  startupOfflineTimer = setTimeout(() => {
    if (state.deviceId && state.deviceStatus !== 'online') {
      state.deviceStatus = 'offline';
      updateDeviceStatusUI(false);
      if (!hasShownOfflineAlert) {
        hasShownOfflineAlert = true;
        showToast("⚠️ Il Pixò è spento o non collegato", "warning");
      }
    }
  }, 3500);
}

// ==========================================================================
//  VERIFICA AUTORIZZAZIONE OSPITI & GESTIONE LINK REVOCATI
// ==========================================================================
let guestAuthTimeout = null;

function setGuestAccessAuthorized(authorized, reason) {
  if (!state.isGuestMode) return;
  state.guestAuthorized = authorized;

  if (guestAuthTimeout) {
    clearTimeout(guestAuthTimeout);
    guestAuthTimeout = null;
  }

  if (authorized) {
    guestRevokedOverlay?.classList.add('hidden');
    // Quando autorizzato, può sottoscrivere e monitorare se Pixò è online
    if (state.mqttClient && state.mqttClient.connected) {
      const statusTopic = `pixo/device/${state.deviceId}/status`;
      state.mqttClient.subscribe(statusTopic, { qos: 1 });
      const currentTopic = `pixo/device/${state.deviceId}/current`;
      state.mqttClient.subscribe(currentTopic, { qos: 0 });
    }
  } else {
    // BLOCCO TOTALE ACCESSO PER OSPITE REVOCATO O NON AUTORIZZATO
    if (guestRevokedReason) {
      guestRevokedReason.textContent = reason || (state.lang === 'it'
        ? "Non possiedi più l'autorizzazione per accedere a questo Pixò."
        : "You no longer have permission to access this Pixò.");
    }
    guestRevokedOverlay?.classList.remove('hidden');

    // Reset indicatori: l'ospite revocato non deve vedere lo stato online di Pixò
    statusDot.className = "status-pulse status-dot";
    statusDot.title = "Accesso non autorizzato";
    if (deviceSubtitle) {
      deviceSubtitle.textContent = "Non autorizzato";
      deviceSubtitle.style.color = "var(--accent-red)";
    }
    deviceOfflineBanner?.classList.add('hidden');
  }
}

function verifyGuestKeyAgainstList(keysStr) {
  if (!state.isGuestMode) return;
  if (!keysStr || keysStr === "NONE") {
    setGuestAccessAuthorized(false, state.lang === 'it'
      ? "Nessun link ospite è attualmente attivo per questo Pixò."
      : "No guest links are currently active for this Pixò.");
    return;
  }
  const keys = keysStr.split(',').map(k => k.trim()).filter(Boolean);
  if (keys.includes(state.guestKey)) {
    setGuestAccessAuthorized(true);
  } else {
    setGuestAccessAuthorized(false, state.lang === 'it'
      ? "Questo link di invito non è valido o è stato revocato dal proprietario."
      : "This invitation link is not valid or has been revoked by the owner.");
  }
}

function handleGuestAccessStatusMessage(payload) {
  const text = (typeof payload === 'string')
    ? payload.trim()
    : new TextDecoder().decode(payload).trim();

  if (text === "DISABLE" || text === "GUEST:DISABLE") {
    setGuestAccessAuthorized(false, state.lang === 'it'
      ? "Il proprietario ha disabilitato l'accesso ai disegni da parte degli ospiti."
      : "The owner has disabled guest access.");
  } else if (text === "ENABLE" || text === "GUEST:ENABLE") {
    if (state.lastKnownGuestKeys) {
      verifyGuestKeyAgainstList(state.lastKnownGuestKeys);
    }
  }
}

function handleGuestAccessKeysMessage(payload) {
  const text = (typeof payload === 'string')
    ? payload.trim()
    : new TextDecoder().decode(payload).trim();

  state.lastKnownGuestKeys = text;
  verifyGuestKeyAgainstList(text);
}

// ==========================================================================
//  SINCRONIZZAZIONE STATO ATTUALE DISPLAY (MQTT Retained)
// ==========================================================================
function handleCurrentDisplaySync(payload) {
  if (!payload || payload.length === 0) return;

  state.lastDisplayPayload = payload;

  // Se l'invio è avvenuto da noi in questa sessione da meno di 4 secondi, ignora l'eco di ritorno
  if (Date.now() - lastLocalSendTime < 4000) {
    return;
  }

  // Se l'utente sta disegnando attivamente in questo istante, non interrompere il tratto
  if (state.isDrawing) {
    console.log("[SYNC] Ricevuto stato display dal Cloud, ma l'utente sta disegnando in questo istante.");
    return;
  }

  // Estrae in modo sicuro i byte binari del JPEG
  const uint8 = (payload instanceof Uint8Array)
    ? new Uint8Array(payload.buffer, payload.byteOffset, payload.byteLength)
    : new Uint8Array(payload);

  // Auto-riparazione header: se il buffer dell'ESP32 ha anteposto 'kOK' sui primi 3 byte (\xFF\xD8\xFF)
  if (uint8.length >= 7 && uint8[0] === 0x6B && uint8[1] === 0x4F && uint8[2] === 0x4B) {
    uint8[0] = 0xFF;
    uint8[1] = 0xD8;
    uint8[2] = 0xFF;
  }

  // Verifica se è un'immagine JPEG valida (Magic Bytes 0xFF 0xD8)
  if (uint8.length >= 2 && uint8[0] === 0xFF && uint8[1] === 0xD8) {
    const blob = new Blob([uint8], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      saveState();
      updatePayloadPreview();
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
    };
    img.src = url;
  } else {
    // Messaggio testuale ("CLEAR", "STANDBY", "CLOCK")
    try {
      const text = new TextDecoder().decode(uint8).trim();
      if (text === "CLEAR" || text === "STANDBY") {
        console.log("[SYNC] Il display è attualmente in standby.");
      } else if (text === "CLOCK") {
        console.log("[SYNC] Il display è attualmente in modalità Orologio.");
      }
    } catch(e) {}
  }
}

function loadCurrentDrawingFromDisplay() {
  if (state.lastDisplayPayload && state.lastDisplayPayload[0] === 0xFF && state.lastDisplayPayload[1] === 0xD8) {
    const blob = new Blob([state.lastDisplayPayload], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      state.userHasDrawnLocally = true;
      saveState();
      updatePayloadPreview();
      URL.revokeObjectURL(url);
      galleryModal.classList.add('hidden');
      showToast("Disegno del display caricato sulla lavagna!", "success");
    };
    img.src = url;
  } else {
    showToast("Nessun disegno presente sul display o display in standby", "info");
  }
}

async function sendCanvasMqtt() {
  if (!state.deviceId) return;

  // Se c'è un elemento interattivo (testo, icona o foto) attivo, fondilo automaticamente sul canvas!
  if (state.interactiveElement && state.interactiveElement.active) {
    confirmInteractiveOverlay(true);
  }

  // Se non siamo ancora connessi al broker (es. appena aperta l'app o risvegliata dal background), attendi la connessione!
  if (!state.mqttConnected || !state.mqttClient || !state.mqttClient.connected) {
    await connectMQTT();
    if (!state.mqttConnected) return;
  }

  // Verifica autorizzazione ospite prima dell'invio
  if (state.isGuestMode && state.guestAuthorized !== true) {
    showToast(state.lang === 'it' ? "Non sei autorizzato a inviare disegni a questo Pixò." : "You are not authorized to send drawings to this Pixò.", "error");
    return;
  }

  // Blocco di concorrenza anti-crash
  if (state.isSending) return;

  state.isSending = true;
  const sendStart = performance.now();

  try {
    const blob = await getCanvasJpegBlob();
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Inclusione PIN di sicurezza nel topic
    const topic = getDrawTopic();

    if (state.mqttClient && state.mqttClient.connected) {
      state.mqttClient.publish(topic, uint8Array, { qos: 0, retain: false }, (err) => {
        state.isSending = false;
        sendBtn.disabled = false;
        sendBtn.querySelector('.send-label').textContent = t("sendToDisplay");

        if (!err) {
          state.userHasDrawnLocally = false;
          const elapsed = Math.round(performance.now() - sendStart);
          const kb = (uint8Array.length / 1024).toFixed(1);
          showToast(t("toastSentSuccess", { name: state.deviceName || state.deviceId, kb: kb, ms: elapsed }), "success");
        }
      });

      // Mantiene aggiornato il Cloud (Retained) per tutti i dispositivi in tempo reale
      lastLocalSendTime = Date.now();
      const currentTopic = `pixo/device/${state.deviceId}/current`;
      state.mqttClient.publish(currentTopic, uint8Array, { qos: 0, retain: true });
      state.lastDisplayPayload = uint8Array;
    } else {
      state.isSending = false;
      sendBtn.disabled = false;
      sendBtn.querySelector('.send-label').textContent = t("sendToDisplay");
      showToast("Connessione persa. Riprovo...", "warning");
      connectMQTT();
    }
  } catch (err) {
    console.error("Errore compressione/invio:", err);
    state.isSending = false;
    sendBtn.disabled = false;
    sendBtn.querySelector('.send-label').textContent = t("sendToDisplay");
  }
}

async function sendToDisplay() {
  stopAutomaticFeed();

  // Se c'è un elemento interattivo attivo, fondilo automaticamente prima di inviare!
  if (state.interactiveElement && state.interactiveElement.active) {
    confirmInteractiveOverlay(true);
  }

  if (!state.deviceId) {
    settingsModal.classList.remove('hidden');
    return;
  }

  sendBtn.disabled = true;
  const labelEl = sendBtn.querySelector('.send-label');
  const originalLabel = labelEl.textContent;

  // Se non siamo ancora connessi al broker, attendi la connessione in background senza errori!
  if (!state.mqttConnected || !state.mqttClient || !state.mqttClient.connected) {
    labelEl.textContent = "Connessione Cloud...";
    const ok = await connectMQTT();
    if (!ok && !state.mqttConnected) {
      showToast("Connessione al Cloud in corso... Riprova tra poco.", "info");
      sendBtn.disabled = false;
      labelEl.textContent = originalLabel;
      return;
    }
  }

  labelEl.textContent = "...";
  await sendCanvasMqtt();
}

async function sendStandbyCommand() {
  stopAutomaticFeed();
  if (!state.deviceId) return;
  if (!state.mqttConnected || !state.mqttClient || !state.mqttClient.connected) {
    await connectMQTT();
    if (!state.mqttConnected) {
      showToast("Broker non connesso!", "error");
      return;
    }
  }
  const topic = getDrawTopic();
  const clearCmd = new TextEncoder().encode("CLEAR");
  if (state.mqttClient && state.mqttClient.connected) {
    state.mqttClient.publish(topic, clearCmd, { qos: 0, retain: false }, (err) => {
      if (!err) {
        showToast(t("toastStandby"), "success");
      }
    });

    const currentTopic = `pixo/device/${state.deviceId}/current`;
    state.mqttClient.publish(currentTopic, clearCmd, { qos: 0, retain: true });
    state.lastDisplayPayload = null;
    state.userHasDrawnLocally = false;
  }
}

function showToast(message, type = "info") {
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `ios-toast ${type}`;
  let icon = "✨";
  if (type === "success") icon = "✅";
  else if (type === "error") icon = "⚠️";
  else if (type === "warning") icon = "🔔";

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 260);
  }, 2600);
}


// ==========================================================================
//  10. EVENT LISTENERS
// ==========================================================================
function setupEventListeners() {
  // Configura interazione touch & drag per overlay ingrandimento
  setupOverlayInteraction();

  // Ferma Feed
  stopFeedBtn.addEventListener('click', stopAutomaticFeed);

  // Chiudi banner offline
  dismissOfflineBannerBtn?.addEventListener('click', () => {
    deviceOfflineBanner?.classList.add('hidden');
  });

  // Riprova verifica autorizzazione ospite
  retryGuestAuthBtn?.addEventListener('click', () => {
    state.guestAuthorized = null;
    showToast(state.lang === 'it' ? "Verifica autorizzazione in corso..." : "Checking authorization...", "info");
    if (state.mqttClient && state.mqttClient.connected) {
      const accessKeysTopic = `pixo/device/${state.deviceId}/access/keys`;
      const accessStatusTopic = `pixo/device/${state.deviceId}/access/status`;
      state.mqttClient.unsubscribe([accessKeysTopic, accessStatusTopic]);
      state.mqttClient.subscribe(accessKeysTopic, { qos: 1 });
      state.mqttClient.subscribe(accessStatusTopic, { qos: 1 });
    } else {
      connectMQTT();
    }
  });

  // Palette Colori
  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentColor = btn.dataset.color;
      state.isEraser = false;
      eraserBtn.classList.remove('active');
    });
  });

  // Spessori
  document.querySelectorAll('.stroke-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.stroke-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentStroke = parseInt(btn.dataset.size, 10);
      state.isEraser = false;
      eraserBtn.classList.remove('active');
    });
  });

  // Gomma
  eraserBtn.addEventListener('click', () => {
    state.isEraser = !state.isEraser;
    eraserBtn.classList.toggle('active', state.isEraser);
    if (!state.isEraser) {
      document.querySelector(`[data-color="${state.currentColor}"]`)?.classList.add('active');
    }
  });

  // Top Bar
  undoBtn.addEventListener('click', undo);
  clearBtn.addEventListener('click', clearCanvas);
  standbyBtn.addEventListener('click', sendStandbyCommand);
  sendBtn.addEventListener('click', sendToDisplay);

  // METEO: Invio automatico immediato + refresh
  weatherBtn.addEventListener('click', activateWeatherMode);

  // OROLOGIO SMART: Invio automatico immediato + refresh continuo
  clockBtn.addEventListener('click', activateClockMode);

  // LUCE CONTINUA: Toggle ON / OFF indipendente dal lampeggio di notifica
  const lightToggleBtn = document.getElementById('lightToggleBtn');
  if (lightToggleBtn) {
    lightToggleBtn.addEventListener('click', toggleContinuousLight);
  }

  // SALVATAGGIO & GALLERIA DISEGNI
  saveCanvasBtn.addEventListener('click', saveCurrentCanvas);
  galleryBtn.addEventListener('click', () => {
    galleryModal.classList.remove('hidden');
    renderGallery();
  });
  closeGalleryModal.addEventListener('click', () => galleryModal.classList.add('hidden'));
  saveCurrentFromGalleryBtn.addEventListener('click', saveCurrentCanvas);
  const loadFromDisplayBtn = document.getElementById('loadFromDisplayBtn');
  if (loadFromDisplayBtn) {
    loadFromDisplayBtn.addEventListener('click', loadCurrentDrawingFromDisplay);
  }

  // CONDIVISIONE & GESTIONE OSPITI
  shareBtn.addEventListener('click', () => {
    shareModal.classList.remove('hidden');
    renderGuestKeysList();
  });
  closeShareModal.addEventListener('click', () => shareModal.classList.add('hidden'));
  allowGuestsToggle.addEventListener('change', (e) => sendGuestAccessConfig(e.target.checked));

  if (createGuestKeyBtn) {
    createGuestKeyBtn.addEventListener('click', () => {
      const name = newGuestNameInput ? newGuestNameInput.value : '';
      addNewGuestKey(name);
    });
  }

  if (newGuestNameInput) {
    newGuestNameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addNewGuestKey(newGuestNameInput.value);
      }
    });
  }

  if (revokeGuestsBtn) {
    revokeGuestsBtn.addEventListener('click', revokeAllGuestKeys);
  }

  // SCREENSAVER (30 min) & LED (GPIO 5)
  screensaverToggle.addEventListener('change', (e) => sendScreensaverConfig(e.target.checked));
  ledToggle.addEventListener('change', (e) => sendLedConfig(e.target.checked));

  // Stop Feed Button
  stopFeedBtn.addEventListener('click', stopAutomaticFeed);

  // Foto con Manipolazione Touch (Ingrandimento & Spostamento con dita)
  photoBtn.addEventListener('click', () => photoInput.click());
  photoInput.addEventListener('change', (e) => {
    stopAutomaticFeed();
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        startInteractiveOverlay('image', img);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    photoInput.value = '';
  });

  // Sticker Drawer & Slider
  stickerToggleBtn.addEventListener('click', () => {
    stickerDrawer.classList.toggle('hidden');
  });
  closeStickerBtn.addEventListener('click', () => stickerDrawer.classList.add('hidden'));

  if (stickerSizeSlider) {
    stickerSizeSlider.addEventListener('input', (e) => {
      state.stickerSize = parseInt(e.target.value, 10);
      if (stickerSizeVal) stickerSizeVal.textContent = `${state.stickerSize}px`;
    });
  }

  // Modal Testo
  textToolBtn.addEventListener('click', () => {
    textModal.classList.remove('hidden');
    customTextInput.focus();
  });
  closeTextModal.addEventListener('click', () => textModal.classList.add('hidden'));
  applyTextBtn.addEventListener('click', applyCustomText);

  // Inserimento testo rapido con tasto Invio
  customTextInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      applyCustomText();
    }
  });

  if (textSizeSlider) {
    textSizeSlider.addEventListener('input', (e) => {
      state.textSize = parseInt(e.target.value, 10);
      if (textSizeVal) textSizeVal.textContent = `${state.textSize}px`;
      document.querySelectorAll('.font-size-picker .size-pill').forEach(b => {
        b.classList.toggle('active', parseInt(b.dataset.size, 10) === state.textSize);
      });
    });
  }

  document.querySelectorAll('.font-size-picker .size-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.font-size-picker .size-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.textSize = parseInt(btn.dataset.size, 10);
      if (textSizeSlider) textSizeSlider.value = state.textSize;
      if (textSizeVal) textSizeVal.textContent = `${state.textSize}px`;
    });
  });

  // Slider Luminosità (Hardware PWM in tempo reale)
  brightnessSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    sendBrightness(val);
  });

  // Impostazioni Dispositivo (Accessibile SOLO al Proprietario)
  const openSettings = () => {
    if (state.isGuestMode) return;
    document.querySelector('.tab-item[data-tab="panelSettings"]')?.click();
  };
  openSettingsBtn.addEventListener('click', openSettings);
  devicePill.addEventListener('click', () => {
    if (!state.isGuestMode) openSettings();
  });
  closeSettingsModal.addEventListener('click', () => settingsModal.classList.add('hidden'));

  // Cambio Lingua
  langSelect.addEventListener('change', (e) => {
    setLanguage(e.target.value);
  });

  // Salvataggio Impostazioni
  saveSettingsBtn.addEventListener('click', () => {
    const newName = deviceNameInput.value.trim();
    if (newName) {
      state.deviceName = newName;
      localStorage.setItem('pixo_device_name', state.deviceName);
      deviceIdDisplay.textContent = state.deviceName;
    }

    const newLang = langSelect.value;
    setLanguage(newLang);

    const newTheme = themeSelect.value;
    if (newTheme !== state.canvasTheme) {
      applyThemeChange(newTheme);
    }

    const newCity = weatherCityInput.value.trim();
    if (newCity) {
      state.weatherCity = newCity;
      localStorage.setItem('pixo_weather_city', state.weatherCity);
    }

    if (devicePinInput) {
      const newPin = devicePinInput.value.trim();
      if (newPin && newPin !== state.devicePin) {
        state.devicePin = newPin;
        localStorage.setItem('pixo_device_pin', state.devicePin);
        if (state.mqttConnected && state.deviceId) {
          const topic = `pixo/device/${state.deviceId}/setpin`;
          state.mqttClient.publish(topic, state.devicePin, { qos: 0, retain: false });
        }
      }
    }

    settingsModal.classList.add('hidden');
    showToast(t("toastSettingsSaved"));
  });

  // Gestione Cambio Dispositivo dalle Impostazioni
  if (changeDeviceBtn) {
    changeDeviceBtn.addEventListener('click', () => {
      settingsModal.classList.add('hidden');
      showOnboardingModal(true);
    });
  }

  // Gestione Ripristino ai Dati di Fabbrica (Solo Proprietario)
  if (factoryResetBtn) {
    factoryResetBtn.addEventListener('click', handleFactoryReset);
  }

  // Gestione Wi-Fi Pixò (Solo Proprietario)
  if (btnToggleNewWifi) {
    btnToggleNewWifi.addEventListener('click', () => {
      if (newWifiFormBox) {
        const isHidden = newWifiFormBox.style.display === 'none' || !newWifiFormBox.style.display;
        newWifiFormBox.style.display = isHidden ? 'block' : 'none';
        if (isHidden && newWifiSsidInput) newWifiSsidInput.focus();
      }
    });
  }

  if (btnCancelNewWifi) {
    btnCancelNewWifi.addEventListener('click', () => {
      if (newWifiFormBox) newWifiFormBox.style.display = 'none';
    });
  }

  if (btnApplyNewWifi) {
    btnApplyNewWifi.addEventListener('click', handleApplyNewWifi);
  }

  if (btnOpenWifiPortal) {
    btnOpenWifiPortal.addEventListener('click', handleOpenWifiPortal);
  }

  // Gestione Chiusura Onboarding (se già associato)
  const closeOnboardingModal = document.getElementById('closeOnboardingModal');
  if (closeOnboardingModal) {
    closeOnboardingModal.addEventListener('click', () => {
      if (state.deviceId) {
        hideOnboardingModal();
      }
    });
  }

  // Gestione Tab Switcher Onboarding
  if (tabOnboardLogin) {
    tabOnboardLogin.addEventListener('click', () => switchOnboardTab('login'));
  }
  if (tabOnboardActivate) {
    tabOnboardActivate.addEventListener('click', () => switchOnboardTab('activate'));
  }

  // Gestione Invio Login con PIN
  if (submitLoginBtn) {
    submitLoginBtn.addEventListener('click', handleOnboardingLogin);
  }

  // Gestione Invio Prima Attivazione
  if (submitOnboardingBtn) {
    submitOnboardingBtn.addEventListener('click', handleOnboardingSubmit);
  }

  // --- LOGICA TAB BAR APPLE STYLE ---
  const canvasStage = document.querySelector('.canvas-stage');
  document.querySelectorAll('.tab-item').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      document.querySelectorAll('.tab-item').forEach(b => b.classList.remove('active'));
      tabBtn.classList.add('active');
      const targetId = tabBtn.dataset.tab;
      document.body.dataset.activeTab = targetId;

      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');

      // Se l'utente entra nella tab Impostazioni (Dispositivo), nascondi completamente la lavagna e il tasto invia!
      if (canvasStage) {
        if (targetId === 'panelSettings') {
          canvasStage.style.display = 'none';
        } else {
          canvasStage.style.display = 'flex';
        }
      }

      if (targetId === 'panelGallery') {
        renderGallery();
      }
    });
  });

  // Chiusura Bottom Sheets cliccando sul backdrop
  const closeBackdrop = (sheetId) => {
    const sheet = document.getElementById(sheetId);
    if (sheet) sheet.classList.add('hidden');
  };
  document.getElementById('closeStickerBackdrop')?.addEventListener('click', () => closeBackdrop('stickerDrawer'));
  document.getElementById('closeTextBackdrop')?.addEventListener('click', () => closeBackdrop('textModal'));
  document.getElementById('closeShareBackdrop')?.addEventListener('click', () => closeBackdrop('shareModal'));
}


// ==========================================================================
//  10b. LOGICA ONBOARDING PRIMO AVVIO & FACTORY RESET
// ==========================================================================
function switchOnboardTab(tab) {
  if (onboardErrorText) {
    onboardErrorText.style.display = 'none';
    onboardErrorText.textContent = '';
  }
  if (tab === 'login') {
    if (tabOnboardLogin) {
      tabOnboardLogin.style.background = 'var(--primary)';
      tabOnboardLogin.style.color = '#fff';
    }
    if (tabOnboardActivate) {
      tabOnboardActivate.style.background = 'transparent';
      tabOnboardActivate.style.color = 'var(--text-muted)';
    }
    if (sectionOnboardLogin) sectionOnboardLogin.style.display = 'flex';
    if (sectionOnboardActivate) sectionOnboardActivate.style.display = 'none';
  } else {
    if (tabOnboardActivate) {
      tabOnboardActivate.style.background = 'var(--primary)';
      tabOnboardActivate.style.color = '#fff';
    }
    if (tabOnboardLogin) {
      tabOnboardLogin.style.background = 'transparent';
      tabOnboardLogin.style.color = 'var(--text-muted)';
    }
    if (sectionOnboardActivate) sectionOnboardActivate.style.display = 'flex';
    if (sectionOnboardLogin) sectionOnboardLogin.style.display = 'none';
  }
}

function showOnboardingModal(prefillCurrent = true) {
  if (!onboardingModal) return;
  const closeBtn = document.getElementById('closeOnboardingModal');
  if (closeBtn) {
    closeBtn.style.display = state.deviceId ? 'block' : 'none';
  }
  if (prefillCurrent && state.deviceId) {
    if (onboardLoginDeviceId) onboardLoginDeviceId.value = state.deviceId;
    if (onboardLoginPin) onboardLoginPin.value = state.devicePin || "";
    if (onboardDeviceId) onboardDeviceId.value = state.deviceId;
    if (onboardFactoryPin) onboardFactoryPin.value = "1234";
  } else {
    if (onboardLoginDeviceId) onboardLoginDeviceId.value = "";
    if (onboardLoginPin) onboardLoginPin.value = "";
    if (onboardDeviceId) onboardDeviceId.value = "";
    if (onboardFactoryPin) onboardFactoryPin.value = "1234";
  }
  if (onboardNewPin) onboardNewPin.value = "";
  if (onboardConfirmPin) onboardConfirmPin.value = "";
  if (onboardErrorText) {
    onboardErrorText.style.display = "none";
    onboardErrorText.textContent = "";
  }
  switchOnboardTab('login');
  onboardingModal.classList.remove('hidden');
}

function hideOnboardingModal() {
  if (onboardingModal) onboardingModal.classList.add('hidden');
}

function showOnboardingError(msg) {
  if (!onboardErrorText) return;
  onboardErrorText.textContent = msg;
  onboardErrorText.style.display = "block";
}

function handleOnboardingLogin() {
  if (!onboardLoginDeviceId || !onboardLoginPin) return;

  let devId = onboardLoginDeviceId.value.trim().toUpperCase();
  if (!devId) {
    showOnboardingError("Inserisci l'ID del dispositivo (es. ESP32-9205D4 o 9205D4).");
    return;
  }
  if (!devId.startsWith("ESP32-")) {
    devId = "ESP32-" + devId;
  }

  const pin = onboardLoginPin.value.trim();
  if (!pin) {
    showOnboardingError("Inserisci il tuo PIN personale di sicurezza.");
    return;
  }
  if (pin === "1234") {
    showOnboardingError("⚠️ Questo Pixò ha ancora il PIN di fabbrica 1234! Clicca sulla scheda '✨ Prima Attivazione' in alto per impostare il tuo PIN personale e attivarlo.");
    return;
  }
  if (pin.length < 4) {
    showOnboardingError("Il PIN personale deve contenere almeno 4 caratteri o cifre.");
    return;
  }

  submitLoginBtn.disabled = true;
  submitLoginBtn.textContent = "Connessione in corso...";

  // Salva credenziali localmente
  state.deviceId = devId;
  state.devicePin = pin;
  localStorage.setItem('pixo_device_id', devId);
  localStorage.setItem('pixo_device_pin', pin);

  // Aggiorna interfaccia utente
  deviceIdDisplay.textContent = state.deviceName || "Il mio Pixò";
  updateSettingsUI();
  hideOnboardingModal();

  submitLoginBtn.disabled = false;
  submitLoginBtn.textContent = "🚀 Connetti e Disegna";

  // Connetti a Pixò Cloud via MQTT
  connectMQTT();
  showToast(`🎉 Connesso a Pixò ${devId}!`, "success");
}

function handleOnboardingSubmit() {
  if (!onboardDeviceId || !onboardNewPin || !onboardConfirmPin) return;

  let devId = onboardDeviceId.value.trim().toUpperCase();
  if (!devId) {
    showOnboardingError("Inserisci l'ID del dispositivo (es. ESP32-9205D4 o 9205D4).");
    return;
  }
  if (!devId.startsWith("ESP32-")) {
    devId = "ESP32-" + devId;
  }

  const factPin = (onboardFactoryPin ? onboardFactoryPin.value.trim() : "") || "1234";
  const newPin = onboardNewPin.value.trim();
  const confirmPin = onboardConfirmPin.value.trim();

  // Validazione nuovo PIN obbligatorio
  if (!newPin) {
    showOnboardingError("È obbligatorio impostare un nuovo PIN personale di sicurezza.");
    return;
  }
  if (newPin.length < 4) {
    showOnboardingError("Il nuovo PIN deve contenere almeno 4 caratteri o cifre.");
    return;
  }
  if (newPin === "1234" || newPin === factPin) {
    showOnboardingError("Il nuovo PIN deve essere diverso dal PIN di fabbrica (1234).");
    return;
  }
  if (newPin !== confirmPin) {
    showOnboardingError("I due campi del nuovo PIN non coincidono. Riprova.");
    return;
  }

  submitOnboardingBtn.disabled = true;
  submitOnboardingBtn.textContent = "Attivazione e connessione...";

  // Imposta lo stato locale
  state.deviceId = devId;
  state.devicePin = newPin;
  localStorage.setItem('pixo_device_id', devId);
  localStorage.setItem('pixo_device_pin', newPin);

  // Aggiorna subito l'interfaccia
  deviceIdDisplay.textContent = state.deviceName || "Il mio Pixò";
  updateSettingsUI();

  // Connetti a MQTT
  connectMQTT().then(() => {
    // Invia comando cambio PIN all'ESP32 tramite MQTT
    if (state.mqttClient && state.mqttClient.connected) {
      // 1. Invia sul topic di setup autorizzato col PIN di fabbrica
      state.mqttClient.publish(`pixo/device/${devId}/${factPin}/setpin`, `SETPIN:${newPin}`, { qos: 0 });
      // 2. Invia anche sul topic diretto
      state.mqttClient.publish(`pixo/device/${devId}/setpin`, `SETPIN:${newPin}`, { qos: 0 });
    }

    submitOnboardingBtn.disabled = false;
    submitOnboardingBtn.textContent = "🚀 Attiva e Connetti Pixò";
    hideOnboardingModal();

    showToast(`🎉 Pixò ${devId} attivato con successo!`, "success");
  }).catch((err) => {
    submitOnboardingBtn.disabled = false;
    submitOnboardingBtn.textContent = "🚀 Attiva e Connetti Pixò";
    hideOnboardingModal();
    showToast(`Pixò salvato! Connessione al Cloud in corso...`);
  });
}

function handleFactoryReset() {
  if (state.isGuestMode) {
    alert("Operazione non consentita in modalità ospite.");
    return;
  }
  if (!state.deviceId) {
    alert("Nessun dispositivo associato da ripristinare.");
    return;
  }
  const pin = state.devicePin || "1234";
  const ok = confirm(`⚠️ ATTENZIONE: Sei sicuro di voler ripristinare "${state.deviceId}" ai dati di fabbrica?\n\n• Verranno cancellate le reti Wi-Fi memorizzate dal dispositivo.\n• Il PIN di sicurezza tornerà a 1234.\n• Il display si riavvierà in modalità configurazione Wi-Fi.\n• L'app sul tuo telefono verrà scollegata.\n\nVuoi procedere?`);
  if (!ok) return;

  if (state.mqttClient && state.mqttClient.connected) {
    state.mqttClient.publish(`pixo/device/${state.deviceId}/${pin}/factory_reset`, `FACTORY_RESET:${pin}`, { qos: 0 });
    state.mqttClient.publish(`pixo/device/${state.deviceId}/1234/factory_reset`, `FACTORY_RESET:1234`, { qos: 0 });
    state.mqttClient.publish(`pixo/device/${state.deviceId}/factory_reset`, `FACTORY_RESET:${pin}`, { qos: 0 });
  }

  localStorage.removeItem('pixo_device_id');
  localStorage.removeItem('pixo_device_pin');
  localStorage.removeItem('pixo_guest_keys');

  settingsModal.classList.add('hidden');

  alert("✅ Comando di ripristino inviato!\n\nPixò si sta riavviando allo stato di fabbrica. Per riconnetterti, accendi il dispositivo, collegati alla sua rete Wi-Fi 'Pixo-Setup-...' e ripeti la procedura iniziale.");

  state.deviceId = "";
  state.devicePin = "1234";
  updateSettingsUI();
  showOnboardingModal(false);
}

// ==========================================================================
//  11. SERVICE WORKER (PWA)
// ==========================================================================
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('[PWA] Service Worker Pixò registrato:', reg.scope))
        .catch(err => console.log('[PWA] Service Worker fallito:', err));
    });
  }
}

// Sveglia socket MQTT alla riapertura dell'app / cambio tab / sblocco schermo su smartphone
let wakeDebounceTimer = null;

function handleAppWakeup() {
  if (wakeDebounceTimer) clearTimeout(wakeDebounceTimer);
  wakeDebounceTimer = setTimeout(() => {
    if (!state.mqttClient || (!state.mqttClient.connected && !state.mqttConnecting)) {
      console.log('[WAKEUP] Connessione MQTT assente o caduta, riconnessione...');
      connectMQTT();
    }
  }, 300);
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    handleAppWakeup();
  }
});
window.addEventListener('focus', handleAppWakeup);
window.addEventListener('online', handleAppWakeup);

// ==========================================================================
//  BOOTSTRAP
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initDeviceAndSettings();
  initCanvas();
  initStickers();
  setupEventListeners();
  if (state.deviceId) {
    connectMQTT();
  } else if (!state.isGuestMode) {
    showOnboardingModal(false);
  }
  registerServiceWorker();
});
