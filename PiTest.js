const Gpio = require('pigpio').Gpio;
 
const led = new Gpio(21, {mode: Gpio.OUTPUT});
 
let dutyCycle = 0;

led.pwmWrite(50);
console.log(led.getPwmDutyCycle());

setTimeout(() => {
  led.pwmWrite(100);
  console.log(led.getPwmDutyCycle());
}, 2000);

setTimeout(() => {
  led.pwmWrite(255);
  console.log(led.getPwmDutyCycle());
}, 4000);

setTimeout(() => {
  led.pwmWrite(100);
  console.log(led.getPwmDutyCycle());
}, 6000);

setTimeout(() => {
  led.pwmWrite(0);
  console.log(led.getPwmDutyCycle());
}, 8000);
 
// setInterval(() => {
//   led.pwmWrite(dutyCycle);
 
//   dutyCycle += 5;
//   if (dutyCycle > 255) {
//     dutyCycle = 0;
//   }
// }, 20);