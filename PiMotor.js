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
    
    this.motorpins = {
      MOTOR4: {
        config: {
          1: {e:32,f:24,r:26},
          2: {e:32,f:26,r:24}
        },
        arrow:1
      },
      MOTOR3: {
        config: {
          1: {e:19,f:21,r:23},
          2: {e:19,f:23,r:21}
        }, 
        arrow:2
      },
      MOTOR2: {
        config: {
          1: {e:22,f:16,r:18},
          2: {e:22,f:18,r:16}
        }, 
        arrow:3
      },
      MOTOR1: {
        config: {
          1: {e:11,f:15,r:13},
          2: {e:11,f:13,r:15}
        },
        arrow:4
      }
    };
    
    this.testMode = false;
    
    this.arrow = new Arrow(this.motorpins[motor].arrow);
    
    this.pins = this.motorpins[motor].config[config];
    
    //TODO: GPIO time, I guess
    
    this.motorE = new Gpio(this.pins.e, {mode: Gpio.OUTPUT});
    this.motorF = new Gpio(this.pins.e, {mode: Gpio.OUTPUT});
    this.motorR = new Gpio(this.pins.e, {mode: Gpio.OUTPUT});
    
    this.motorE.pwmRange(100);
    this.motorE.pwmFrequency(50);
    
  }
  
  test = state => {
    
    /*
      Puts the motor into test mode. When in test mode, the Arrow associated with the motor
      receives power on "forward" rather than the motor. Useful when testing your code.
      
      Arguments: 
      state = boolean
      
      Supports toggling test mode state. To toggle, call test with no arguments.
    */
    
    this.testMode = typeof state === 'boolean' ? state : !this.testMode;
    
  }
  
  forward = speed => {
    
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
      this.motorE.pwmWrite(speed || 100);
      this.motorF.digitalWrite(1);
      this.motorR.digitalWrite(0);
    }
    
  }
  
  reverse = speed => {
    
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
      this.motorE.pwmWrite(speed || 100);
      this.motorF.digitalWrite(0);
      this.motorR.digitalWrite(1);
    }
    
  }
  
  stop = () => {
    
    // Stops power to the motor
    
    console.log('Stop');
    
    this.arrow.off();

    this.motorE.pwmWrite(0);
    this.motorF.digitalWrite(0);
    this.motorR.digitalWrite(0);

  }
  
}

class Arrow{
  
  constructor(which){
    
    this.arrowpins = [0, 33, 35, 37, 36];
    
    this.pin = this.arrowpins[which];
    
  }
  
}