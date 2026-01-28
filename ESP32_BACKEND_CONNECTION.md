# Guide de Connexion ESP32 - Backend Brassard IoT

## 📍 Localisation des fichiers clés

### Backend - Configuration et Routes

#### 1. **Configuration du serveur**
- **Fichier** : [backend/src/config/config.js](backend/src/config/config.js)
  - Contient: Port (3000), JWT, CORS, variables d'environnement
  - Variables d'environnement: [backend/ENV_SETUP.md](backend/ENV_SETUP.md)

#### 2. **Serveur Express**
- **Fichier** : [backend/src/server.js](backend/src/server.js)
  - Initialise le serveur Express sur le port 3000
  - Gestion des signaux de fermeture (SIGTERM, SIGINT)

#### 3. **Application Express**
- **Fichier** : [backend/src/app.js](backend/src/app.js)
  - Configuration CORS (accepte les requêtes du frontend et ESP32)
  - Middlewares (JWT, validation)
  - Routes API

#### 4. **Routes de données de capteurs**
- **Fichier** : [backend/src/routes/sensorDataRoutes.js](backend/src/routes/sensorDataRoutes.js)
  ```
  POST   /api/sensor-data/:sessionId          - Envoyer une donnée capteur
  POST   /api/sensor-data/:sessionId/batch    - Envoyer plusieurs données
  GET    /api/sensor-data/:sessionId          - Récupérer les données
  GET    /api/sensor-data/:sessionId/latest   - Dernière donnée capteur
  GET    /api/sensor-data/:sessionId/stats    - Statistiques
  ```

#### 5. **Contrôleur des capteurs**
- **Fichier** : [backend/src/controllers/sensorDataController.js](backend/src/controllers/sensorDataController.js)
  - Gère la création et récupération des données de capteurs
  - Validation des sessions utilisateur
  - Enregistrement en base de données

#### 6. **Middlewares d'authentification**
- **Fichier** : [backend/src/middlewares/auth.js](backend/src/middlewares/auth.js)
  - Vérification des tokens JWT
  - Authentification des requêtes

#### 7. **Base de données**
- **Schéma** : [backend/prisma/schema.prisma](backend/prisma/schema.prisma)
  - Modèle `SensorData` stocke les données des capteurs
  - Modèle `Session` lie les données à une session utilisateur
  - Modèle `User` pour l'authentification

---

## 🔌 Étapes de connexion ESP32 ↔ Backend

### **Étape 1 : Configuration de l'ESP32**

Préparez votre ESP32 avec le code suivant :

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Configuration WiFi
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

// Configuration Backend
const char* backendUrl = "http://YOUR_BACKEND_IP:3000";
const char* apiToken = "YOUR_JWT_TOKEN"; // Généré lors du login

// Structure pour les données capteur
struct SensorData {
  float heartRate;
  float temperature;
  float spo2;
  float accelX, accelY, accelZ;
  float gyroX, gyroY, gyroZ;
  float latitude, longitude, altitude;
  float ecgValue;
  int steps;
  float calories;
  float battery;
};

void setup() {
  Serial.begin(115200);
  connectToWiFi();
}

void loop() {
  // Lire les données des capteurs
  SensorData data = readSensors();
  
  // Envoyer au backend
  sendSensorDataToBackend(data);
  
  delay(5000); // Envoyer toutes les 5 secondes
}

void connectToWiFi() {
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✓ Connecté au WiFi");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
  }
}

SensorData readSensors() {
  SensorData data;
  // À implémenter selon vos capteurs
  // Lecture du capteur cardiaque, température, accéléromètre, etc.
  return data;
}

