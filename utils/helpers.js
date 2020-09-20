const fs = require("fs");
const pathTest = "C:/Users/Lia/studying-neural-networks/utils/timing.json";
const { sortBy } = require("lodash");
const getHistory = () => {
  const history = fs.readFileSync("history.json");
  if (history.length) {
    return JSON.parse(history);
  }
  return null;
};

const getTiming = () => {
  const timing = fs.readFileSync(pathTest);
  if (timing.length) {
    return JSON.parse(timing);
  }
  return null;
};

let count = [];

exports.setHistory = (data) => {
  count.push(data);
  if (count.length > 5) {
    const history = getHistory();
    fs.writeFileSync(
      "history.json",
      JSON.stringify(history ? history.concat(count) : count)
    );
    count = [];
  }
};

exports.setTiming = async ({ typeFoot, servo, deg, value }) => {
  const currentFields = { servo, deg, value };
  let initialTiming = {
    currentTiming: {
      forward: {},
      right: {},
      left: {},
    },
    settingsTimer: {
      topLeft: [],
      topRight: [],
    },
  };

  let timing = await getTiming();
  try {
    if (timing && timing.settingsTimer) {
      const settingsTimer = timing.settingsTimer;
      const currentFoot = settingsTimer[typeFoot];
      // if yes wos delete
      if (currentFoot.length && deg === "remove") {
        const preparedCurrentFoot = currentFoot.filter(
          ({ value: currentValue }) => currentValue !== value
        );
        fs.writeFileSync(
          pathTest,
          JSON.stringify({
            ...timing,
            settingsTimer: {
              ...settingsTimer,
              [typeFoot]: sortBy(preparedCurrentFoot, "value"),
            },
          })
        );
        return;
      }
      // change
      if (
        currentFoot.length &&
        currentFoot.some(({ value: currentValue }) => value === currentValue)
      ) {
        const preparedCurrentFoot = currentFoot.map((item) =>
          item.value === value ? currentFields : item
        );
        fs.writeFileSync(
          pathTest,
          JSON.stringify({
            ...timing,
            settingsTimer: {
              ...settingsTimer,
              [typeFoot]: sortBy(preparedCurrentFoot, "value"),
            },
          })
        );
        return;
      }
      // add new
      if (currentFoot) {
        fs.writeFileSync(
          pathTest,
          JSON.stringify({
            ...timing,
            settingsTimer: {
              ...settingsTimer,
              [typeFoot]: sortBy([...currentFoot, currentFields], "value"),
            },
          })
        );
        return;
      }
      return;
    } else {
      initialTiming.settingsTimer[typeFoot] = [{ servo, deg, value }];
      fs.writeFileSync(pathTest, JSON.stringify(initialTiming));
      return;
    }
  } catch (error) {
    console.log({ error });
  }
};

const saveSettingsIn = async (type) => {
  let timing = await getTiming();
  if (timing && timing.settingsTimer) {
    fs.writeFileSync(
      pathTest,
      JSON.stringify({
        ...timing,
        currentTiming: {
          ...timing.currentTiming,
          [type]: timing.settingsTimer,
        },
      })
    );
  }
};

exports.saveSettingsIn = saveSettingsIn;
exports.getHistory = getHistory;
exports.getTiming = getTiming;
