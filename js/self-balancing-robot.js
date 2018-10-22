const i2c = require('i2c-bus')
const MPU6050 = require('i2c-mpu6050')
const math = require('mathjs')
const timer = require('nanotimer')
const gpio = require('pigpio').Gpio
const lcd = require('lcd')

const lcd = new Lcd({rs: 18, e: 23, data: [24, 25, 8, 7], cols: 16, rows: 2})

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
  if (leftMotorSpeed >= 0) {
    leftMotorSpeed = 
  }
}


setInterval(() => {
  let data = sensor.readSync()
  lcd.on('ready', () => {
    lcd.setCursor(0, 0)
    lcd.print("Temp: " + data.temp, (err) => {
      if (err) {
        throw err
      }
    })
  })
}, 120)



// If ctrl+c is hit, free resources and exit.
process.on('SIGINT', () => {
  lcd.close();
  process.exit();
});
