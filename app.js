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
    kidsModeLabel: "🛡️ Filtro Bambini & Protezione",
    kidsModeSub: "Blocca bestemmie, volgarità e foto non adatte inviate da ospiti o amici",
    toastKidsModeBlocked: "⚠️ Messaggio bloccato dal Filtro Bambini: contiene linguaggio inappropriato!",
    toastKidsModeImgBlocked: "⚠️ Immagine bloccata dal Filtro Bambini: rilevato contenuto non appropriato!",
    feedWeatherActive: "🌦️ Meteo attivo ({city}) • Aggiornamento automatico ogni 15 min",
    feedNewsActive: "📰 Notizia {current} di {total} su Pixò (prossima tra 15s)...",
    feedClockActive: "⏰ Orologio Digitale attivo sul Display (Nativo)",
    feedFollowerActive: "📊 Follower {platform} ({user}): {count} • Aggiornamento ogni {interval}s",
    follower: "Follower",
    followerTitle: "Contatore Follower Live",
    toastFollowerSent: "Contatore Follower avviato su Pixò!",
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
    kidsModeLabel: "🛡️ Kids Safe Mode & Protection",
    kidsModeSub: "Blocks profanities, blasphemy, and inappropriate photos from guests",
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
    toastKidsModeBlocked: "⚠️ Message blocked by Kids Safe Filter: inappropriate content detected!",
    toastKidsModeImgBlocked: "⚠️ Image blocked by Kids Safe Filter: inappropriate content detected!",
    confirmClear: "Do you really want to clear the entire canvas?",
    feedWeatherActive: "🌦️ Weather active ({city}) • Auto-refresh every 15 min",
    feedNewsActive: "📰 Story {current} of {total} on Pixò (next in 15s)...",
    feedClockActive: "⏰ Digital Clock active on Display (Native)",
    feedFollowerActive: "📊 {platform} Followers ({user}): {count} • Auto-refresh every {interval}s",
    follower: "Followers",
    followerTitle: "Live Follower Counter",
    toastFollowerSent: "Follower Counter started on Pixò!",
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

  // Gestione Feed Automatici (Meteo, Orologio & Follower)
  activeFeedType: null, // "weather", "clock" o "follower"
  feedTimer: null,
  followerPlatform: localStorage.getItem('pixo_follower_platform') || 'tiktok',
  followerUsername: localStorage.getItem('pixo_follower_user') || '',
  followerInterval: parseInt(localStorage.getItem('pixo_follower_interval') || '30', 10),
  followerMode: 'live',
  followerCount: 0,
  followerTarget: 0,

  // Modalità Ospite & Condivisione
  isGuestMode: false,
  guestKey: "pixo123",
  guestKeys: [],
  allowGuests: true,

  // Screensaver & LED & Protezione Bambini & Notifiche
  screensaverEnabled: true,
  ledEnabled: true,
  kidsModeEnabled: true,
  lightOn: false,
  phoneNotifications: localStorage.getItem('pixo_phone_notifications') === 'true',
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
  firmwareVersion: "1.0.1",
  otaStatus: "ready", // "ready" | "updating" | "error"
  otaProgress: 0,
  deviceStatus: "unknown", // "online" | "offline" | "unknown"
  guestAuthorized: null, // null = verifica in corso, true = autorizzato, false = revocato/non autorizzato
  lastKnownGuestKeys: null,

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
const photoInputCamera = document.getElementById('photoInputCamera');
const photoInputGallery = document.getElementById('photoInputGallery');
const weatherBtn = document.getElementById('weatherBtn');
const clockBtn = document.getElementById('clockBtn');
const lightToggleBtn = document.getElementById('lightToggleBtn');
const followerBtn = document.getElementById('followerBtn');
const saveCanvasBtn = document.getElementById('saveCanvasBtn');
const galleryBtn = document.getElementById('galleryBtn');
const shareBtn = document.getElementById('shareBtn');

// Modale & Contatore Follower Live
const followerModal = document.getElementById('followerModal');
const closeFollowerModal = document.getElementById('closeFollowerModal');
const closeFollowerBackdrop = document.getElementById('closeFollowerBackdrop');
const startFollowerBtn = document.getElementById('startFollowerBtn');
const followerUsernameInput = document.getElementById('followerUsernameInput');
const followerUsernameLabel = document.getElementById('followerUsernameLabel');
const followerPrefix = document.getElementById('followerPrefix');
const followerIntervalSelect = document.getElementById('followerIntervalSelect');
const followerModeSelect = document.getElementById('followerModeSelect');
const followerInitialInput = document.getElementById('followerInitialInput');
const followerInitialGroup = document.getElementById('followerInitialGroup');
const feedPlusOneBtn = document.getElementById('feedPlusOneBtn');
const socialCardTikTok = document.getElementById('socialCardTikTok');
const socialCardInstagram = document.getElementById('socialCardInstagram');
const socialCardYouTube = document.getElementById('socialCardYouTube');

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
const kidsModeToggle = document.getElementById('kidsModeToggle');
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

// Gestione Aggiornamento Firmware Remoto (OTA)
const otaManagementSection = document.getElementById('otaManagementSection');
const currentFwDesc = document.getElementById('currentFwDesc');
const currentFwBadge = document.getElementById('currentFwBadge');
const btnCheckFwUpdate = document.getElementById('btnCheckFwUpdate');
const otaStatusBox = document.getElementById('otaStatusBox');
const otaStatusText = document.getElementById('otaStatusText');
const otaFormBox = document.getElementById('otaFormBox');
const otaUrlInput = document.getElementById('otaUrlInput');
const btnCancelOta = document.getElementById('btnCancelOta');
const btnStartOta = document.getElementById('btnStartOta');


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

// ==========================================================================
//  FEEDBACK AUDIO TATTICO (Click Sintetizzato Senza Latenza Stile iOS)
// ==========================================================================
let audioFeedbackCtx = null;
function playAudioClick() {
  try {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtxClass) return;
    if (!audioFeedbackCtx) {
      audioFeedbackCtx = new AudioCtxClass();
    }
    if (audioFeedbackCtx.state === 'suspended') {
      audioFeedbackCtx.resume();
    }
    const now = audioFeedbackCtx.currentTime;
    const osc = audioFeedbackCtx.createOscillator();
    const gain = audioFeedbackCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(audioFeedbackCtx.destination);

    osc.start(now);
    osc.stop(now + 0.035);
  } catch (err) {}
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

function getTargetDeviceIds() {
  const ids = [];
  if (state.deviceId) ids.push(state.deviceId);
  // Auto-recovery: se l'utente ha salvato 5205D4 (typo frequente del display per 9205D4), includi l'hardware reale
  if (state.deviceId === 'ESP32-5205D4' || state.deviceId === '5205D4') {
    ids.push('ESP32-9205D4');
  }
  return Array.from(new Set(ids));
}

