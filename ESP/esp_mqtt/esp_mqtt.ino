#include "EspMQTTClient.h"

// utlrasonic pinout
#define ULTRASONIC_TRIG_PIN     5   // pin TRIG 
#define ULTRASONIC_ECHO_PIN     4 // pin ECHO 

int distance;

EspMQTTClient client(
  "0F620A",
  "l56mq35itl",
  "192.168.0.29",  // MQTT Broker server ip
  "ESP32"      // Client name that uniquely identify your device
);

void setup() {

 Serial.begin(115200);

   // ultraonic setup 
  pinMode(ULTRASONIC_TRIG_PIN, OUTPUT);
  pinMode(ULTRASONIC_ECHO_PIN, INPUT);


  
}

void onConnectionEstablished() {



  client.subscribe("mytopic/test", [] (const String &payload)  {
    Serial.println(payload);
  });

};

void loop() {

  // measure distance 
  long duration;
  digitalWrite(ULTRASONIC_TRIG_PIN, LOW);  
  delayMicroseconds(2); 
  
  digitalWrite(ULTRASONIC_TRIG_PIN, HIGH);
  delayMicroseconds(10); 
  
  digitalWrite(ULTRASONIC_TRIG_PIN, LOW);
  duration = pulseIn(ULTRASONIC_ECHO_PIN, HIGH);
  distance = (duration/2) / 29.1;
  Serial.print("********** Ultrasonic Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

  String message = String (distance);

  client.publish("mytopic/test", message);


client.loop();
  delay(200);
}
