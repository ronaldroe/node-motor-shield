# Node Motor Shield

Node-based implementation of SBCShop's [Python MotorShield library](https://github.com/sbcshop/MotorShield).

## Implementation Status

  - Class `Motor` :heavy_check_mark:
  - Class `LinkedMotors` :heavy_check_mark:
  - Class `Stepper` :heavy_check_mark:
  - Class `Sensor` :x:
  - Class `Arrow` :heavy_check_mark:

  - Test_Motor :heavy_check_mark:
  - Stepper_Test :heavy_check_mark:

  - GUI_Motor_Shield :x:

## Installation

```
npm install --save node-motor-shield
```

Alternatively, download the package and include `PiMotor.js` in your project's directory.

## Usage

**NOTE:** In order to use the included `sleep()` function, routines must be wrapped in an async function (see example under Differences and Notes section). Alternatively, packages like [sleep](https://www.npmjs.com/package/sleep) can be used to stop the thread for a specified length of time.

Include the library like so:

```
// From npm:
const PiMotor = require('node-motor-shield');
// From PiMotor.js:
const PiMotor = require('./PiMotor.js');
```

Instance the class you want and use it to control the motors.

```
const motor1 = new PiMotor.Motor('MOTOR1', 1);

motor1.forward(75); // Drives motor #1 forward at 75% speed.
```

Arguments are the same as the [Python MotorShield library](https://github.com/sbcshop/MotorShield). See `Test_Motor.js` and `Stepper_Test.js` for more examples, and the [MotorShield Python Docs](https://sbcshop.github.io/MotorShield/) for more information on how to use the library.

## Differences and Notes

Effort has been made to ensure this repository behaves identically to the Python version. 
Differences between the libraries are designed to add minor functionality without sacrificing compatibility.

  - ### Class `Motor`
    - `forward()` and `reverse()` may be called without a `speed` argument, which will cause the speed to default to `100`.
    - `test()` may be called without an argument, which acts as a toggle to the `testmode` state.
  - ### Class `LinkedMotors`
    - As in the `Motor` class, `forward()` and `reverse()` may be called without the speed argument, which will default the speed to `100`.
  - ### Motor Test
    - For now, the test only runs once, until I can figure out how to make it loop continuously, which will depend on making it block the next iteration until the last one finishes. JS sucks at things like that.
  - ### Class `Stepper`
    - **NOTE:** Delay times are in full seconds to align with the original library's API.
  - ### Stepper Test
    - As with Motor Test, only runs once. 
    - Added a stop call to the function so the motor will stop running after the test.
  - ### `sleep(ms)`
    - Mimics Python's `sleep()` function in a JS async function.
    - Delays are in JS standard milliseconds, rather than Python's full seconds.
    - **NOTE:** `sleep()` must be called inside an asynchronous function, and used with the `await` operator.
    - Example:
```
(async function(){
  console.log('start');
  await sleep(3000); // 3 seconds
  console.log('done');
})()
```

The above will log "start", and after 3 seconds, will log "done".