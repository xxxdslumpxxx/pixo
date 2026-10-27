/*
 * ===================================================================================
 *  PROGETTO: Lavagna Smart Cloud - ESP32-C3 SuperMini + Display ST7789 (240x240)
 * ===================================================================================
 *  Hardware Collaudato:
 *  - Microcontrollore: ESP32-C3 SuperMini
 *  - Display: 1.54" TFT ST7789 SPI 240x240
 *  - Pinout: SCL:4 | SDA:6 | CS:7 | DC:2 | RST:3 | BL:10
 *  - Grafica: Adafruit_ST7789 + TJpg_Decoder (Hardware SPI Nativo)
 *  - Rete: WiFiManager (Captive Portal autonomo) + HiveMQ Cloud TLS (8883)
 * ===================================================================================
 */

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <HTTPUpdate.h>
#include <WiFiManager.h> // Configurazione autonoma Wi-Fi da smartphone via Captive Portal
#include <esp_system.h>
#include <nvs_flash.h>
#include <LittleFS.h>

// Sovrascrittura dimensione pacchetto PubSubClient per payload JPEG da 240x240 px
#define MQTT_MAX_PACKET_SIZE 36864
#include <PubSubClient.h>

#include <SPI.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ST7789.h>
#include <TJpg_Decoder.h>
#include <AnimatedGIF.h>
#include "waiting_gif.h"

// ===================================================================================
//  CONFIGURAZIONE BROKER DEDICATO ORACLE CLOUD (SEMPRE GRATIS A VITA CON TLS LET'S ENCRYPT)
// ===================================================================================
const char* MQTT_BROKER   = "mqtt.dslumpstudio.com"; 
const int   MQTT_PORT     = 8883;                     
const bool  USE_TLS       = true;                     
const char* MQTT_USER     = "pixo";       
const char* MQTT_PASS     = "projectLavagna!";       

// ID Dispositivo:
// Lasciando "AUTO", ogni ESP32 ricava il proprio ID dal chip MAC (es. ESP32-B2090C).
// Questo permette di flashare lo stesso identico codice su tutti i 50 dispositivi autonomi!
const char* CONFIG_DEVICE_ID = "AUTO";

// Topic base MQTT (Nuovo Pixò + Retrocompatibilità)
const char* TOPIC_PREFIX        = "pixo/device/";
const char* TOPIC_PREFIX_LEGACY = "lavagna/device/";

#include <time.h>
#include <Preferences.h>

// ===================================================================================
//  PINOUT COLLAUDATO (ESP32-C3 SuperMini -> ST7789 240x240)
// ===================================================================================
#define TFT_CS    7
#define TFT_DC    2
#define TFT_RST   3
#define TFT_MOSI  6
#define TFT_SCLK  4
#define TFT_BL    10
#define NOTIF_LED_PIN 5  // Pin per LED ausiliario 3.2V (con resistenza 47-100 ohm verso GND)
#define BUZZER_PIN    9  // Pin per Buzzer Audio (Canale 9 ESP32-C3)

// ===================================================================================
//  OGGETTI GLOBALI
// ==========================================================================
Adafruit_ST7789 tft = Adafruit_ST7789(TFT_CS, TFT_DC, TFT_RST);
AnimatedGIF gif;
Preferences preferences;

WiFiClient netClient;
WiFiClientSecure secureClient;
PubSubClient mqttClient;

const char* FIRMWARE_VERSION = "1.2.0";

// Cornice Digitale / Slideshow Foto Autonomo (LittleFS)
#define MAX_SLIDESHOW_PHOTOS 5
bool slideshowActive = false;
int slideshowCount = 0;
int slideshowInterval = 15; // Intervallo predefinito in secondi
int currentSlideIndex = 0;
unsigned long lastSlideChangeTime = 0;
String topicSlideshow = "";
String topicSlideWildcard = "";
String topicSlideStatus = "";

String deviceId = "";
String topicSubscribe = "";
String topicSubscribeLegacy = "";
String topicBrightness = "";
String topicScreensaver = "";
String topicAccess = "";
String topicLed = "";
String topicGuestWildcard = "";
String topicPinWildcard = "";
String topicSetPin = "";
String topicFactoryReset = "";
String topicWifi = "";
String topicSetWifi = "";
String topicWifiPortal = "";
String topicStatus = "";
String topicCurrent = "";
String topicOta = "";
String topicOtaStatus = "";
const char* TOPIC_GLOBAL_OTA = "pixo/global/ota";
const char* MASTER_OTA_PIN   = "pixo_master_2026"; // PIN segreto del proprietario per broadcast globale

unsigned long lastReconnectAttempt = 0;

// Prototipi di funzione per gestione Wi-Fi, MQTT & OTA
boolean connectMQTT();
void publishWifiStatus();
void handleWifiChange(const String& newSsid, const String& newPass);
void startWiFiConfigPortal();
void enterStandbyGif();
void performOTAUpdate(const String& otaUrl, const String& targetVersion = "");
void checkAutoUpdateOnBoot();
void showRecoveryInfoScreen(int durationSec);

// Stato visualizzazione e Screensaver
bool isDeviceActivated = false;
bool hasUserDrawing = false;
bool gifOpen = false;
bool isInitialBoot = true; // Diventa false dopo il setup: impedisce schermate di boot durante riconnessioni di rete
bool isQuickRecoveryBoot = false; // Flag Quick Power-Cycle: schermata 30s Info & PIN recovery
unsigned long setupFinishedTime = 0;
String bootResetReasonStr = "ACCENSIONE";
int bootResetReasonCode = 1;
unsigned long nextFrameTime = 0;
unsigned long lastDrawTime = 0;
bool screensaverEnabled = true;
const unsigned long SCREENSAVER_TIMEOUT_MS = 30UL * 60UL * 1000UL; // 30 minuti

// Luce Fissa & Notifiche LED Ausiliario 3.2V (GPIO 5)
bool ledNotifEnabled = true;
bool ledLightState = false; // Stato luce continua indipendente (ON/OFF)
int  blinkStep = 0;
unsigned long blinkNextTime = 0;

// ===================================================================================
//  GESTIONE FEEDBACK AUDIO BUZZER (GPIO 9)
// ===================================================================================
void buzzerSetup() {
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);
}

void buzzerBootSound() {
  tone(BUZZER_PIN, 2000, 70);
  delay(100);
  tone(BUZZER_PIN, 2600, 90);
}

void buzzerNotificationSound() {
  tone(BUZZER_PIN, 2500, 110);
}

void triggerLedNotification() {
  if (!ledNotifEnabled) return;
  buzzerNotificationSound();
  blinkStep = 1;
  ledcWrite(NOTIF_LED_PIN, 255);
  blinkNextTime = millis() + 90; // Primo flash: 90ms
}

void processLedBlink() {
  if (blinkStep == 0) return;
  if (millis() < blinkNextTime) return;

  switch (blinkStep) {
    case 1: // Fine 1° flash -> Breve pausa 80ms
      ledcWrite(NOTIF_LED_PIN, 0);
      blinkNextTime = millis() + 80;
      blinkStep = 2;
      break;
    case 2: // Inizio 2° flash -> 90ms
      ledcWrite(NOTIF_LED_PIN, 255);
      blinkNextTime = millis() + 90;
      blinkStep = 3;
      break;
    case 3: // Fine 2° flash -> Ripristina stato luce fissa (ON o OFF)
      ledcWrite(NOTIF_LED_PIN, ledLightState ? 255 : 0);
      blinkStep = 0;
      break;
  }
}

// Orologio Digitale Nativo Stile Smart Weather Clock (Zero Traffico di Rete)
bool clockModeActive = false;
unsigned long lastClockTick = 0;
bool colonVisible = true;
int lastClockMin = -1;
int lastClockSec = -1;

// Contatore Social Follower Nativo con Barra Avanzamento Hardware (Zero Traffico)
bool followerModeActive = false;
String followerPlatform = "tiktok"; // "tiktok", "instagram", "youtube"
String followerUsername = "PIXO";
long followerCurrentCount = 0;
long followerLastRenderedCount = -1;
int followerInterval = 30;
int followerElapsedSec = 0;
unsigned long followerLastSecTick = 0;


// Gestione Ospiti & Sicurezza PIN
bool guestAllowed = true;
String guestAccessKey = "pixo123";
String authorizedGuestKeys = "pixo123";
String devicePin = "1234";

// Verifica se la chiave ospite inviata è autorizzata
bool isGuestKeyAuthorized(const String& key) {
  if (key.length() == 0) return false;
  if (!guestAllowed) return false;
  if (authorizedGuestKeys == "NONE") return false;
  
  // Se l'elenco delle chiavi multiple è presente, valida ESCLUSIVAMENTE contro di esso
  if (authorizedGuestKeys.length() > 0) {
    String searchToken = "," + key + ",";
    String list = "," + authorizedGuestKeys + ",";
    return (list.indexOf(searchToken) != -1);
  }
  
  // Fallback con la singola chiave storica solo se authorizedGuestKeys non è ancora stata popolata
  if (guestAccessKey.length() > 0 && guestAccessKey != "NONE") {
    return (key == guestAccessKey);
  }
  
  return false;
}

// Callback per TJpg_Decoder: pulizia selettiva rumore DCT/ringing sul nero e invio al display
bool tft_output(int16_t x, int16_t y, uint16_t w, uint16_t h, uint16_t* bitmap) {
  if (y >= tft.height()) return false;
  
  // Rimuovi artefatti di compressione JPEG attorno alle linee (soglia nero assoluto <10%)
  uint32_t count = (uint32_t)w * h;
  for (uint32_t i = 0; i < count; i++) {
    uint16_t c = bitmap[i];
    uint8_t r = (c >> 11) & 0x1F;
    uint8_t g = (c >> 5) & 0x3F;
    uint8_t b = c & 0x1F;
    if (r <= 3 && g <= 6 && b <= 3) {
      bitmap[i] = 0x0000; // Nero puro e assoluto
    }
  }

  tft.drawRGBBitmap(x, y, bitmap, w, h);
  return true;
}

// Banner informativo sotto la GIF animata (visibile SOLO fino all'attivazione)
void drawActivationBanner() {
  tft.fillRect(0, 194, 240, 46, 0x000F); // Navy blue scuro
  tft.drawFastHLine(0, 194, 240, ST77XX_CYAN); // Linea superiore di separazione

  // Riga 1: ID Dispositivo
  tft.setTextSize(1);
  tft.setTextColor(ST77XX_YELLOW);
  tft.setCursor(6, 201);
  tft.print("ID: ");
  tft.setTextSize(2);
  tft.setTextColor(ST77XX_WHITE);
  tft.print(deviceId);

  // Riga 2: PIN
  tft.setTextSize(1);
  tft.setTextColor(ST77XX_CYAN);
  tft.setCursor(6, 222);
  tft.print("PIN: ");
  tft.setTextSize(2);
  tft.setTextColor(0x07E0); // Verde brillante
  tft.print(devicePin);

  // Badge arancione di stato
  tft.setTextSize(1);
  tft.setTextColor(0xFD20); // Arancione
  tft.setCursor(145, 225);
  tft.print("DA ATTIVARE");
}

// Passaggio immediato e pulito all'animazione GIF di standby su sfondo giallo nativo
void enterStandbyGif() {
  clockModeActive = false;
  followerModeActive = false;
  slideshowActive = false;
  hasUserDrawing = false;
  blinkStep = 0;
  if (!ledLightState) ledcWrite(NOTIF_LED_PIN, 0);
  if (gifOpen) {
    gif.close();
    gifOpen = false;
  }
  nextFrameTime = 0;
  tft.fillScreen(0xF7D73C);
  if (!isDeviceActivated) {
    drawActivationBanner();
  }
}

// Callback per AnimatedGIF: disegna ogni riga dell'animazione
void GIFDraw(GIFDRAW *pDraw) {
  if (hasUserDrawing) return; // Se è arrivato un disegno, abortisce il rendering del frame

  // Se Pixò non è ancora attivato (PIN di fabbrica 1234), riserva le ultime righe per l'ID e il PIN
  if (!isDeviceActivated && (pDraw->iY + pDraw->y) >= 194) {
    return;
  }

  uint8_t *s;
  uint16_t *d, *usPalette, usTemp[240];
  int x, y, iWidth;

  iWidth = pDraw->iWidth;
  if (iWidth + pDraw->iX > 240)
    iWidth = 240 - pDraw->iX;
  usPalette = pDraw->pPalette;
  y = pDraw->iY + pDraw->y; // riga corrente
  if (y >= 240 || pDraw->iX >= 240 || iWidth < 1)
    return;

  s = pDraw->pPixels;
  if (pDraw->ucDisposalMethod == 2) {
    for (x = 0; x < iWidth; x++) {
      if (s[x] == pDraw->ucTransparent)
        s[x] = pDraw->ucBackground;
    }
    pDraw->ucHasTransparency = 0;
  }

  if (pDraw->ucHasTransparency) {
    uint8_t *pEnd, c, ucTransparent = pDraw->ucTransparent;
    int xPos = 0, iCount = 0;
    pEnd = s + iWidth;
    while (xPos < iWidth) {
      c = ucTransparent - 1;
      d = usTemp;
      while (c != ucTransparent && s < pEnd) {
        c = *s++;
        if (c == ucTransparent) {
          s--;
        } else {
          *d++ = usPalette[c];
          iCount++;
        }
      }
      if (iCount) {
        tft.drawRGBBitmap(pDraw->iX + xPos, y, usTemp, iCount, 1);
        xPos += iCount;
        iCount = 0;
      }
      c = ucTransparent;
      while (c == ucTransparent && s < pEnd) {
        c = *s++;
        if (c == ucTransparent)
          iCount++;
        else
          s--;
      }
      if (iCount) {
        xPos += iCount;
        iCount = 0;
      }
    }
  } else {
    s = pDraw->pPixels;
    for (x = 0; x < iWidth; x++)
      usTemp[x] = usPalette[*s++];
    tft.drawRGBBitmap(pDraw->iX, y, usTemp, iWidth, 1);
  }
}

