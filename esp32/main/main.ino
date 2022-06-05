#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* ssid = "Platform Nine and Three Routers";
const char* password = "ilovedisney99";
const char* mqtt_server = "iade-iot.eu";
#define mqtt_port 1883
#define MQTT_USER "admin"
#define MQTT_PASSWORD "TcV1YrduetnMmxx9"
const char* device_serial_number = "20220604";
const char* user_email = "kobe@blackmamba.com";
#define MQTT_SERIAL_PUBLISH_CH  "kobe@blackmamba.com/20220604/serialdata/tx"
#define MQTT_SERIAL_RECEIVER_CH "kobe@blackmamba.com/20220604/serialdata/rx"



WiFiClient wifiClient;
PubSubClient client(wifiClient);


void setup_wifi() {
    delay(10);
    // We start by connecting to a WiFi network
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }
    randomSeed(micros());
    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    Serial.println("===Device Setup===");
    Serial.println("Device Serial Number: ");
    Serial.println(device_serial_number);
    Serial.println("Device user_email: ");
    Serial.println(user_email);
    Serial.println("MQTT_SERIAL_PUBLISH_CH: ");
    Serial.println(MQTT_SERIAL_PUBLISH_CH);
    Serial.println("MQTT_SERIAL_RECEIVER_CH: ");
    Serial.println(MQTT_SERIAL_RECEIVER_CH);
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str(),MQTT_USER,MQTT_PASSWORD)) {
      Serial.println("connected");
      //Once connected, publish an announcement...
      client.publish("discovery/devices/kobe@blackmamba.com", "{\"deviceSerial\":\"20220604\"}");
      // ... and resubscribe
      client.subscribe(MQTT_SERIAL_RECEIVER_CH);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void callback(char* topic, byte *payload, unsigned int length) {
    
    Serial.println("-------new message from broker-----");
    char str[length+1];
    int i=0;
    for (i=0;i<length;i++) {
        str[i]=(char)payload[i];
    }
    StaticJsonDocument<256> doc;
    deserializeJson(doc,str);
    const int deviceStatus = doc["deviceStatus"];

    if (deviceStatus == 1) {
        Serial.println("device is ON");
        digitalWrite(16, HIGH);
    } else {
        Serial.println("device is OFF");
        digitalWrite(16, LOW);
    }
}

void setup() {
  Serial.begin(115200);
  pinMode(16, OUTPUT);
  Serial.setTimeout(500);// Set time out for 
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  reconnect();
}

void publishSerialData(char *serialData){
  if (!client.connected()) {
    reconnect();
  }
  client.publish(MQTT_SERIAL_PUBLISH_CH, serialData);
}


void loop() {
   client.loop();
   if (Serial.available() > 0) {
     char mun[501];
     memset(mun,0, 501);
     Serial.readBytesUntil( '\n',mun,500);
     publishSerialData(mun);
   }
 }