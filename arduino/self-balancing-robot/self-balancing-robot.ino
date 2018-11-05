#include "Wire.h"
#include "I2Cdev.h"
#include "MPU6050.h"
#include "math.h"


MPU6050 mpu;                                    // Create an instance of the MPU6050 class

int16_t accY, accZ;                             // Define accelerometer Y and Z values as 16bit integers
float accAngle;                                 // Define the angle that will be calculated using accY and accZ values

int16_t gyroX;                                  // Define gyroscope X value (angular velocity around x-axis) as 16bit integer
float gyroAngle = 0;                            // Give the gyro angle an initial value of 0
unsigned long currTime, prevTime = 0, loopTime; // Set time-related variables as 32bit numbers of only positive value (0 to 2^32-1)

#define direction_left 5                        // Set pin number for DIR pin of left motor
#define direction_right 8                       // Set pin number for DIR pin of right motor
#define motor_pwm_left 6                        // Set pin number for EN- pin of left motor (must be a PWM pin)
#define motor_pwm_right 11                      // Set pin number for EN pin of right motor (must be a PWM pin)

#define Kp 36 // Set the proportional gain value for the PID controller
#define Ki 16.6667 //33.3333                                  //0.003 // Set the derivative gain value for the PID controller
#define Kd 0.015//0.0075
#define sampleTime 0.005                        // Define sampling time
#define targetAngle 0.5                           // Define target angle which is the desired tilt of the robot

float a = 0.0;
float tau = 0.075;
float x_angle = 0.0;

// Declare variables that are shared between the interrupt function and main loop as volatile to avoid compiler attempt to optimize the shared objects
volatile int motorPower, gyroRate;
volatile float currentAngle, prevAngle = 0, error, prevError = 0, errorSum = 0;

float complementaryFilter(float newAngle, float gyroRate, int loopTime) {
  float dtC = float(loopTime)/1000.0;
  a = tau / (tau+dtC);
  x_angle = a * (x_angle + gyroRate*dtC) + (1-a)*(newAngle);
  return x_angle;
}

void setMotors(int leftMotorSpeed, int rightMotorSpeed) {
  if (leftMotorSpeed <= 0) {
    leftMotorSpeed = leftMotorSpeed * (-1);
    leftMotorSpeed = map(leftMotorSpeed, 0, 255, 22, 255); // CCW
    analogWrite(motor_pwm_left, leftMotorSpeed);
    digitalWrite(direction_left, HIGH);
  } else {
    leftMotorSpeed = map(leftMotorSpeed, 0, 255, 22, 255); // CW
    analogWrite(motor_pwm_left, leftMotorSpeed);
    digitalWrite(direction_left, LOW);
  }

  if (rightMotorSpeed <= 0) {
    rightMotorSpeed = rightMotorSpeed * (-1);
    rightMotorSpeed = map(rightMotorSpeed, 0, 255, 0 , 255); // CW
    analogWrite(motor_pwm_right, rightMotorSpeed);
    digitalWrite(direction_right, LOW);
  } else {
    rightMotorSpeed = map(rightMotorSpeed, 0, 255, 0, 255); //CCW
    analogWrite(motor_pwm_right, rightMotorSpeed);
    digitalWrite(direction_right, HIGH);
  }
}


void initPID() {
  // initialize timer
  cli();
  TCCR1A = 0;
  TCCR1B = 0;

  OCR1A = 19999; // match register = (16000000Hz / (8*desired_frequency)) - 1 ; currently the frequency is 200HZ(5ms)
  TCCR1B |= (1 << WGM12);
  TCCR1B |= (1 << CS11);
  TIMSK1 |= (1 << OCIE1A);

  sei();
}

void setup() {
  mpu.initialize();
  Serial.begin(115200);

  pinMode(direction_left, OUTPUT);
  pinMode(direction_right, OUTPUT);
  pinMode(motor_pwm_left, OUTPUT);
  pinMode(motor_pwm_right, OUTPUT);

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
  //Serial.println("accY: " + accY);
  //define the range of motor input
  motorPower = constrain(motorPower, -255, 255);
  setMotors(motorPower, motorPower);
}

ISR(TIMER1_COMPA_vect) {
  // calculate angle of inclination
  accAngle = atan2(accY, accZ) * RAD_TO_DEG;
  gyroRate = map(gyroX, -32768, 32768, -250, 250);
  gyroAngle = (float)gyroRate * sampleTime;
  //currentAngle = 0.98 * (prevAngle + gyroAngle) + 0.02 * (accAngle);
  currentAngle = complementaryFilter(accAngle, gyroRate, sampleTime*1000);
  //Serial.print(accY);
  //Serial.print(",");
  //Serial.print(accZ);
  //Serial.print(",");
  //Serial.print(gyroRate);
  //Serial.print(",");

  error = currentAngle - targetAngle;
    errorSum = errorSum + error/2*sampleTime;

  // calculate output from PID values
  
  motorPower = Kp*(error + Ki * errorSum + Kd * (error - prevError) / sampleTime);
  prevError = error;
  Serial.println(currentAngle);
  //Serial.print(",");
  //Serial.print(motorPower);
  //Serial.println("");
  prevAngle = currentAngle;
}