// Genera un ID univoco basato sull'eFuse MAC dell'ESP32-C3
String getDeviceID() {
  if (String(CONFIG_DEVICE_ID) != "AUTO" && strlen(CONFIG_DEVICE_ID) > 0) {
    return String(CONFIG_DEVICE_ID);
  }
  uint64_t mac = ESP.getEfuseMac();
  char idBuffer[16];
  snprintf(idBuffer, sizeof(idBuffer), "ESP32-%06X", (uint32_t)(mac & 0xFFFFFF));
  return String(idBuffer);
}

// ===================================================================================
//  OROLOGIO DIGITALE NATIVO (STILE SMART WEATHER CLOCK) - ZERO CARICO DI RETE
// ===================================================================================
void drawNativeClock(bool forceFullRedraw = false) {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo, 50)) {
    if (forceFullRedraw) {
      tft.fillScreen(ST77XX_BLACK);
      tft.fillRect(0, 0, 240, 36, 0x0842);
      tft.setTextSize(2);
      tft.setTextColor(ST77XX_CYAN);
      tft.setCursor(12, 10);
      tft.print("PIXO' CLOCK");
      tft.setTextColor(ST77XX_YELLOW);
      tft.setTextSize(2);
      tft.setCursor(20, 100);
      tft.print("Sincronizzazione...");
      tft.setTextSize(1);
      tft.setTextColor(ST77XX_WHITE);
      tft.setCursor(20, 130);
      tft.print("In attesa segnale orario NTP...");
    }
    return;
  }

  const char* giorniIt[] = {"DOM", "LUN", "MAR", "MER", "GIO", "VEN", "SAB"};
  const char* mesiIt[]   = {"GEN", "FEB", "MAR", "APR", "MAG", "GIU", "LUG", "AGO", "SET", "OTT", "NOV", "DIC"};

  if (forceFullRedraw) {
    tft.fillScreen(ST77XX_BLACK);

    // Barra superiore Navy / Dark Cyan
    tft.fillRect(0, 0, 240, 36, 0x0842);
    tft.setTextSize(2);
    tft.setTextColor(ST77XX_CYAN);
    tft.setCursor(12, 10);
    tft.print("PIXO' CLOCK");

    // Data breve in alto a destra (es. "SAB 26")
    int safeWday = constrain(timeinfo.tm_wday, 0, 6);
    int safeMon  = constrain(timeinfo.tm_mon, 0, 11);
    char headerBuf[16];
    snprintf(headerBuf, sizeof(headerBuf), "%s %02d", giorniIt[safeWday], timeinfo.tm_mday);
    tft.setTextColor(ST77XX_YELLOW);
    tft.setCursor(155, 10);
    tft.print(headerBuf);

    // Linea divisoria sottile
    tft.drawFastHLine(0, 36, 240, 0x03FF);

    // Cornice per la barra secondi in basso
    tft.drawRoundRect(18, 178, 204, 10, 4, 0x4208);
  }

  // Aggiornamento cifre Ore e Minuti se cambiano o se forzato
  if (forceFullRedraw || timeinfo.tm_min != lastClockMin) {
    lastClockMin = timeinfo.tm_min;

    // Pulisce il riquadro cifre centrali
    tft.fillRect(10, 48, 220, 75, ST77XX_BLACK);

    // Ore grandi a sinistra (X=15, Y=56)
    tft.setTextSize(7);
    tft.setTextColor(ST77XX_WHITE);
    tft.setCursor(15, 56);
    tft.printf("%02d", timeinfo.tm_hour);

    // Minuti grandi a destra (X=140, Y=56)
    tft.setCursor(140, 56);
    tft.printf("%02d", timeinfo.tm_min);

    // Data per esteso nel riquadro centrale (Y=142)
    tft.fillRect(10, 138, 220, 24, ST77XX_BLACK);
    tft.setTextSize(2);
    tft.setTextColor(0x07E0); // Verde brillante
    int safeMon = constrain(timeinfo.tm_mon, 0, 11);
    char dateBuf[32];
    snprintf(dateBuf, sizeof(dateBuf), "%02d %s %04d", timeinfo.tm_mday, mesiIt[safeMon], timeinfo.tm_year + 1900);
    int xDate = (240 - (strlen(dateBuf) * 12)) / 2;
    tft.setCursor(max(10, xDate), 142);
    tft.print(dateBuf);
  }

  // Separatore due punti ':' lampeggiante a 1Hz tra Ore e Minuti (X=112)
  if (colonVisible) {
    tft.fillRect(112, 70, 8, 10, 0xFD20); // Arancione caldo vivo
    tft.fillRect(112, 95, 8, 10, 0xFD20);
  } else {
    tft.fillRect(112, 70, 8, 10, ST77XX_BLACK);
    tft.fillRect(112, 95, 8, 10, ST77XX_BLACK);
  }

  // Secondi e barra avanzamento (aggiornati ogni secondo)
  if (forceFullRedraw || timeinfo.tm_sec != lastClockSec) {
    lastClockSec = timeinfo.tm_sec;

    // Barra avanzamento lineare secondo per secondo (0-59 sec)
    int barW = map(timeinfo.tm_sec, 0, 59, 0, 200);
    tft.fillRect(20, 180, barW, 6, 0x03FF); // Ciano neon
    tft.fillRect(20 + barW, 180, 200 - barW, 6, ST77XX_BLACK);

    // Indicatore numerico secondi centrato in basso
    tft.fillRect(80, 200, 80, 20, ST77XX_BLACK);
    tft.setTextSize(2);
    tft.setTextColor(0x07FF);
    tft.setCursor(95, 202);
    tft.printf(":%02d", timeinfo.tm_sec);
  }
}

// ===================================================================================
//  CONTATORE SOCIAL FOLLOWER NATIVO (ST7789 240x240 - NERO ASSOLUTO 0x0000)
// ===================================================================================
void drawNativeFollower(bool forceFullRedraw = false) {
  if (forceFullRedraw) {
    tft.fillScreen(ST77XX_BLACK);

    // 1. Barra Superiore Header (44px)
    uint16_t themeColor = ST77XX_CYAN;
    String platName = "TIKTOK";
    if (followerPlatform.equalsIgnoreCase("instagram")) {
      themeColor = 0xFD20; // Arancione Instagram
      platName = "INSTAGRAM";
    } else if (followerPlatform.equalsIgnoreCase("youtube")) {
      themeColor = ST77XX_RED;
      platName = "YOUTUBE";
    }

    // Linea accento social in alto (Y=0, H=3)
    tft.fillRect(0, 0, 240, 3, themeColor);

    // Icona Social Stilizzata a sinistra (X=10, Y=12, 22x22)
    tft.drawRoundRect(10, 12, 22, 22, 5, themeColor);
    tft.fillCircle(21, 23, 5, themeColor);

    // Nome Social in chiaro (X=38, Y=14)
    tft.setTextSize(1);
    tft.setTextColor(themeColor);
    tft.setCursor(38, 14);
    tft.print(platName);

    // Nome account (X=38, Y=25, TextSize: 2)
    tft.setTextSize(2);
    tft.setTextColor(ST77XX_WHITE);
    tft.setCursor(38, 25);
    String uDisp = followerUsername;
    uDisp.trim();
    if (!uDisp.startsWith("@")) uDisp = "@" + uDisp;
    if (uDisp.length() > 14) uDisp = uDisp.substring(0, 14);
    tft.print(uDisp);

    // Linea divisoria orizzontale sotto l'header (Y=46)
    tft.drawFastHLine(0, 46, 240, 0x2104);

    // Linea divisoria sopra FOLLOWERS (Y=146)
    tft.drawFastHLine(0, 146, 240, 0x2104);

    // Dicitura FOLLOWERS a sinistra (X=30, Y=161)
    tft.fillCircle(18, 168, 5, themeColor);

    tft.setTextSize(2);
    tft.setTextColor(0x9CD3); // Argento chiaro
    tft.setCursor(30, 161);
    tft.print("FOLLOWERS");

    // Cornice arrotondata della barra di avanzamento (stile Orologio Nativo)
    tft.drawRoundRect(18, 188, 204, 10, 4, 0x4208);

    followerLastRenderedCount = -1;
  }

  // 2. Disegno Tessere Cifre se il conteggio è variato (7 CIFRE: fino a 9.999.999 Milioni!)
  if (forceFullRedraw || followerCurrentCount != followerLastRenderedCount) {
    followerLastRenderedCount = followerCurrentCount;

    // Buffer di 7 cifre formattate con spazi a sinistra
    char numBuf[16];
    snprintf(numBuf, sizeof(numBuf), "%7ld", max(0L, followerCurrentCount));

    const int tileW = 29;
    const int tileH = 76;
    const int gap = 3;
    const int totalW = 7 * tileW + 6 * gap; // 221px
    const int startX = (240 - totalW) / 2;  // 9px
    const int tileY = 56;

    for (int i = 0; i < 7; i++) {
      int tx = startX + i * (tileW + gap);
      char ch = numBuf[i];

      // Sfondo tessera nero assoluto con bordo rettangolare arrotondato
      tft.fillRoundRect(tx, tileY, tileW, tileH, 4, ST77XX_BLACK);
      tft.drawRoundRect(tx, tileY, tileW, tileH, 4, 0x39E7); // Bordo grigio

      // Cerniera orizzontale centrale split-flap
      tft.drawFastHLine(tx, tileY + (tileH / 2), tileW, 0x2945);
      tft.fillRect(tx - 1, tileY + (tileH / 2) - 2, 2, 4, 0x7BEF);
      tft.fillRect(tx + tileW - 1, tileY + (tileH / 2) - 2, 2, 4, 0x7BEF);

      if (ch != ' ') {
        tft.setTextSize(4); // 24x32 pixel per cifra, perfettamente centrata
        tft.setTextColor(ST77XX_WHITE);
        tft.setCursor(tx + 4, tileY + 22);
        tft.print(ch);
      }
    }

    // Totale numerico a destra sulla riga FOLLOWERS
    tft.fillRect(145, 155, 90, 24, ST77XX_BLACK);
    tft.setTextSize(2);
    tft.setTextColor(ST77XX_WHITE);
    char fmtBuf[16];
    snprintf(fmtBuf, sizeof(fmtBuf), "%ld", max(0L, followerCurrentCount));
    int xFmt = 230 - (strlen(fmtBuf) * 12);
    tft.setCursor(max(145, xFmt), 161);
    tft.print(fmtBuf);
  }

  // 3. Avanzamento Barra Lineare ad ogni secondo (Identico all'Orologio)
  int safeInterval = max(5, followerInterval);
  int curSec = constrain(followerElapsedSec, 0, safeInterval);
  int barW = map(curSec, 0, safeInterval, 0, 200);

  uint16_t barColor = (followerPlatform.equalsIgnoreCase("youtube")) ? ST77XX_RED : (followerPlatform.equalsIgnoreCase("instagram") ? 0xFD20 : ST77XX_CYAN);
  tft.fillRect(20, 190, barW, 6, barColor);
  tft.fillRect(20 + barW, 190, 200 - barW, 6, ST77XX_BLACK);

  // Secondi rimanenti puliti in basso
  int remSec = max(0, safeInterval - curSec);
  tft.fillRect(30, 208, 180, 24, ST77XX_BLACK);
  tft.setTextSize(1);
  tft.setTextColor(ST77XX_CYAN);
  char remBuf[32];
  if (curSec >= safeInterval) {
    snprintf(remBuf, sizeof(remBuf), "Aggiornamento in corso...");
  } else {
    snprintf(remBuf, sizeof(remBuf), "Aggiornamento tra: %02ds", remSec);
  }
  int xRem = (240 - (strlen(remBuf) * 6)) / 2;
  tft.setCursor(max(10, xRem), 214);
  tft.print(remBuf);
}

// Chiamata HTTP autonoma da ESP32 per recuperare i follower live da Wi-Fi senza dipendere dall'app
void fetchAutonomousFollowerCount() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[AUTONOMOUS FOLLOWER] Wi-Fi non connesso, salto interrogazione.");
    return;
  }

  Serial.printf("[AUTONOMOUS FOLLOWER] Interrogazione rete per %s (%s)...\n", followerPlatform.c_str(), followerUsername.c_str());

  WiFiClientSecure client;
  client.setInsecure();
  client.setHandshakeTimeout(7);

  HTTPClient http;
  http.setFollowRedirects(HTTPC_STRICT_FOLLOW_REDIRECTS);
  http.setUserAgent("Pixo-ESP32");

  long newCount = -1;

  if (followerPlatform.equalsIgnoreCase("tiktok")) {
    String url = "https://countik.com/api/exist/" + followerUsername;
    http.begin(client, url);
    int httpCode = http.GET();
    if (httpCode == HTTP_CODE_OK) {
      String payload = http.getString();
      int idx = payload.indexOf("\"followerCount\":");
      if (idx != -1) {
        int endIdx = payload.indexOf(',', idx);
        if (endIdx != -1) {
          String countStr = payload.substring(idx + 16, endIdx);
          countStr.trim();
          newCount = countStr.toInt();
        }
      }
    } else {
      Serial.printf("[AUTONOMOUS FOLLOWER] Errore HTTP TikTok: %d\n", httpCode);
    }
    http.end();
  } else if (followerPlatform.equalsIgnoreCase("youtube")) {
    String url = "https://mixerno.space/api/youtube-channel-counter/user/" + followerUsername;
    http.begin(client, url);
    int httpCode = http.GET();
    if (httpCode == HTTP_CODE_OK) {
      String payload = http.getString();
      int idx = payload.indexOf("\"count\":");
      if (idx != -1) {
        int endIdx = payload.indexOf('}', idx);
        if (endIdx != -1) {
          String countStr = payload.substring(idx + 8, endIdx);
          countStr.trim();
          newCount = countStr.toInt();
        }
      }
    } else {
      Serial.printf("[AUTONOMOUS FOLLOWER] Errore HTTP YouTube: %d\n", httpCode);
    }
    http.end();
  }

  if (newCount >= 0) {
    Serial.printf("[AUTONOMOUS FOLLOWER] Conteggio aggiornato con successo: %ld (Precedente: %ld)\n", newCount, followerCurrentCount);
    followerCurrentCount = newCount;
  }
}

