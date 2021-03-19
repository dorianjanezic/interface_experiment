#include "Arduino_LSM6DS3.h"

void setup() {
  Serial.begin(9600);
  // start the IMU:
  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU");
    // stop here if you can't access the IMU:
    while (true);
  }
}

void loop() {
  // values for acceleration and rotation:
 
  float xGyro, yGyro, zGyro;

  // if both accelerometer and gyrometer are ready to be read:
  if (IMU.accelerationAvailable() &&
      IMU.gyroscopeAvailable()) {
    // read accelerometer and gyrometer:
 
    // print the results:
    IMU.readGyroscope(xGyro, yGyro, zGyro);
    
    Serial.print(zGyro);
    Serial.print(",");
    Serial.println(yGyro);

  }
}