void sendSensorDataToBackend(SensorData data) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ WiFi non connecté");
    return;
  }
  
  HTTPClient http;
  
  // URL de l'endpoint API
  String url = String(backendUrl) + "/api/sensor-data/YOUR_SESSION_ID";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + String(apiToken));
  
  // Créer le JSON
  StaticJsonDocument<500> jsonDoc;
  jsonDoc["heartRate"] = data.heartRate;
  jsonDoc["temperature"] = data.temperature;
  jsonDoc["spo2"] = data.spo2;
  jsonDoc["accelX"] = data.accelX;
  jsonDoc["accelY"] = data.accelY;
  jsonDoc["accelZ"] = data.accelZ;
  jsonDoc["gyroX"] = data.gyroX;
  jsonDoc["gyroY"] = data.gyroY;
  jsonDoc["gyroZ"] = data.gyroZ;
  jsonDoc["latitude"] = data.latitude;
  jsonDoc["longitude"] = data.longitude;
  jsonDoc["altitude"] = data.altitude;
  jsonDoc["ecgValue"] = data.ecgValue;
  jsonDoc["steps"] = data.steps;
  jsonDoc["calories"] = data.calories;
  jsonDoc["battery"] = data.battery;
  
  String jsonString;
  serializeJson(jsonDoc, jsonString);
  
  // Envoyer la requête POST
  int httpCode = http.POST(jsonString);
  
  if (httpCode == 201) {
    Serial.println("✓ Données envoyées avec succès");
  } else {
    Serial.print("❌ Erreur HTTP: ");
    Serial.println(httpCode);
    Serial.println(http.getString());
  }
  
  http.end();
}
```

### **Étape 2 : Authentification Backend**

Avant d'envoyer des données, authentifiez l'ESP32:

```cpp
String getJWTToken(const char* email, const char* password) {
  HTTPClient http;
  String url = String(backendUrl) + "/api/auth/login";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  StaticJsonDocument<200> jsonDoc;
  jsonDoc["email"] = email;
  jsonDoc["password"] = password;
  
  String jsonString;
  serializeJson(jsonDoc, jsonString);
  
  int httpCode = http.POST(jsonString);
  
  String token = "";
  if (httpCode == 200) {
    DynamicJsonDocument responseDoc(1024);
    deserializeJson(responseDoc, http.getString());
    token = responseDoc["data"]["token"].as<String>();
    Serial.println("✓ Token JWT obtenu");
  } else {
    Serial.println("❌ Erreur d'authentification");
  }
  
  http.end();
  return token;
}
```

### **Étape 3 : Créer une session utilisateur**

```cpp
String createSession(const char* apiToken) {
  HTTPClient http;
  String url = String(backendUrl) + "/api/sessions";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + String(apiToken));
  
  StaticJsonDocument<200> jsonDoc;
  jsonDoc["activityType"] = "RUNNING";
  jsonDoc["notes"] = "Session depuis ESP32";
  
  String jsonString;
  serializeJson(jsonDoc, jsonString);
  
  int httpCode = http.POST(jsonString);
  
  String sessionId = "";
  if (httpCode == 201) {
    DynamicJsonDocument responseDoc(1024);
    deserializeJson(responseDoc, http.getString());
    sessionId = responseDoc["data"]["id"].as<String>();
    Serial.println("✓ Session créée: " + sessionId);
  }
  
  http.end();
  return sessionId;
}
```

### **Étape 4 : Envoyer les données en batch**

Pour une meilleure efficacité, envoyez plusieurs données à la fois:

```cpp
void sendBatchSensorData(const char* apiToken, const char* sessionId, 
                         SensorData* dataArray, int dataCount) {
  HTTPClient http;
  
  String url = String(backendUrl) + "/api/sensor-data/" + String(sessionId) + "/batch";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + String(apiToken));
  
  DynamicJsonDocument jsonDoc(2000);
  JsonArray dataArray_json = jsonDoc.createNestedArray("data");
  
  for (int i = 0; i < dataCount; i++) {
    JsonObject obj = dataArray_json.createNestedObject();
    obj["heartRate"] = dataArray[i].heartRate;
    obj["temperature"] = dataArray[i].temperature;
    obj["spo2"] = dataArray[i].spo2;
    // ... ajouter les autres champs
  }
  
  String jsonString;
  serializeJson(jsonDoc, jsonString);
  
  int httpCode = http.POST(jsonString);
  
  if (httpCode == 201) {
    Serial.println("✓ Batch de " + String(dataCount) + " données envoyé");
  }
  
  http.end();
}
```

### **Étape 5 : Configuration du .env Backend**

Créez le fichier `.env` dans le dossier `backend/`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/brassard_iot?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV=development

# CORS - Autorise les requêtes de l'ESP32
CORS_ORIGIN="*"

# ESP32 Configuration (optionnel)
ESP32_API_KEY="optional-api-key-for-esp32"
```

### **Étape 6 : Démarrer le serveur Backend**

```bash
cd backend

# Installer les dépendances
npm install

# Configuration de la base de données
npm run prisma:push
npm run prisma:seed

# Démarrer le serveur
npm run dev
```

---

## 📊 Structure des données SensorData

Voici les champs disponibles dans le modèle `SensorData`:

```json
{
  "heartRate": 72.5,          // bpm
  "temperature": 36.8,        // °C
  "spo2": 98.5,              // % saturation oxygène
  "accelX": 0.1,             // accélération X
  "accelY": 0.2,             // accélération Y
  "accelZ": 0.3,             // accélération Z
  "gyroX": 1.5,              // rotation X
  "gyroY": 2.1,              // rotation Y
  "gyroZ": 0.8,              // rotation Z
  "latitude": 48.8566,       // coordonnée GPS
  "longitude": 2.3522,       // coordonnée GPS
  "altitude": 35.0,          // altitude (m)
  "ecgValue": 0.5,           // ECG
  "steps": 1250,             // nombre de pas
  "calories": 150.5,         // calories brûlées
  "battery": 85.0            // % batterie
}
```

---

## 🔍 Routes API principales

### **Authentification**
```
POST   /api/auth/register     - Créer un compte
POST   /api/auth/login        - Se connecter (obtenir token JWT)
```

### **Sessions**
```
POST   /api/sessions          - Créer une session
GET    /api/sessions          - Lister les sessions
GET    /api/sessions/:id      - Détails d'une session
PUT    /api/sessions/:id      - Modifier une session
DELETE /api/sessions/:id      - Terminer une session
```

### **Données de capteurs**
```
POST   /api/sensor-data/:sessionId           - Ajouter une donnée
POST   /api/sensor-data/:sessionId/batch     - Ajouter en batch
GET    /api/sensor-data/:sessionId           - Récupérer les données
GET    /api/sensor-data/:sessionId/latest    - Dernière donnée
GET    /api/sensor-data/:sessionId/stats     - Statistiques
```

---

## 🧪 Test de la connexion

### **Depuis l'ESP32**

```cpp
// Test simple de connexion
void testConnection() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    // Tester l'endpoint de santé
    http.begin("http://YOUR_BACKEND_IP:3000/api/health");
    int httpCode = http.GET();
    
    if (httpCode == 200) {
      Serial.println("✓ Backend accessible et fonctionnel");
    } else {
      Serial.print("❌ Backend non accessible: ");
      Serial.println(httpCode);
    }
    
    http.end();
  }
}
```

### **Depuis PowerShell**

```powershell
# Test de la connexion au backend
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/health"
Write-Host "✓ Status: " $response.StatusCode

# Test de login
$loginData = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginData

Write-Host $response.Content
```

---

## ❌ Troubleshooting

| Problème | Cause | Solution |
|----------|-------|----------|
| **ESP32 ne se connecte pas au WiFi** | Identifiants incorrects | Vérifier SSID et mot de passe |
| **Erreur 401 (Unauthorized)** | Token JWT invalide ou expiré | Reconnecter et obtenir un nouveau token |
| **Erreur 404 (Not Found)** | Session non trouvée | Créer une session avant d'envoyer des données |
| **Erreur 500 (Backend down)** | Serveur non démarré | Exécuter `npm run dev` dans le dossier backend |
| **CORS bloqué** | Origine non autorisée | Mettre à jour `CORS_ORIGIN` dans le .env |
| **Données non sauvegardées** | Base de données non configurée | Exécuter `npm run prisma:push` |

---

## 📝 Exemple complet - Flux de travail

```
1. Authentification
   ESP32 → Backend: POST /api/auth/login
   ← Token JWT reçu

2. Créer une session
   ESP32 → Backend: POST /api/sessions (avec token)
   ← Session ID reçu

3. Envoyer des données
   ESP32 → Backend: POST /api/sensor-data/:sessionId (avec token)
   ← Confirmation reçue

4. Récupérer les données
   Frontend/App → Backend: GET /api/sensor-data/:sessionId (avec token)
   ← Données JSON reçues

5. Terminer la session
   ESP32 → Backend: DELETE /api/sessions/:sessionId (avec token)
   ← Session fermée
```

---

## 🔐 Sécurité

- **Toujours** utiliser HTTPS en production
- **Jamais** hardcoder les identifiants dans l'ESP32
- **Stocker** les tokens de manière sécurisée (EEPROM chiffrée)
- **Valider** toutes les données côté serveur
- **Mettre à jour** régulièrement les certificats SSL

---

## 📚 Ressources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [JWT (JSON Web Tokens)](https://jwt.io/)
- [Arduino ESP32 Docs](https://docs.espressif.com/projects/esp-idf/)
- [ArduinoJson Library](https://arduinojson.org/)

---

**Version** : 1.0.0  
**Dernière mise à jour** : 21 janvier 2026