void showBootScreen(const String& statusText, uint16_t color = ST77XX_WHITE) {
  tft.fillScreen(ST77XX_BLACK);
  
  // Header Navy
  tft.fillRect(0, 0, 240, 36, 0x000F);
  tft.drawFastHLine(0, 36, 240, ST77XX_CYAN);
  tft.setTextSize(2);
  tft.setTextColor(ST77XX_WHITE);
  tft.setCursor(55, 10);
  tft.print("PIXO' CLOUD");

  // Device ID Box (riga 1)
  tft.setTextSize(1);
  tft.setTextColor(ST77XX_CYAN);
  tft.setCursor(20, 48);
  tft.print("DEVICE ID:");
  tft.setTextSize(2);
  tft.setTextColor(ST77XX_YELLOW);
  tft.setCursor(20, 60);
  tft.print(deviceId);

  // PIN Box (riga 2, separata)
  tft.setTextSize(1);
  tft.setTextColor(ST77XX_CYAN);
  tft.setCursor(20, 88);
  tft.print("PIN SICUREZZA:");
  tft.setTextSize(3);
  tft.setTextColor(0x07E0); // Verde chiaro
  tft.setCursor(20, 102);
  tft.print(devicePin);

  // Stato Connessione
  tft.setTextSize(2);
  tft.setTextColor(color);
  tft.setCursor(20, 142);
  tft.print(statusText);

  // Footer pulito
  tft.drawFastHLine(15, 204, 210, 0x2104);
  tft.setTextSize(1);
  tft.setTextColor(ST77XX_CYAN);
  tft.setCursor(20, 214);
  tft.print("pixo.dslumpstudio.com");
}

// Schermata di Emergenza / Recupero PIN & Info Dispositivo (Quick Power-Cycle)
void showRecoveryInfoScreen(int durationSec) {
  tft.fillScreen(ST77XX_BLACK);

  // Header Navy pulito
  tft.fillRect(0, 0, 240, 34, 0x000F);
  tft.drawFastHLine(0, 34, 240, ST77XX_CYAN);
  tft.setTextSize(2);
  tft.setTextColor(ST77XX_WHITE);
  tft.setCursor(30, 9);
  tft.print("PIXO' - ACCESSO");

  // ID Dispositivo
  tft.setTextSize(1);
  tft.setTextColor(ST77XX_CYAN);
  tft.setCursor(16, 44);
  tft.print("ID DISPOSITIVO:");
  tft.setTextSize(2);
  tft.setTextColor(ST77XX_YELLOW);
  tft.setCursor(16, 56);
  tft.print(deviceId);

  // Box PIN gigante con bordo verde brillante
  tft.fillRoundRect(14, 82, 212, 76, 8, 0x0842); // Card sfondo scuro
  tft.drawRoundRect(14, 82, 212, 76, 8, 0x07E0); // Bordo verde brillante
  
  tft.setTextSize(1);
  tft.setTextColor(ST77XX_WHITE);
  tft.setCursor(24, 90);
  tft.print("PIN DI SICUREZZA:");

  // PIN a dimensione 4 (24x32 px per cifra) - Gigante e chiarissimo da lontano
  tft.setTextSize(4);
  tft.setTextColor(0x07E0); // Verde Neon
  int pinLen = devicePin.length();
  int pinX = (240 - (pinLen * 24)) / 2;
  if (pinX < 24) pinX = 24;
  tft.setCursor(pinX, 112);
  tft.print(devicePin);

  // Link WebApp
  tft.setTextSize(1);
  tft.setTextColor(0xAD55);
  tft.setCursor(16, 172);
  tft.print("Accedi: ");
  tft.setTextColor(ST77XX_WHITE);
  tft.print("pixo.dslumpstudio.com");

  // Divisore countdown
  tft.drawFastHLine(14, 192, 212, 0x2104);

  // Loop del conto alla rovescia (30 secondi) con ricezione MQTT attiva
  unsigned long endTime = millis() + (durationSec * 1000UL);
  int lastSec = -1;

  while (millis() < endTime) {
    if (WiFi.status() == WL_CONNECTED) {
      mqttClient.loop();
      if (hasUserDrawing) {
        Serial.println("[RECOVERY] Disegno ricevuto durante recovery, passaggio immediato al canvas!");
        return;
      }
    }

    int remainingSec = (int)((endTime - millis() + 999) / 1000);
    if (remainingSec != lastSec) {
      lastSec = remainingSec;

      // Aggiornamento testo countdown
      tft.fillRect(14, 200, 212, 12, ST77XX_BLACK);
      tft.setTextSize(1);
      tft.setTextColor(0x7BEF);
      tft.setCursor(16, 202);
      tft.printf("Standby tra: %2d secondi", remainingSec);

      // Aggiornamento barra di avanzamento dinamica
      int barW = map(remainingSec, 0, durationSec, 0, 212);
      if (barW < 0) barW = 0;
      tft.fillRect(14, 218, 212, 6, 0x2104);
      if (barW > 0) {
        tft.fillRect(14, 218, barW, 6, ST77XX_CYAN);
      }
    }
    delay(50);
  }

  Serial.println("[RECOVERY] Timer scaduto: passaggio a standby.");
}

// Schermata mostrata quando si attiva il Captive Portal per configurare il Wi-Fi
void showWiFiConfigScreen(const String& apName) {
  tft.fillScreen(ST77XX_BLACK);

  // Header Giallo
  tft.fillRect(0, 0, 240, 32, ST77XX_YELLOW);
  tft.setTextSize(2);
  tft.setTextColor(ST77XX_BLACK);
  tft.setCursor(15, 8);
  tft.print("CONFIGURA WI-FI");

  // Istruzioni chiare per l'utente finale
  tft.setTextSize(1);
  tft.setTextColor(ST77XX_WHITE);
  tft.setCursor(8, 38);
  tft.println("1. Connetti lo smartphone al Wi-Fi:");

  tft.setTextSize(2);
  tft.setTextColor(ST77XX_GREEN);
  tft.setCursor(8, 52);
  tft.println(apName);

  tft.setTextSize(1);
  tft.setTextColor(ST77XX_WHITE);
  tft.setCursor(8, 76);
  tft.println("2. Apri il browser su: 192.168.4.1");
  tft.setCursor(8, 90);
  tft.println("   e seleziona la tua rete di casa.");

  // Box ID Dispositivo e PIN
  tft.fillRoundRect(6, 108, 228, 86, 6, 0x0842); // Box grigio scuro a contrasto
  tft.drawRoundRect(6, 108, 228, 86, 6, ST77XX_CYAN); // Bordo ciano

  tft.setTextSize(1);
  tft.setTextColor(ST77XX_YELLOW);
  tft.setCursor(14, 116);
  tft.print("ID DISPOSITIVO:");

  tft.setTextSize(2);
  tft.setTextColor(ST77XX_WHITE);
  tft.setCursor(14, 128);
  tft.print(deviceId);

  tft.setTextSize(1);
  tft.setTextColor(ST77XX_CYAN);
  tft.setCursor(14, 154);
  tft.print("PIN DISPOSITIVO: ");
  tft.setTextSize(2);
  tft.setTextColor(0x07E0); // Verde chiaro
  tft.print(devicePin);

  tft.setTextColor(0xFD20); // Arancione
  tft.setTextSize(1);
  tft.setCursor(8, 208);
  tft.println("In attesa di configurazione...");
}

