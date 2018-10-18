var mpu6050 = require('mpu6050');

// Instantiate and initialize.
var mpu = new mpu6050();
mpu.initialize();

// Test the connection before using.

mpu.testConnection(function(err, testPassed) {
  if (testPassed) {
    mpu.getMotion6(function(err, data){
      console.log(data);
    });
    // Put the MPU6050 back to sleep.
    mpu.setSleepEnabled(1);
  }
});

setInterval(() => {
  mpu.setSleepEnabled(0)
  mpu.getMotion6((err, data) => {
    console.log(data)
  })
  mpu.setSleepEnabled(1)
}, 1000)
