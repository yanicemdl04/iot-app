#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

const char *ssid = "VOTRE_WIFI";
const char *password = "MOT_DE_PASSE";
const char *serverUrl = "https://votre-api.com/api/data";
const char *jwt_token = "VOTRE_JWT_SECRET"; // À générer et stocker de façon sécurisée

void sendData(float heartRate)
{
  WiFiClientSecure client;
  client.setInsecure(); // Pour le test, sinon utilisez client.setCACert(root_ca);

  HTTPClient http;
  http.begin(client, serverUrl);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", jwt_token);

  String httpRequestData = "{\"heartRate\":" + String(heartRate) + "}";
  int httpResponseCode = http.POST(httpRequestData);

  http.end();
}