// ==========================================================================
//  CALLBACK RICEZIONE MQTT (DECODIFICA JPEG, LUMINOSITA', LED, CONFIG)
// ==========================================================================
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  Serial.printf("\n[MQTT] Ricevuto messaggio sul topic: %s | Dimensione: %u bytes\n", topic, length);

  if (length < 1) return;

  // 1. Gestione Luminosità Display (0 - 100%)
  if (strcmp(topic, topicBrightness.c_str()) == 0 ||
      (length >= 11 && memcmp(payload, "BRIGHTNESS:", 11) == 0)) {
    int percent = 100;
    if (strcmp(topic, topicBrightness.c_str()) == 0) {
      char buf[8];
      unsigned int l = min(length, (unsigned int)7);
      memcpy(buf, payload, l);
      buf[l] = '\0';
      percent = atoi(buf);
    } else {
      char buf[8];
      unsigned int l = min(length - 11, (unsigned int)7);
      memcpy(buf, payload + 11, l);
      buf[l] = '\0';
      percent = atoi(buf);
    }
    percent = constrain(percent, 5, 100);
    int duty = map(percent, 0, 100, 0, 255);
    ledcWrite(TFT_BL, duty);
    Serial.printf("[LUMINOSITA'] Impostata al %d%% (PWM duty: %d)\n", percent, duty);
    return;
  }

  // 2. Gestione LED Ausiliario 3.2V (GPIO 5): Luce fissa e Notifiche
  String topStrLed = String(topic);
  bool isLedCmd = (topStrLed == topicLed) ||
                  (topStrLed.startsWith(String(TOPIC_PREFIX) + deviceId + "/") && topStrLed.endsWith("/led")) ||
                  (length >= 4 && memcmp(payload, "LED:", 4) == 0);
  if (isLedCmd) {
    // Controllo sicurezza PIN: accetta PIN proprietario, PIN di fabbrica 1234, o Master Key
    if (devicePin.length() > 0 && devicePin != "1234" && devicePin != "NONE") {
      String prefix = String(TOPIC_PREFIX) + deviceId + "/";
      if (topStrLed.startsWith(prefix) && topStrLed.endsWith("/led")) {
        String sub = topStrLed.substring(prefix.length());
        if (sub.endsWith("/led") && sub != "led") {
          int slash = sub.indexOf("/led");
          String sentPin = (slash != -1) ? sub.substring(0, slash) : "";
          if (sentPin != devicePin && sentPin != "1234" && sentPin != MASTER_OTA_PIN) {
            Serial.printf("[LED] Comando LED BLOCCATO: PIN errato ('%s')!\n", sentPin.c_str());
            return;
          }
        }
      }
    }

    char buf[32];
    unsigned int l = min(length, (unsigned int)31);
    memcpy(buf, payload, l);
    buf[l] = '\0';
    String cmd = String(buf);
    if (cmd.startsWith("LED:")) cmd = cmd.substring(4);
    cmd.trim();

    if (cmd.equalsIgnoreCase("NOTIF:ON") || cmd.equalsIgnoreCase("NOTIF:1")) {
      ledNotifEnabled = true;
      preferences.begin("pixo", false);
      preferences.putBool("led_notif", true);
      preferences.end();
      Serial.println("[LED] Notifiche lampeggianti ABILITATE (salvato in NVS)");
    } else if (cmd.equalsIgnoreCase("NOTIF:OFF") || cmd.equalsIgnoreCase("NOTIF:0")) {
      ledNotifEnabled = false;
      preferences.begin("pixo", false);
      preferences.putBool("led_notif", false);
      preferences.end();
      Serial.println("[LED] Notifiche lampeggianti DISABILITATE (salvato in NVS)");
    } else if (cmd.equalsIgnoreCase("ON") || cmd.equalsIgnoreCase("LIGHT:ON") || cmd == "1") {
      ledLightState = true;
      blinkStep = 0;
      ledcWrite(NOTIF_LED_PIN, 255);
      Serial.println("[LED] Luce fissa ACCESA");
    } else if (cmd.equalsIgnoreCase("OFF") || cmd.equalsIgnoreCase("LIGHT:OFF") || cmd == "0") {
      ledLightState = false;
      blinkStep = 0;
      ledcWrite(NOTIF_LED_PIN, 0);
      Serial.println("[LED] Luce fissa SPENTA");
    } else {
      int pct = constrain(cmd.toInt(), 0, 100);
      int duty = map(pct, 0, 100, 0, 255);
      ledLightState = (duty > 0);
      blinkStep = 0;
      ledcWrite(NOTIF_LED_PIN, duty);
      Serial.printf("[LED] Luce fissa regolata al %d%%\n", pct);
    }
    return;
  }

  // 3. Gestione Flag Screensaver 30 Minuti (salvato in flash NVS)
  if (strcmp(topic, topicScreensaver.c_str()) == 0 ||
      (length >= 12 && memcmp(payload, "SCREENSAVER:", 12) == 0)) {
    char buf[16];
    unsigned int l = min(length, (unsigned int)15);
    memcpy(buf, payload, l);
    buf[l] = '\0';
    String cmd = String(buf);
    if (cmd.startsWith("SCREENSAVER:")) cmd = cmd.substring(12);
    cmd.trim();
    screensaverEnabled = (cmd.equalsIgnoreCase("ON") || cmd == "1");
    preferences.begin("pixo", false);
    preferences.putBool("scrsav", screensaverEnabled);
    preferences.end();
    Serial.printf("[SCREENSAVER] Impostato a: %s (salvato in memoria NVS)\n", screensaverEnabled ? "ATTIVO" : "DISATTIVATO");
    return;
  }

  // 4. Gestione Controllo Accessi & Inibizione Ospiti
  String currentTopicStr = String(topic);
  if (currentTopicStr == topicAccess ||
      currentTopicStr.startsWith(topicAccess + "/") ||
      (length >= 6 && memcmp(payload, "GUEST:", 6) == 0)) {
    char buf[512];
    unsigned int l = min(length, (unsigned int)511);
    memcpy(buf, payload, l);
    buf[l] = '\0';
    String cmd = String(buf);
    cmd.trim();

    if (currentTopicStr.endsWith("/status") || cmd == "GUEST:DISABLE" || cmd == "GUEST:ENABLE" || cmd == "DISABLE" || cmd == "ENABLE") {
      if (cmd == "DISABLE" || cmd == "GUEST:DISABLE") {
        guestAllowed = false;
        preferences.begin("pixo", false);
        preferences.putBool("gst_ok", false);
        preferences.end();
        Serial.println("[SICUREZZA] Accesso Ospiti INIBITO dal Proprietario!");
      } else {
        guestAllowed = true;
        preferences.begin("pixo", false);
        preferences.putBool("gst_ok", true);
        preferences.end();
        Serial.println("[SICUREZZA] Accesso Ospiti RIABILITATO!");
      }
    } else if (currentTopicStr.endsWith("/keys") || cmd.startsWith("GUEST:KEYS:")) {
      if (cmd.startsWith("GUEST:KEYS:")) cmd = cmd.substring(11);
      cmd.trim();
      if (cmd.length() > 0) {
        authorizedGuestKeys = cmd;
        preferences.begin("pixo", false);
        preferences.putString("gst_keys", authorizedGuestKeys);
        preferences.end();
        Serial.printf("[SICUREZZA] Elenco chiavi ospiti aggiornato: %s\n", authorizedGuestKeys.c_str());
      }
    } else if (currentTopicStr.endsWith("/key") || cmd.startsWith("GUEST:KEY:")) {
      if (cmd.startsWith("GUEST:KEY:")) cmd = cmd.substring(10);
      cmd.trim();
      if (cmd.length() >= 3) {
        guestAccessKey = cmd;
        preferences.begin("pixo", false);
        preferences.putString("gst_key", guestAccessKey);
        preferences.end();
        Serial.printf("[SICUREZZA] Nuova chiave ospiti salvata: %s (vecchi link invalidati)\n", guestAccessKey.c_str());
      }
    }
    return;
  }

  // 4b. Gestione Modifica PIN di Sicurezza (salvato in NVS)
  String topStr = String(topic);
  if (topStr.endsWith("/setpin") || (length >= 7 && memcmp(payload, "SETPIN:", 7) == 0)) {
    bool pinChangeAuth = false;
    String prefix = String(TOPIC_PREFIX) + deviceId + "/";
    if (topStr.startsWith(prefix)) {
      String sub = topStr.substring(prefix.length());
      if (sub == "setpin") {
        if (devicePin == "1234" || devicePin.length() == 0) pinChangeAuth = true;
      } else if (sub.endsWith("/setpin")) {
        int slash = sub.indexOf("/setpin");
        String oldPin = sub.substring(0, slash);
        if (oldPin == devicePin || (devicePin == "1234" && oldPin == "1234")) {
          pinChangeAuth = true;
        }
      }
    } else {
      if (devicePin == "1234") pinChangeAuth = true;
    }

    if (pinChangeAuth) {
      char buf[16];
      unsigned int l = min(length, (unsigned int)15);
      memcpy(buf, payload, l);
      buf[l] = '\0';
      String newPin = String(buf);
      if (newPin.startsWith("SETPIN:")) newPin = newPin.substring(7);
      newPin.trim();
      if (newPin.length() >= 2) {
        devicePin = newPin;
        isDeviceActivated = (devicePin != "1234");
        preferences.begin("pixo", false);
        preferences.putString("dev_pin", devicePin);
        preferences.end();
        Serial.printf("[SICUREZZA] Nuovo PIN di sicurezza impostato e salvato: %s (Attivato: %d)\n", devicePin.c_str(), isDeviceActivated);
        if (isDeviceActivated) {
          tft.fillRect(0, 194, 240, 46, 0xF7D73C); // Cancella la barra con il colore giallo originale della GIF!
        }
      }
    } else {
      Serial.println("[SICUREZZA] Modifica PIN RIFIUTATA: PIN precedente non autorizzato!");
    }
    return;
  }

  // 4c. Gestione Ripristino ai Dati di Fabbrica (Factory Reset - Solo Proprietario con PIN)
  if (topStr.endsWith("/factory_reset") || (length >= 13 && memcmp(payload, "FACTORY_RESET", 13) == 0)) {
    bool resetAuth = false;
    String prefix = String(TOPIC_PREFIX) + deviceId + "/";
    if (topStr.startsWith(prefix)) {
      String sub = topStr.substring(prefix.length());
      if (sub.endsWith("/factory_reset")) {
        int slash = sub.indexOf("/factory_reset");
        String sentPin = (slash != -1) ? sub.substring(0, slash) : "";
        if (sentPin == devicePin || sentPin == "1234" || devicePin == "1234") {
          resetAuth = true;
        }
      }
    }
    if (!resetAuth && length >= 13) {
      char buf[32];
      unsigned int l = min(length, (unsigned int)31);
      memcpy(buf, payload, l);
      buf[l] = '\0';
      String pStr = String(buf);
      if (pStr.startsWith("FACTORY_RESET")) {
        int col = pStr.indexOf(':');
        String sentPin = (col != -1) ? pStr.substring(col + 1) : "";
        sentPin.trim();
        if (sentPin == devicePin || sentPin == "1234" || devicePin == "1234") {
          resetAuth = true;
        }
      }
    }

    if (resetAuth) {
      Serial.println("[RESET] FACTORY RESET autorizzato! Ripristino condizioni di fabbrica...");
      tft.fillScreen(ST77XX_BLACK);
      tft.fillRect(0, 0, 240, 36, ST77XX_RED);
      tft.setTextSize(2);
      tft.setTextColor(ST77XX_WHITE);
      tft.setCursor(25, 10);
      tft.print("FACTORY RESET");

      tft.setTextSize(2);
      tft.setTextColor(ST77XX_YELLOW);
      tft.setCursor(15, 60);
      tft.println("Ripristino dati");
      tft.setCursor(15, 85);
      tft.println("di fabbrica...");

      tft.setTextSize(1);
      tft.setTextColor(ST77XX_WHITE);
      tft.setCursor(15, 130);
      tft.println("1. Reset Wi-Fi e Captive Portal");
      tft.setCursor(15, 150);
      tft.println("2. Reset PIN a 1234");
      tft.setCursor(15, 170);
      tft.println("3. Riavvio sistema...");

      preferences.begin("pixo", false);
      preferences.clear();
      preferences.end();

      WiFiManager wm;
      wm.resetSettings();
      WiFi.disconnect(true, true);

      // Cancellazione fisica completa della memoria NVS (elimina definitivamente SSID e Password Wi-Fi)
      nvs_flash_erase();
      nvs_flash_init();

      delay(1500);
      Serial.println("[RESET] Riavvio dispositivo...");
      ESP.restart();
      return;
    } else {
      Serial.println("[RESET] FACTORY RESET RIFIUTATO: PIN errato!");
      return;
    }
  }

  // 4d. Gestione Cambio Wi-Fi Remoto (Solo Proprietario con PIN o ID autorizzato)
  if (topStr.endsWith("/setwifi") || (length >= 8 && memcmp(payload, "SETWIFI:", 8) == 0)) {
    bool wifiAuth = false;
    String prefix = String(TOPIC_PREFIX) + deviceId + "/";
    if (topStr.startsWith(prefix)) {
      String sub = topStr.substring(prefix.length());
      if (sub == "setwifi") {
        if (devicePin == "1234" || devicePin.length() == 0) wifiAuth = true;
      } else if (sub.endsWith("/setwifi")) {
        int slash = sub.indexOf("/setwifi");
        String sentPin = (slash != -1) ? sub.substring(0, slash) : "";
        if (sentPin == devicePin || sentPin == "1234" || devicePin == "1234") {
          wifiAuth = true;
        }
      }
    } else {
      if (devicePin == "1234") wifiAuth = true;
    }

    if (!wifiAuth && length >= 8) {
      char buf[64];
      unsigned int l = min(length, (unsigned int)63);
      memcpy(buf, payload, l);
      buf[l] = '\0';
      String pStr = String(buf);
      if (pStr.indexOf(devicePin) != -1 || devicePin == "1234") {
        wifiAuth = true;
      }
    }

    if (wifiAuth) {
      String pl = "";
      for (unsigned int i = 0; i < length && i < 256; i++) pl += (char)payload[i];
      pl.trim();

      String newSsid = "";
      String newPass = "";

      if (pl.startsWith("{")) {
        int idxSsid = pl.indexOf("\"ssid\":");
        if (idxSsid != -1) {
          int q1 = pl.indexOf('"', idxSsid + 7);
          if (q1 != -1) {
            int q2 = pl.indexOf('"', q1 + 1);
            if (q2 != -1) newSsid = pl.substring(q1 + 1, q2);
          }
        }
        int idxPass = pl.indexOf("\"pass\":");
        if (idxPass != -1) {
          int q1 = pl.indexOf('"', idxPass + 7);
          if (q1 != -1) {
            int q2 = pl.indexOf('"', q1 + 1);
            if (q2 != -1) newPass = pl.substring(q1 + 1, q2);
          }
        }
      } else if (pl.startsWith("SETWIFI:")) {
        String rest = pl.substring(8);
        int sep = rest.indexOf(':');
        if (sep != -1) {
          newSsid = rest.substring(0, sep);
          newPass = rest.substring(sep + 1);
        } else {
          newSsid = rest;
        }
      }

      newSsid.trim();
      newPass.trim();

      if (newSsid.length() > 0) {
        handleWifiChange(newSsid, newPass);
      } else {
        Serial.println("[WIFI] Errore: SSID vuoto o non valido nel messaggio!");
      }
    } else {
      Serial.println("[WIFI] Cambio Wi-Fi RIFIUTATO: PIN errato o non autorizzato!");
    }
    return;
  }

  // 4e. Gestione Apertura Portale Hotspot Wi-Fi (Pixo-Setup)
  if (topStr.endsWith("/wifi_portal") || (length >= 11 && memcmp(payload, "WIFI:PORTAL", 11) == 0)) {
    bool portalAuth = false;
    String prefix = String(TOPIC_PREFIX) + deviceId + "/";
    if (topStr.startsWith(prefix)) {
      String sub = topStr.substring(prefix.length());
      if (sub == "wifi_portal") {
        if (devicePin == "1234" || devicePin.length() == 0) portalAuth = true;
      } else if (sub.endsWith("/wifi_portal")) {
        int slash = sub.indexOf("/wifi_portal");
        String sentPin = (slash != -1) ? sub.substring(0, slash) : "";
        if (sentPin == devicePin || sentPin == "1234" || devicePin == "1234") {
          portalAuth = true;
        }
      }
    } else {
      if (devicePin == "1234") portalAuth = true;
    }

    if (portalAuth) {
      startWiFiConfigPortal();
    } else {
      Serial.println("[WIFI] Apertura Portale Wi-Fi RIFIUTATA: PIN errato!");
    }
    return;
  }

  // 4f. Gestione Aggiornamento Firmware Remoto (OTA - Singolo Dispositivo o Broadcast Globale)
  bool isGlobalOta = (topStr == TOPIC_GLOBAL_OTA);
  if (isGlobalOta || topStr.endsWith("/ota") || (length >= 4 && memcmp(payload, "OTA:", 4) == 0)) {
    bool otaAuth = false;
    
    // Se è un comando globale per tutta la flotta, richiede il PIN master segreto
    if (isGlobalOta) {
      char buf[64];
      unsigned int l = min(length, (unsigned int)63);
      memcpy(buf, payload, l);
      buf[l] = '\0';
      String pStr = String(buf);
      if (pStr.indexOf(MASTER_OTA_PIN) != -1) {
        otaAuth = true;
        Serial.println("[OTA GLOBAL] Comando broadcast autorizzato con Master Key!");
      }
    } else {
      String prefix = String(TOPIC_PREFIX) + deviceId + "/";
      if (topStr.startsWith(prefix)) {
        String sub = topStr.substring(prefix.length());
        if (sub == "ota") {
          if (devicePin == "1234" || devicePin.length() == 0) otaAuth = true;
        } else if (sub.endsWith("/ota")) {
          int slash = sub.indexOf("/ota");
          String sentPin = (slash != -1) ? sub.substring(0, slash) : "";
          if (sentPin == devicePin || sentPin == "1234" || devicePin == "1234" || sentPin == MASTER_OTA_PIN) {
            otaAuth = true;
          }
        }
      } else {
        if (devicePin == "1234") otaAuth = true;
      }

      if (!otaAuth && length >= 4) {
        char buf[64];
        unsigned int l = min(length, (unsigned int)63);
        memcpy(buf, payload, l);
        buf[l] = '\0';
        String pStr = String(buf);
        if (pStr.indexOf(devicePin) != -1 || devicePin == "1234" || pStr.indexOf(MASTER_OTA_PIN) != -1) {
          otaAuth = true;
        }
      }
    }

    if (otaAuth) {
      String pl = "";
      for (unsigned int i = 0; i < length && i < 512; i++) pl += (char)payload[i];
      pl.trim();

      String otaUrl = "";
      String otaVer = "";

      if (pl.startsWith("{")) {
        int idxUrl = pl.indexOf("\"url\":");
        if (idxUrl != -1) {
          int q1 = pl.indexOf('"', idxUrl + 6);
          if (q1 != -1) {
            int q2 = pl.indexOf('"', q1 + 1);
            if (q2 != -1) otaUrl = pl.substring(q1 + 1, q2);
          }
        }
        int idxVer = pl.indexOf("\"version\":");
        if (idxVer != -1) {
          int q1 = pl.indexOf('"', idxVer + 10);
          if (q1 != -1) {
            int q2 = pl.indexOf('"', q1 + 1);
            if (q2 != -1) otaVer = pl.substring(q1 + 1, q2);
          }
        }
      } else if (pl.startsWith("OTA:")) {
        otaUrl = pl.substring(4);
        otaUrl.trim();
      } else {
        otaUrl = pl;
      }

      otaUrl.trim();
      otaVer.trim();

      if (otaUrl.length() > 0) {
        performOTAUpdate(otaUrl, otaVer);
      } else {
        Serial.println("[OTA] URL firmware non specificato!");
      }
    } else {
      Serial.println("[OTA] Aggiornamento RIFIUTATO: PIN errato o non autorizzato!");
    }
    return;
  }

  // 5. Verifica Filtro Sicurezza e PIN
  topStr = String(topic);
  if (topStr.indexOf("/guest/") != -1) {
    int keyStart = topStr.indexOf("/guest/") + 7;
    int keyEnd = topStr.indexOf("/draw", keyStart);
    String sentKey = (keyEnd != -1) ? topStr.substring(keyStart, keyEnd) : topStr.substring(keyStart);
    sentKey.trim();

    if (!guestAllowed) {
      Serial.println("[SICUREZZA] Disegno OSPITE BLOCCATO: l'accesso ospiti e' inibito dal proprietario!");
      String ackTopic = String(TOPIC_PREFIX) + deviceId + "/guest/" + sentKey + "/ack";
      mqttClient.publish(ackTopic.c_str(), "REJECTED:DISABLED", false);
      return;
    }
    if (!isGuestKeyAuthorized(sentKey)) {
      Serial.printf("[SICUREZZA] Disegno OSPITE RIFIUTATO: chiave '%s' non autorizzata o revocata!\n", sentKey.c_str());
      String ackTopic = String(TOPIC_PREFIX) + deviceId + "/guest/" + sentKey + "/ack";
      mqttClient.publish(ackTopic.c_str(), "REJECTED:UNAUTHORIZED", false);
      return;
    }
    Serial.printf("[SICUREZZA] Disegno OSPITE autorizzato con successo! (Chiave: %s)\n", sentKey.c_str());
  } else if (topStr.endsWith("/draw")) {
    String prefix = String(TOPIC_PREFIX) + deviceId + "/";
    if (topStr.startsWith(prefix)) {
      String subPart = topStr.substring(prefix.length()); // "draw" oppure "<PIN>/draw"
      if (subPart != "draw") {
        int slashIdx = subPart.indexOf("/draw");
        String sentPin = (slashIdx != -1) ? subPart.substring(0, slashIdx) : subPart;
        if (sentPin.length() > 0 && sentPin != devicePin && sentPin != "1234") {
          Serial.printf("[SICUREZZA] Disegno RIFIUTATO: PIN errato ('%s' vs autorizzato '%s')!\n", sentPin.c_str(), devicePin.c_str());
          return;
        }
        Serial.println("[SICUREZZA] Disegno PROPRIETARIO autorizzato con PIN corretto!");
      } else {
        if (devicePin.length() > 0 && devicePin != "NONE" && devicePin != "1234") {
          Serial.println("[SICUREZZA] Disegno ANONIMO BLOCCATO: il dispositivo richiede il PIN di sicurezza!");
          return;
        }
      }
    }
  }

  // 6. Comando CLEAR: ripristina la simpatica animazione di standby
  if (length == 5 && memcmp(payload, "CLEAR", 5) == 0) {
    Serial.println("[MQTT] Ricevuto comando CLEAR autorizzato: ritorno ad animazione di standby.");
    enterStandbyGif();
    return;
  }

  // 6b. Comando CLOCK: attiva la modalità Orologio Digitale Nativo stile Smart Weather Clock
  if (length == 5 && memcmp(payload, "CLOCK", 5) == 0) {
    Serial.println("[MQTT] Ricevuto comando CLOCK: attivazione Orologio Digitale Nativo!");
    clockModeActive = true;
    followerModeActive = false;
    hasUserDrawing = false;
    if (gifOpen) {
      gif.close();
      gifOpen = false;
    }
    colonVisible = true;
    lastClockMin = -1;
    lastClockSec = -1;
    drawNativeClock(true);
    return;
  }

  // 6c. Comando FOLLOWER: attiva il Contatore Social Follower Nativo
  // Formato: FOLLOWER:TIKTOK:@username:1420:30 oppure COUNT:1421
  if (length >= 6 && memcmp(payload, "COUNT:", 6) == 0) {
    char cBuf[32];
    unsigned int l = min(length - 6, (unsigned int)31);
    memcpy(cBuf, payload + 6, l);
    cBuf[l] = '\0';
    followerCurrentCount = atol(cBuf);
    followerElapsedSec = 0; // Reset della barra ad ogni nuovo conteggio
    Serial.printf("[MQTT] Nuovo conteggio Follower: %ld\n", followerCurrentCount);
    if (followerModeActive) {
      drawNativeFollower(false);
    }
    return;
  }

  if (length >= 8 && memcmp(payload, "FOLLOWER", 8) == 0) {
    String pStr = "";
    for (unsigned int i = 0; i < length && i < 128; i++) pStr += (char)payload[i];
    pStr.trim();
    Serial.printf("[MQTT] Ricevuto comando FOLLOWER: %s\n", pStr.c_str());

    // Parsing parametri: FOLLOWER:PLATFORM:USERNAME:COUNT:INTERVAL
    int p1 = pStr.indexOf(':');
    if (p1 != -1) {
      int p2 = pStr.indexOf(':', p1 + 1);
      if (p2 != -1) {
        followerPlatform = pStr.substring(p1 + 1, p2);
        int p3 = pStr.indexOf(':', p2 + 1);
        if (p3 != -1) {
          followerUsername = pStr.substring(p2 + 1, p3);
          int p4 = pStr.indexOf(':', p3 + 1);
          if (p4 != -1) {
            followerCurrentCount = pStr.substring(p3 + 1, p4).toInt();
            followerInterval = pStr.substring(p4 + 1).toInt();
          } else {
            followerCurrentCount = pStr.substring(p3 + 1).toInt();
            followerInterval = 30;
          }
        } else {
          followerUsername = pStr.substring(p2 + 1);
        }
      } else {
        followerPlatform = pStr.substring(p1 + 1);
      }
    }

    if (followerInterval < 5) followerInterval = 30;
    followerElapsedSec = 0;
    followerModeActive = true;
    clockModeActive = false;
    hasUserDrawing = false;
    if (gifOpen) {
      gif.close();
      gifOpen = false;
    }

    // Salvataggio permanente in NVS per autonomia totale
    preferences.begin("pixo", false);
    preferences.putString("fol_plat", followerPlatform);
    preferences.putString("fol_user", followerUsername);
    preferences.putInt("fol_int", followerInterval);
    preferences.putLong("fol_count", followerCurrentCount);
    preferences.end();
    Serial.printf("[NVS] Configurazione Follower salvata in memoria flash: %s @%s ogni %ds (Iniziale: %ld)\n",
      followerPlatform.c_str(), followerUsername.c_str(), followerInterval, followerCurrentCount);

    drawNativeFollower(true);
    return;
  }

  // 6d. Gestione Upload Foto per Cornice Digitale / Slideshow Autonomo (/slide/0, /slide/1, ...)
  int slideIdx = -1;
  String slidePrefix = String(TOPIC_PREFIX) + deviceId + "/slide/";
  if (topStr.startsWith(slidePrefix)) {
    slideIdx = topStr.substring(slidePrefix.length()).toInt();
  } else {
    int pinSlidePos = topStr.indexOf("/slide/");
    if (pinSlidePos != -1) {
      slideIdx = topStr.substring(pinSlidePos + 7).toInt();
    }
  }

  if (slideIdx >= 0 && slideIdx < MAX_SLIDESHOW_PHOTOS && length > 10 && payload[0] == 0xFF && payload[1] == 0xD8) {
    Serial.printf("[SLIDESHOW] Ricevuta foto per slot %d (dimensione: %u bytes)\n", slideIdx, length);
    String filePath = "/slide_" + String(slideIdx) + ".jpg";
    File f = LittleFS.open(filePath, "w");
    if (f) {
      f.write((const uint8_t*)payload, length);
      f.close();
      Serial.printf("[SLIDESHOW] Foto salvata in %s!\n", filePath.c_str());

      if (slideIdx >= slideshowCount) {
        slideshowCount = slideIdx + 1;
        preferences.begin("pixo", false);
        preferences.putInt("slide_cnt", slideshowCount);
        preferences.end();
      }

      // Mostra a display la foto e il badge di feedback
      TJpgDec.drawFsJpg(0, 0, filePath.c_str(), LittleFS);
      tft.fillRoundRect(15, 195, 210, 36, 6, 0x000F);
      tft.drawRoundRect(15, 195, 210, 36, 6, ST77XX_GREEN);
      tft.setTextSize(1);
      tft.setTextColor(ST77XX_WHITE);
      tft.setCursor(25, 202);
      tft.print("CORNICE DIGITALE");
      tft.setTextColor(ST77XX_GREEN);
      tft.setCursor(25, 216);
      tft.printf("Foto %d/5 Salvata!", slideIdx + 1);

      triggerLedNotification();

      String statusPayload = "{\"status\":\"saved\",\"slot\":" + String(slideIdx) + ",\"count\":" + String(slideshowCount) + "}";
      String topicSlideStatus = String(TOPIC_PREFIX) + deviceId + "/slideshow/status";
      mqttClient.publish(topicSlideStatus.c_str(), statusPayload.c_str(), false);
    } else {
      Serial.println("[SLIDESHOW] Errore apertura file in scrittura!");
    }
    return;
  }

  // 6e. Gestione Comandi Slideshow (START, START:<sec>, STOP, CLEAR)
  if (topStr.endsWith("/slideshow")) {
    char cmdBuf[32];
    unsigned int l = min(length, (unsigned int)31);
    memcpy(cmdBuf, payload, l);
    cmdBuf[l] = '\0';
    String cmd = String(cmdBuf);
    cmd.trim();

    String topicSlideStatus = String(TOPIC_PREFIX) + deviceId + "/slideshow/status";

    if (cmd.startsWith("START")) {
      int sep = cmd.indexOf(':');
      if (sep != -1) {
        int interval = cmd.substring(sep + 1).toInt();
        if (interval >= 5 && interval <= 3600) {
          slideshowInterval = interval;
        }
      }
      slideshowActive = true;
      clockModeActive = false;
      followerModeActive = false;
      hasUserDrawing = false;
      if (gifOpen) { gif.close(); gifOpen = false; }
      currentSlideIndex = 0;
      lastSlideChangeTime = millis();

      preferences.begin("pixo", false);
      preferences.putBool("slide_act", true);
      preferences.putInt("slide_int", slideshowInterval);
      preferences.end();

      String p0 = "/slide_0.jpg";
      if (LittleFS.exists(p0)) {
        TJpgDec.drawFsJpg(0, 0, p0.c_str(), LittleFS);
      }
      String res = "{\"status\":\"playing\",\"count\":" + String(slideshowCount) + ",\"interval\":" + String(slideshowInterval) + "}";
      mqttClient.publish(topicSlideStatus.c_str(), res.c_str(), false);
      Serial.printf("[SLIDESHOW] Avviato con intervallo %d s\n", slideshowInterval);
      return;
    } else if (cmd == "STOP") {
      slideshowActive = false;
      preferences.begin("pixo", false);
      preferences.putBool("slide_act", false);
      preferences.end();
      enterStandbyGif();
      mqttClient.publish(topicSlideStatus.c_str(), "{\"status\":\"stopped\"}", false);
      Serial.println("[SLIDESHOW] Fermato.");
      return;
    } else if (cmd == "CLEAR") {
      slideshowActive = false;
      for (int i = 0; i < MAX_SLIDESHOW_PHOTOS; i++) {
        String p = "/slide_" + String(i) + ".jpg";
        if (LittleFS.exists(p)) LittleFS.remove(p);
      }
      slideshowCount = 0;
      preferences.begin("pixo", false);
      preferences.putInt("slide_cnt", 0);
      preferences.putBool("slide_act", false);
      preferences.end();
      enterStandbyGif();
      mqttClient.publish(topicSlideStatus.c_str(), "{\"status\":\"cleared\"}", false);
      Serial.println("[SLIDESHOW] Cancellate tutte le foto.");
      return;
    }
  }

  // 7. Decodifica Disegno JPEG (Magic Bytes: 0xFF 0xD8)
  if (payload[0] == 0xFF && payload[1] == 0xD8) {
    slideshowActive = false; // Disattiva slideshow se arriva un disegno nuovo
    clockModeActive = false; // Esce all'istante dall'orologio per mostrare il disegno
    followerModeActive = false; // Esce all'istante dal follower nativo
    if (gifOpen) {
      gif.close();
      gifOpen = false;
    }
    hasUserDrawing = true;
    lastDrawTime = millis(); // Reset timer screensaver 30 minuti

    Serial.println("[DECODER] Header JPEG valido rilevato (0xFFD8). Decodifica a schermo...");
    unsigned long startTime = millis();

    // Decodifica il JPEG dal buffer RAM e disegna direttamente sul display
    JRESULT res = TJpgDec.drawJpg(0, 0, (const uint8_t*)payload, length);

    if (res == JDR_OK) {
      Serial.printf("[DECODER] Immagine/Foto visualizzata con successo in %lu ms!\n", millis() - startTime);
      // Lampeggio rapido del LED di notifica a disegno completato a schermo (260ms rapido e non bloccante)
      triggerLedNotification();

      // Il topic current retained è già aggiornato dalla WebApp con qos:0 retain:true.
      // Non inviamo il payload da 10KB dall'ESP32 per non saturare la RAM TLS ed evitare blocchi del loop/LED e disconnessioni.

      // Notifica ACK confermata per disegni inviati da ospiti
      if (topStr.indexOf("/guest/") != -1) {
        int keyStart = topStr.indexOf("/guest/") + 7;
        int keyEnd = topStr.indexOf("/draw", keyStart);
        String sKey = (keyEnd != -1) ? topStr.substring(keyStart, keyEnd) : topStr.substring(keyStart);
        sKey.trim();
        String ackTopic = String(TOPIC_PREFIX) + deviceId + "/guest/" + sKey + "/ack";
        mqttClient.publish(ackTopic.c_str(), "OK", false);
      }
    } else {
      Serial.printf("[DECODER] Errore decodifica JPEG. Codice: %d\n", res);
    }
    return;
  } else {
    Serial.println("[DECODER] Payload non riconosciuto come JPEG.");
  }
}

