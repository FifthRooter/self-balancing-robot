const i2c = require('i2c-bus')
const MPU6050 = require('i2c-mpu6050')
const math = require('mathjs')
const timer = require('nanotimer')
const gpio = require('pigpio')
const lcd = require('lcd')

const lcd = new Lcd({rs: 18, e: 23, data: [24, 25, 8, 7], cols: 8, rows: 1})

let address = 0x68
let i2c1 = i2c.openSync(1)

const sensor = new MPU6050(i2c1, address)

let accY, accY, gyroX, currTime, loopTime
