/* ==========================================================================
   PIXÒ CLOUD - LOGICA APPLICATIVA JAVASCRIPT
   ========================================================================== */

// --- CONFIGURAZIONE PREDEFINITA BROKER MQTT ---
const DEFAULT_CONFIG = {
  brokerUrl: "wss://e58d8ef9b4cb45b9b8250157f6c5b7c2.s1.eu.hivemq.cloud:8884/mqtt",
  brokerUser: "dslump",
  brokerPass: "projectLavagna!",
  defaultDeviceId: "ESP32-A28DCC",
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
  textSize: 24
};

// --- RIFERIMENTI DOM ---
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const statusDot = document.getElementById('statusDot');
const deviceIdDisplay = document.getElementById('deviceIdDisplay');
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
const guestLinkInput = document.getElementById('guestLinkInput');
const copyGuestLinkBtn = document.getElementById('copyGuestLinkBtn');
const revokeGuestsBtn = document.getElementById('revokeGuestsBtn');

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
    state.deviceId = localStorage.getItem('pixo_device_id') || 
                     localStorage.getItem('lavagna_device_id') || 
                     DEFAULT_CONFIG.defaultDeviceId;
  }

  // Verifica se l'app è aperta come ospite
  if (urlParams.get('guest') === '1') {
    state.isGuestMode = true;
    state.guestKey = urlParams.get('key') || 'pixo123';
    state.devicePin = ""; // L'ospite NON ha e NON vede il PIN proprietario
  } else {
    state.isGuestMode = false;
    // Mantiene la chiave ospite memorizzata o il default pixo123
    state.guestKey = localStorage.getItem('pixo_guest_key') || 'pixo123';
    
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
  updateGuestLink();
}

function updateSettingsUI() {
  if (state.isGuestMode) {
    deviceIdDisplay.textContent = `${state.deviceName || state.deviceId} (Ospite)`;
    if (openSettingsBtn) openSettingsBtn.style.display = 'none';
    if (shareBtn) shareBtn.style.display = 'none';
    if (devicePill) {
      devicePill.style.cursor = 'default';
      devicePill.removeAttribute('title');
    }
    if (devicePinInput) devicePinInput.value = "";
  } else {
    deviceIdDisplay.textContent = state.deviceName || state.deviceId;
    if (openSettingsBtn) openSettingsBtn.style.display = '';
    if (shareBtn) shareBtn.style.display = '';
    if (devicePill) {
      devicePill.style.cursor = 'pointer';
      devicePill.title = "Clicca per aprire le impostazioni";
    }
    if (devicePinInput) devicePinInput.value = state.devicePin;
  }

  deviceNameInput.value = state.deviceName;
  if (devicePinInput) devicePinInput.value = state.devicePin;
  hardwareIdDisplay.textContent = state.deviceId;
  brightnessSlider.value = state.brightness;
  brightnessVal.textContent = `${state.brightness}%`;
  langSelect.value = state.lang;
  themeSelect.value = state.canvasTheme;
  weatherCityInput.value = state.weatherCity;

  if (screensaverToggle) screensaverToggle.checked = state.screensaverEnabled;
  if (ledToggle) ledToggle.checked = state.ledEnabled;
  if (allowGuestsToggle) allowGuestsToggle.checked = state.allowGuests;
}

function updateGuestLink() {
  if (!guestLinkInput) return;
  const baseUrl = window.location.origin + window.location.pathname;
  const url = new URL(baseUrl);
  url.searchParams.set('id', state.deviceId);
  url.searchParams.set('key', state.guestKey);
  url.searchParams.set('guest', '1');
  guestLinkInput.value = url.toString();
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
    overlayHintText.textContent = "🖐️ Sposta con un dito • Pizzica con 2 dita per ingrandire la foto";
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
    overlayHintText.textContent = "🖐️ Sposta con un dito • Pizzica con 2 dita per ingrandire l'icona";
  } else if (type === 'text') {
    state.interactiveElement.imageObj = null;
    state.interactiveElement.content = content;
    state.interactiveElement.aspectRatio = 1;
    state.interactiveElement.size = initialSize || 28;

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
    overlayHintText.textContent = "🖐️ Sposta con un dito • Pizzica con 2 dita per ingrandire il testo";
  }

  updateFloatingElementPosition();
  updateFloatingElementDisplay();

  elementOverlay.classList.remove('hidden');
  overlayToolbar.classList.remove('hidden');
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
  }
}

function closeInteractiveOverlay() {
  state.interactiveElement.active = false;
  elementOverlay.classList.add('hidden');
  overlayToolbar.classList.add('hidden');
  floatingElement.classList.remove('active-drag');
}