// ==========================================================================
// ==========================================================================
//  GESTIONE CONNESSIONE WI-FI ULTRA-STABILE E FULMINEA (CON ANTIBROWNOUT)
// ==========================================================================
void setupWiFi() {
  Serial.println("[WiFi] Inizializzazione radio Wi-Fi...");
  
  // 1. Modalità Station e salvataggio permanente in NVS
  WiFi.persistent(true);
  WiFi.setAutoReconnect(true);
  WiFi.mode(WIFI_STA);
  WiFi.setSleep(false);
  
  // 2. Anti-Brownout: riduce i picchi di assorbimento RF per evitare cali di tensione su 3.3V
  WiFi.setTxPower(WIFI_POWER_17dBm);

  // 3. Recupero credenziali memorizzate (da Preferences o dalla flash driver NVS)
  preferences.begin("pixo", true);
  String targetSSID = preferences.getString("wifi_ssid", "");
  String targetPass = preferences.getString("wifi_pass", "");
  preferences.end();

  if (targetSSID.length() == 0 && WiFi.SSID().length() > 0) {
    targetSSID = WiFi.SSID();
    targetPass = WiFi.psk();
  }

  // 4. Se abbiamo una rete nota: tentiamo la connessione con determinazione prima di ogni altra cosa
  if (targetSSID.length() > 0) {
    Serial.printf("[WiFi] Tentativo connessione a rete nota: '%s'...\n", targetSSID.c_str());
    if (isInitialBoot) showBootScreen(("WiFi: " + targetSSID).c_str(), ST77XX_YELLOW);

    // Chiamata esplicita con SSID e Password
    WiFi.begin(targetSSID.c_str(), targetPass.c_str());

    // Tentativo 1: fino a 10 secondi con feedback
    unsigned long startWait = millis();
    while (WiFi.status() != WL_CONNECTED && (millis() - startWait < 10000)) {
      delay(200);
      Serial.print(".");
    }
    Serial.println();

    // Se non si è ancora connesso al primo tentativo (es. router occupato all'avvio a freddo),
    // esegui un secondo tentativo pulito prima di aprire qualsiasi portale
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("[WiFi] Secondo tentativo rapido di connessione...");
      WiFi.disconnect();
      delay(300);
      WiFi.begin(targetSSID.c_str(), targetPass.c_str());
      startWait = millis();
      while (WiFi.status() != WL_CONNECTED && (millis() - startWait < 6000)) {
        delay(200);
        Serial.print(".");
      }
      Serial.println();
    }

    // Se connesso con successo: esci immediatamente ed entra in funzione!
    if (WiFi.status() == WL_CONNECTED) {
      preferences.begin("pixo", false);
      preferences.putString("wifi_ssid", targetSSID);
      preferences.putString("wifi_pass", targetPass);
      preferences.end();

      configTzTime("CET-1CEST,M3.5.0,M10.5.0/3", "pool.ntp.org", "time.google.com");
      Serial.printf("[WiFi] Connessione riuscita! IP: %s\n", WiFi.localIP().toString().c_str());
      if (isInitialBoot) showBootScreen("WiFi Connesso!", ST77XX_GREEN);
      return;
    }

    Serial.println("[WiFi] La rete memorizzata non ha risposto dopo 16 secondi.");
  } else {
    Serial.println("[WiFi] Nessuna rete precedentemente configurata.");
  }

  // 5. SOLO SE non ci sono credenziali o la rete nota non risponde dopo 16s:
  // avvia l'interfaccia di configurazione Captive Portal WiFiManager
  Serial.println("[WiFiManager] Avvio interfaccia configurazione...");
  String apName = "Pixo-Setup-" + deviceId.substring(deviceId.length() - 4);
  showWiFiConfigScreen(apName);

  WiFiManager wm;
  wm.setConfigPortalTimeout(120);

  wm.setSaveConfigCallback([]() {
    Serial.println("[WiFiManager] Nuova rete configurata dall'utente! Scrittura in Preferences...");
    preferences.begin("pixo", false);
    preferences.putString("wifi_ssid", WiFi.SSID());
    preferences.putString("wifi_pass", WiFi.psk());
    preferences.end();
  });

  if (!wm.startConfigPortal(apName.c_str())) {
    Serial.println("[WiFiManager] Timeout configurazione. Riavvio...");
    showBootScreen("Timeout WiFi!", ST77XX_RED);
    delay(1000);
    ESP.restart();
  }

  // Backup permanente della nuova rete configurata in Preferences
  if (WiFi.SSID().length() > 0) {
    preferences.begin("pixo", false);
    preferences.putString("wifi_ssid", WiFi.SSID());
    preferences.putString("wifi_pass", WiFi.psk());
    preferences.end();
  }

  WiFi.mode(WIFI_STA);
  WiFi.setSleep(false);
  WiFi.setTxPower(WIFI_POWER_17dBm);
  configTzTime("CET-1CEST,M3.5.0,M10.5.0/3", "pool.ntp.org", "time.google.com");

  Serial.printf("[WiFi] Configurazione completata! SSID: '%s' IP: %s\n", WiFi.SSID().c_str(), WiFi.localIP().toString().c_str());
  if (isInitialBoot) showBootScreen("WiFi Connesso!", ST77XX_GREEN);
}

