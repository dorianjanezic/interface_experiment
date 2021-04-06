#include <WiFiNINA.h>

#include <MQTT.h>

#include "Arduino_LSM6DS3.h"


 char ssid[] = "T-2_4295d1";
 char pass[] = "INNBOX2729000677";

WiFiClient net;
MQTTClient client;

unsigned long lastMillis = 0;

void connect() {
  Serial.print("checking wifi...");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    Serial.print(WiFi.status());
    delay(1000);
  }

  Serial.print("\nconnecting...");
  while (!client.connect("arduino", "public", "public")) {
    Serial.print("/");
    delay(1000);
  }

  Serial.println("\nconnected!");

  client.subscribe("hello");
}

void messageReceived(String &topic, String &payload) {
  Serial.println(topic + ": " + payload);
}

void setup() {
  Serial.begin(115200);

   // start the IMU:
  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU");
    // stop here if you can't access the IMU:
    while (true);
  }

  // start wifi and mqtt
  WiFi.begin(ssid, pass);
  client.begin("192.168.64.101", net);
  client.onMessage(messageReceived);

  connect();
}

void loop() {

 // values for acceleration and rotation:
 
  float xGyro, yGyro, zGyro, x, y, z;

  // if both accelerometer and gyrometer are ready to be read:
  if (IMU.accelerationAvailable() &&
      IMU.gyroscopeAvailable()) {
    // read accelerometer and gyrometer:
 
    // print the results:
    IMU.readGyroscope(xGyro, yGyro, zGyro);
    IMU.readAcceleration(x, y, z);
    
    Serial.print(zGyro);
    Serial.print(",");
    Serial.println(yGyro);
    Serial.print(",");
    Serial.print(x);
    Serial.print(y);
    Serial.print(z);



  }
 
  client.loop();
  delay(200);

  // check if connected
  if (!client.connected()) {
    connect();
  }

  // publish a message roughly every second.
  
    String message = String (zGyro);
    //message += String (yGyro);
    //message += String(x);
    //message += String(y);
    //message += String(z);
    
    client.publish("/zGyro", message);
  
}
