/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc
*/

let state, mid, win;


function createBranch(pos, angle, steps=0, width=1){
  return {pos: [pos.copy()], angle: [angle.copy()], steps, width: [width]};
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
      // wiggle the angle. the wider the branch the less change in angle
      const newAngle = rndAngle((1-last(b.width))*0.1, last(b.angle));
      b.angle.push(newAngle);

      // step branch
      b.pos.push(last(b.pos).copy().add(newAngle));

      // decrease width
      b.width.push(Math.max(0, last(b.width)*0.997));

      // increment steps
      b.steps += 1;
      // create a new branch with a certain probability
      // the probability depends on the width, so that thinner branches
      // are more likely to create new branches
      prob((1-last(b.width))*0.01, () =>
        state.branches.push(
          createBranch(last(b.pos), last(b.angle).copy(), b.steps,
                       last(b.width)*0.72)));
    }
  });
}


function offsetAngle(tail, angleTail, widthTail, a){
  return tail.map((v, i) => {
    const offset = rotAngle(angleTail[i], a).mult(widthTail[i]);
    return v.copy().add(offset);
  });
}


function drawBranch(b){
  if (b.pos.length<2){
    return;
  }

  // two last elements of b.pos
  //const n = b.pos.length-2;

  // or draw all parts of branch
  const n = 0;

  const tail = b.pos.slice(n);
  const angleTail = b.angle.slice(n);
  const widthTail = b.width.slice(n).map(w => w*40);

  const width = last(b.width);

  // offset paths to both sides
  const leftPath = offsetAngle(tail, angleTail, widthTail, HALF_PI);
  // reverse, because we need to form a polygon
  const rightPath = offsetAngle(tail, angleTail, widthTail, -HALF_PI).reverse();

  // draw a background
  fill(color('rgb(255,255,255)'));
  noStroke();
  drawPath(leftPath.concat(rightPath));

  // draw outlines
  stroke(color('rgb(0,0,0)'));
  noFill();
  drawPath(leftPath);
  drawPath(rightPath);
}

function draw(){
  clear();
  animate();
  strokeWeight(2);
  state.branches.forEach(b => drawBranch(b));
}
