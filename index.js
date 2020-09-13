var { Board, Servo } = require("johnny-five");
var board = new Board({
  port: "COM5",
});
const controller = "PCA9685";

board.on("ready", function () {
  console.log(
    "Use Up and Down arrows for CW and CCW respectively. Space to stop."
  );
  var servo = new Servo({
    controller,
    pin: 0,
  });
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.setRawMode(true);

  process.stdin.on("keypress", function (ch, key) {
    if (!key) {
      // if no key is pressed, return i.e do nothing.
      return;
    }
    if (key.name === "q") {
      console.log("Quitting");
      process.exit();
    } else if (key.name === "up") {
      console.log("CW");
      servo.to(180);
    } else if (key.name === "down") {
      console.log("CCW");
      servo.to(60);
    } else if (key.name === "space") {
      console.log("Stopping");
      servo.to(0);
    }
  });
});
