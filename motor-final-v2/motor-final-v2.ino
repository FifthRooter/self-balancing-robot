#include "Wire.h"
#include "I2Cdev.h"
#include "MPU6050.h"
#include "math.h"


MPU6050 mpu;

int16_t accY, accZ;
float accAngle;

int16_t gyroX;
float gyroAngle=0;
unsigned long currTime, prevTime = 0, loopTime;

#define direction_left 5
#define direction_right 8
#define motor_pwm_left 6
#define motor_pwm_right 11

#define Kp 26 
#define Kd 0 //0.003
#define Ki 0 //0.5

#define sampleTime 0.005
#define targetAngle -10

volatile int motorPower, gyroRate;
volatile float currentAngle, prevAngle=0, error, prevError=0, errorSum=0;


void setMotors(int leftMotorSpeed, int rightMotorSpeed) {
  if (leftMotorSpeed >=0) {
    leftMotorSpeed = map(leftMotorSpeed, 0, 255, 75, 255);
    analogWrite(motor_pwm_left, leftMotorSpeed);
    digitalWrite(direction_left, LOW);
  } else {
    leftMotorSpeed = 255 + leftMotorSpeed;
    leftMotorSpeed = map(leftMotorSpeed, 0, 255, 75, 255);
    analogWrite(motor_pwm_left, leftMotorSpeed);
    digitalWrite(direction_left, HIGH);
  }

  if(rightMotorSpeed >= 0) {
    rightMotorSpeed = map(rightMotorSpeed, 0, 255, 30, 255);
    analogWrite(motor_pwm_right, rightMotorSpeed);
    digitalWrite(direction_right, HIGH);
  } else {
    rightMotorSpeed = 255 + rightMotorSpeed;
    rightMotorSpeed = map(rightMotorSpeed, 0, 255, 30, 255);
    analogWrite(motor_pwm_right, rightMotorSpeed);
    digitalWrite(direction_right, LOW);
  }
}


void initPID() {
  // initialize timer
  cli();
  TCCR1A = 0;
  TCCR1B = 0;

  OCR1A = 9999;
  TCCR1B |= (1 << WGM12);
  TCCR1B |= (1 << CS11);
  TIMSK1 |= (1 << OCIE1A);

  sei();
}

void setup() {
  mpu.initialize();
  Serial.begin(9600);

  pinMode(direction_left,OUTPUT); 
  pinMode(direction_right,OUTPUT); 
  pinMode(motor_pwm_left,OUTPUT);
  pinMode(motor_pwm_right,OUTPUT); 
  
  mpu.setYAccelOffset(-205);
  mpu.setZAccelOffset(1398);
  mpu.setXGyroOffset(-45);

  initPID();
}

void loop() {
 // read sensor data
 accY = mpu.getAccelerationY();
 accZ = mpu.getAccelerationZ();
 gyroX = mpu.getRotationX();

 //define the range of motor input
 motorPower = constrain(motorPower, -255, 255);
 setMotors(motorPower, motorPower);
}

ISR(TIMER1_COMPA_vect) {
  // calculate angle of inclination
  accAngle = atan2(accY, accZ)*RAD_TO_DEG;
  gyroRate = map(gyroX, -32768, 32768, -250, 250);
  gyroAngle = (float)gyroRate*sampleTime;
  currentAngle = 0.9934*(prevAngle + gyroAngle) + 0.0066*(accAngle);

  error = currentAngle - targetAngle;
  errorSum = errorSum + error;
  // calculate output from PID values
  motorPower = Kp*(error) + Ki*(errorSum)*sampleTime - Kd*(currentAngle-prevAngle)/sampleTime;
  prevAngle = currentAngle;
  }
