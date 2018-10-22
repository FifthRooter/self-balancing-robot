const nanotimer = require('nanotimer')
const gpio = require('pigpio').Gpio

const timer = new nanotimer()

const direction_left = new gpio(16, {mode: gpio.OUTPUT})
const direction_right = new gpio(12, {mode: gpio.OUTPUT})

const motor_pwm_left = new gpio(20, {mode: gpio.OUTPUT})
const motor_pwm_right = new gpio(21, {mode: gpio.OUTPUT})

let leftMotorSpeed = 75
let rightMotorSpeed = 30

timer.setInterval(() => {
  direction_left.digitalWrite(0)
  direction_right.digitalWrite(1)

  motor_pwm_left.pwmWrite(leftMotorSpeed)
  motor_pwm_right.pwmWrite(rightMotorSpeed)

}, '5m', (err) => {
  if (err) {
    console.log('Something went wrong with timer initialization :(')
  }
})
