const i2c = require('i2c-bus')
const MPU6050 = require('i2c-mpu6050')
const math = require('mathjs')
const gpio = require('pigpio').Gpio
const lcd = require('lcd')
//const csvWriter = require('csv-write-stream')
const fs = require('fs')

//const mongoose = require('mongoose')
//mongoose.connect('mongodb://localhost/edgeBot')

let writeStream = fs.createWriteStream('robot-log.csv')

//const Schema = mongoose.Schema
//const ObjectId = Schema.ObjectId

let address = 0x68
let Kp=90, Ki=0, Kd=0
let targetAngle=4
let sampleTime=0.025

// let schema = new mongoose.Schema({
//   gains: {
//     Kp: Number,
//     Ki: Number,
//     Kd: Number,
//   },
//   log: {
//     timestamp: String,
//     accY: [],
//     accZ: [],
//     gyroX: [],
//     currentAngle: [],
//     elapsedTime: []
//   }
// })

//let EdgeBot = mongoose.model('EdgeBot', schema)

// let i2c1 = i2c.openSync(1)
// let sensor = new MPU6050(i2c1, address)
// const lcd = new Lcd({rs: 18, e: 23, data: [24, 25, 8, 7], cols: 16, rows: 2})


let accX, accY, gyroX, accAngle, gyroRate, currTime, loopTime, prevTime=0, gyroAngle=0
let motorPower, currentAngle, prevAngle=0, error, prevError=0, errorSum=0

let timeNow=0, earlierTime=0, elapsedTime=0

let accYArray=[], accZArray=[], gyroXArray=[], currentAngleArray=[], elapsedTimeArray=[]

let log_data_array = []
let log_data_temp_array = []

let log_data = {
  timestamp: '',
  accY: [],
  accZ: [],
  gyroX: [],
  currentAngle: [],
  elapsedTime: []
}


let motorsTurnedOff = false

//let Kp=19, Kd=0, Ki=0

//let sampleTime = 0.02
//let targetAngle = 3

const direction_left = new gpio(16, {mode: gpio.OUTPUT})
const direction_right = new gpio(12, {mode: gpio.OUTPUT})

const motor_pwm_left = new gpio(20, {mode: gpio.OUTPUT})
const motor_pwm_right = new gpio(21, {mode: gpio.OUTPUT})


let motorState = (motorsAreOn) => {
  motorsTurnedOff = motorsAreOn
}

let mapRange = (x, in_min, in_max, out_min, out_max) => {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
}

let setMotors = (leftMotorSpeed, rightMotorSpeed) => {
  if (!motorsTurnedOff) {
    if (leftMotorSpeed <= 0) {
      leftMotorSpeed = leftMotorSpeed * (-1)
      leftMotorSpeed = mapRange(leftMotorSpeed, 0, 1200, 5, 255)
      direction_left.digitalWrite(1)
      motor_pwm_left.pwmWrite(leftMotorSpeed.toFixed())
    } else {
      leftMotorSpeed = mapRange(leftMotorSpeed, 0, 1200, 9, 255)
      direction_left.digitalWrite(0)
      motor_pwm_left.pwmWrite(leftMotorSpeed.toFixed())
    }

    if (rightMotorSpeed <= 0) {
      rightMotorSpeed = rightMotorSpeed * (-1)
      rightMotorSpeed = mapRange(rightMotorSpeed, 0, 1200, 0, 255)
      direction_right.digitalWrite(0)
      motor_pwm_right.pwmWrite(rightMotorSpeed.toFixed())
    } else {
      rightMotorSpeed = mapRange(rightMotorSpeed, 0, 1200, 0, 255)
      direction_right.digitalWrite(1)
      motor_pwm_right.pwmWrite(rightMotorSpeed.toFixed())
    }
  } else {
    motor_pwm_left.pwmWrite(0)
    motor_pwm_right.pwmWrite(0)
  }
}


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



  // setInterval(() => {
  //   let data = sensor.readSync()
  //
	// 	accY = data.accel.y
	// 	accZ = data.accel.z
	// 	gyroX = data.gyro.x
	// 	accAngle = math.atan2(accY, accZ) * 180 / Math.PI
	// 	gyroRate = gyroX
  //
  //   gyroAngle = gyroRate * sampleTime
  //
  //   currentAngle = 0.99 * (prevAngle + gyroAngle) + 0.01 * accAngle
  //
  //   error = currentAngle - targetAngle
  //   errorSum = errorSum + error
  //
  //   motorPower = Kp*(error) + Ki*(errorSum)*sampleTime - Kd*(currentAngle-prevAngle)/sampleTime
  //   //motorPower = motorPower > 255 ? 255 : motorPower < -255 ? -255 : parseInt(motorPower, 10)
  //   if (motorPower > 255) motorPower = 255
  //   else if (motorPower < -255) motorPower = -255
  //
  //   setMotors(motorPower, motorPower)
  //
  //   prevAngle = currentAngle
  // }, 20)

