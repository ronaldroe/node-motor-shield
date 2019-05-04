# Node Motor Shield

Node-based implementation of SBCShop's [Python MotorShield library](https://github.com/sbcshop/MotorShield).

## Implementation Status

  - Class `Motor` :heavy_check_mark:
  - Class `LinkedMotors` :x:
  - Class `Stepper` :x:
  - Class `Sensor` :x:
  - Class `Arrow` :x:

  - Test_Motor :x:
  - Stepper_Test :x:

  - GUI_Motor_Shield :x:

## Differences

Effort has been made to ensure this repository behaves identically to the Python version. 
Differences between the libraries are designed to add minor functionality without sacrificing compatibility.

  - ### Class `Motor`
    - `forward()` and `reverse()` may be called without a `speed` argument, which will cause the speed to default to `100`.
    - `test()` may be called without an argument, which acts as a toggle to the `testmode` state.