#include "Wire.h"
#include "I2Cdev.h"
#include "MPU6050.h"
#include "math.h"

MPU6050 mpu;

int16_t accY, accZ; 
float accAngle;

void setup() {  
  mpu.initialize();
  Serial.begin(9600);
}

void loop() {  
  accZ = mpu.getAccelerationZ();
  accY = mpu.getAccelerationY();
   
  accAngle = atan2(accY, accZ)* RAD_TO_DEG;
  
  if(isnan(accAngle));
  else
    Serial.println(accAngle);
}