function publishToDrawTopics(payload) {
  if (!state.mqttClient || !state.mqttClient.connected) return;
  const pin = state.devicePin || "1234";
  const devIds = getTargetDeviceIds();

  devIds.forEach(devId => {
    if (state.isGuestMode) {
      const key = state.guestKey || 'pixo123';
      state.mqttClient.publish(`pixo/device/${devId}/guest/${key}/draw`, payload, { qos: 0, retain: false });
    } else {
      // 1. Invia su topic con PIN proprietario
      if (pin && pin !== "1234") {
        state.mqttClient.publish(`pixo/device/${devId}/${pin}/draw`, payload, { qos: 0, retain: false });
      }
      // 2. Invia su topic con PIN di fabbrica 1234 (sempre autorizzato dal firmware)
      state.mqttClient.publish(`pixo/device/${devId}/1234/draw`, payload, { qos: 0, retain: false });
      // 3. Invia su topic diretto (retrocompatibilità assoluta)
      state.mqttClient.publish(`pixo/device/${devId}/draw`, payload, { qos: 0, retain: false });
    }
  });
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

  // Risoluzione automatica typo frequente 5205D4 -> 9205D4
  if (state.deviceId === 'ESP32-5205D4' || state.deviceId === '5205D4') {
    console.log('[AUTO-FIX] Correzione automatica typo ID: ESP32-5205D4 -> ESP32-9205D4');
    state.deviceId = 'ESP32-9205D4';
    localStorage.setItem('pixo_device_id', 'ESP32-9205D4');
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
  state.kidsModeEnabled = localStorage.getItem('pixo_kids_mode') !== 'false'; // Default attivo!

  state.deviceName = localStorage.getItem('pixo_device_name') || DEFAULT_CONFIG.defaultDeviceName;
  state.brightness = parseInt(localStorage.getItem('pixo_brightness') || DEFAULT_CONFIG.defaultBrightness, 10);

  // Broker fisso e sicuro (non esposto agli utenti finali)
  state.brokerUrl = DEFAULT_CONFIG.brokerUrl;
  state.brokerUser = DEFAULT_CONFIG.brokerUser;
  state.brokerPass = DEFAULT_CONFIG.brokerPass;

  state.lang = localStorage.getItem('pixo_lang') || DEFAULT_CONFIG.defaultLang;
  state.canvasTheme = localStorage.getItem('pixo_canvas_theme') || DEFAULT_CONFIG.defaultTheme;
  state.weatherCity = localStorage.getItem('pixo_weather_city') || DEFAULT_CONFIG.defaultCity;
  state.firmwareVersion = localStorage.getItem('pixo_firmware_version') || '1.0.1';
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
      devicePill.style.cursor = 'pointer';
      devicePill.title = "Apri opzioni e notifiche";
    }
    if (devicePinInput) devicePinInput.value = "";
    if (factoryResetSection) factoryResetSection.style.display = 'none';
    if (wifiManagementSection) wifiManagementSection.style.display = 'none';

    // Agli ospiti nascondiamo i controlli hardware (Luce stanza, Feed meteo/orologio/follower)
    if (lightToggleBtn) lightToggleBtn.style.display = 'none';
    if (weatherBtn) weatherBtn.style.display = 'none';
    if (clockBtn) clockBtn.style.display = 'none';
    if (followerBtn) followerBtn.style.display = 'none';
    
    // Per gli ospiti mostriamo la tab come "Opzioni" per gestire notifiche e lingua
    const settingsTab = document.querySelector('.tab-item[data-tab="panelSettings"]');
    if (settingsTab) {
      settingsTab.style.display = '';
      const tabSpan = settingsTab.querySelector('span');
      if (tabSpan) tabSpan.textContent = state.lang === 'it' ? 'Opzioni' : 'Options';
    }
    const settingsTitle = document.querySelector('#panelSettings .card-title');
    if (settingsTitle) settingsTitle.textContent = state.lang === 'it' ? 'Opzioni Pixò' : 'Pixò Options';

    // Nasconde tutti i controlli riservati al proprietario
    document.querySelectorAll('.owner-only-setting').forEach(el => el.style.display = 'none');

    // La tab Foto resta visibile sia per gli ospiti che per i proprietari
    const photoTab = document.querySelector('.tab-item[data-tab="panelPhoto"]');
    if (photoTab) photoTab.style.display = '';
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
    if (followerBtn) followerBtn.style.display = '';

    // Per il proprietario mostra la tab come "Dispositivo"
    const settingsTab = document.querySelector('.tab-item[data-tab="panelSettings"]');
    if (settingsTab) {
      settingsTab.style.display = '';
      const tabSpan = settingsTab.querySelector('span');
      if (tabSpan) tabSpan.textContent = state.lang === 'it' ? 'Dispositivo' : 'Device';
    }
    const settingsTitle = document.querySelector('#panelSettings .card-title');
    if (settingsTitle) settingsTitle.textContent = t("settingsTitle");

    // Mostra tutti i controlli del proprietario
    document.querySelectorAll('.owner-only-setting').forEach(el => el.style.display = '');

    const photoTab = document.querySelector('.tab-item[data-tab="panelPhoto"]');
    if (photoTab) photoTab.style.display = '';
  }

  deviceNameInput.value = state.deviceName;
  if (devicePinInput) devicePinInput.value = state.devicePin;
  if (hardwareIdDisplay) hardwareIdDisplay.textContent = state.deviceId || "(Non collegato)";
  brightnessSlider.value = state.brightness;
  brightnessVal.textContent = `${state.brightness}%`;
  langSelect.value = state.lang;
  const phoneNotificationsToggle = document.getElementById('phoneNotificationsToggle');
  if (phoneNotificationsToggle) {
    phoneNotificationsToggle.checked = state.phoneNotifications;
  }
  themeSelect.value = state.canvasTheme;
  weatherCityInput.value = state.weatherCity;

  if (state.wifiSsid && currentWifiDesc) {
    currentWifiDesc.innerHTML = `<strong style="color:#fff;">${escapeHtml(state.wifiSsid)}</strong> <span style="color:var(--text-secondary); font-size:0.75rem;">(${state.wifiSignal || 0}% segnale${state.wifiIp ? ' • IP: ' + state.wifiIp : ''})</span>`;
    if (currentWifiBadge) {
      currentWifiBadge.style.display = 'inline-block';
      currentWifiBadge.textContent = 'Collegato';
    }
  }

  if (currentFwBadge) {
    currentFwBadge.textContent = `v${state.firmwareVersion || '1.0.1'}`;
  }

  if (screensaverToggle) screensaverToggle.checked = state.screensaverEnabled;
  if (ledToggle) ledToggle.checked = state.ledEnabled;
  if (kidsModeToggle) kidsModeToggle.checked = state.kidsModeEnabled;
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
  window.addEventListener('pointerup', (e) => { if (state.isDrawing) stopDrawing(e); });
  window.addEventListener('pointercancel', (e) => { if (state.isDrawing) stopDrawing(e); });
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
  if (e && e.pointerId) {
    try {
      if (canvas.hasPointerCapture && canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId);
      }
    } catch (err) {}
  }
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

// ==========================================================================
//  5b. FILTRO BAMBINI & PROTEZIONE CONTENUTI (BESTEMMIE, VOLGARITÀ, NSFW)
// ==========================================================================
const PROFANITY_PATTERNS = [
  // Bestemmie e offese sacre
  /d[i1!l]o\s*(c[a4]n[e3]|p[o0]rc[o0]|b[o0]i[a4]|m[a4]i[a4]l[e3]|l[a4]dr[o0]|m[e3]rd[a4]|sch[i1]f[o0]|b[a4]st[a4]rd[o0]|str[o0]nz[o0]|serpente|cane)/i,
  /p[o0]rc[o0]\s*d[i1!l]o/i,
  /p[o0]rc[a4]\s*m[a4]d[o0]nn[a4]/i,
  /m[a4]d[o0]nn[a4]\s*(p[u0]tt[a4]n[a4]|tr[o0]i[a4]|c[a4]n[e3]|p[o0]rc[a4]|v[a4]cc[a4]|b[o0]i[a4]|sch[i1]f[o0])/i,
  /d[i1!l]o\s*b[e3]st[i1]a/i,
  /d[i1!l]o\s*c[a4]gn[a4]cc[i1]o/i,
  /d[i1!l]o\s*f[a4]sc[i1]st[a4]/i,
  /m[a4]d[o0]nn[a4]\s*l[a4]dr[a4]/i,
  /c[hH]r[i1!l]st[o0]\s*(d[i1!l]o|c[a4]n[e3]|p[o0]rc[o0]|b[a4]st[a4]rd[o0])/i,
  /p[o0]rc[o0]\s*c[hH]r[i1!l]st[o0]/i,
  /p[o0]rc[o0]\s*d[i1!l][e3]u/i,
  /p[o0]rc[o0]\s*zz[i1]o/i,
  // Volgarità esplicite pesanti
  /\bc[a4]zz[o0i1]\b/i,
  /\bstr[o0]nz[o0i1a4]\b/i,
  /\bv[a4]ff[a4]nc[u0]l[o0]\b/i,
  /\bf[a4]nc[u0]l[o0]\b/i,
  /\bp[u0]tt[a4]n[a4e3]\b/i,
  /\btr[o0]i[a4e3]\b/i,
  /\bb[o0]cc[hH][i1]n[o0i1]\b/i,
  /\bsb[o0]rr[a4e3]\b/i,
  /\bsp[e3]rm[a4]\b/i,
  /\bp[e3]n[e3i1]\b/i,
  /\bv[a4]g[i1]n[a4]\b/i,
  /\bt[e3]tt[e3]\b/i,
  /\bc[u0]l[o0]\b/i,
  /\benc[u0]l[a4]/i,
  /\bincul[a4o0]/i,
  /\bricchi[o0]n[e3i1]\b/i,
  /\bfr[o0]ci[o0]\b/i,
  /\bnegro\b/i,
  /\bnegri\b/i,
  /\bfuck\b/i,
  /\bshit\b/i,
  /\bbitch\b/i,
  /\bcunt\b/i,
  /\bdick\b/i,
  /\bpussy\b/i,
  /\bwhore\b/i,
  /\bslut\b/i
];

function normalizeTextForProfanity(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[@]/g, 'a')
    .replace(/[3]/g, 'e')
    .replace(/[1!|]/g, 'i')
    .replace(/[0]/g, 'o')
    .replace(/[$5]/g, 's')
    .replace(/[+]/g, 't')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function checkProfanity(text) {
  if (!state.kidsModeEnabled) return { clean: true };
  if (!text) return { clean: true };

  const raw = text.toLowerCase();
  const normalized = normalizeTextForProfanity(text);

  for (const pattern of PROFANITY_PATTERNS) {
    if (pattern.test(raw) || pattern.test(normalized)) {
      return { clean: false, blocked: true };
    }
  }

  // Verifica anche senza spazi intermedi (es. "p-o-r-c-o-d-i-o" o "porcodio")
  const compact = raw.replace(/[^a-z0-9]/g, '');
  const compactNorm = normalized.replace(/[^a-z0-9]/g, '');
  for (const pattern of PROFANITY_PATTERNS) {
    if (pattern.test(compact) || pattern.test(compactNorm)) {
      return { clean: false, blocked: true };
    }
  }

  return { clean: true };
}

function checkImageSafety(imgOrCanvas) {
  if (!state.kidsModeEnabled) return { safe: true };

  try {
    const testCanvas = document.createElement('canvas');
    testCanvas.width = 120;
    testCanvas.height = 120;
    const tCtx = testCanvas.getContext('2d', { willReadFrequently: true });
    tCtx.drawImage(imgOrCanvas, 0, 0, 120, 120);

    const imgData = tCtx.getImageData(0, 0, 120, 120);
    const data = imgData.data;
    const totalPixels = 120 * 120;
    let skinPixels = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a < 50) continue; // Trasparente

      // Euristica universale per tonalità pelle (RGB & HSV bounding box)
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const isSkinRGB = (r > 95) && (g > 40) && (b > 20) &&
                        ((max - min) > 15) &&
                        (Math.abs(r - g) > 15) &&
                        (r > g) && (r > b);

      if (isSkinRGB) {
        skinPixels++;
      }
    }

    const skinRatio = skinPixels / totalPixels;
    // Se più del 48% dell'immagine è tonalità di pelle, blocca per protezione bambini
    if (skinRatio > 0.48) {
      console.warn(`[FILTRO BAMBINI] Immagine bloccata: rapporto tonalità pelle ${Math.round(skinRatio * 100)}% (soglia 48%)`);
      return { safe: false, ratio: skinRatio };
    }

    return { safe: true, ratio: skinRatio };
  } catch(e) {
    console.warn('[FILTRO BAMBINI] Errore analisi immagine:', e);
    return { safe: true };
  }
}

