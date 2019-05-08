const PiMotor = require('./');

// Name of individual motors
const m1 = new PiMotor.Motor('MOTOR1', 1);
const m2 = new PiMotor.Motor('MOTOR2', 1);
const m3 = new PiMotor.Motor('MOTOR3', 1);
const m4 = new PiMotor.Motor('MOTOR4', 1);

// To drive all motors together
const motorAll = new PiMotor.LinkedMotors(m1, m2, m3, m4);

//Names for individual arrows
const ab = new PiMotor.Arrow(1);
const al = new PiMotor.Arrow(2);
const af = new PiMotor.Arrow(3);
const ar = new PiMotor.Arrow(4);

// This segment drives the motors in the direction listed below:
// forward and reverse take speed in percentage (0-100).
// Node version only goes through the test routine once.

try{
    
  (async function(){
    
    // Drive the motors forward
    console.log('Robot moving forward');
    af.on();
    motorAll.forward(100);
    await PiMotor.sleep(5000);
    
    // Drive the motors backward
    console.log('Robot moving backward');
    af.off();
    ab.on();
    motorAll.reverse();
    await PiMotor.sleep(5000);
  
    // Drive the motors left
    console.log('Robot moving left');
    ab.off();
    al.on();
    m1.stop();
    m2.stop();
    m3.forward();
    m4.forward();
    await PiMotor.sleep(5000);
  
    // Drive the motors right
    console.log('Robot moving right');
    al.off();
    ar.on();
    m1.forward();
    m2.forward();
    m3.stop();
    m4.stop();
    await PiMotor.sleep(5000);
  
    // Stop the motors
    console.log('Robot stop');
    al.off();
    af.off();
    ar.off();
    motorAll.stop();
    
  })();
  
} finally {
  
  // Cleanup before exit
  if (process.platform === "win32") {
    let rl = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout
    });
  
    rl.on("SIGINT", function () {
      process.emit("SIGINT");
    });
  }
  
  process.on('SIGINT', () => {
    motorAll.stop();
    process.exit();
  });
  
}

// Create function to sleep for a given time
function timeout(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function sleep(time, cb, ...args){
  await timeout(time);
  return cb(...args);
}