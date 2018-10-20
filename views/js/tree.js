/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc
*/

let state, mid, win;


function createBranch(pos, angle, steps=0){
  return {pos: [pos.copy()], angle: angle.copy(), steps};
}



function init(pos){
  angle = vec(0, -1);
  state.branches = [createBranch(pos, angle)];
}


function setup(){
  win = vec(1000, 1000);
  angleMode(RADIANS);
  createCanvas(win.x, win.y);
  noFill();

  state = {
    mouse: null,
    win,
    inside: v => v && (v.x>0 && v.x<win.x && v.y>0 && v.y<win.y),
  };

  const bottom = vec(win.x*0.5, 900);
  init(bottom);
}

function last(l){
  return l[l.length-1];
}

function animate(){

  // animate remaining branches
  state.branches
    .forEach(b => {
    if (b.steps<800){
      b.pos.push(last(b.pos).copy().add(b.angle));
      b.angle.add(rndInCirc(b.steps/800*0.2)).normalize();
      b.steps += 1;
      prob((800-b.steps)/800*0.009, () =>
        state.branches.push(createBranch(last(b.pos), b.angle.copy(), b.steps)))
    }
  });
}

function draw(){
  const mouse = vec(mouseX, mouseY);

  clear();

  animate();

  strokeWeight(50);
  stroke(color('rgba(0, 0, 0, 0.5)'))

  state.branches
       .map(b => b.pos)
       .forEach(b => drawPath(b));

}
