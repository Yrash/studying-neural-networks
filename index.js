var { Board, Servo } = require("johnny-five");
var board = new Board({
  port: "COM5",
});

const controller = "PCA9685";
const INTERVAL_COUNT = 1000;
const TIME_INTERVAL = 5;
const timing = [
  [
    { servo: "oneLeft", deg: 0,  value: 0 },
    { servo: "twoLeft", deg: 0, value: 1 },
    { servo: "oneLeft", deg: 180, value: 2 },
    { servo: "twoLeft", deg: 60, value: 3 },
  ],
];
let time = 0;

board.on("ready", function () {
  this.onLeft = new Servo({
    controller,
    pin: 0,
    startAt: 0,
  });

  this.oneLeft = new Servo({
    controller,
    pin: 0,
    startAt: 0,
  });

  this.twoLeft = new Servo({
    controller,
    pin: 1,
    startAt: 0,
  });

  this.oneRight = new Servo({
    controller,
    pin: 2,
    startAt: 0,
  });

  this.twoRight = new Servo({
    controller,
    pin: 3,
    startAt: 0,
  });

  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.setRawMode(true);

  const handleRun = ({ servo, deg, value }) => {
    if (servo && time === value) {
      console.log(
        `this servo ${servo} is running on ${deg}: deg and current time ->${time}`
      );
      this[servo].to(deg);
    }
  };

  this.handleFoot = (servos) => {
    servos.forEach(handleRun);
  };

  const intervalCount = setInterval(() => {
    timing.forEach(this.handleFoot);
    time += 1;
    if (time === TIME_INTERVAL) {
      time = 0;
    }
  }, INTERVAL_COUNT);
});
