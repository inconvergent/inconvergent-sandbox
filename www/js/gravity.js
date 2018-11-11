/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc
*/

let state, win;


function init(n, rad, xy){
  state.bodies = [];
  for (let i=0; i<n; i++){
    state.bodies.push([{
      pos: rndInCirc(rad, xy=xy),
      vel: rndInCirc(10)}
    ]);
  }
}



function setup(){
  win = vec(1000, 1000);
  angleMode(RADIANS);
  createCanvas(win.x, win.y);
  noFill();

  state = {
    mouse: null,
    numBodies: 10,
    stpSize: 0.01,
    maxLength: 100,
    win,
  };

  init(state.numBodies, 150, win.copy().mult(0.5));
}

function step(bodies){
  const curr = bodies.map(b => last(b));
  for (let i=0 ; i<state.numBodies; i++){
    const acc = vec(0.0);
    for (let j=0 ; j<state.numBodies; j++){
      if (i===j){
        continue;
      }
      const dx = curr[j].pos.copy().sub(curr[i].pos);
      const ndx = dx.copy().normalize();

      let dst = dx.mag();
      if (dst<0.01){
        dst = 0.01;
      }
      acc.add(ndx.mult(1.0/dst*dst));
    }

    const vel = curr[i].vel.copy().add(acc).add(rndInCirc(1));
    const pos = curr[i].pos.copy().add(vel.copy().mult(state.stpSize));
    const o = {pos, vel};
    bodies[i].push(o);

    if (bodies[i].length>state.maxLength){
      bodies[i] = bodies[i].slice(bodies[i].length-state.maxLength);
    }
  }
}


function draw(){
  clear();

  step(state.bodies);

  strokeWeight(3);
  drawCirc(state.bodies.map(b => last(b).pos));

  strokeWeight(1);
  state.bodies.forEach(his => {
    drawPath(his.map(b => b.pos));
  });
}