// Pubblica telemetria Wi-Fi su topic dedicato retained per la webapp
void publishWifiStatus() {
  if (!mqttClient.connected()) return;
  int rssi = WiFi.RSSI();
  String ip = WiFi.localIP().toString();
  String ssid = WiFi.SSID();
  if (ssid.length() == 0) return;

  int signalPct = 0;
  if (rssi <= -100) signalPct = 0;
  else if (rssi >= -50) signalPct = 100;
  else signalPct = 2 * (rssi + 100);

  String payload = "{\"ssid\":\"" + ssid + "\",\"rssi\":" + String(rssi) + ",\"signal\":" + String(signalPct) + ",\"ip\":\"" + ip + "\"}";
  mqttClient.publish(topicWifi.c_str(), payload.c_str(), true);
  Serial.printf("[WiFi] Stato Wi-Fi pubblicato: %s\n", payload.c_str());
}

// Avvio manuale del Captive Portal Wi-Fi (Pixo-Setup-XXXX) richiesto dall'utente
void startWiFiConfigPortal() {
  Serial.println("[WIFI] Avvio interfaccia configurazione hotspot Pixo-Setup...");
  String apName = "Pixo-Setup-" + deviceId.substring(deviceId.length() - 4);
  showWiFiConfigScreen(apName);

  WiFiManager wm;
  wm.setConfigPortalTimeout(180);
  wm.setSaveConfigCallback([]() {
    Serial.println("[WiFiManager] Nuova rete configurata da portale! Salvataggio in flash...");
    preferences.begin("pixo", false);
    preferences.putString("wifi_ssid", WiFi.SSID());
    preferences.putString("wifi_pass", WiFi.psk());
    preferences.end();
  });

  if (wm.startConfigPortal(apName.c_str())) {
    Serial.println("[WiFiManager] Portale completato con successo!");
    if (WiFi.SSID().length() > 0) {
      preferences.begin("pixo", false);
      preferences.putString("wifi_ssid", WiFi.SSID());
      preferences.putString("wifi_pass", WiFi.psk());
      preferences.end();
    }
    showBootScreen("WiFi Connesso!", ST77XX_GREEN);
    delay(1000);
    connectMQTT();
    publishWifiStatus();
    if (!hasUserDrawing) {
      enterStandbyGif();
    }
  } else {
    Serial.println("[WiFiManager] Timeout portale: riavvio in corso...");
    ESP.restart();
  }
}

// Gestione cambio rete Wi-Fi via MQTT con protezione di fallback
void handleWifiChange(const String& newSsid, const String& newPass) {
  Serial.printf("[WiFi] Tentativo cambio Wi-Fi verso: '%s'\n", newSsid.c_str());

  // Salva credenziali attuali come backup
  preferences.begin("pixo", true);
  String oldSsid = preferences.getString("wifi_ssid", WiFi.SSID());
  String oldPass = preferences.getString("wifi_pass", WiFi.psk());
  preferences.end();

  // Feedback grafico a display
  tft.fillScreen(0x000F);
  tft.fillRect(0, 0, 240, 32, ST77XX_YELLOW);
  tft.setTextSize(2);
  tft.setTextColor(ST77XX_BLACK);
  tft.setCursor(15, 8);
  tft.print("CAMBIO WI-FI");

  tft.setTextSize(1);
  tft.setTextColor(ST77XX_WHITE);
  tft.setCursor(12, 45);
  tft.println("Connessione alla nuova rete:");

  tft.setTextSize(2);
  tft.setTextColor(ST77XX_CYAN);
  tft.setCursor(12, 65);
  String dispSsid = newSsid;
  if (dispSsid.length() > 18) dispSsid = dispSsid.substring(0, 15) + "...";
  tft.println(dispSsid);

  tft.setTextSize(1);
  tft.setTextColor(ST77XX_YELLOW);
  tft.setCursor(12, 100);
  tft.println("Tentativo in corso (max 15s)...");

  // Invia aggiornamento di stato intermedio alla webapp
  if (mqttClient.connected()) {
    String notifyPayload = "{\"status\":\"connecting\",\"ssid\":\"" + newSsid + "\"}";
    mqttClient.publish(topicWifi.c_str(), notifyPayload.c_str(), true);
    mqttClient.loop();
    delay(200);
  }

  WiFi.disconnect();
  delay(400);
  WiFi.begin(newSsid.c_str(), newPass.c_str());

  unsigned long tStart = millis();
  while (WiFi.status() != WL_CONNECTED && (millis() - tStart < 15000)) {
    delay(250);
    Serial.print(".");
  }
  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("[WiFi] Nuova rete collegata con successo!");
    preferences.begin("pixo", false);
    preferences.putString("wifi_ssid", newSsid);
    preferences.putString("wifi_pass", newPass);
    preferences.end();

    tft.fillRect(0, 95, 240, 140, 0x000F);
    tft.setTextColor(ST77XX_GREEN);
    tft.setTextSize(2);
    tft.setCursor(12, 110);
    tft.println("CONNESSO!");
    tft.setTextSize(1);
    tft.setTextColor(ST77XX_WHITE);
    tft.setCursor(12, 140);
    tft.printf("IP: %s\n", WiFi.localIP().toString().c_str());
    delay(2500);

    connectMQTT();
    publishWifiStatus();
    if (!hasUserDrawing) {
      enterStandbyGif();
    }
  } else {
    Serial.println("[WiFi] Connessione nuova rete fallita! Ripristino rete precedente...");
    tft.fillRect(0, 95, 240, 140, 0x000F);
    tft.setTextColor(ST77XX_RED);
    tft.setTextSize(2);
    tft.setCursor(12, 110);
    tft.println("ERRORE WI-FI!");
    tft.setTextSize(1);
    tft.setTextColor(ST77XX_WHITE);
    tft.setCursor(12, 140);
    tft.println("Password o rete non valida.");
    tft.setCursor(12, 160);
    tft.setTextColor(ST77XX_YELLOW);
    tft.println("Ripristino rete precedente...");
    delay(2500);

    WiFi.disconnect();
    delay(400);
    WiFi.begin(oldSsid.c_str(), oldPass.c_str());

    tStart = millis();
    while (WiFi.status() != WL_CONNECTED && (millis() - tStart < 15000)) {
      delay(250);
    }

    connectMQTT();
    publishWifiStatus();
    if (!hasUserDrawing) {
      enterStandbyGif();
    }
  }
}

// ==========================================================================
//  AGGIORNAMENTO FIRMWARE OVER-THE-AIR (OTA) DA REMOTO / CLOUD
// ==========================================================================
void performOTAUpdate(const String& otaUrl, const String& targetVersion) {
  if (otaUrl.length() < 7) {
    Serial.println("[OTA] URL non valido!");
    return;
  }

  Serial.printf("[OTA] Inizio procedura di aggiornamento da: %s\n", otaUrl.c_str());

  // Interrompi riproduzione GIF o orologio
  clockModeActive = false;
  if (gifOpen) {
    gif.close();
    gifOpen = false;
  }

  // Notifica immediata di avvio su topic status OTA retained
  if (mqttClient.connected()) {
    String startMsg = "{\"status\":\"updating\",\"version\":\"" + targetVersion + "\",\"progress\":0}";
    mqttClient.publish(topicOtaStatus.c_str(), startMsg.c_str(), true);
    mqttClient.loop();
  }

  // UI Grafica su ST7789 (240x240)
  tft.fillScreen(ST77XX_BLACK);
  tft.fillRect(0, 0, 240, 38, 0x000F); // Navy Header
  tft.setTextSize(2);
  tft.setTextColor(ST77XX_WHITE);
  tft.setCursor(20, 11);
  tft.print("PIXO' AGGIORNA");

  tft.setTextSize(1);
  tft.setTextColor(ST77XX_CYAN);
  tft.setCursor(15, 52);
  tft.print("Firmware Attuale: v");
  tft.print(FIRMWARE_VERSION);

  if (targetVersion.length() > 0) {
    tft.setCursor(15, 68);
    tft.setTextColor(ST77XX_GREEN);
    tft.print("Nuova Versione:   v");
    tft.print(targetVersion);
  }

  tft.setTextSize(2);
  tft.setTextColor(ST77XX_YELLOW);
  tft.setCursor(15, 96);
  tft.println("Download...");

  tft.setTextSize(1);
  tft.setTextColor(ST77XX_WHITE);
  tft.setCursor(15, 126);
  tft.println("Non spegnere il dispositivo!");

  // Barra di avanzamento grafica (sfondo e cornice)
  tft.drawRoundRect(18, 160, 204, 18, 5, ST77XX_CYAN);
  tft.fillRect(20, 162, 200, 14, 0x0842); // Sfondo barra grigio

  // Chiudi client MQTT per liberare buffer di memoria (36KB) e socket prima dell'OTA
  if (mqttClient.connected()) {
    mqttClient.disconnect();
  }
  delay(200);

  // Setup callbacks HTTPUpdate
  httpUpdate.rebootOnUpdate(false); // Gestiamo noi il reboot dopo aver disegnato lo schermo di successo

  httpUpdate.onStart([]() {
    Serial.println("[OTA] Download ed installazione avviati...");
  });

  httpUpdate.onEnd([]() {
    Serial.println("[OTA] Installazione completata con successo!");
  });

  static int lastReportedProgress = -1;
  httpUpdate.onProgress([](int cur, int total) {
    if (total <= 0) return;
    int pct = (cur * 100) / total;
    if (pct != lastReportedProgress && (pct % 5 == 0 || pct == 100)) {
      lastReportedProgress = pct;
      Serial.printf("[OTA] Progresso: %d%% (%d / %d bytes)\n", pct, cur, total);
      int fillW = map(pct, 0, 100, 0, 200);
      tft.fillRect(20, 162, fillW, 14, ST77XX_GREEN);

      tft.fillRect(70, 192, 100, 22, ST77XX_BLACK);
      tft.setTextSize(2);
      tft.setTextColor(ST77XX_WHITE);
      tft.setCursor(95, 194);
      tft.printf("%d%%", pct);
    }
  });

  httpUpdate.onError([](int err) {
    Serial.printf("[OTA] Errore HTTPUpdate: codice %d\n", err);
  });

  // Supporto sia HTTP che HTTPS con setInsecure per release GitHub/Cloud
  t_httpUpdate_return ret;
  if (otaUrl.startsWith("https://")) {
    WiFiClientSecure otaSecureClient;
    otaSecureClient.setInsecure();
    otaSecureClient.setHandshakeTimeout(15);
    httpUpdate.setFollowRedirects(HTTPC_STRICT_FOLLOW_REDIRECTS);
    ret = httpUpdate.update(otaSecureClient, otaUrl);
  } else {
    WiFiClient otaNetClient;
    httpUpdate.setFollowRedirects(HTTPC_STRICT_FOLLOW_REDIRECTS);
    ret = httpUpdate.update(otaNetClient, otaUrl);
  }

  if (ret == HTTP_UPDATE_OK) {
    Serial.println("[OTA] SUCCESSO! Firmware aggiornato. Riavvio in corso...");
    tft.fillRect(0, 90, 240, 150, ST77XX_BLACK);
    tft.setTextColor(ST77XX_GREEN);
    tft.setTextSize(2);
    tft.setCursor(20, 110);
    tft.println("AGGIORNATO!");

    tft.setTextSize(1);
    tft.setTextColor(ST77XX_WHITE);
    tft.setCursor(20, 145);
    tft.println("Nuovo firmware installato.");
    tft.setCursor(20, 165);
    tft.setTextColor(ST77XX_YELLOW);
    tft.println("Riavvio in 3 secondi...");

    delay(3000);
    ESP.restart();
  } else {
    int errCode = httpUpdate.getLastError();
    String errStr = httpUpdate.getLastErrorString();
    Serial.printf("[OTA] ERRORE (%d): %s\n", errCode, errStr.c_str());

    tft.fillRect(0, 90, 240, 150, ST77XX_BLACK);
    tft.setTextColor(ST77XX_RED);
    tft.setTextSize(2);
    tft.setCursor(20, 105);
    tft.println("ERRORE OTA!");

    tft.setTextSize(1);
    tft.setTextColor(ST77XX_WHITE);
    tft.setCursor(20, 135);
    tft.printf("Codice: %d\n", errCode);
    tft.setCursor(20, 152);
    tft.println(errStr.substring(0, 32));

    tft.setCursor(20, 180);
    tft.setTextColor(ST77XX_YELLOW);
    tft.println("Ripristino in corso...");

    delay(4000);

    // Riconnetti a MQTT e notifica l'errore
    connectMQTT();
    if (mqttClient.connected()) {
      String failMsg = "{\"status\":\"error\",\"error\":\"" + errStr + "\",\"code\":" + String(errCode) + "}";
      mqttClient.publish(topicOtaStatus.c_str(), failMsg.c_str(), true);
    }

    if (!hasUserDrawing) {
      enterStandbyGif();
    }
  }
}

