left.onclick = handlerButton("left");
down.onclick = handlerButton("down");
right.onclick = handlerButton("right");

const handlerButton = (type) => () => {
  alert(type);
};
