/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc
*/

let state, mid, win;



function init(s, xy){
  state.verts = getBox(s.x, s.y, xy);
  state.path = getRange(state.verts.length);
  state.path.push(0);
  console.log(state);
}


function setup(){
  //win = vec(windowHeight, windowWidth);
  win = vec(1000, 1000);
  angleMode(RADIANS);
  createCanvas(win.x, win.y);
  strokeWeight(2);

  state = {
    mouse: null,
    win,
    selectedEdge: null,
    inside: v => v && (v.x>0 && v.x<win.x && v.y>0 && v.y<win.y),
  };

  init(win.copy().mult(0.1), win.copy().mult(0.5));
}

function lineDistance(mouse){
  let dst = 1000000;
  let pi = 0;
  let xy = vec(0, 0);
  for (let i=0; i<state.path.length-1; i++){
    distance = linePointDistance([state.verts[state.path[i]],
                                  state.verts[state.path[i+1]]], mouse);
    if (distance.dst < dst){
      dst = distance.dst;
      pi = i;
      xy = distance.xy;
    }
  }
  drawCirc([xy]);
  drawPath([xy, mouse]);
  return pi;
}


function extrudeEdge(pi){
  const numVerts = state.verts.length;
  const numEdges = state.path.length;

  const a = state.path[pi];
  const b = state.path[pi+1];
  const va = state.verts[a];
  const vb = state.verts[b];

  const angleVec = vb.copy().sub(va).normalize();
  const angle = Math.atan2(angleVec.y, angleVec.x)-HALF_PI;

  const mag = rndBetween(20, 100);
  const v = p5.Vector.fromAngle(angle).setMag(mag);

  if (random()<0.4){
    v.add(rndInCirc(mag*0.7));
  }

  state.verts.push(va.copy().add(v));
  state.verts.push(vb.copy().add(v));

  let newPath = state.path.slice(0, pi+1);
  newPath.push(numVerts);
  newPath.push(numVerts+1);
  newPath.push.apply(newPath, state.path.slice(pi+1));
  state.path = newPath;
}


function mouseClicked(){
  if (state.selectedEdge !== null){
    extrudeEdge(state.selectedEdge);
    state.selectedEdge = null;
  }
}

function draw(){
  const mouse = vec(mouseX, mouseY);

  clear();

  drawPath(state.path.map(i => state.verts[i]));

  state.selectedEdge = null;

  if (state.inside(mouse)){
    state.selectedEdge = lineDistance(mouse);
  }

  drawCirc(state.verts, 10);
}