// ==========================================================================
//  AUTO-AGGIORNAMENTO ALL'ACCENSIONE (Verifica GitHub Releases)
// ==========================================================================
void checkAutoUpdateOnBoot() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[AUTO-OTA] Wi-Fi non connesso, salto controllo aggiornamenti.");
    return;
  }

  Serial.println("[AUTO-OTA] Controllo automatico aggiornamenti su GitHub...");
  showBootScreen("Verifica Update...", ST77XX_CYAN);

  String updateUrl = "";
  String updateVer = "";

  {
    WiFiClientSecure client;
    client.setInsecure();
    client.setHandshakeTimeout(15);

    HTTPClient http;
    http.setFollowRedirects(HTTPC_STRICT_FOLLOW_REDIRECTS);
    http.begin(client, "https://api.github.com/repos/xxxdslumpxxx/pixo/releases/latest");
    http.setUserAgent("Pixo-ESP32");
    http.addHeader("Accept", "application/vnd.github.v3+json");
    http.setTimeout(8000);

    int httpCode = http.GET();
    if (httpCode == HTTP_CODE_OK) {
      String payload = http.getString();
      int tagIdx = payload.indexOf("\"tag_name\":\"");
      if (tagIdx != -1) {
        int endTag = payload.indexOf('"', tagIdx + 12);
        if (endTag != -1) {
          String latestTag = payload.substring(tagIdx + 12, endTag);
          if (latestTag.startsWith("v")) latestTag = latestTag.substring(1);
          latestTag.trim();

          Serial.printf("[AUTO-OTA] Versione locale: %s | Versione remota: %s\n", FIRMWARE_VERSION, latestTag.c_str());

          // Se la versione remota è diversa da quella locale
          if (latestTag.length() > 0 && latestTag != FIRMWARE_VERSION) {
            int urlIdx = payload.indexOf("\"browser_download_url\":\"");
            while (urlIdx != -1) {
              int endUrl = payload.indexOf('"', urlIdx + 24);
              if (endUrl != -1) {
                String downUrl = payload.substring(urlIdx + 24, endUrl);
                if (downUrl.endsWith(".bin")) {
                  updateUrl = downUrl;
                  updateVer = latestTag;
                  Serial.printf("[AUTO-OTA] Trovato nuovo firmware! URL: %s\n", updateUrl.c_str());
                  break;
                }
              }
              urlIdx = payload.indexOf("\"browser_download_url\":\"", urlIdx + 25);
            }
          } else {
            Serial.println("[AUTO-OTA] Firmware gia' all'ultima versione disponibile.");
          }
        }
      }
    } else {
      Serial.printf("[AUTO-OTA] Controllo fallito, codice HTTP: %d\n", httpCode);
    }
    http.end();
  } // Destructor di client e http eseguito qui: la memoria TLS e buffer heap vengono rilasciati al 100%!

  // Se è disponibile una nuova versione, procedi al download e flash con heap completamente libero
  if (updateUrl.length() > 0) {
    Serial.printf("[AUTO-OTA] Avvio aggiornamento a v%s da URL: %s\n", updateVer.c_str(), updateUrl.c_str());
    showBootScreen(("Nuovo FW: v" + updateVer).c_str(), ST77XX_GREEN);
    delay(1500);
    performOTAUpdate(updateUrl, updateVer);
  }
}

boolean connectMQTT() {
  unsigned long startMqtt = millis();
  Serial.printf("[MQTT] Tentativo connessione a %s:%d...\n", MQTT_BROKER, MQTT_PORT);
  if (isInitialBoot) {
    showBootScreen("Connessione Cloud...", ST77XX_YELLOW);
  }
  
  String clientIdentifier = "Pixo_" + deviceId;
  boolean connected = false;

  const char* willTopic = topicStatus.c_str();
  const char* willPayload = "offline";
  uint8_t willQos = 1;
  boolean willRetain = true;

  if (strlen(MQTT_USER) > 0) {
    connected = mqttClient.connect(clientIdentifier.c_str(), MQTT_USER, MQTT_PASS, willTopic, willQos, willRetain, willPayload);
  } else {
    connected = mqttClient.connect(clientIdentifier.c_str(), willTopic, willQos, willRetain, willPayload);
  }

  if (connected) {
    Serial.printf("[MQTT] Connesso al Cloud in %lu ms!\n", millis() - startMqtt);

    // Pubblica immediatamente lo stato ONLINE su retain per l'app
    mqttClient.publish(topicStatus.c_str(), "online", true);

    Serial.printf("[MQTT] Iscrizione al topic: %s\n", topicSubscribe.c_str());
    mqttClient.subscribe(topicSubscribe.c_str(), 0); // Topic nativo Pixò
    mqttClient.subscribe(topicPinWildcard.c_str(), 0); // Topic con PIN (pixo/device/<ID>/<PIN>/draw)
    mqttClient.subscribe(topicSubscribeLegacy.c_str(), 0); // Retrocompatibilità Lavagna
    mqttClient.subscribe(topicBrightness.c_str(), 0); // Topic Luminosità PWM
    mqttClient.subscribe(topicScreensaver.c_str(), 0); // Topic Screensaver ON/OFF
    mqttClient.subscribe(topicAccess.c_str(), 0); // Topic Controllo Accessi Ospiti
    String topicAccessWildcard = topicAccess + "/#";
    mqttClient.subscribe(topicAccessWildcard.c_str(), 0); // Topic Sub-access (# per /keys, /status, /key)
    mqttClient.subscribe(topicLed.c_str(), 0); // Topic Controllo LED GPIO 5
    String topicLedWildcard = String(TOPIC_PREFIX) + deviceId + "/+/led";
    mqttClient.subscribe(topicLedWildcard.c_str(), 0); // Topic Controllo LED con PIN
    mqttClient.subscribe(topicGuestWildcard.c_str(), 0); // Topic Ospiti con Wildcard
    mqttClient.subscribe(topicSetPin.c_str(), 0); // Topic Configurazione PIN
    String topicSetPinWildcard = String(TOPIC_PREFIX) + deviceId + "/+/setpin";
    mqttClient.subscribe(topicSetPinWildcard.c_str(), 0); // Topic Configurazione PIN con vecchio PIN
    mqttClient.subscribe(topicFactoryReset.c_str(), 0); // Topic Factory Reset
    String topicFactoryResetWildcard = String(TOPIC_PREFIX) + deviceId + "/+/factory_reset";
    mqttClient.subscribe(topicFactoryResetWildcard.c_str(), 0); // Topic Factory Reset con PIN
    mqttClient.subscribe(topicSetWifi.c_str(), 0); // Topic configurazione Wi-Fi
    String topicSetWifiWildcard = String(TOPIC_PREFIX) + deviceId + "/+/setwifi";
    mqttClient.subscribe(topicSetWifiWildcard.c_str(), 0); // Topic configurazione Wi-Fi con PIN
    mqttClient.subscribe(topicWifiPortal.c_str(), 0); // Topic apertura portale Wi-Fi
    String topicWifiPortalWildcard = String(TOPIC_PREFIX) + deviceId + "/+/wifi_portal";
    mqttClient.subscribe(topicWifiPortalWildcard.c_str(), 0); // Topic apertura portale con PIN
    mqttClient.subscribe(topicOta.c_str(), 0); // Topic OTA firmware update
    String topicOtaWildcard = String(TOPIC_PREFIX) + deviceId + "/+/ota";
    mqttClient.subscribe(topicOtaWildcard.c_str(), 0); // Topic OTA con PIN
    mqttClient.subscribe(TOPIC_GLOBAL_OTA, 0); // Topic Broadcast OTA per l'intera flotta Pixò!

    // Topic Cornice Digitale / Slideshow Foto
    mqttClient.subscribe(topicSlideshow.c_str(), 0);
    mqttClient.subscribe(topicSlideWildcard.c_str(), 0);
    String topicSlideshowPin = String(TOPIC_PREFIX) + deviceId + "/+/slideshow";
    mqttClient.subscribe(topicSlideshowPin.c_str(), 0);
    String topicSlidePin = String(TOPIC_PREFIX) + deviceId + "/+/slide/+";
    mqttClient.subscribe(topicSlidePin.c_str(), 0);

    // Pubblica diagnostica stato/reset al cloud (Retained per monitoraggio continuo)
    String topicDiag = String(TOPIC_PREFIX) + deviceId + "/diag";
    String diagPayload = "{\"fw_ver\":\"" + String(FIRMWARE_VERSION) + "\",\"reset_reason\":\"" + bootResetReasonStr + "\",\"code\":" + String(bootResetReasonCode) + ",\"free_heap\":" + String(ESP.getFreeHeap()) + ",\"uptime_s\":" + String(millis()/1000) + "}";
    mqttClient.publish(topicDiag.c_str(), diagPayload.c_str(), true);

    // Pubblica anche topic status OTA iniziale (ready)
    String otaReadyPayload = "{\"status\":\"ready\",\"version\":\"" + String(FIRMWARE_VERSION) + "\"}";
    mqttClient.publish(topicOtaStatus.c_str(), otaReadyPayload.c_str(), true);

    // Pubblica stato Wi-Fi aggiornato a display e webapp
    publishWifiStatus();

    // All'avvio iniziale o a runtime se non c'è un disegno attivo, pulisce lo stato retained sul cloud
    if (isInitialBoot && !hasUserDrawing) {
      mqttClient.publish(topicCurrent.c_str(), "CLEAR", true);
    } else if (!isInitialBoot && !hasUserDrawing) {
      if (slideshowActive && slideshowCount > 0 && LittleFS.exists("/slide_0.jpg")) {
        Serial.println("[SLIDESHOW] Ripresa carosello foto autonoma dopo riconnessione...");
        TJpgDec.drawFsJpg(0, 0, "/slide_0.jpg", LittleFS);
        lastSlideChangeTime = millis();
        currentSlideIndex = 0;
      } else {
        enterStandbyGif();
        mqttClient.publish(topicCurrent.c_str(), "CLEAR", true);
      }
    }
    return true;
  } else {
    Serial.printf("[MQTT] Connessione fallita, rc=%d. Riprovo...\n", mqttClient.state());
    return false;
  }
}