function applyCustomText() {
  stopAutomaticFeed();
  const text = customTextInput.value.trim();
  if (!text) return;

  // Controllo Filtro Bambini su Testo
  const check = checkProfanity(text);
  if (!check.clean) {
    showToast(t("toastKidsModeBlocked"), "error");
    return;
  }

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
  if (feedPlusOneBtn) {
    feedPlusOneBtn.style.display = 'none';
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
  const cmd = new TextEncoder().encode("CLOCK");
  if (state.mqttClient && state.mqttClient.connected) {
    publishToDrawTopics(cmd);

    getTargetDeviceIds().forEach(id => {
      state.mqttClient.publish(`pixo/device/${id}/current`, cmd, { qos: 0, retain: true });
    });

    state.lastDisplayPayload = null;
    state.userHasDrawnLocally = false;
    console.log("[MQTT] Comando CLOCK inviato a Pixò!");
  }
}

// ==========================================================================
//  7b2. CONTATORE FOLLOWER MULTI-SOCIAL (TIKTOK, INSTAGRAM, YOUTUBE)
//       CON TESSERE SPLIT-FLAP RETRO ANIMATE A 240x240 PX
// ==========================================================================
function drawTikTokGlyph(targetCtx, cx, cy, scale) {
  targetCtx.save();
  targetCtx.translate(cx, cy);
  targetCtx.scale(scale, scale);
  targetCtx.beginPath();
  targetCtx.arc(-2, 5, 5, 0, Math.PI * 2);
  targetCtx.fill();
  targetCtx.fillRect(1, -9, 3, 14);
  targetCtx.beginPath();
  targetCtx.moveTo(4, -9);
  targetCtx.bezierCurveTo(7, -9, 10, -5, 11, -3);
  targetCtx.lineTo(11, 0);
  targetCtx.bezierCurveTo(8, -1, 4, -4, 4, -5);
  targetCtx.closePath();
  targetCtx.fill();
  targetCtx.restore();
}

function drawInstagramGlyph(targetCtx, cx, cy, size) {
  targetCtx.save();
  targetCtx.translate(cx - size / 2, cy - size / 2);
  targetCtx.lineWidth = Math.max(1.5, size * 0.1);
  targetCtx.strokeStyle = "#ffffff";
  const r = size * 0.28;
  targetCtx.beginPath();
  targetCtx.moveTo(r, 0);
  targetCtx.lineTo(size - r, 0);
  targetCtx.quadraticCurveTo(size, 0, size, r);
  targetCtx.lineTo(size, size - r);
  targetCtx.quadraticCurveTo(size, size, size - r, size);
  targetCtx.lineTo(r, size);
  targetCtx.quadraticCurveTo(0, size, 0, size - r);
  targetCtx.lineTo(0, r);
  targetCtx.quadraticCurveTo(0, 0, r, 0);
  targetCtx.closePath();
  targetCtx.stroke();
  targetCtx.beginPath();
  targetCtx.arc(size / 2, size / 2, size * 0.26, 0, Math.PI * 2);
  targetCtx.stroke();
  targetCtx.fillStyle = "#ffffff";
  targetCtx.beginPath();
  targetCtx.arc(size * 0.76, size * 0.24, size * 0.07, 0, Math.PI * 2);
  targetCtx.fill();
  targetCtx.restore();
}

function drawYouTubeGlyph(targetCtx, cx, cy, w, h) {
  targetCtx.save();
  targetCtx.fillStyle = "#ff0000";
  const r = 4;
  const x = cx - w / 2;
  const y = cy - h / 2;
  targetCtx.beginPath();
  targetCtx.moveTo(x + r, y);
  targetCtx.lineTo(x + w - r, y);
  targetCtx.quadraticCurveTo(x + w, y, x + w, y + r);
  targetCtx.lineTo(x + w, y + h - r);
  targetCtx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  targetCtx.lineTo(x + r, y + h);
  targetCtx.quadraticCurveTo(x, y + h, x, y + h - r);
  targetCtx.lineTo(x, y + r);
  targetCtx.quadraticCurveTo(x, y, x + r, y);
  targetCtx.closePath();
  targetCtx.fill();
  targetCtx.fillStyle = "#ffffff";
  targetCtx.beginPath();
  const triH = h * 0.52;
  const triW = w * 0.36;
  targetCtx.moveTo(cx - triW / 2 + 1, cy - triH / 2);
  targetCtx.lineTo(cx + triW / 2 + 1, cy);
  targetCtx.lineTo(cx - triW / 2 + 1, cy + triH / 2);
  targetCtx.closePath();
  targetCtx.fill();
  targetCtx.restore();
}

function drawSingleSplitFlap(targetCtx, x, y, w, h, currChar, targChar, progress) {
  const halfH = h / 2;
  const r = 4;

  function drawRoundedRectPath(ctxRef, rx, ry, rw, rh, radius) {
    ctxRef.beginPath();
    ctxRef.moveTo(rx + radius, ry);
    ctxRef.lineTo(rx + rw - radius, ry);
    ctxRef.quadraticCurveTo(rx + rw, ry, rx + rw, ry + radius);
    ctxRef.lineTo(rx + rw, ry + rh - radius);
    ctxRef.quadraticCurveTo(rx + rw, ry + rh, rx + rw - radius, ry + rh);
    ctxRef.lineTo(rx + radius, ry + rh);
    ctxRef.quadraticCurveTo(rx, ry + rh, rx, ry + rh - radius);
    ctxRef.lineTo(rx, ry + radius);
    ctxRef.quadraticCurveTo(rx, ry, rx + radius, ry);
    ctxRef.closePath();
  }

  targetCtx.save();

  // 1. Base card shadow / border
  drawRoundedRectPath(targetCtx, x, y, w, h, r);
  targetCtx.fillStyle = "#15161c";
  targetCtx.fill();
  targetCtx.strokeStyle = "#2e313b";
  targetCtx.lineWidth = 1;
  targetCtx.stroke();

  // 2. Metà superiore FISSA
  targetCtx.save();
  targetCtx.beginPath();
  targetCtx.rect(x, y, w, halfH);
  targetCtx.clip();

  const gradTop = targetCtx.createLinearGradient(x, y, x, y + halfH);
  gradTop.addColorStop(0, "#292c36");
  gradTop.addColorStop(1, "#1c1e26");
  targetCtx.fillStyle = gradTop;
  targetCtx.fillRect(x, y, w, halfH);

  targetCtx.font = "bold 38px 'SF Pro Display', -apple-system, 'Helvetica Neue', Arial, sans-serif";
  targetCtx.fillStyle = "#f5f6f8";
  targetCtx.textAlign = "center";
  targetCtx.textBaseline = "middle";
  targetCtx.fillText(progress > 0 ? targChar : currChar, x + w / 2, y + halfH);
  targetCtx.restore();

  // 3. Metà inferiore FISSA
  targetCtx.save();
  targetCtx.beginPath();
  targetCtx.rect(x, y + halfH, w, halfH);
  targetCtx.clip();

  const gradBot = targetCtx.createLinearGradient(x, y + halfH, x, y + h);
  gradBot.addColorStop(0, "#16171e");
  gradBot.addColorStop(1, "#0d0e12");
  targetCtx.fillStyle = gradBot;
  targetCtx.fillRect(x, y + halfH, w, halfH);

  targetCtx.font = "bold 38px 'SF Pro Display', -apple-system, 'Helvetica Neue', Arial, sans-serif";
  targetCtx.fillStyle = "#f5f6f8";
  targetCtx.textAlign = "center";
  targetCtx.textBaseline = "middle";
  targetCtx.fillText(progress >= 0.5 ? targChar : currChar, x + w / 2, y + halfH);
  targetCtx.restore();

  // 4. ANIMAZIONE SPLIT-FLAP (Rotazione prospettica della linguetta a 30-60 fps)
  if (progress > 0 && progress < 1) {
    if (progress < 0.5) {
      const scaleY = Math.cos(progress * Math.PI);
      targetCtx.save();
      targetCtx.beginPath();
      targetCtx.rect(x, y, w, halfH);
      targetCtx.clip();

      targetCtx.translate(x + w / 2, y + halfH);
      targetCtx.scale(1, Math.max(0.02, scaleY));
      targetCtx.translate(-(x + w / 2), -(y + halfH));

      const gradFoldTop = targetCtx.createLinearGradient(x, y, x, y + halfH);
      gradFoldTop.addColorStop(0, "#2c2f3b");
      gradFoldTop.addColorStop(1, "#1c1e26");
      targetCtx.fillStyle = gradFoldTop;
      targetCtx.fillRect(x, y, w, halfH);

      targetCtx.font = "bold 38px 'SF Pro Display', -apple-system, 'Helvetica Neue', Arial, sans-serif";
      targetCtx.fillStyle = "#f5f6f8";
      targetCtx.textAlign = "center";
      targetCtx.textBaseline = "middle";
      targetCtx.fillText(currChar, x + w / 2, y + halfH);

      targetCtx.fillStyle = `rgba(0, 0, 0, ${progress * 1.5})`;
      targetCtx.fillRect(x, y, w, halfH);
      targetCtx.restore();
    } else {
      const scaleY = Math.sin((progress - 0.5) * Math.PI);
      targetCtx.save();
      targetCtx.beginPath();
      targetCtx.rect(x, y + halfH, w, halfH);
      targetCtx.clip();

      targetCtx.translate(x + w / 2, y + halfH);
      targetCtx.scale(1, Math.max(0.02, scaleY));
      targetCtx.translate(-(x + w / 2), -(y + halfH));

      const gradFoldBot = targetCtx.createLinearGradient(x, y + halfH, x, y + h);
      gradFoldBot.addColorStop(0, "#1a1b22");
      gradFoldBot.addColorStop(1, "#0f1015");
      targetCtx.fillStyle = gradFoldBot;
      targetCtx.fillRect(x, y + halfH, w, halfH);

      targetCtx.font = "bold 38px 'SF Pro Display', -apple-system, 'Helvetica Neue', Arial, sans-serif";
      targetCtx.fillStyle = "#f5f6f8";
      targetCtx.textAlign = "center";
      targetCtx.textBaseline = "middle";
      targetCtx.fillText(targChar, x + w / 2, y + halfH);

      targetCtx.fillStyle = `rgba(0, 0, 0, ${(1 - progress) * 1.5})`;
      targetCtx.fillRect(x, y + halfH, w, halfH);
      targetCtx.restore();
    }
  }

  // 5. Cerniera meccanica centrale
  targetCtx.fillStyle = "#0a0a0d";
  targetCtx.fillRect(x - 1, y + halfH - 1, w + 2, 2);

  targetCtx.fillStyle = "#3e4250";
  targetCtx.fillRect(x - 2, y + halfH - 2, 2, 4);
  targetCtx.fillRect(x + w, y + halfH - 2, 2, 4);

  targetCtx.restore();
}

function renderSplitFlapCanvas(platform, username, currentCount, targetCount, flipFraction = 0) {
  const displayUser = (username || "PIXO").replace(/^@+/, '').toUpperCase();

  // 1. Sfondo base in base alla piattaforma
  if (platform === 'tiktok') {
    ctx.fillStyle = "#07080a";
    ctx.fillRect(0, 0, 240, 240);

    // Accenti Ciano e Magenta
    ctx.fillStyle = "#00f2fe";
    ctx.fillRect(0, 0, 120, 3);
    ctx.fillStyle = "#fe2c55";
    ctx.fillRect(120, 0, 120, 3);

    // Icona Glitch TikTok
    ctx.save();
    ctx.fillStyle = "#00f2fe";
    drawTikTokGlyph(ctx, 32, 23, 0.75);
    ctx.fillStyle = "#fe2c55";
    drawTikTokGlyph(ctx, 34, 25, 0.75);
    ctx.fillStyle = "#ffffff";
    drawTikTokGlyph(ctx, 33, 24, 0.75);
    ctx.restore();

    ctx.font = "bold 13px -apple-system, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(`@${displayUser}`, 52, 25);

    ctx.font = "bold 9px -apple-system, sans-serif";
    ctx.fillStyle = "#fe2c55";
    ctx.textAlign = "center";
    ctx.fillText("TIKTOK LIVE", 120, 68);

  } else if (platform === 'instagram') {
    ctx.fillStyle = "#09060c";
    ctx.fillRect(0, 0, 240, 240);

    const igGrad = ctx.createLinearGradient(0, 0, 240, 0);
    igGrad.addColorStop(0, "#f09433");
    igGrad.addColorStop(0.5, "#dc2743");
    igGrad.addColorStop(1, "#bc1888");
    ctx.fillStyle = igGrad;
    ctx.fillRect(0, 0, 240, 3);

    drawInstagramGlyph(ctx, 32, 25, 20);

    ctx.font = "bold 13px -apple-system, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(`@${displayUser}`, 52, 25);

    ctx.font = "bold 9px -apple-system, sans-serif";
    ctx.fillStyle = "#e6683c";
    ctx.textAlign = "center";
    ctx.fillText("INSTAGRAM FOLLOWERS", 120, 68);

  } else { // youtube
    ctx.fillStyle = "#090506";
    ctx.fillRect(0, 0, 240, 240);

    ctx.fillStyle = "#ff0000";
    ctx.fillRect(0, 0, 240, 3);

    drawYouTubeGlyph(ctx, 32, 25, 24, 17);

    ctx.font = "bold 13px -apple-system, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(displayUser, 52, 25);

    ctx.font = "bold 9px -apple-system, sans-serif";
    ctx.fillStyle = "#ff3b30";
    ctx.textAlign = "center";
    ctx.fillText("YOUTUBE SUBSCRIBERS", 120, 68);
  }

  // 2. Disegno 6 Tessere Split-Flap
  const currStr = String(Math.max(0, Math.floor(currentCount))).padStart(6, ' ');
  const targStr = String(Math.max(0, Math.floor(targetCount))).padStart(6, ' ');

  const tileW = 32;
  const tileH = 64;
  const gap = 5;
  const totalW = 6 * tileW + 5 * gap; // 217px
  const startX = Math.round((240 - totalW) / 2); // ~12px
  const tileY = 86;

  // Cornice retro del blocco tessere
  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.fillRect(startX - 6, tileY - 6, totalW + 12, tileH + 12);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;
  ctx.strokeRect(startX - 6, tileY - 6, totalW + 12, tileH + 12);

  for (let i = 0; i < 6; i++) {
    const x = startX + i * (tileW + gap);
    const currChar = currStr[i] || ' ';
    const targChar = targStr[i] || ' ';
    const isFlipping = (currChar !== targChar);
    const progress = isFlipping ? flipFraction : 0;

    drawSingleSplitFlap(ctx, x, tileY, tileW, tileH, currChar, targChar, progress);
  }

  // 3. Barra di stato inferiore
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(14, 182);
  ctx.lineTo(226, 182);
  ctx.stroke();

  const dotColor = platform === 'tiktok' ? "#00f2fe" : (platform === 'youtube' ? "#ff3b30" : "#34c759");
  ctx.fillStyle = dotColor;
  ctx.beginPath();
  ctx.arc(32, 210, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = "bold 11px -apple-system, sans-serif";
  ctx.fillStyle = "#8e95a5";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const intervalSec = state.followerInterval || 30;
  ctx.fillText(`LIVE • OGNI ${intervalSec}s`, 44, 210);

  ctx.font = "bold 13px monospace";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "right";
  const formattedNum = Number(targetCount || currentCount || 0).toLocaleString('it-IT');
  ctx.fillText(formattedNum, 226, 210);

  saveState();
  updatePayloadPreview();
}

async function fetchSocialFollowerCount(platform, username) {
  const clean = (username || "").replace(/^@+/, '').trim();
  if (!clean) return 0;

  if (state.followerMode === 'test') {
    if (state.followerCount <= 0) {
      state.followerCount = parseInt(followerInitialInput.value, 10) || 1420;
    }
    return state.followerCount;
  }

  try {
    if (platform === 'tiktok') {
      const res = await fetch(`https://countik.com/api/exist/${encodeURIComponent(clean)}`, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const d = await res.json();
        if (d && d.sec_uid) {
          const detailRes = await fetch(`https://countik.com/api/user/detail/${d.sec_uid}`, { signal: AbortSignal.timeout(6000) });
          if (detailRes.ok) {
            const detail = await detailRes.json();
            if (detail && typeof detail.follower_count === 'number') {
              return detail.follower_count;
            }
          }
        }
      }
      const resB = await fetch(`https://tokcount.com/api/user/${encodeURIComponent(clean)}`, { signal: AbortSignal.timeout(6000) });
      if (resB.ok) {
        const dB = await resB.json();
        if (dB && typeof dB.follower_count === 'number') {
          return dB.follower_count;
        }
      }
    } else if (platform === 'youtube') {
      const res = await fetch(`https://mixerno.space/api/youtube-channel-counter/user/${encodeURIComponent(clean)}`, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const d = await res.json();
        if (d && d.counts && typeof d.counts[0]?.count === 'number') {
          return d.counts[0].count;
        }
      }
    }
  } catch (err) {
    console.warn("[FOLLOWER] Errore fetch online per", platform, clean, err);
  }

  if (state.followerCount > 0) return state.followerCount;
  return parseInt(followerInitialInput.value, 10) || 1420;
}

function triggerFollowerFlip(oldCount, newCount, onComplete) {
  const duration = 520;
  const startT = performance.now();
  playAudioClick();

  function loop(now) {
    const elapsed = now - startT;
    const progress = Math.min(1, elapsed / duration);
    const ease = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    renderSplitFlapCanvas(state.followerPlatform, state.followerUsername, oldCount, newCount, ease);

    if (progress < 1) {
      requestAnimationFrame(loop);
    } else {
      renderSplitFlapCanvas(state.followerPlatform, state.followerUsername, newCount, newCount, 0);
      if (onComplete) onComplete();
    }
  }
  requestAnimationFrame(loop);
}

async function activateFollowerMode() {
  stopAutomaticFeed();
  state.activeFeedType = "follower";
  await connectMQTT();

  const plat = state.followerPlatform || 'tiktok';
  const user = (followerUsernameInput.value || state.followerUsername || "pixo").trim();
  state.followerUsername = user;
  state.followerInterval = parseInt(followerIntervalSelect.value, 10) || 30;
  state.followerMode = followerModeSelect.value || 'live';

  localStorage.setItem('pixo_follower_platform', plat);
  localStorage.setItem('pixo_follower_user', user);
  localStorage.setItem('pixo_follower_interval', String(state.followerInterval));

  let count = await fetchSocialFollowerCount(plat, user);
  state.followerCount = count;
  state.followerTarget = count;

  renderSplitFlapCanvas(plat, user, count, count, 0);
  await sendCanvasMqtt(false);

  if (feedPlusOneBtn) feedPlusOneBtn.style.display = '';

  const platName = plat === 'tiktok' ? "TikTok" : (plat === 'instagram' ? "Instagram" : "YouTube");
  feedStatusText.textContent = t("feedFollowerActive", {
    platform: platName,
    user: `@${user.replace(/^@+/, '')}`,
    count: count.toLocaleString('it-IT'),
    interval: state.followerInterval
  });
  feedBanner.classList.remove('hidden');
  showToast(t("toastFollowerSent"), "success");

  state.feedTimer = setInterval(async () => {
    if (state.activeFeedType !== "follower") return;

    if (state.followerMode === 'test') {
      state.followerTarget = state.followerCount + 1;
    } else {
      const newCount = await fetchSocialFollowerCount(state.followerPlatform, state.followerUsername);
      if (newCount > 0) {
        state.followerTarget = newCount;
      }
    }

    if (state.followerTarget !== state.followerCount) {
      const oldVal = state.followerCount;
      const newVal = state.followerTarget;
      state.followerCount = newVal;

      triggerFollowerFlip(oldVal, newVal, async () => {
        await sendCanvasMqtt(false);
        feedStatusText.textContent = t("feedFollowerActive", {
          platform: platName,
          user: `@${user.replace(/^@+/, '')}`,
          count: newVal.toLocaleString('it-IT'),
          interval: state.followerInterval
        });
      });
    }
  }, state.followerInterval * 1000);
}

function incrementFollowerManually(amount = 1) {
  if (state.activeFeedType !== 'follower') return;
  const oldVal = state.followerCount;
  const newVal = oldVal + amount;
  state.followerCount = newVal;
  state.followerTarget = newVal;

  triggerFollowerFlip(oldVal, newVal, async () => {
    await sendCanvasMqtt(false);
    const platName = state.followerPlatform === 'tiktok' ? "TikTok" : (state.followerPlatform === 'instagram' ? "Instagram" : "YouTube");
    feedStatusText.textContent = t("feedFollowerActive", {
      platform: platName,
      user: `@${(state.followerUsername || '').replace(/^@+/, '')}`,
      count: newVal.toLocaleString('it-IT'),
      interval: state.followerInterval
    });
  });
}

function openFollowerModal() {
  if (followerUsernameInput) {
    followerUsernameInput.value = state.followerUsername || "";
  }
  if (followerIntervalSelect) {
    followerIntervalSelect.value = String(state.followerInterval || 30);
  }
  updateFollowerModalUI();
  if (followerModal) {
    followerModal.classList.remove('hidden');
  }
}

function closeFollowerModalSheet() {
  if (followerModal) {
    followerModal.classList.add('hidden');
  }
}

function updateFollowerModalUI() {
  const plat = state.followerPlatform || 'tiktok';
  [socialCardTikTok, socialCardInstagram, socialCardYouTube].forEach(card => {
    if (card) {
      if (card.dataset.platform === plat) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    }
  });

  if (followerUsernameLabel) {
    if (plat === 'tiktok') {
      followerUsernameLabel.textContent = "Nome Utente TikTok:";
      if (followerPrefix) followerPrefix.textContent = "@";
    } else if (plat === 'instagram') {
      followerUsernameLabel.textContent = "Nome Utente Instagram:";
      if (followerPrefix) followerPrefix.textContent = "@";
    } else {
      followerUsernameLabel.textContent = "Nome Canale YouTube:";
      if (followerPrefix) followerPrefix.textContent = "@";
    }
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

    const dlBtn = document.createElement('button');
    dlBtn.className = 'gallery-card-dl-btn';
    dlBtn.innerHTML = '⬇️';
    dlBtn.title = state.lang === 'it' ? 'Scarica immagine sul dispositivo' : 'Download image';
    dlBtn.onclick = (e) => {
      e.stopPropagation();
      downloadDrawingImage(d.dataUrl, d.name);
    };

    card.appendChild(img);
    card.appendChild(dlBtn);
    card.appendChild(delBtn);
    galleryGrid.appendChild(card);
  });
}

function downloadDrawingImage(dataUrl, name) {
  try {
    const link = document.createElement('a');
    const safeName = (name || 'disegno-pixo').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.download = `${safeName}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(state.lang === 'it' ? "Disegno scaricato sul dispositivo! 📥" : "Image downloaded! 📥", "success");
  } catch(e) {
    showToast("Errore durante il download dell'immagine", "error");
  }
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

async function sendKidsModeConfig(enabled) {
  state.kidsModeEnabled = enabled;
  localStorage.setItem('pixo_kids_mode', enabled ? 'true' : 'false');
  if (!state.mqttConnected || !state.mqttClient || !state.mqttClient.connected) {
    await connectMQTT();
  }
  if (!state.deviceId) return;
  const topic = `pixo/device/${state.deviceId}/kids_mode`;
  const val = enabled ? "ON" : "OFF";
  if (state.mqttClient && state.mqttClient.connected) {
    state.mqttClient.publish(topic, val, { qos: 1, retain: true });
  }
  showToast(enabled 
    ? (state.lang === 'it' ? "🛡️ Filtro Bambini ATTIVATO: bestemmie e immagini non adatte bloccate!" : "🛡️ Kids Safe Filter ENABLED: profanities and NSFW blocked!")
    : (state.lang === 'it' ? "Filtro Bambini DISATTIVATO" : "Kids Safe Filter DISABLED"),
    enabled ? "success" : "info");
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

  const cmd = state.lightOn ? "LIGHT:ON" : "LIGHT:OFF";
  const numCmd = state.lightOn ? "100" : "0";
  const pin = state.devicePin || "1234";
  const devIds = getTargetDeviceIds();

  if (state.mqttClient && state.mqttClient.connected) {
    devIds.forEach(id => {
      if (pin && pin !== "1234") {
        state.mqttClient.publish(`pixo/device/${id}/${pin}/led`, cmd, { qos: 0 });
        state.mqttClient.publish(`pixo/device/${id}/${pin}/led`, numCmd, { qos: 0 });
        state.mqttClient.publish(`pixo/device/${id}/${pin}/led`, `LED:${cmd}`, { qos: 0 });
      }
      state.mqttClient.publish(`pixo/device/${id}/1234/led`, cmd, { qos: 0 });
      state.mqttClient.publish(`pixo/device/${id}/1234/led`, numCmd, { qos: 0 });
      state.mqttClient.publish(`pixo/device/${id}/1234/led`, `LED:${cmd}`, { qos: 0 });

      state.mqttClient.publish(`pixo/device/${id}/led`, cmd, { qos: 0 });
      state.mqttClient.publish(`pixo/device/${id}/led`, numCmd, { qos: 0 });
      state.mqttClient.publish(`pixo/device/${id}/led`, `LED:${cmd}`, { qos: 0 });
    });
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

    // 4. Sincronizzazione stato Filtro Bambini (Retained) per gli ospiti
    const kidsVal = state.kidsModeEnabled !== false ? "ON" : "OFF";
    state.mqttClient.publish(`pixo/device/${state.deviceId}/kids_mode`, kidsVal, { qos: 1, retain: true });
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

function handleKidsModeSyncMessage(payload) {
  try {
    const text = (typeof payload === 'string')
      ? payload.trim().toUpperCase()
      : new TextDecoder().decode(payload).trim().toUpperCase();
    const isEnabled = (text === 'ON' || text === '1' || text === 'TRUE');
    state.kidsModeEnabled = isEnabled;
    localStorage.setItem('pixo_kids_mode', isEnabled ? 'true' : 'false');
    if (kidsModeToggle) {
      kidsModeToggle.checked = isEnabled;
    }
    console.log(`[SYNC] Filtro Bambini sincronizzato da Cloud: ${isEnabled ? 'ON' : 'OFF'}`);
  } catch(e) {
    console.warn('[SYNC] Errore sync kids mode:', e);
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
      state.deviceStatus = 'online';
      updateDeviceStatusUI(true);
      if (startupOfflineTimer) {
        clearTimeout(startupOfflineTimer);
        startupOfflineTimer = null;
      }
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
//  7b. AGGIORNAMENTO FIRMWARE OVER-THE-AIR (OTA)
// ==========================================================================
function handleOtaStatusSync(payload) {
  try {
    const uint8 = (payload instanceof Uint8Array)
      ? new Uint8Array(payload.buffer, payload.byteOffset, payload.byteLength)
      : new Uint8Array(payload);
    const text = new TextDecoder().decode(uint8).trim();
    if (!text) return;
    const data = JSON.parse(text);

    state.deviceStatus = 'online';
    updateDeviceStatusUI(true);
    if (startupOfflineTimer) {
      clearTimeout(startupOfflineTimer);
      startupOfflineTimer = null;
    }

    if (data.version) {
      state.firmwareVersion = data.version;
      localStorage.setItem('pixo_firmware_version', data.version);
      if (currentFwBadge) {
        currentFwBadge.textContent = `v${data.version}`;
      }
    }

    if (data.status === 'updating') {
      state.otaStatus = 'updating';
      if (otaStatusBox) {
        otaStatusBox.style.display = 'block';
        otaStatusBox.style.background = 'rgba(255,149,0,0.15)';
        otaStatusBox.style.borderColor = 'rgba(255,149,0,0.35)';
      }
      if (otaStatusText) {
        otaStatusText.innerHTML = `⚡ <strong>Download ed installazione in corso...</strong> Pixò si riavvierà al termine. Non spegnere!`;
      }
      if (btnCheckFwUpdate) btnCheckFwUpdate.disabled = true;
    } else if (data.status === 'ready') {
      state.otaStatus = 'ready';
      if (btnCheckFwUpdate) btnCheckFwUpdate.disabled = false;
    } else if (data.status === 'error') {
      state.otaStatus = 'error';
      if (otaStatusBox) {
        otaStatusBox.style.display = 'block';
        otaStatusBox.style.background = 'rgba(255,69,58,0.15)';
        otaStatusBox.style.borderColor = 'rgba(255,69,58,0.35)';
      }
      if (otaStatusText) {
        otaStatusText.innerHTML = `⚠️ <strong>Errore aggiornamento:</strong> ${escapeHtml(data.error || 'Errore sconosciuto')}`;
      }
      if (btnCheckFwUpdate) btnCheckFwUpdate.disabled = false;
      showToast("Aggiornamento OTA fallito!", "error");
    }
  } catch (err) {
    console.warn('[OTA] Errore parsing stato OTA:', err);
  }
}

function handleDiagSync(payload) {
  try {
    const uint8 = (payload instanceof Uint8Array)
      ? new Uint8Array(payload.buffer, payload.byteOffset, payload.byteLength)
      : new Uint8Array(payload);
    const text = new TextDecoder().decode(uint8).trim();
    if (!text) return;
    const data = JSON.parse(text);

    state.deviceStatus = 'online';
    updateDeviceStatusUI(true);
    if (startupOfflineTimer) {
      clearTimeout(startupOfflineTimer);
      startupOfflineTimer = null;
    }

    if (data.fw_ver) {
      state.firmwareVersion = data.fw_ver;
      localStorage.setItem('pixo_firmware_version', data.fw_ver);
      if (currentFwBadge) {
        currentFwBadge.textContent = `v${data.fw_ver}`;
      }
    }
  } catch (err) {
    console.warn('[DIAG] Errore parsing telemetria diagnostica:', err);
  }
}

async function handleCheckFwUpdate() {
  if (state.isGuestMode) {
    alert("Operazione non consentita in modalità ospite.");
    return;
  }
  if (!state.deviceId) return;

  btnCheckFwUpdate.disabled = true;
  btnCheckFwUpdate.textContent = "Verifica...";

  try {
    // 1. Verifica release ufficiali su GitHub Releases Pixò
    const resp = await fetch("https://api.github.com/repos/xxxdslumpxxx/pixo/releases/latest", {
      headers: { "Accept": "application/vnd.github.v3+json" }
    });

    if (resp.ok) {
      const release = await resp.json();
      const latestTag = (release.tag_name || "").replace(/^v/, "");
      const binAsset = (release.assets || []).find(a => a.name.endsWith(".bin"));

      if (latestTag && latestTag !== state.firmwareVersion && binAsset && binAsset.browser_download_url) {
        if (otaStatusBox) {
          otaStatusBox.style.display = 'block';
          otaStatusBox.style.background = 'rgba(52,199,89,0.15)';
          otaStatusBox.style.borderColor = 'rgba(52,199,89,0.35)';
        }
        if (otaStatusText) {
          otaStatusText.innerHTML = `🎉 <strong>Nuova versione disponibile: v${latestTag}</strong><br><small>${escapeHtml(release.name || '')}</small>`;
        }
        if (otaUrlInput) otaUrlInput.value = binAsset.browser_download_url;
        if (otaFormBox) otaFormBox.style.display = 'block';
        showToast(`Disponibile aggiornamento v${latestTag}!`, "info");
      } else {
        if (otaStatusBox) {
          otaStatusBox.style.display = 'block';
          otaStatusBox.style.background = 'rgba(10,132,255,0.12)';
          otaStatusBox.style.borderColor = 'rgba(10,132,255,0.25)';
        }
        if (otaStatusText) {
          otaStatusText.innerHTML = `✅ <strong>Il tuo Pixò è già aggiornato</strong> (v${state.firmwareVersion}).`;
        }
        // Mostra comunque l'opzione per URL personalizzato / forzatura
        if (otaFormBox) otaFormBox.style.display = 'block';
      }
    } else {
      // Se non ci sono release GitHub ancora caricate, apri il box per consentire l'URL diretto
      if (otaStatusBox) {
        otaStatusBox.style.display = 'block';
        otaStatusBox.style.background = 'rgba(10,132,255,0.12)';
        otaStatusBox.style.borderColor = 'rgba(10,132,255,0.25)';
      }
      if (otaStatusText) {
        otaStatusText.innerHTML = `💡 Inserisci l'indirizzo URL del file .bin compilato per aggiornare da remoto.`;
      }
      if (otaFormBox) otaFormBox.style.display = 'block';
    }
  } catch (err) {
    console.warn("[OTA] Errore controllo GitHub Releases:", err);
    if (otaFormBox) otaFormBox.style.display = 'block';
    if (otaStatusBox) {
      otaStatusBox.style.display = 'block';
      otaStatusBox.style.background = 'rgba(10,132,255,0.12)';
      otaStatusBox.style.borderColor = 'rgba(10,132,255,0.25)';
    }
    if (otaStatusText) {
      otaStatusText.innerHTML = `💡 Inserisci l'indirizzo URL del file .bin compilato per aggiornare da remoto.`;
    }
  } finally {
    btnCheckFwUpdate.disabled = false;
    btnCheckFwUpdate.textContent = "Verifica";
  }
}