setInterval(() => {
  let i2c1 = i2c.open(1, function (err) {
    if (err) console.log(err);

    let sensor = MPU6050(i2c1, address)

    sensor.read(function (err, data) {
      if (err) console.log(err);
      earlierTime = timeNow
      elapsedTime = Date.now() - earlierTime
      timeNow = Date.now()

      accY = data.accel.y
  		accZ = data.accel.z
  		gyroX = data.gyro.x
  		accAngle = math.atan2(accY, accZ) * 180 / Math.PI
  		gyroRate = gyroX

      gyroAngle = gyroRate * sampleTime

      currentAngle = 0.9934 * (prevAngle + gyroAngle) + 0.0066 * accAngle

      //accYArray.push(accY, ';')
      //accZArray.push(accZ, ';')
      //gyroXArray.push(gyroX, ';')
      //currentAngleArray.push(currentAngle, ';')
      //elapsedTimeArray.push(elapsedTime, ';')

      // log_data.log.accY[].push(accY, ';')
      // log_data.log.accZ[].push(accZ, ';')
      // log_data.log.gyroX[].push(gyroX, ';')
      // log_data.log.currentAngle[].push(currentAngle, ';')
      // log_data.log.elapsedTime[].push(elapsedTime, ';')
      //log_data_temp_array = []
      //log_data_temp_array = [accY, accZ, gyroX, currentAngle, elapsedTime]
      //log_data_array.push(log_data_temp_array)

      //writeStream.write(log_data_temp_array.toString()+'\r\n')
      //writer.write(log_data)

      error = currentAngle - targetAngle
      errorSum = errorSum + error

      motorPower = Kp*(error) + Ki*(errorSum)*sampleTime - Kd*(currentAngle-prevAngle)/sampleTime
      //motorPower = motorPower > 255 ? 255 : motorPower < -255 ? -255 : parseInt(motorPower, 10)
      //if (motorPower > 255) motorPower = 255
      //else if (motorPower < -255) motorPower = -255

     // setMotors(motorPower, motorPower)
      
      log_data_temp_array = []
      log_data_temp_array = [accY, accZ, gyroX, currentAngle, elapsedTime, motorPower]
      log_data_array.push(log_data_temp_array)
      writeStream.write(log_data_temp_array.toString()+'\r\n')
      if (motorPower > 1200) motorPower = 1200
      else if (motorPower < -1200) motorPower = -1200
      setMotors(motorPower, motorPower)
      prevAngle = currentAngle
    })
  })
}, 25)


process.on('SIGINT', () => {
  //lcd.close();
  motor_pwm_left.pwmWrite(0)
  motor_pwm_right.pwmWrite(0)
  // fs.writeFile('robot-log.csv', log_data_array, (err) => {
  //   if (err) throw err;
  //
  //   console.log('Log data saved!')
  //
  //
  // })
  timeNow = Date.now()

  // const logData = new EdgeBot({
  //   gains: {
  //     Kp: Kp,
  //     Ki: Ki,
  //     Kd: Kd
  //   },
  //   log: {
  //     timestamp: timeNow.toString(),
  //     accY: accYArray,
  //     accZ: accZArray,
  //     gyroX: gyroXArray,
  //     currentAngle: currentAngleArray,
  //     elapsedTime: elapsedTimeArray
  //   }
  // })

  // logData.save().then(() => {
  //   console.log('Data saved successfully!')
  //   process.exit()
  // })
  // .catch(err => {
  //   console.log('Error caught: ', err)
  // })
  console.log(log_data_array)
  writeStream.end()
  process.exit()
});
