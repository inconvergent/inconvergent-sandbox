/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc
*/

let state, mid, win;


function createBranch(pos, angle, steps=0){
  return {pos: [pos.copy()], angle: [angle.copy()], steps};
}


function init(pos){
  angle = vec(0, -1);
  state.branches = [createBranch(pos, angle)];
}


function setup(){
  win = vec(1000, 1000);
  angleMode(RADIANS);
  createCanvas(win.x, win.y);

  state = {
    win,
    branches: null,
    maxSteps: 850,
    //inside: v => v && (v.x>0 && v.x<win.x && v.y>0 && v.y<win.y),
  };

  // crate tree in the middle of the canvas, near the bottom.
  init(vec(win.x*0.5, 950));
}

function animate(){
  // animate active remaining branches
  const maxSteps = state.maxSteps;
  state.branches
    .forEach(b => {
    // branches that have fewer than maxSteps are still active
    if (b.steps<maxSteps){
      b.pos.push(last(b.pos).copy().add(last(b.angle)));
      // wiggle the angle. the higher the step count, the greater the
      // potential change in angle
      b.angle.push(rndAngle(b.steps/maxSteps*0.1, last(b.angle)));
      // increment steps
      b.steps += 1;
      // create a new branch with a certain probability
      // the probability depends on the number of steps so
      // that a higher step count increases the probability
      prob((maxSteps-b.steps)/maxSteps*0.009, () =>
        state.branches.push(
          createBranch(last(b.pos), last(b.angle).copy(), b.steps)));
    }
  });
}

function drawBranch(b){
  const angle = last(b.angle);
  const left = rotAngle(angle, HALF_PI).mult(20);
  const right = rotAngle(angle, -HALF_PI).mult(20);
  const n = b.pos.length-2;

  const leftPath = b.pos.slice(n).map(v => v.copy().add(left));
  const rightPath = b.pos.slice(n).map(v => v.copy().add(right)).reverse();

  fill(color('rgb(255,0,255)'));
  noStroke();
  drawPath(leftPath.concat(rightPath));

  stroke(color('rgb(0,0,0)'));
  noFill();
  drawPath(leftPath);
  drawPath(rightPath);
}

function draw(){
  //const mouse = vec(mouseX, mouseY);
  //clear();
  animate();

  strokeWeight(3);

  state.branches.forEach(b => drawBranch(b));
}