function handleStartOta() {
  if (state.isGuestMode) {
    alert("Operazione non consentita in modalità ospite.");
    return;
  }
  const url = (otaUrlInput ? otaUrlInput.value.trim() : "");
  if (!url) {
    alert("Inserisci l'URL completo del file firmware .bin (es. https://.../firmware.bin)");
    return;
  }

  const ok = confirm(`🚀 Sei sicuro di voler avviare l'aggiornamento firmware di "${state.deviceId}"?\n\n• Sorgente: ${url}\n• Il display mostrerà la barra di avanzamento e si riavvierà automaticamente.\n• Non togliere l'alimentazione a Pixò durante il processo.\n\nProcedere?`);
  if (!ok) return;

  if (state.mqttClient && state.mqttClient.connected && state.deviceId) {
    const pin = state.devicePin || "1234";
    const payload = JSON.stringify({
      url: url,
      version: "update",
      pin: pin
    });

    state.mqttClient.publish(`pixo/device/${state.deviceId}/${pin}/ota`, payload, { qos: 0 });
    state.mqttClient.publish(`pixo/device/${state.deviceId}/ota`, payload, { qos: 0 });

    if (otaStatusBox) {
      otaStatusBox.style.display = 'block';
      otaStatusBox.style.background = 'rgba(255,149,0,0.15)';
      otaStatusBox.style.borderColor = 'rgba(255,149,0,0.35)';
    }
    if (otaStatusText) {
      otaStatusText.innerHTML = `⏳ <strong>Comando inviato!</strong> Pixò sta avviando il download...`;
    }
    showToast("Comando OTA inviato a Pixò!", "info");
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

function subscribeDeviceTopics() {
  if (!state.mqttClient || !state.mqttClient.connected || !state.deviceId) return;

  if (state.isGuestMode) {
    const accessKeysTopic = `pixo/device/${state.deviceId}/access/keys`;
    const accessStatusTopic = `pixo/device/${state.deviceId}/access/status`;
    const guestAckTopic = `pixo/device/${state.deviceId}/guest/${state.guestKey}/ack`;
    const kidsModeTopic = `pixo/device/${state.deviceId}/kids_mode`;
    state.mqttClient.subscribe(accessKeysTopic, { qos: 1 });
    state.mqttClient.subscribe(accessStatusTopic, { qos: 1 });
    state.mqttClient.subscribe(guestAckTopic, { qos: 0 });
    state.mqttClient.subscribe(kidsModeTopic, { qos: 1 });

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
    const statusTopic = `pixo/device/${state.deviceId}/status`;
    state.mqttClient.subscribe(statusTopic, { qos: 1 });

    const currentTopic = `pixo/device/${state.deviceId}/current`;
    state.mqttClient.subscribe(currentTopic, { qos: 0 });

    const keysDataTopic = `pixo/device/${state.deviceId}/access/keys_data`;
    state.mqttClient.subscribe(keysDataTopic, { qos: 1 });
    syncGuestKeysToDevice(false);

    const wifiTopic = `pixo/device/${state.deviceId}/wifi`;
    state.mqttClient.subscribe(wifiTopic, { qos: 0 });

    const otaStatusTopic = `pixo/device/${state.deviceId}/ota/status`;
    state.mqttClient.subscribe(otaStatusTopic, { qos: 0 });

    const diagTopic = `pixo/device/${state.deviceId}/diag`;
    state.mqttClient.subscribe(diagTopic, { qos: 0 });

    sendBrightness(state.brightness);
  }
}

function connectMQTT() {
  if (state.mqttConnected && state.mqttClient && state.mqttClient.connected) {
    if (state.deviceId) subscribeDeviceTopics();
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
          if (deviceSubtitle) {
            deviceSubtitle.textContent = "Online";
            deviceSubtitle.style.color = "var(--accent-green)";
          }
          deviceOfflineBanner?.classList.add('hidden');

          // Mostra il toast di benvenuto una sola volta all'avvio, mai in loop
          if (!hasShownConnectedToast) {
            hasShownConnectedToast = true;
            showToast(t("toastConnected"), "success");
          }

          if (state.deviceId) {
            subscribeDeviceTopics();
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
          const otaStatusTopic = `pixo/device/${state.deviceId}/ota/status`;
          const diagTopic = `pixo/device/${state.deviceId}/diag`;
          const kidsModeTopic = `pixo/device/${state.deviceId}/kids_mode`;

          if (topic === kidsModeTopic) {
            handleKidsModeSyncMessage(payload);
          } else if (topic === accessKeysTopic && state.isGuestMode) {
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
          } else if (topic === otaStatusTopic && !state.isGuestMode) {
            handleOtaStatusSync(payload);
          } else if (topic === diagTopic && !state.isGuestMode) {
            handleDiagSync(payload);
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
  if (startupOfflineTimer) {
    clearTimeout(startupOfflineTimer);
    startupOfflineTimer = null;
  }
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
//  NOTIFICHE DI SISTEMA SUL CELLULARE & PUSH STANDBY
// ==========================================================================
function sendSystemNotification(title, body) {
  if (!state.phoneNotifications) return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const notifIcon = new URL('pixo_face.png', window.location.href).href;
  const options = {
    body: body,
    icon: notifIcon,
    vibrate: [200, 100, 200],
    tag: 'pixo-drawing-alert',
    renotify: true
  };

  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready.then(reg => {
      reg.showNotification(title, options);
    }).catch(() => {
      try { new Notification(title, options); } catch(e) {}
    });
  } else {
    try {
      new Notification(title, options);
    } catch(e) {}
  }
}

// ==========================================================================
//  SINCRONIZZAZIONE STATO ATTUALE DISPLAY (MQTT Retained)
// ==========================================================================
function handleCurrentDisplaySync(payload) {
  if (!payload || payload.length === 0) return;

  state.deviceStatus = 'online';
  updateDeviceStatusUI(true);
  if (startupOfflineTimer) {
    clearTimeout(startupOfflineTimer);
    startupOfflineTimer = null;
  }

  state.lastDisplayPayload = payload;

  // Se l'invio è avvenuto da noi in questa sessione da meno di 4 secondi, ignora l'eco di ritorno
  if (Date.now() - lastLocalSendTime < 4000) {
    return;
  }

  // Notifica sul cellulare se abilitata per ogni nuovo messaggio/disegno in arrivo
  sendSystemNotification(
    state.lang === 'it' ? "Nuovo messaggio su Pixò! 🎨" : "New drawing on Pixò! 🎨",
    state.lang === 'it' ? "È appena apparso un nuovo disegno o messaggio sul display." : "A new drawing has appeared on the display."
  );

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

  // Controllo Filtro Bambini su tutto il Canvas (sia per foto sia per disegni)
  if (state.kidsModeEnabled) {
    const safety = checkImageSafety(canvas);
    if (!safety.safe) {
      showToast(t("toastKidsModeImgBlocked"), "error");
      sendBtn.disabled = false;
      const lbl = sendBtn.querySelector('.send-label');
      if (lbl) lbl.textContent = t("sendToDisplay");
      return;
    }
  }

  state.isSending = true;
  const sendStart = performance.now();

  try {
    const blob = await getCanvasJpegBlob();
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    if (state.mqttClient && state.mqttClient.connected) {
      publishToDrawTopics(uint8Array);

      getTargetDeviceIds().forEach(id => {
        state.mqttClient.publish(`pixo/device/${id}/current`, uint8Array, { qos: 0, retain: true });
      });

      state.isSending = false;
      sendBtn.disabled = false;
      sendBtn.querySelector('.send-label').textContent = t("sendToDisplay");
      state.userHasDrawnLocally = false;
      lastLocalSendTime = Date.now();
      state.lastDisplayPayload = uint8Array;

      const elapsed = Math.round(performance.now() - sendStart);
      const kb = (uint8Array.length / 1024).toFixed(1);
      showToast(t("toastSentSuccess", { name: state.deviceName || state.deviceId, kb: kb, ms: elapsed }), "success");
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
  const clearCmd = new TextEncoder().encode("CLEAR");
  if (state.mqttClient && state.mqttClient.connected) {
    publishToDrawTopics(clearCmd);

    getTargetDeviceIds().forEach(id => {
      state.mqttClient.publish(`pixo/device/${id}/current`, clearCmd, { qos: 0, retain: true });
    });

    state.lastDisplayPayload = null;
    state.userHasDrawnLocally = false;
    showToast(t("toastStandby"), "success");
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
      playAudioClick();
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
      playAudioClick();
      document.querySelectorAll('.stroke-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentStroke = parseInt(btn.dataset.size, 10);
      state.isEraser = false;
      eraserBtn.classList.remove('active');
    });
  });

  // Gomma
  eraserBtn.addEventListener('click', () => {
    playAudioClick();
    state.isEraser = !state.isEraser;
    eraserBtn.classList.toggle('active', state.isEraser);
    if (!state.isEraser) {
      document.querySelector(`[data-color="${state.currentColor}"]`)?.classList.add('active');
    }
  });

  // Top Bar con Feedback Audio e Invio Istantaneo al 1° tocco (Zero doppio tap)
  undoBtn.addEventListener('click', () => {
    playAudioClick();
    undo();
  });
  clearBtn.addEventListener('click', () => {
    playAudioClick();
    clearCanvas();
  });
  standbyBtn.addEventListener('click', () => {
    playAudioClick();
    sendStandbyCommand();
  });

  let lastSendTriggerTime = 0;
  const triggerSendAction = (e) => {
    if (e && e.cancelable && e.type === 'touchstart') e.preventDefault();
    const now = Date.now();
    if (now - lastSendTriggerTime < 500) return;
    lastSendTriggerTime = now;
    playAudioClick();
    if (navigator.vibrate) try { navigator.vibrate(25); } catch(v) {}
    sendToDisplay();
  };
  sendBtn.addEventListener('pointerdown', triggerSendAction);
  sendBtn.addEventListener('click', triggerSendAction);

  // METEO: Invio automatico immediato + refresh
  weatherBtn.addEventListener('click', activateWeatherMode);

  // OROLOGIO SMART: Invio automatico immediato + refresh continuo
  clockBtn.addEventListener('click', activateClockMode);

  // LUCE CONTINUA: Toggle ON / OFF indipendente dal lampeggio di notifica
  const lightToggleBtn = document.getElementById('lightToggleBtn');
  if (lightToggleBtn) {
    lightToggleBtn.addEventListener('click', toggleContinuousLight);
  }

  // CONTATORE FOLLOWER MULTI-SOCIAL (TikTok, Instagram, YouTube)
  if (followerBtn) {
    followerBtn.addEventListener('click', () => {
      playAudioClick();
      openFollowerModal();
    });
  }

  if (closeFollowerModal) closeFollowerModal.addEventListener('click', closeFollowerModalSheet);
  if (closeFollowerBackdrop) closeFollowerBackdrop.addEventListener('click', closeFollowerModalSheet);

  [socialCardTikTok, socialCardInstagram, socialCardYouTube].forEach(card => {
    if (card) {
      card.addEventListener('click', () => {
        playAudioClick();
        state.followerPlatform = card.dataset.platform;
        updateFollowerModalUI();
      });
    }
  });

  if (followerModeSelect) {
    followerModeSelect.addEventListener('change', () => {
      if (followerInitialGroup) {
        if (followerModeSelect.value === 'test') {
          followerInitialGroup.classList.remove('hidden');
        } else {
          followerInitialGroup.classList.add('hidden');
        }
      }
    });
  }

  if (startFollowerBtn) {
    startFollowerBtn.addEventListener('click', () => {
      playAudioClick();
      closeFollowerModalSheet();
      activateFollowerMode();
    });
  }

  if (feedPlusOneBtn) {
    feedPlusOneBtn.addEventListener('click', () => {
      incrementFollowerManually(1);
    });
  }

  // SALVATAGGIO & GALLERIA DISEGNI (Drawer da Crea & Feed)
  const galleryDrawer = document.getElementById('galleryDrawer');
  const closeGalleryDrawerBtn = document.getElementById('closeGalleryDrawerBtn');
  const closeGalleryBackdrop = document.getElementById('closeGalleryBackdrop');

  saveCanvasBtn.addEventListener('click', () => {
    playAudioClick();
    saveCurrentCanvas();
  });

  // Tasto Galleria posizionato dentro Crea & Feed
  if (galleryBtn) {
    galleryBtn.addEventListener('click', () => {
      playAudioClick();
      if (galleryDrawer) galleryDrawer.classList.remove('hidden');
      renderGallery();
    });
  }

  if (closeGalleryDrawerBtn) {
    closeGalleryDrawerBtn.addEventListener('click', () => {
      galleryDrawer?.classList.add('hidden');
    });
  }
  if (closeGalleryBackdrop) {
    closeGalleryBackdrop.addEventListener('click', () => {
      galleryDrawer?.classList.add('hidden');
    });
  }

  const saveCurrentFromGalleryBtn = document.getElementById('saveCurrentFromGalleryBtn');
  if (saveCurrentFromGalleryBtn) {
    saveCurrentFromGalleryBtn.addEventListener('click', saveCurrentCanvas);
  }
  const loadFromDisplayBtn = document.getElementById('loadFromDisplayBtn');
  if (loadFromDisplayBtn) {
    loadFromDisplayBtn.addEventListener('click', () => {
      playAudioClick();
      loadCurrentDrawingFromDisplay();
    });
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

  // SCREENSAVER (30 min) & LED (GPIO 5) & FILTRO BAMBINI
  screensaverToggle.addEventListener('change', (e) => sendScreensaverConfig(e.target.checked));
  ledToggle.addEventListener('change', (e) => sendLedConfig(e.target.checked));
  if (kidsModeToggle) {
    kidsModeToggle.addEventListener('change', (e) => sendKidsModeConfig(e.target.checked));
  }

  // NOTIFICHE PUSH SUL CELLULARE
  const phoneNotificationsToggle = document.getElementById('phoneNotificationsToggle');
  if (phoneNotificationsToggle) {
    phoneNotificationsToggle.checked = state.phoneNotifications;
    phoneNotificationsToggle.addEventListener('change', async (e) => {
      if (e.target.checked) {
        if (!('Notification' in window)) {
          alert(state.lang === 'it' ? "Il tuo browser non supporta le notifiche di sistema." : "Browser does not support notifications.");
          e.target.checked = false;
          return;
        }
        let perm = Notification.permission;
        if (perm === 'default') {
          perm = await Notification.requestPermission();
        }
        if (perm === 'granted') {
          state.phoneNotifications = true;
          localStorage.setItem('pixo_phone_notifications', 'true');
          showToast(state.lang === 'it' ? "🔔 Notifiche sul cellulare attivate!" : "🔔 Phone notifications enabled!", "success");
          sendSystemNotification("Pixò Notifiche Attivate", "Riceverai un avviso ogni volta che arriva un nuovo disegno.");
        } else {
          state.phoneNotifications = false;
          localStorage.setItem('pixo_phone_notifications', 'false');
          e.target.checked = false;
          showToast(state.lang === 'it' ? "Permesso notifiche negato nel browser." : "Notification permission denied.", "warning");
        }
      } else {
        state.phoneNotifications = false;
        localStorage.setItem('pixo_phone_notifications', 'false');
        showToast(state.lang === 'it' ? "Notifiche sul cellulare disattivate." : "Phone notifications disabled.", "info");
      }
    });
  }

  // Stop Feed Button
  stopFeedBtn.addEventListener('click', stopAutomaticFeed);

  // Foto con Scelta Esplicita: Fotocamera vs Galleria
  const photoSourceModal = document.getElementById('photoSourceModal');
  const closePhotoSourceBtn = document.getElementById('closePhotoSourceBtn');
  const closePhotoSourceBackdrop = document.getElementById('closePhotoSourceBackdrop');
  const btnSourceCamera = document.getElementById('btnSourceCamera');
  const btnSourceGallery = document.getElementById('btnSourceGallery');

  const handleIncomingPhotoFile = (file) => {
    if (!file) return;
    stopAutomaticFeed();
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const safety = checkImageSafety(img);
        if (!safety.safe) {
          showToast(t("toastKidsModeImgBlocked"), "error");
          return;
        }
        startInteractiveOverlay('image', img);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Pulsanti dedicati nella Tab 3 (Sezione Foto)
  const tabPhotoCameraBtn = document.getElementById('tabPhotoCameraBtn');
  const tabPhotoGalleryBtn = document.getElementById('tabPhotoGalleryBtn');

  if (tabPhotoCameraBtn && photoInputCamera) {
    tabPhotoCameraBtn.addEventListener('click', () => {
      playAudioClick();
      photoInputCamera.click();
    });
  }
  if (tabPhotoGalleryBtn && photoInputGallery) {
    tabPhotoGalleryBtn.addEventListener('click', () => {
      playAudioClick();
      photoInputGallery.click();
    });
  }

  // Modale Sorgente Foto (compatibilità)
  if (closePhotoSourceBtn && photoSourceModal) {
    closePhotoSourceBtn.addEventListener('click', () => {
      photoSourceModal.classList.add('hidden');
    });
  }
  if (closePhotoSourceBackdrop && photoSourceModal) {
    closePhotoSourceBackdrop.addEventListener('click', () => {
      photoSourceModal.classList.add('hidden');
    });
  }
  if (btnSourceCamera && photoInputCamera) {
    btnSourceCamera.addEventListener('click', () => {
      photoSourceModal?.classList.add('hidden');
      photoInputCamera.click();
    });
  }
  if (btnSourceGallery && photoInputGallery) {
    btnSourceGallery.addEventListener('click', () => {
      photoSourceModal?.classList.add('hidden');
      photoInputGallery.click();
    });
  }

  if (photoInputCamera) {
    photoInputCamera.addEventListener('change', (e) => {
      handleIncomingPhotoFile(e.target.files?.[0]);
      photoInputCamera.value = '';
    });
  }
  if (photoInputGallery) {
    photoInputGallery.addEventListener('change', (e) => {
      handleIncomingPhotoFile(e.target.files?.[0]);
      photoInputGallery.value = '';
    });
  }

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

  // Gestione Aggiornamento Firmware Remoto (OTA - Solo Proprietario)
  if (btnCheckFwUpdate) {
    btnCheckFwUpdate.addEventListener('click', handleCheckFwUpdate);
  }

  if (btnCancelOta) {
    btnCancelOta.addEventListener('click', () => {
      if (otaFormBox) otaFormBox.style.display = 'none';
    });
  }

  if (btnStartOta) {
    btnStartOta.addEventListener('click', handleStartOta);
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

      // Se l'utente entra nella tab Impostazioni (Dispositivo), nascondi la lavagna e il tasto invia!
      if (canvasStage) {
        if (targetId === 'panelSettings') {
          canvasStage.style.display = 'none';
        } else {
          canvasStage.style.display = 'flex';
        }
      }

      if (targetId === 'panelSmart') {
        // Smart Crea
      }
    });
  });

  // Chiusura Bottom Sheets cliccando sul backdrop
  const closeBackdrop = (sheetId) => {
    const sheet = document.getElementById(sheetId);
    if (sheet) sheet.classList.add('hidden');
  };
  document.getElementById('closeStickerBackdrop')?.addEventListener('click', () => closeBackdrop('stickerDrawer'));
  document.getElementById('closeGalleryBackdrop')?.addEventListener('click', () => closeBackdrop('galleryDrawer'));
  document.getElementById('closeTextBackdrop')?.addEventListener('click', () => closeBackdrop('textModal'));
  document.getElementById('closeShareBackdrop')?.addEventListener('click', () => closeBackdrop('shareModal'));
  document.getElementById('closePhotoSourceBackdrop')?.addEventListener('click', () => closeBackdrop('photoSourceModal'));
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

function verifyDeviceOnlineBeforeRegister(devId) {
  return new Promise((resolve) => {
    connectMQTT().then((connected) => {
      if (!connected || !state.mqttClient || !state.mqttClient.connected) {
        return resolve({ online: false, reason: "Impossibile connettersi a Pixò Cloud. Verifica la connessione Internet." });
      }

      const statusTopic = `pixo/device/${devId}/status`;
      const wifiTopic = `pixo/device/${devId}/wifi`;
      const diagTopic = `pixo/device/${devId}/diag`;

      let resolved = false;
      let timer = null;

      const handler = (topic, payload) => {
        if (topic === statusTopic) {
          const st = new TextDecoder().decode(payload).trim().toLowerCase();
          if (st === 'online' && !resolved) {
            cleanup();
            return resolve({ online: true });
          } else if (st === 'offline' && !resolved) {
            cleanup();
            return resolve({ online: false, reason: `Il Pixò '${devId}' risulta spento o non collegato.` });
          }
        } else if ((topic === wifiTopic || topic === diagTopic) && !resolved) {
          cleanup();
          return resolve({ online: true });
        }
      };

      function cleanup() {
        resolved = true;
        if (timer) clearTimeout(timer);
        try {
          state.mqttClient.removeListener('message', handler);
        } catch(e) {}
      }

      state.mqttClient.on('message', handler);
      state.mqttClient.subscribe(statusTopic, { qos: 1 });
      state.mqttClient.subscribe(wifiTopic, { qos: 0 });
      state.mqttClient.subscribe(diagTopic, { qos: 0 });

      timer = setTimeout(() => {
        if (!resolved) {
          cleanup();
          resolve({ online: false, reason: `Nessuna risposta dal Pixò '${devId}'. Il dispositivo non esiste o non è attualmente acceso e connesso al Wi-Fi.` });
        }
      }, 3000);
    });
  });
}

async function handleOnboardingLogin() {
  if (!onboardLoginDeviceId || !onboardLoginPin) return;

  let devId = onboardLoginDeviceId.value.trim().toUpperCase();
  if (!devId) {
    showOnboardingError("Inserisci l'ID del dispositivo (es. ESP32-9205D4 o 9205D4).");
    return;
  }
  if (!devId.startsWith("ESP32-")) {
    devId = "ESP32-" + devId;
  }
  if (devId === 'ESP32-5205D4') {
    devId = 'ESP32-9205D4';
  }

  const pin = onboardLoginPin.value.trim();
  if (!pin) {
    showOnboardingError("Inserisci il tuo PIN personale di sicurezza.");
    return;
  }
  if (pin.length < 4) {
    showOnboardingError("Il PIN deve contenere almeno 4 cifre.");
    return;
  }

  submitLoginBtn.disabled = true;
  submitLoginBtn.textContent = "🔍 Verifica Pixò sul Cloud...";

  const check = await verifyDeviceOnlineBeforeRegister(devId);
  if (!check.online) {
    submitLoginBtn.disabled = false;
    submitLoginBtn.textContent = "🚀 Connetti e Disegna";
    showOnboardingError(`⚠️ ${check.reason}`);
    return;
  }

  // Salva credenziali localmente SOLO dopo verifica online riuscita
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

  // Connetti e sottoscrivi al Cloud
  connectMQTT();
  showToast(`🎉 Pixò ${devId} verificato e connesso!`, "success");
}

async function handleOnboardingSubmit() {
  if (!onboardDeviceId || !onboardNewPin || !onboardConfirmPin) return;

  let devId = onboardDeviceId.value.trim().toUpperCase();
  if (!devId) {
    showOnboardingError("Inserisci l'ID del dispositivo (es. ESP32-9205D4 o 9205D4).");
    return;
  }
  if (!devId.startsWith("ESP32-")) {
    devId = "ESP32-" + devId;
  }
  if (devId === 'ESP32-5205D4') {
    devId = 'ESP32-9205D4';
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
  submitOnboardingBtn.textContent = "🔍 Verifica Pixò sul Cloud...";

  const check = await verifyDeviceOnlineBeforeRegister(devId);
  if (!check.online) {
    submitOnboardingBtn.disabled = false;
    submitOnboardingBtn.textContent = "🚀 Attiva e Connetti Pixò";
    showOnboardingError(`⚠️ ${check.reason}`);
    return;
  }

  submitOnboardingBtn.textContent = "Attivazione e connessione...";

  // Imposta lo stato locale solo dopo verifica
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
