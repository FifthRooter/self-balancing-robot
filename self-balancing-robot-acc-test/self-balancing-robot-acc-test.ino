#include "Wire.h"
#include "I2Cdev.h"
#include "MPU6050.h"
#include "math.h"

MPU6050 mpu;

int16_t accY, accZ;
float accAngle;
//
//#define INT_L_MPU 8
//#define INT_R_MPU 2
//
//#define SCL_L_MPU A2
//#define SCL_R_MPU A0
//
//#define SDA_L_MPU A1
//#define SDA_R_MPU A3
//
//#define EN_L_HBRIDGE 10
//#define EN_R_HBRIDGE 12
//
//#define DIR_L_HBRIDGE 6
//#define DIR_R_HBRIDGE 7


void setup() {
  Serial.begin(9600);
  mpu.initialize();
}

void loop() {
  // Reading accelerometer //
  accZ = mpu.getAccelerationZ();
  accY = mpu.getAccelerationY();

  accAngle = atan2(accY, accZ)*RAD_TO_DEG;


  if(isnan(accAngle));
  else Serial.println(accAngle);
  
}
