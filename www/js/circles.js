/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc
*/

let obj, mid, win;


function init(n) {
  // make some circles along a horizontal line.
  obj = linspace(n, 0, 1000).map(x => vec(x, 500));
}

function setup() {
  win = vec(1000, 1000);
  mid = win.copy().mult(0.5);

  //either filled or unfilled circles
  // fill(color('rgba(0,0,0,1)')
  // noFill()

  createCanvas(win.x, win.y);

  init(10);
}

function draw() {
  const mouse = vec(mouseX, mouseY);
  obj = obj.map(o => {
    // vector from mouse to circle
    const df = o.copy().sub(mouse);
    // lengt of df, multiplied by 0.2
    const l = df.mag()*0.2;
    // draw with random radius
    drawCirc([o], random(l));
    // take a small step in the direction of the mouse.
    // and add some randomness
    return o.copy().sub(df.normalize()).add(rndInCirc(5));
  });
}