// ==========================================================================
//  SETUP PRINCIPALE
// ==========================================================================
void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println("\n=============================================");
  Serial.println("        PIXO' CLOUD (ESP32-C3 SuperMini)     ");
  Serial.println("=============================================");

  // Diagnosi del motivo dell'ultimo riavvio
  esp_reset_reason_t r = esp_reset_reason();
  bootResetReasonCode = (int)r;
  switch (r) {
    case ESP_RST_POWERON:   bootResetReasonStr = "POWERON (Accensione o Alimentazione)"; break;
    case ESP_RST_EXT:       bootResetReasonStr = "EXT_PIN (Reset da Pin Esterno / DTR Seriale)"; break;
    case ESP_RST_SW:        bootResetReasonStr = "SW_RESET (Riavvio da Software)"; break;
    case ESP_RST_PANIC:     bootResetReasonStr = "PANIC (Crash Hardware / Exception)"; break;
    case ESP_RST_INT_WDT:   bootResetReasonStr = "INT_WDT (Watchdog Interrupt)"; break;
    case ESP_RST_TASK_WDT:  bootResetReasonStr = "TASK_WDT (Task Watchdog)"; break;
    case ESP_RST_WDT:       bootResetReasonStr = "OTHER_WDT (Altro Watchdog)"; break;
    case ESP_RST_DEEPSLEEP: bootResetReasonStr = "DEEPSLEEP"; break;
    case ESP_RST_BROWNOUT:  bootResetReasonStr = "BROWNOUT (Calo di Tensione USB / 3.3V)"; break;
    case ESP_RST_SDIO:      bootResetReasonStr = "SDIO"; break;
    default:                bootResetReasonStr = "UNKNOWN (" + String((int)r) + ")"; break;
  }
  Serial.printf("[BOOT] Motivo ultimo riavvio: %s (codice %d)\n", bootResetReasonStr.c_str(), bootResetReasonCode);

  // Rilevamento Quick Power-Cycle (stacco e riattacco corrente entro 10s per schermata Info & PIN Recovery)
  preferences.begin("pixo_pwr", false);
  int pwrFlag = preferences.getInt("pwr_flag", 0);
  if (pwrFlag == 1) {
    isQuickRecoveryBoot = true;
    preferences.putInt("pwr_flag", 0); // Resetta subito il flag per evitare loop
    Serial.println("[PWR] *** QUICK POWER-CYCLE RILEVATO! Avvio Modalita' Info & PIN Recovery (30s) ***");
  } else {
    preferences.putInt("pwr_flag", 1);
    Serial.println("[PWR] Avvio normale. Flag recovery impostato a 1 (si resettera' dopo 10s).");
  }
  preferences.end();

  // Configurazione Retroilluminazione Hardware PWM su Pin 10 (Luminosità 0-100%)
  ledcAttach(TFT_BL, 5000, 8);
  ledcWrite(TFT_BL, 255); // 100% luminosità all'avvio

  // Configurazione LED Ausiliario 3.2V su GPIO 5
  ledcAttach(NOTIF_LED_PIN, 5000, 8);
  ledcWrite(NOTIF_LED_PIN, 0); // Spento all'avvio

  // Configurazione Buzzer Hardware su GPIO 9
  buzzerSetup();
  buzzerBootSound();

  // Caricamento configurazioni persistenti dalla memoria flash NVS
  preferences.begin("pixo", false);
  screensaverEnabled = preferences.getBool("scrsav", true);
  ledNotifEnabled = preferences.getBool("led_notif", true);
  guestAllowed = preferences.getBool("gst_ok", true);
  guestAccessKey = preferences.getString("gst_key", "pixo123");
  authorizedGuestKeys = preferences.getString("gst_keys", "pixo123");
  devicePin = preferences.getString("dev_pin", "1234");
  isDeviceActivated = (devicePin != "1234");
  preferences.end();
  Serial.printf("[CONFIG NVS] Screensaver: %s | LED Notifica: %s | Ospiti: %s | PIN: %s | Attivato: %s\n",
    screensaverEnabled ? "ATTIVO" : "DISATTIVATO",
    ledNotifEnabled ? "ABILITATO" : "DISABILITATO",
    guestAllowed ? "CONSENTITI" : "INIBITI",
    devicePin.c_str(),
    isDeviceActivated ? "SI (Clean GIF)" : "NO (Mostra Banner Setup)");

  // Reset hardware pulito display (Pin 3)
  pinMode(TFT_RST, OUTPUT);
  digitalWrite(TFT_RST, HIGH);
  delay(30);
  digitalWrite(TFT_RST, LOW);
  delay(80);
  digitalWrite(TFT_RST, HIGH);
  delay(100);

  // Inizializzazione Bus SPI Hardware e Display ST7789 a 40 MHz
  SPI.begin(TFT_SCLK, -1, TFT_MOSI, TFT_CS);
  tft.init(240, 240);
  tft.setSPISpeed(40000000); // 40 MHz SPI per rendering ultra-rapido
  tft.setRotation(0);
  tft.invertDisplay(true); // Inversione per ST7789 1.54"

  // Inizializzazione Decoder JPEG
  TJpgDec.setJpgScale(1);          // Scala 1:1 nativa (240x240)
  TJpgDec.setSwapBytes(false);     // Ordine colori RGB565 corretto per Adafruit
  TJpgDec.setCallback(tft_output); // Callback di rendering JPEG

  // Inizializzazione File System LittleFS per Cornice Digitale / Slideshow Foto
  if (!LittleFS.begin(true)) {
    Serial.println("[LittleFS] Mount fallito!");
  } else {
    Serial.println("[LittleFS] File system LittleFS attivo.");
    preferences.begin("pixo", true);
    slideshowCount = preferences.getInt("slide_cnt", 0);
    slideshowInterval = preferences.getInt("slide_int", 15);
    preferences.end();
    // Opzione B: al riavvio/accensione parte SEMPRE la GIF animata di standby (la cornice si avvia solo su richiesta da WebApp)
    slideshowActive = false;
    Serial.printf("[LittleFS] Foto memorizzate: %d, intervallo: %ds (avvio sempre in Standby GIF)\n", slideshowCount, slideshowInterval);
  }

  // Inizializzazione Player AnimatedGIF
  gif.begin(LITTLE_ENDIAN_PIXELS);

  // Identificativo univoco hardware e topics
  deviceId = getDeviceID();
  topicSubscribe = String(TOPIC_PREFIX) + deviceId + "/draw";
  topicPinWildcard = String(TOPIC_PREFIX) + deviceId + "/+/draw";
  topicSubscribeLegacy = String(TOPIC_PREFIX_LEGACY) + deviceId + "/draw";
  topicBrightness = String(TOPIC_PREFIX) + deviceId + "/brightness";
  topicScreensaver = String(TOPIC_PREFIX) + deviceId + "/screensaver";
  topicAccess = String(TOPIC_PREFIX) + deviceId + "/access";
  topicLed = String(TOPIC_PREFIX) + deviceId + "/led";
  topicGuestWildcard = String(TOPIC_PREFIX) + deviceId + "/guest/+/draw";
  topicSetPin = String(TOPIC_PREFIX) + deviceId + "/setpin";
  topicFactoryReset = String(TOPIC_PREFIX) + deviceId + "/factory_reset";
  topicWifi = String(TOPIC_PREFIX) + deviceId + "/wifi";
  topicSetWifi = String(TOPIC_PREFIX) + deviceId + "/setwifi";
  topicWifiPortal = String(TOPIC_PREFIX) + deviceId + "/wifi_portal";
  topicStatus = String(TOPIC_PREFIX) + deviceId + "/status";
  topicCurrent = String(TOPIC_PREFIX) + deviceId + "/current";
  topicOta = String(TOPIC_PREFIX) + deviceId + "/ota";
  topicOtaStatus = String(TOPIC_PREFIX) + deviceId + "/ota/status";
  topicSlideshow = String(TOPIC_PREFIX) + deviceId + "/slideshow";
  topicSlideWildcard = String(TOPIC_PREFIX) + deviceId + "/slide/+";
  topicSlideStatus = String(TOPIC_PREFIX) + deviceId + "/slideshow/status";

  Serial.printf("[INFO] Device ID: %s | PIN: %s | Firmware: v%s\n", deviceId.c_str(), devicePin.c_str(), FIRMWARE_VERSION);
  Serial.printf("[INFO] Topic Pixò: %s\n", topicSubscribe.c_str());
  Serial.printf("[INFO] Topic PIN Wildcard: %s\n", topicPinWildcard.c_str());
  Serial.printf("[INFO] Topic Legacy: %s\n", topicSubscribeLegacy.c_str());
  Serial.printf("[INFO] Topic Luminosità: %s\n", topicBrightness.c_str());
  Serial.printf("[INFO] Topic Screensaver: %s\n", topicScreensaver.c_str());
  Serial.printf("[INFO] Topic Accesso Ospiti: %s\n", topicAccess.c_str());
  Serial.printf("[INFO] Topic Wildcard Ospiti: %s\n", topicGuestWildcard.c_str());

  // Configurazione Client di Rete TLS Ottimizzato
  if (USE_TLS) {
    secureClient.setInsecure(); // Non richiede certificati radice locali
    secureClient.setHandshakeTimeout(10);
    mqttClient.setClient(secureClient);
  } else {
    mqttClient.setClient(netClient);
  }

  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);
  mqttClient.setKeepAlive(10); // Keepalive a 10s: mantiene costantemente aperti i pinhole NAT dei router (es. Vodafone Station)
  mqttClient.setSocketTimeout(5); // 5 secondi per permettere la ricezione dei pacchetti TLS completi

  // Buffer PubSubClient a 36 KB per payload JPEG completi
  if (!mqttClient.setBufferSize(MQTT_MAX_PACKET_SIZE)) {
    Serial.println("[WARN] Impossibile allocare 36 KB di buffer MQTT!");
  } else {
    Serial.printf("[INFO] Buffer MQTT configurato a %d byte\n", mqttClient.getBufferSize());
  }

  if (isQuickRecoveryBoot) {
    // Modalità Recupero PIN: connetti silenziosamente la rete senza sporcare il display
    isInitialBoot = false;
    setupWiFi();
    connectMQTT();
    showRecoveryInfoScreen(30);
    enterStandbyGif();
  } else {
    // Avvio normale
    showBootScreen("Avvio Sistema...", ST77XX_YELLOW);
    setupWiFi();
    checkAutoUpdateOnBoot();
    connectMQTT();
    showBootScreen("Connesso!", ST77XX_GREEN);
    unsigned long splashStart = millis();
    while (millis() - splashStart < 3500) {
      mqttClient.loop();
      if (hasUserDrawing) break;
      delay(50);
    }
    if (!hasUserDrawing) {
      enterStandbyGif();
      mqttClient.publish(topicCurrent.c_str(), "CLEAR", true);
    }
  }

  setupFinishedTime = millis();
  // Fine boot iniziale: riconnessioni successive di rete saranno silenziose senza cancellare il disegno
  isInitialBoot = false;
}

void loop() {
  // Stabilizzazione alimentazione: azzera il flag solo dopo 15 secondi di funzionamento stabile DOPO il setup
  static bool pwrFlagCleared = false;
  if (!pwrFlagCleared && (millis() - setupFinishedTime > 15000)) {
    pwrFlagCleared = true;
    preferences.begin("pixo_pwr", false);
    preferences.putInt("pwr_flag", 0);
    preferences.end();
    Serial.println("[PWR] Sistema stabilizzato (15s post-setup). Flag recovery azzerato in NVS.");
  }

  // Gestione non-bloccante lampeggio rapido notifica LED (doppio flash)
  processLedBlink();

  // Gestione silente e non-bloccante della riconnessione Wi-Fi (non cancella lo schermo e non riavvia)
  static unsigned long wifiDisconnectedSince = 0;
  if (WiFi.status() != WL_CONNECTED) {
    if (wifiDisconnectedSince == 0) {
      wifiDisconnectedSince = millis();
      Serial.println("[WiFi] Connessione temporaneamente persa, attendo auto-reconnect...");
    } else if (millis() - wifiDisconnectedSince > 15000) {
      // Se disconnesso da oltre 15 secondi, prova una riconnessione non-bloccante
      Serial.println("[WiFi] Disconnesso da >15s, provo WiFi.reconnect()...");
      WiFi.reconnect();
      wifiDisconnectedSince = millis() - 5000;
    }
    delay(50);
    return;
  } else {
    wifiDisconnectedSince = 0;
  }

  // Verifica stato connessione MQTT
  if (!mqttClient.connected()) {
    unsigned long now = millis();
    if (now - lastReconnectAttempt > 3000) {
      lastReconnectAttempt = now;
      if (connectMQTT()) {
        lastReconnectAttempt = 0;
      }
    }
  } else {
    // Processa i pacchetti MQTT in ingresso in modo fluido e pulito
    mqttClient.loop();
  }

  // Gestione Screensaver Standby a 30 minuti
  if (hasUserDrawing && screensaverEnabled) {
    if (millis() - lastDrawTime >= SCREENSAVER_TIMEOUT_MS) {
      Serial.println("[SCREENSAVER] 30 minuti di inattività trascorsi: ritorno all'animazione standby.");
      enterStandbyGif();

      // Aggiorna lo stato su MQTT Retain per sincronizzare la webapp
      if (mqttClient.connected()) {
        mqttClient.publish(topicCurrent.c_str(), "CLEAR", true);
      }
    }
  }

  // Riproduzione Orologio Digitale Nativo, Follower Nativo o Animazione di Standby quando non è presente un disegno utente
  if (!hasUserDrawing && mqttClient.connected()) {
    if (clockModeActive) {
      unsigned long now = millis();
      // Lampeggio del separatore ':' a 1 Hz (ogni 500 ms) e aggiornamento cifre/secondi
      if (now - lastClockTick >= 500) {
        lastClockTick = now;
        colonVisible = !colonVisible;
        drawNativeClock(false);
      }
    } else if (followerModeActive) {
      unsigned long now = millis();
      if (now - followerLastSecTick >= 1000) {
        followerLastSecTick = now;
        followerElapsedSec++;

        // Quando il timer scade: recupera autonomamente il nuovo conteggio e resetta la barra a 0!
        if (followerElapsedSec >= followerInterval) {
          followerElapsedSec = followerInterval;
          drawNativeFollower(false); // Mostra "Aggiornamento in corso..."

          // Fetch autonomo via Wi-Fi direttamente da ESP32
          fetchAutonomousFollowerCount();

          followerElapsedSec = 0; // Riparti da 0s!
          drawNativeFollower(false);
        } else {
          drawNativeFollower(false);
        }
      }
    } else if (slideshowActive && slideshowCount > 0) {
      unsigned long now = millis();
      if (now - lastSlideChangeTime >= (unsigned long)(slideshowInterval * 1000UL)) {
        lastSlideChangeTime = now;
        currentSlideIndex = (currentSlideIndex + 1) % slideshowCount;
        String path = "/slide_" + String(currentSlideIndex) + ".jpg";
        if (LittleFS.exists(path)) {
          Serial.printf("[SLIDESHOW] Cambio diapositiva -> %s\n", path.c_str());
          TJpgDec.drawFsJpg(0, 0, path.c_str(), LittleFS);
        }
      }
    } else {
      unsigned long now = millis();
      if (now >= nextFrameTime) {
        if (!gifOpen) {
          if (gif.open((uint8_t *)WAITING_GIF, WAITING_GIF_LEN, GIFDraw)) {
            gifOpen = true;
            if (!isDeviceActivated) {
              drawActivationBanner();
            }
          } else {
            Serial.println("[GIF] Errore apertura file GIF in RAM!");
            nextFrameTime = now + 1000;
          }
        }

        if (gifOpen) {
          int iDelay = 125;
          if (gif.playFrame(false, &iDelay)) {
            nextFrameTime = now + (iDelay > 0 ? iDelay : 125);
          } else {
            // Fine ciclo video (10 secondi): riavvolgi e ricomincia in loop continuo!
            gif.close();
            gifOpen = false;
            nextFrameTime = now + 10;
          }
        }
      }
    }
  }

  // Yield breve per consentire a FreeRTOS di alimentare il Watchdog e i task Wi-Fi
  delay(2);
}
