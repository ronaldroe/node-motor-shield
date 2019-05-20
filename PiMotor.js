'use strict';
const Gpio = require('pigpio').Gpio;
const sleep = require('sleep');

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
      m.forward(typeof speed !== 'undefined' ? speed : 100);
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
    
    this.motor.forEach(m => {
      m.reverse(typeof speed !== 'undefined' ? speed : 100);
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
    
    this.arrowpins = [13, 19, 26, 16];
    
    this.pin = new Gpio(this.arrowpins[(which - 1)], {mode: Gpio.OUTPUT});
    
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

class Stepper{
  
  constructor(motor){
    
    /*
      Defines stepper motor pins on the MotorShield
    
      Arguments:
      motor = stepper motor
    */
    
    this.stepperpins = {
      STEPPER1: {
        en1: 17,
        en2: 25,
        c1: 27,
        c2: 22,
        c3: 24,
        c4: 23
      },
      STEPPER2: {
        en1: 10,
        en2: 12,
        c1: 9,
        c2: 11,
        c3: 8,
        c4: 7
      }
    };
    
    this.config = this.stepperpins[motor];
    
    this.motorEn1 = new Gpio(this.config.en1, {mode: Gpio.OUTPUT});
    this.motorEn2 = new Gpio(this.config.en2, {mode: Gpio.OUTPUT});
    this.motorC1 = new Gpio(this.config.c1, {mode: Gpio.OUTPUT});
    this.motorC2 = new Gpio(this.config.c2, {mode: Gpio.OUTPUT});
    this.motorC3 = new Gpio(this.config.c3, {mode: Gpio.OUTPUT});
    this.motorC4 = new Gpio(this.config.c4, {mode: Gpio.OUTPUT});
    
    this.motorEn1.digitalWrite(1);
    this.motorEn2.digitalWrite(1);
    this.motorC1.digitalWrite(0);
    this.motorC2.digitalWrite(0);
    this.motorC3.digitalWrite(0);
    this.motorC4.digitalWrite(0);
    
  }
  
  setStep(w1, w2, w3, w4){
    
    /*
      Set steps of Stepper Motor
    
      Arguments:
      w1,w2,w3,w4 = Wire of Stepper Motor
    */
    
    this.motorC1.digitalWrite(w1);
    this.motorC2.digitalWrite(w2);
    this.motorC3.digitalWrite(w3);
    this.motorC4.digitalWrite(w4);
    
    return this;
    
  }
  
  forward(delay, steps){
    
    /*
      Rotate Stepper motor in forward direction
    
      Arguments:
      delay = time between steps in full seconds
      steps = Number of Steps
    */
    
    for(let i = 0; i < steps; i++){
      
      this.setStep(1, 0, 0, 0);
      sleep.msleep(delay * 1000);
      this.setStep(0, 1, 0, 0);
      sleep.msleep(delay * 1000);
      this.setStep(0, 0, 1, 0);
      sleep.msleep(delay * 1000);
      this.setStep(0, 0, 0, 1);
      sleep.msleep(delay * 1000);
      
    }
    
    return this;
    
  }
  
  backward(delay, steps){
    
    /*
      Rotate Stepper motor in backward direction
    
      Arguments:
      delay = time between steps
      steps = Number of Steps
    */
    
    for(let i = 0; i < steps; i++){
      
      this.setStep(0, 0, 0, 1);
      sleep.msleep(delay * 1000);
      this.setStep(0, 0, 1, 0);
      sleep.msleep(delay * 1000);
      this.setStep(0, 1, 0, 0);
      sleep.msleep(delay * 1000);
      this.setStep(1, 0, 0, 0);
      sleep.msleep(delay * 1000);
      
    }
    
    return this;
    
  }
  
  stop(){
    
    // Stops power to the motor
    
    console.log("Stop stepper motor");
    
    this.motorC1.digitalWrite(0);
    this.motorC2.digitalWrite(0);
    this.motorC3.digitalWrite(0);
    this.motorC4.digitalWrite(0);
    
    return this;
    
  }
  
}

class Sensor{
  
  /*
    Defines a sensor connected to the sensor pins on the MotorShield
    
    Arguments:
    sensortype = string identifying which sensor is being configured.
        i.e. "IR1", "IR2", "ULTRASONIC"
    boundary = an integer specifying the minimum distance at which the sensor
        will return a Triggered response of True.
  */
  
  constructor(sensortype, boundary){
    
    this.triggered = false;
    
    this.sensorpins = {
      IR1: {
        echo: 4,
        check: this.iRCheck
      },
      IR2: {
        echo: 18,
        check: this.iRCheck
      },
      ULTRASONIC: {
        trigger: 5,
        echo: 6,
        check: this.sonicCheck
      }
    };
    
    this.config = this.sensorpins[sensortype];
    
    this.boundary = boundary;
    
    this.lastRead = 0;
    
    if(this.config.hasOwnProperty('trigger')){
      
      console.log('trigger');
      this.trigger = new Gpio(this.config.trigger, {mode: Gpio.OUTPUT});
      
      this.trigger.digitalWrite(0);
      
    }
    
    this.echo = new Gpio(this.config.echo, {mode: Gpio.INPUT, alert: true});
    
  }
  
  iRCheck(){
    
    let input_state = this.config.echo.digitalRead();
    
    if(input_state){
      console.log('Sensor 2: Object Detected');
      this.triggered = true;
    } else {
      this.triggered = false;
    }
    
    return this;
    
  }
  
  sonicCheck(){
    
    // I really don't know what to do here. Need to look deeper into this one.
    
  }
  
  trigger(){
    
    /*
      Executes the relevant routine that activates and takes a reading from the specified sensor.
    
      If the specified "boundary" has been breached the Sensor's Triggered attribute gets set to True.
    */
    
    this.config.check();
    console.log('Trigger called');
    
    return this;
    
  }
  
}

module.exports = { Motor, LinkedMotors, Stepper, Arrow };