function confirmInteractiveOverlay() {
  if (!state.interactiveElement.active) return;
  const { type, content, imageObj, x, y, size, aspectRatio, color } = state.interactiveElement;

  if (type === 'image' && imageObj) {
    const w = size;
    const h = Math.round(w / aspectRatio);
    const drawX = Math.round(x - w / 2);
    const drawY = Math.round(y - h / 2);
    ctx.drawImage(imageObj, drawX, drawY, w, h);
    showToast("Foto posizionata sul disegno!", "success");
  } else if (type === 'sticker') {
    ctx.font = `${size}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(content, x, y);
    showToast("Icona inserita sul disegno!", "success");
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
    showToast("Testo inserito sul disegno!", "success");
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

  // GESTIONE EVENTI TOUCH (Smartphone / Tablet)
  elementOverlay.addEventListener('touchstart', (e) => {
    if (!state.interactiveElement.active) return;
    const { rect } = getScale();

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
    if (!state.interactiveElement.active || !mode) return;
    const { scaleX, scaleY, rect } = getScale();

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
    floatingElement.classList.remove('active-drag');
  };
  elementOverlay.addEventListener('touchend', endTouch);
  elementOverlay.addEventListener('touchcancel', endTouch);

  // GESTIONE EVENTI MOUSE (Desktop / PC)
  let isMouseDown = false;
  elementOverlay.addEventListener('mousedown', (e) => {
    if (!state.interactiveElement.active) return;
    const { rect } = getScale();
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
    if (!state.interactiveElement.active || !isMouseDown || !mode) return;
    const { scaleX, scaleY, rect } = getScale();

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
    card.className = 'gallery-card';

    const img = document.createElement('img');
    img.className = 'gallery-thumb';
    img.src = d.dataUrl;
    img.alt = d.name;
    img.title = state.lang === 'it' ? "Clicca per caricare sulla lavagna" : "Click to load onto canvas";
    img.onclick = () => loadSavedDrawing(d.id);

    const info = document.createElement('div');
    info.className = 'gallery-info';

    const nameEl = document.createElement('div');
    nameEl.className = 'gallery-name';
    nameEl.textContent = d.name;

    const dateEl = document.createElement('div');
    dateEl.className = 'gallery-date';
    dateEl.textContent = d.date;

    const actions = document.createElement('div');
    actions.className = 'gallery-card-actions';

    const loadBtn = document.createElement('button');
    loadBtn.className = 'btn mini-btn';
    loadBtn.textContent = '✏️ ' + (state.lang === 'it' ? 'Carica' : 'Load');
    loadBtn.onclick = () => loadSavedDrawing(d.id);

    const sendDirectBtn = document.createElement('button');
    sendDirectBtn.className = 'btn mini-btn primary-btn';
    sendDirectBtn.textContent = '🚀 ' + (state.lang === 'it' ? 'Invia' : 'Send');
    sendDirectBtn.onclick = () => sendSavedDrawingDirect(d.id);

    const delBtn = document.createElement('button');
    delBtn.className = 'btn mini-btn danger';
    delBtn.textContent = '🗑️';
    delBtn.title = 'Elimina';
    delBtn.onclick = () => deleteSavedDrawing(d.id);

    actions.appendChild(loadBtn);
    actions.appendChild(sendDirectBtn);
    actions.appendChild(delBtn);

    info.appendChild(nameEl);
    info.appendChild(dateEl);
    info.appendChild(actions);

    card.appendChild(img);
    card.appendChild(info);
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
    galleryModal.classList.add('hidden');
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
  if (!state.mqttConnected || !state.mqttClient || !state.mqttClient.connected) {
    await connectMQTT();
  }
  state.lightOn = !state.lightOn;
  if (!state.deviceId) return;

  const topic = `pixo/device/${state.deviceId}/led`;
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
  const topic = `pixo/device/${state.deviceId}/access`;
  const cmd = enabled ? "GUEST:ENABLE" : "GUEST:DISABLE";
  state.mqttClient.publish(topic, cmd, { qos: 0, retain: false });
  showToast(enabled ? t("toastGuestEnabled") : t("toastGuestDisabled"), enabled ? "success" : "error");
}

function revokeAndRegenerateGuestKey() {
  const newKey = generateRandomGuestKey();
  state.guestKey = newKey;
  localStorage.setItem('pixo_guest_key', newKey);
  updateGuestLink();

  if (state.mqttConnected && state.deviceId) {
    const topic = `pixo/device/${state.deviceId}/access`;
    const cmd = `GUEST:KEY:${newKey}`;
    state.mqttClient.publish(topic, cmd, { qos: 0, retain: false });
  }

  showToast(t("toastKeyRevoked"), "success");
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

function connectMQTT() {
  if (state.mqttConnected && state.mqttClient && state.mqttClient.connected) {
    return Promise.resolve(true);
  }
  if (mqttConnectPromise) return mqttConnectPromise;

  state.mqttConnecting = true;
  statusDot.className = "status-dot connecting";
  statusDot.title = "Connessione a Pixò Cloud...";

  const clientId = "WebPixo_" + Math.random().toString(16).substr(2, 8);
  const options = {
    clientId: clientId,
    clean: true,
    connectTimeout: 5000,
    reconnectPeriod: 2000,
    keepalive: 15, // Keepalive a 15s: previene socket zombie o congelati su smartphone
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
          statusDot.className = "status-dot online";
          statusDot.title = "Connesso a Pixò Cloud";
          showToast(t("toastConnected"), "success");

          // Invia la luminosità memorizzata all'avvio
          sendBrightness(state.brightness);

          // Sincronizza la chiave ospiti dal proprietario al dispositivo
          if (state.deviceId && !state.isGuestMode && state.guestKey) {
            const accTopic = `pixo/device/${state.deviceId}/access`;
            state.mqttClient.publish(accTopic, `GUEST:KEY:${state.guestKey}`, { qos: 0, retain: false });
          }
          resolve(true);
        });

        state.mqttClient.on('error', (err) => {
          console.error('[MQTT] Errore MQTT:', err);
          state.mqttConnected = false;
          state.mqttConnecting = false;
          mqttConnectPromise = null;
          statusDot.className = "status-dot";
          resolve(false);
        });

        state.mqttClient.on('offline', () => {
          state.mqttConnected = false;
          state.mqttConnecting = false;
          statusDot.className = "status-dot";
        });

        state.mqttClient.on('close', () => {
          state.mqttConnected = false;
          state.mqttConnecting = false;
          statusDot.className = "status-dot";
        });
      } else {
        // Se il client esiste già ma il socket si era addormentato (background mobile), forza subito la riconnessione!
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
        }, 80);
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

async function sendCanvasMqtt() {
  if (!state.deviceId) return;

  // Se non siamo ancora connessi al broker (es. appena aperta l'app o risvegliata dal background), attendi la connessione!
  if (!state.mqttConnected || !state.mqttClient || !state.mqttClient.connected) {
    await connectMQTT();
    if (!state.mqttConnected) return;
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
          const elapsed = Math.round(performance.now() - sendStart);
          const kb = (uint8Array.length / 1024).toFixed(1);
          showToast(t("toastSentSuccess", { name: state.deviceName || state.deviceId, kb: kb, ms: elapsed }), "success");
        }
      });
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
  }
}

function showToast(message, type = "info") {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 2800);
}

// ==========================================================================
//  10. EVENT LISTENERS
// ==========================================================================
function setupEventListeners() {
  // Configura interazione touch & drag per overlay ingrandimento
  setupOverlayInteraction();

  // Ferma Feed
  stopFeedBtn.addEventListener('click', stopAutomaticFeed);

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

  // CONDIVISIONE & GESTIONE OSPITI
  shareBtn.addEventListener('click', () => {
    shareModal.classList.remove('hidden');
    updateGuestLink();
  });
  closeShareModal.addEventListener('click', () => shareModal.classList.add('hidden'));
  allowGuestsToggle.addEventListener('change', (e) => sendGuestAccessConfig(e.target.checked));
  copyGuestLinkBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(guestLinkInput.value);
      showToast(t("toastLinkCopied"), "success");
    } catch(e) {
      guestLinkInput.select();
      document.execCommand('copy');
      showToast(t("toastLinkCopied"), "success");
    }
  });
  revokeGuestsBtn.addEventListener('click', revokeAndRegenerateGuestKey);

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

  stickerSizeSlider.addEventListener('input', (e) => {
    state.stickerSize = parseInt(e.target.value, 10);
    stickerSizeVal.textContent = `${state.stickerSize}px`;
  });

  // Modal Testo
  textToolBtn.addEventListener('click', () => {
    textModal.classList.remove('hidden');
    customTextInput.focus();
  });
  closeTextModal.addEventListener('click', () => textModal.classList.add('hidden'));
  applyTextBtn.addEventListener('click', applyCustomText);

  textSizeSlider.addEventListener('input', (e) => {
    state.textSize = parseInt(e.target.value, 10);
    textSizeVal.textContent = `${state.textSize}px`;
    document.querySelectorAll('.font-size-picker .size-pill').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.size, 10) === state.textSize);
    });
  });

  document.querySelectorAll('.font-size-picker .size-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.font-size-picker .size-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.textSize = parseInt(btn.dataset.size, 10);
      textSizeSlider.value = state.textSize;
      textSizeVal.textContent = `${state.textSize}px`;
    });
  });

  // Slider Luminosità (Hardware PWM in tempo reale)
  brightnessSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    sendBrightness(val);
  });

  // Modal Impostazioni (Accessibile SOLO al Proprietario)
  const openSettings = () => {
    if (state.isGuestMode) return;
    settingsModal.classList.remove('hidden');
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

// Sveglia immediata socket MQTT alla riapertura dell'app / cambio tab / sblocco schermo su smartphone
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    if (!state.mqttClient || !state.mqttClient.connected) {
      state.mqttConnected = false;
      connectMQTT();
    }
  }
});
window.addEventListener('focus', () => {
  if (!state.mqttClient || !state.mqttClient.connected) {
    state.mqttConnected = false;
    connectMQTT();
  }
});
window.addEventListener('online', () => {
  state.mqttConnected = false;
  connectMQTT();
});

// ==========================================================================
//  BOOTSTRAP
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initDeviceAndSettings();
  initCanvas();
  initStickers();
  setupEventListeners();
  connectMQTT();
  registerServiceWorker();
});
