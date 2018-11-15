/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc
*/

let state;

function setup(){
  const win = vec(1000, 1000);
  angleMode(RADIANS);
  createCanvas(win.x, win.y);
  strokeWeight(4);
  noFill();

  state = {
    mouse: null,
    win,
    black: color('rgba(0, 0, 0, 0.8)'),
    red: color('rgba(255, 0, 0, 0.8)'),
    blue: color('rgba(0, 0, 255, 0.8)'),
    cyan: color('rgba(0, 255, 255, 0.3)'),
    gray: color('rgba(0, 0, 0, 0.3)'),
    green: color('rgba(0, 255, 0, 0.8)'),
    white: color('rgba(255, 255, 255, 1)'),
  };
}

function showPgram(start, a, b, f){
  noStroke();
  fill(f);
  drawPath([
    start,
    start.copy().add(a),
    start.copy().add(a).add(b),
    start.copy().add(b),
  ]);

  noFill();
  if (cross(a, b)<0){
    fill(state.black);
  }
  drawCirc([start.copy().add(a.copy().mult(0.5).add(b.copy().mult(0.5)))]);
  noFill();
}

function draw(){
  noFill();
  clear();
  const mouse = vec(mouseX, mouseY);

  const a0 = vec(500, 100);
  const a1 = vec(700, 800);
  const b0 = vec(250, 300);
  const b1 = mouse;

  const sa = a1.copy().sub(a0);
  const sb = b1.copy().sub(b0);
  const u = cross(sa, sb);


  if (Math.abs(u) <= 0){
    return;
  }

  const ba = a0.copy().sub(b0);

  const q = cross(sa, ba)/u;
  const p = cross(sb, ba)/u;

  console.log(p, q);

  strokeWeight(15);
  stroke((q>0 && q<1) ? state.blue: state.red);
  drawPath([a0, a1]);

  stroke((p>0 && p<1) ? state.blue: state.red);
  drawPath([b0, b1]);

  noStroke();
  showPgram(a0, sa, ba, state.red);
  showPgram(b0, sb, ba, state.green);
  showPgram(a0, sa, sb, state.gray);

  if (p >= 0 && p <= 1 && q >= 0 && q <= 1){
    fill(state.black);
    drawCirc([p5.Vector.lerp(a0, a1, p)], 60);
  }

}
