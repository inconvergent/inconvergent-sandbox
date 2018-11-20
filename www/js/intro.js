/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc
*/

// some global variables that can be accessed by all functions below.
let state, mid, win;


function setup() {
  // setup is automatically executed before everything else.
  //
  // use a setup to initialize the canvas, as well as to
  // assign values to other variables you will need for your sketch.
  //
  // p5.js functions must be called from inside setup(), or draw(). otherwise
  // they are undefined

  // canvas size
  win = vec(1000, 1000);

  // the coordinate of the middle of the canvas
  mid = win.copy().mult(0.5);

  // make the canvas of size win
  createCanvas(win.x, win.y);
}

function draw() {
  //the draw function is called for every animation step automatically.
  //if you want to clear the canvas between each time step use: clear()
  //
  //see what happens of you comment this in or out:
  //clear();

  // get the coordinate of the mouse pointer
  const mouse = vec(mouseX, mouseY);

  // draw a circle at the moise position.
  drawCirc([mouse]);

  //state = state.points.map(o => {
  //});
}
