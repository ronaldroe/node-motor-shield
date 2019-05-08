# Node Motor Shield

Node-based implementation of SBCShop's [Python MotorShield library](https://github.com/sbcshop/MotorShield).

## Implementation Status

  - Class `Motor` :heavy_check_mark:
  - Class `LinkedMotors` :heavy_check_mark:
  - Class `Stepper` :x:
  - Class `Sensor` :x:
  - Class `Arrow` :heavy_check_mark:

  - Test_Motor :heavy_check_mark:
  - Stepper_Test :x:

  - GUI_Motor_Shield :x:

## Installation

```
npm install --save node-motor-shield
```

## Differences

Effort has been made to ensure this repository behaves identically to the Python version. 
Differences between the libraries are designed to add minor functionality without sacrificing compatibility.

  - ### Class `Motor`
    - `forward()` and `reverse()` may be called without a `speed` argument, which will cause the speed to default to `100`.
    - `test()` may be called without an argument, which acts as a toggle to the `testmode` state.
  - ### Class `LinkedMotors`
    - As in the `Motor` class, `forward()` and `reverse()` may be called without the speed argument, which will default the speed to `100`.
  - ### Motor Test
    - For now, the test only runs once, until I can figure out how to make it loop continuously, which will depend on making it block the next iteration until the last one finishes. JS sucks at things like that.
  - ### `sleep(ms)`
    - Mimics Python's `sleep()` function in a JS async function.
    - **NOTE:** `sleep()` must be called inside an asynchronous function, and used with the `await` operator.
    - Example:
```
(async function(){
  console.log('start');
  sleep(3000);
  console.log('done');
})()
```

The above will log "start", and after 3 seconds, will log "done".