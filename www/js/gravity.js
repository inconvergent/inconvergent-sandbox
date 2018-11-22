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
  strokeCap(SQUARE);
  noFill();

  state = {
    mouse: null,
    numBodies: 10,
    stpSize: 0.01,
    maxLength: 100,
    win,
    inside: v => v && (v.x>0 && v.x<win.x && v.y>0 && v.y<win.y),
  };

  init(state.numBodies, 300, win.copy().mult(0.5));
}

function getAcc(a, b){
  // the the vector from a to b
  const dx = b.copy().sub(a);
  // normalized the vector (so it has length 1)
  const ndx = dx.copy().normalize();

  // distance between i and j
  let dst = dx.mag();
  if (dst<10){
    dst = 10;
  }
  // sum up the acceleration between i and j
  return ndx.mult(1.0/(dst*dst));
}


function step(trails, mouse){
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
      acc.add(getAcc(curr[i].pos, curr[j].pos).mult(5000));
    }

    if (state.inside(mouse)){
      acc.add(getAcc(curr[i].pos, mouse).mult(10000));
    }

    // the new velocity is the old velocity + the acceleration +
    // a little bit of randomness
    // multiply by 0.999 to keep the velocity from growing too high.
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

  const mouse = vec(mouseX, mouseY);

  step(state.trails, mouse);

  // draw bodies (only the last position of each trail)
  strokeWeight(3);
  drawCirc(state.trails.map(b => last(b).pos));

  // draw trails
  strokeWeight(1);
  state.trails.forEach(his => {
    const path = his.map(b => b.pos);
    //curve = getRange(0, path.length).map(i => kappa(path, i));
    //for (let i=0; i<path.length-1;i++){
    //  strokeWeight(Math.min(10, curve[i]*1000));
    //  drawPath([path[i], path[i+1]]);
    //}
    drawPath(path);
    //console.log()
  });
}

