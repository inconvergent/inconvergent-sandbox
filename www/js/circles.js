/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc
*/

let obj, mid, win;


function init(n) {
  obj = linspace(n, 0, 1000).map(x => new vec(x, 500));
}

function setup() {
  win = new vec(1000, 1000);
  mid = win.copy().mult(0.5);
  // noFill()

  createCanvas(win.x, win.y);

  init(10);
}

function draw() {
  const mouse = new vec(mouseX, mouseY);
  obj = obj.map(o => {
    const df = o.copy().sub(mouse);
    const l = df.mag()*0.2;
    drawCirc([o], random(l));
    return o.copy().sub(df.normalize()).add(rndInCirc(5));
  });
}
