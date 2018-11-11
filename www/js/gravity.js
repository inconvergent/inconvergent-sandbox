/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc
*/

let state, win;


function init(n, rad, xy){
  state.trails = [];
  for (let i=0; i<n; i++){
    // make n lists of trails inside radius rad. each list contains the trail
    // of a body as it moves. the last element is the most recent.
    state.trails.push([{
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

function step(trails){
  // most recent position of every body
  const curr = trails.map(b => last(b));

  // for every pair of body, calculate the forces between them
  for (let i=0 ; i<state.numBodies; i++){
    const acc = vec(0.0);
    for (let j=0 ; j<state.numBodies; j++){
      // don't do anything since there are no forces between a body and itself
      if (i===j){
        continue;
      }
      // the the vector between i and j
      const dx = curr[j].pos.copy().sub(curr[i].pos);
      // normalized the vector (so it has length 1)
      const ndx = dx.copy().normalize();

      // distance between i and j
      let dst = dx.mag();
      if (dst<0.01){
        dst = 0.01;
      }

      // sum up the acceleration between i and j
      acc.add(ndx.mult(1.0/dst*dst));
    }

    // the new velocity is the old velocity + the acceleration +
    // a little bit of randomness
    const vel = curr[i].vel.copy().add(acc).add(rndInCirc(1));
    // new position is the old position + the velocity (multiplied by step size)
    const pos = curr[i].pos.copy().add(vel.copy().mult(state.stpSize));
    // add the new position to the trail
    trails[i].push({pos, vel});

    // make sure each trail is at most maxLength long
    if (trails[i].length>state.maxLength){
      trails[i] = trails[i].slice(trails[i].length-state.maxLength);
    }
  }
}


function draw(){
  clear();

  step(state.trails);

  // draw bodies (only the last position of each trail)
  strokeWeight(3);
  drawCirc(state.trails.map(b => last(b).pos));

  // draw trails
  strokeWeight(1);
  state.trails.forEach(his => {
    drawPath(his.map(b => b.pos));
  });
}

