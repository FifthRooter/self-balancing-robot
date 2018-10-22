const i2c = require('i2c-bus')
const MPU6050 = require('i2c-mpu6050')
const math = require('mathjs')
const nanotimer = require('nanotimer')
const gpio = require('pigpio').Gpio
const lcd = require('lcd')

//const lcd = new Lcd({rs: 18, e: 23, data: [24, 25, 8, 7], cols: 16, rows: 2})
const timer = new nanotimer()

let address = 0x68
let i2c1 = i2c.openSync(1)
const sensor = new MPU6050(i2c1, address)

let accY, accY, gyroX, gyroRate, currTime, loopTime, prevTime=0, gyroAngle=0
let motorPower, currentAngle, prevAngle=0, error, prevError=0, errorSum=0

let Kp=15, Kd=0.03, Ki=5

let sampleTime = 5
let targetAngle = -14

const direction_left = new gpio(16, {mode: gpio.OUTPUT})
const direction_right = new gpio(12, {mode: gpio.OUTPUT})

const motor_pwm_left = new gpio(20, {mode: gpio.OUTPUT})
const motor_pwm_right = new gpio(21, {mode: gpio.OUTPUT})


let mapRange = (x, in_min, in_max, out_min, out_max) => {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
}

let setMotors = (leftMotorSpeed, rightMotorSpeed) => {
  if (leftMotorSpeed <= 0) {
    leftMotorSpeed = leftMotorSpeed * (-1)
    leftMotorSpeed = mapRange(leftMotorSpeed, 0, 255, 10, 255)
    direction_left.digitalWrite(0)
    motor_pwm_left.pwmWrite(leftMotorSpeed)
  } else {
    leftMotorSpeed = mapRange(leftMotorSpeed, 0, 255, 20, 255)
    direction_left.digitalWrite(1)
  }

  if (rightMotorSpeed <= 0) {
    rightMotorSpeed = rightMotorSpeed * (-1)
    rightMotorSpeed = mapRange(rightMotorSpeed, 0, 255, 0, 255)
    direction_right.digitalWrite(1)
    motor_pwm_right.pwmWrite(rightMotorSpeed)
  } else {
    rightMotorSpeed = mapRange(rightMotorSpeed, 0, 255, 0, 255)
    direction_right.digitalWrite(0)
    motor_pwm_right.pwmWrite(rightMotorSpeed)
  }
}


timer.setInterval(() => {
  let data = sensor.readSync()
  accY = data.accel.y
  accZ = data.accel.z
  gyroX = data.gyro.x

  accAngle = atan2(accY, accZ) * 180 / Math.PI
  gyroRate = gyroX
  gyroAngle = gyroRate * sampleTime

  currentAngle = 0.99 * (prevAngle + gyroAngle) + 0.01 * accAngle

  error = currentAngle = targetAngle
  errorSum = errorSum + error

  motorPower = Kp*(error) + Ki*(errorSum)*sampleTime - Kd*(currentAngle-prevAngle)/sampleTime
  motorPower = motorPower > 255 ? 255 : motorPower < -255 ? -255 : motorPower

  prevAngle = currentAngle


},[""], '5m', (err) => {
  if (err) {
    console.log('Something went wrong with timer initialization :(')
  }
})


// setInterval(() => {
//   let data = sensor.readSync()
//   lcd.on('ready', () => {
//     lcd.setCursor(0, 0)
//     lcd.print("Temp: " + data.temp, (err) => {
//       if (err) {
//         throw err
//       }
//     })
//   })
// }, 120)


process.on('SIGINT', () => {
  lcd.close();
  timer.clearInterval()
  motor_pwm_left.pwmWrite(0)
  motor_pwm_right.pwmWrite(0)
  process.exit()
});
