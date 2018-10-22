const nanotimer = require('nanotimer')
const gpio = require('pigpio').Gpio

//const gpio = pigpio.initialize()
const timer = new nanotimer()

const direction_left = new gpio(16, {mode: gpio.OUTPUT})
const direction_right = new gpio(12, {mode: gpio.OUTPUT})

const motor_pwm_left = new gpio(20, {mode: gpio.OUTPUT})
const motor_pwm_right = new gpio(21, {mode: gpio.OUTPUT})

let leftMotorSpeed = 100
let rightMotorSpeed = 100

timer.setInterval(() => {
  direction_left.digitalWrite(0)
  direction_right.digitalWrite(1)

  motor_pwm_left.pwmWrite(leftMotorSpeed)
  motor_pwm_right.pwmWrite(rightMotorSpeed)

},[""], '5m', (err) => {
  if (err) {
    console.log('Something went wrong with timer initialization :(')
  }
})

process.on('SIGINT', () => {
 timer.clearInterval()
//gpio.terminate()
motor_pwm_left.pwmWrite(0)
motor_pwm_right.pwmWrite(0)
process.exit()
});
