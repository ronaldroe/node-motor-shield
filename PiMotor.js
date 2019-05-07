'use strict';
const Gpio = require('pigpio').Gpio;

class Motor{
  
  /* 
    Class to handle interaction with the motor pins
    Supports redefinition of "forward" and "backward" depending on how motors are connected
    Use the supplied Motorshieldtest module to test the correct configuration for your project.
    
    Arguments:
      motor = string motor pin label (i.e. "MOTOR1","MOTOR2","MOTOR3","MOTOR4") identifying the pins to which
              the motor is connected.
      config = number defining which pins control "forward" and "backward" movement.
  */
  
  constructor(motor, config){
    
    // Pin numbers are different, because pigpio uses GPIO numbers instead of pin numbers.
    this.motorpins = {
      MOTOR4: {
        config: {
          1: {e:12,f:8,r:7},
          2: {e:12,f:7,r:8}
        },
        arrow:1
      },
      MOTOR3: {
        config: {
          1: {e:10,f:9,r:11},
          2: {e:10,f:11,r:9}
        }, 
        arrow:2
      },
      MOTOR2: {
        config: {
          1: {e:25,f:23,r:24},
          2: {e:25,f:24,r:23}
        }, 
        arrow:3
      },
      MOTOR1: {
        config: {
          1: {e:17,f:22,r:27},
          2: {e:17,f:27,r:22}
        },
        arrow:4
      }
    };
    
    this.testMode = false;
    
    this.arrow = new Arrow(this.motorpins[motor].arrow);
    
    this.pins = this.motorpins[motor].config[config];
    
    //TODO: GPIO time, I guess
    
    this.motorE = new Gpio(this.pins.e, {mode: Gpio.OUTPUT});
    this.motorF = new Gpio(this.pins.f, {mode: Gpio.OUTPUT});
    this.motorR = new Gpio(this.pins.r, {mode: Gpio.OUTPUT});
    
    this.motorE.pwmFrequency(50);
    
    this.motorF.digitalWrite(0);
    this.motorR.digitalWrite(0);
    
  }
  
  test(state){
    
    /*
      Puts the motor into test mode. When in test mode, the Arrow associated with the motor
      receives power on "forward" rather than the motor. Useful when testing your code.
      
      Arguments: 
      state = boolean
      
      Supports toggling test mode state. To toggle, call test with no arguments.
    */
    
    this.testMode = typeof state === 'boolean' ? state : !this.testMode;
    
    return this;
    
  }
  
  forward(speed){
    
    /*
      Starts the motor turning in its configured "forward" direction.

      Arguments:
      speed = Duty Cycle Percentage from 0 to 100. Default: 100
      0 - stop and 100 - maximum speed.
      
      Call without an argument to set speed to 100.
    */
    
    console.log('Forward');
    
    if(this.testMode){
      this.arrow.on();
    } else {
      this.motorE.pwmWrite(typeof speed !== 'undefined' ? Math.ceil(255 * (speed / 100)) : 255);
      this.motorF.digitalWrite(1);
      this.motorR.digitalWrite(0);
    }
    
    return this;
    
  }
  
  reverse(speed){
    
    /*
      Starts the motor turning in its configured "reverse" direction.

      Arguments:
      speed = Duty Cycle Percentage from 0 to 100. Default: 100
      0 - stop and 100 - maximum speed.
      
      Call without an argument to set speed to 100.
    */
    
    console.log('Reverse');
    
    if(this.testMode){
      this.arrow.off();
    } else {
      this.motorE.pwmWrite(typeof speed !== 'undefined' ? Math.ceil(255 * (speed / 100)) : 255);
      this.motorF.digitalWrite(0);
      this.motorR.digitalWrite(1);
    }
    
    return this;
    
  }
  
  stop(){
    
    // Stops power to the motor
    
    console.log('Stop');
    
    this.arrow.off();

    this.motorE.pwmWrite(0);
    this.motorF.digitalWrite(0);
    this.motorR.digitalWrite(0);
    
    return this;

  }
  
}

class LinkedMotors{
  
  /*
    Links 2 or more motors together as a set.
    
    This allows a single command to be used to control a linked set of motors
    e.g. For a 4x wheel vehicle this allows a single command to make all 4 wheels go forward.
    Starts the motor turning in its configured "forward" direction.
    
    Arguments:
    *motors = a list of Motor objects
  */
  
  constructor(){
    
    this.motor = [];
    
    for(let i = 0; i < arguments.length; i++){
      this.motor.push(arguments[i]);
    }
    
  }
  
  forward(speed){
    
    /*
      Starts the motor turning in its configured "forward" direction.

      Arguments:
      speed = Duty Cycle Percentage from 0 to 100. Default: 100
      0 - stop and 100 - maximum speed.
      
      Call without an argument to set speed to 100.
    */
    
    this.motor.forEach(m => {
      m.forward(speed || 100);
    });
    
    return this;
    
  }
  
  reverse(speed){
    
    /*
      Starts the motor turning in its configured "reverse" direction.

      Arguments:
      speed = Duty Cycle Percentage from 0 to 100. Default: 100
      0 - stop and 100 - maximum speed.
      
      Call without an argument to set speed to 100.
    */
    
    this.motor.forEach(motor => {
      motor.reverse(speed || 100);
    });
    
    return this;
    
  }
  
  stop(){
    
    /* Stops power to the motors */
    
    this.motor.forEach(motor => {
      motor.stop();
    });
    
    return this;
    
  }
  
}

class Arrow{
  
  /*
    Defines an object for controlling one of the LED arrows on the Motorshield.
  
    Arguments:
    which = integer label for each arrow. The arrow number if arbitrary starting with:
        1 = Arrow closest to the Motorshield's power pins and running clockwise round the board
        ...
        4 = Arrow closest to the motor pins.
  */
  
  constructor(which){
    
    this.arrowpins = [0, 13, 19, 26, 16];
    
    this.pin = new Gpio(which, {mode: Gpio.OUTPUT});
    
    this.pin.digitalWrite(0);
    
  }
  
  on(){
    this.pin.digitalWrite(1);
    return this;
  }
  
  off(){
    this.pin.digitalWrite(0);
    return this;
  }
  
}

function sleep(time) {
  /* 
  Stand-in for Python's sleep function. Requires async-await to work.
  Wrap code in a async function, then await sleep(time).
  IIFE example:
    (async function(){
      console.log('start');
      sleep(3000);
      console.log('done');
    })()
  This will log 'start', wait 3 seconds, then log 'done'.
*/
  return new Promise(resolve => setTimeout(resolve, time));
}

module.exports = { Motor, LinkedMotors, Arrow, sleep };