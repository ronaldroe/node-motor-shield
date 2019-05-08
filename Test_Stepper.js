const PiMotor = require('./');

const m1 = new PiMotor.Stepper('STEPPER1');

// Rotate Stepper 1 in forward/backward direction

try{
  
  (async function(){
    
    // Stepper forward
    console.log('Stepper Forward');
    m1.forward(0.1, 10);
    await PiMotor.sleep(2000);
    
    // Stepper reverse
    console.log('Stepper Reverse');
    m1.backward(0.1, 10);
    await PiMotor.sleep(2000);
    
    // Stepper stop
    console.log('Stepper Stop');
    m1.stop();
    
  })();
  
} finally{
  
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
    m1.stop();
    process.exit();
  });
  
}