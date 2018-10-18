// var mpu6050 = require('mpu6050');
//
// // Instantiate and initialize.
// var mpu = new mpu6050();
// mpu.initialize();
//
// // Test the connection before using.
//
// mpu.testConnection(function(err, testPassed) {
//   if (testPassed) {
//     mpu.getMotion6(function(err, data){
//       console.log(data);
//     });
//     // Put the MPU6050 back to sleep.
//     mpu.setSleepEnabled(1);
//   }
// });
//
// setInterval(() => {
//   mpu.setSleepEnabled(0)
//   mpu.getMotion6((err, data) => {
//     console.log(data)
//   })
//   mpu.setSleepEnabled(1)
// }, 1000)
//
var i2c = require('i2c-bus');
var MPU6050 = require('i2c-mpu6050');

var address = 0x68;
var i2c1 = i2c.openSync(1);

var sensor = new MPU6050(i2c1, address);


setInterval(() => {
  var data = sensor.readSync();
  console.log(data);
}, 1000)
