var fs = require("fs");
const { createCanvas } = require("canvas");
const canvas = createCanvas(200, 500, "svg");
let ctx = canvas.getContext("2d");

const pathMotion = [
  {
    x: 0,
    y: 0,
  },
  {
    x: 2,
    y: 20,
  },
  {
    x: 5,
    y: 20,
  },
];

const writePathRobot = (path) => {
  // Use the normal primitives.
  ctx.beginPath();
  ctx.moveTo(0, 0);
  pathMotion.forEach(({ x, y }) => ctx.lineTo(x, y));
  ctx.stroke();
  fs.writeFileSync("out.svg", canvas.toBuffer());
};

writePathRobot(pathMotion);
