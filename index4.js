var { Board, Servo } = require("johnny-five");
var { sortBy } = require("lodash");

const {
  setHistory,
  getHistory,
  setTiming,
  getTiming,
  saveSettingsIn,
} = require("./utils/helpers");

var board = new Board({
  port: "COM5",
});
let intervalCount;
const controller = "PCA9685";
const INTERVAL_COUNT = 1000;
const TIME_INTERVAL = 5;
let time = 0;

board.on("ready", function () {
  this.onLeft = new Servo({
    controller,
    pin: 0,
    startAt: 0,
  });

  this.topLeftOne = new Servo({
    controller,
    pin: 0,
    startAt: 0,
  });

  this.topLeftTwo = new Servo({
    controller,
    pin: 1,
    startAt: 0,
  });

  this.oneRight = new Servo({
    controller,
    pin: 2,
    startAt: 0,
  });

  this.topRightTwo = new Servo({
    controller,
    pin: 3,
    startAt: 0,
  });

  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.setRawMode(true);

  const handleRun = ({ servo, deg, value }) => {
    if (servo && time === value) {
      // setHistory({ servo, deg, value });
      this[servo].to(deg);
    }
  };

  this.handleFoot = (servos) => {
    servos.forEach(handleRun);
  };

  const handleOnStart = (timing) => {
    intervalCount = setInterval(() => {
      Object.keys(timing).forEach((key) => this.handleFoot(timing[key]));
      time += 1;
      if (time === TIME_INTERVAL) {
        time = 0;
      }
    }, INTERVAL_COUNT);
  };

  const handlerSetFoot = async (typeFoot, numberServo, deg, value) => {
    clearInterval(intervalCount);
    if (numberServo) {
      await setTiming({
        typeFoot,
        servo: `${typeFoot}${numberServo}`,
        deg,
        value,
      });
    }
    const getCurrentTiming = await getTiming();
    if (getCurrentTiming && getCurrentTiming.settingsTimer) {
      if (getCurrentTiming.settingsTimer[typeFoot]) {
        console.log(sortBy(getCurrentTiming.settingsTimer[typeFoot], "value"));
      }
      handleOnStart(getCurrentTiming.settingsTimer);
    }
  };
  this.repl.inject({
    // Allow limited on/off control access to the
    // Led instance from the REPL.
    saveSettings: (type) => {
      saveSettingsIn(type);
      return `save settings in ${type}`;
    },
    start: (type) => {
      const getCurrentTiming = getTiming();
      if (getCurrentTiming.currentTiming) {
        clearInterval(intervalCount);
        handleOnStart(getCurrentTiming.currentTiming[type]);
      }
      return "start";
    },

    stop: () => {
      clearInterval(intervalCount);
      return "stop";
    },
    getTimingSettings: () => {
      const getCurrentTiming = getTiming();
      if (getCurrentTiming && getCurrentTiming.settingsTimer) {
        handleOnStart(getCurrentTiming.settingsTimer);
      }
    },
    setFoot: (...args) => {
      handlerSetFoot(...args);
    },
  });
});
