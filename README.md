### Self-balancing robot

https://github.com/FifthRooter/self-balancing-robot/assets/22204845/546c1cc7-7c90-414c-b639-572d04be5377

#### Overview
The robot is equipped with two MPU-6050 sensors that contain a 3-axis MEMS accelerometer and a 3-axis MEMS gyroscope.
The two sensors are placed at each end of the robot (above the wheels) for greater accuracy.

The design files (STLs and Solidworks) can be found in the repo under /design.

Both the accelerometer and the gyroscope individually are not sufficient to provide quality data that can be used to correct the robot’s tilt and always keep it aligned. 

That’s because the gyroscope only measures angular velocity which means that there is no fixed reference point apart from the initial calibration that can be done at the beginning of the robot test by aligning it properly and using the velocity measurements to calculate angular displacement and correct the robot accordingly. 

This requires integrating the velocity data, which would quickly become useless as integration would increase the error with time, rendering the original reference point moot. Every angular displacement calculation would contain an error, which would keep adding up with every integration step, leading to an increasingly larger errors, making the system unstable.

The accelerometer, however, can be used without the gyroscope, as the angular displacement and velocity can be calculated by performing a double and single integration, respectively. The issue is that it cannot measure precise enough acceleration values for the project’s purposes. As the accelerometer measures acceleration, it also measures the gravitational pull of Earth, which output value would be read as 1g. This 1g reference point can be used to determine orientation relative to ground.

Thus, the accelerometer and gyroscope are an ideal combination (sensor fusion) to measure the orientation and the angular velocity of the robot, allowing for accurate compensation calculations that could be used to actuate the motors in order to keep the robot stable. A complementary filter has been implemented to merge the accelerometer and gyroscope data for greater accuracy:
![complementary-filter](https://github.com/FifthRooter/self-balancing-robot/assets/22204845/24d9fb31-db18-46bc-97c0-a3240c18c7ba)

The robot uses a proportional-integral-derivative controller (PID) to ensure that it’s always balanced with its z-axis aligned with the gravitational pull of the planet:
![image](https://github.com/FifthRooter/self-balancing-robot/assets/22204845/da8812e0-06a2-41e0-b066-823004a36a53)

Electrical diagram of the whole system:
![self-balancing-robot-diagram](https://github.com/FifthRooter/self-balancing-robot/assets/22204845/0d5d90a7-0743-41d9-870b-38615ca7f299)

Electrical components:
- 2x 1:53 6V DC motors
- 2x H-bridges for motor control
- Arduino Nano
- Optional: ESP8266 for wireless control
- Optional: RPi + camera for vision
- 2x MPU-6050 sensors
- Boost converter
- 2x 18650 3.7V batteries

Libraries used:
- Wire.h  - enables communication with I2C devices (small serial devices)
- I2Cdev.h - enables interfacing/reading data from a I2C device
- MPU6050.h - allows for reading data from the MPU-6050 board

Electrical components:
- 2x 1:53 6V DC motors
- 2x H-bridges for motor control
- Arduino Nano
- Optional: ESP8266 for wireless control
- Optional: RPi + camera for vision
- 2x MPU-6050 sensors
- Boost converter
- 2x 18650 3.7V batteries

Libraries used:
- Wire.h  - enables communication with I2C devices (small serial devices)
- I2Cdev.h - enables interfacing/reading data from a I2C device
- MPU6050.h - allows for reading data from the MPU-6050 board

![mark-1-angle](https://github.com/FifthRooter/self-balancing-robot/assets/22204845/f6f01f2f-0999-420e-97f7-5de972a8af57)
![mark-1-front](https://github.com/FifthRooter/self-balancing-robot/assets/22204845/103c5792-25d4-4d15-b150-73dc340c3b31)
![mark-1-side](https://github.com/FifthRooter/self-balancing-robot/assets/22204845/2a8bf8a8-1e68-4261-98d1-7efba381481b)
![mark-1-top](https://github.com/FifthRooter/self-balancing-robot/assets/22204845/97ea6658-e6c4-4eca-ba50-b5df885f6f23)
![mark-bottom](https://github.com/FifthRooter/self-balancing-robot/assets/22204845/711813bd-c435-42a1-9309-e33b931dba93)

