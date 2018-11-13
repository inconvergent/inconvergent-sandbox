/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc
*/

let state;



function init(s, xy){
  // s denotes a percentage of the canwas.
  // xy is the middle of the canvas

  // get a box in the middle of the canvas.
  // width: s.x, height: s.y
  state.verts = getBox(s.x, s.y, xy);

  // make a path that denotes the order of the initial vertices.
  // the path starts and stops at the first vertex.
  // in this case [0, 1, 2, 3, 0]
  state.path = getRange(state.verts.length);
  state.path.push(0);
}


function setup(){
  const win = vec(1000, 1000);

  // use Radians (instead of angles from 0 to 360, angles go from 0 to 2pi
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
  let e = 0;
  let xy = vec(0, 0);

  // for every edge, calulate the distance to mouse
  for (let i=0; i<state.path.length-1; i++){
    distance = linePointDistance([state.verts[state.path[i]],
                                  state.verts[state.path[i+1]]], mouse);

    // if the new distance is closer than current closest distance, update.
    if (distance.dst < dst){
      dst = distance.dst;
      e = i;
      xy = distance.xy;
    }
  }

  // show a path to the closest edge
  drawCirc([xy]);
  drawPath([xy, mouse]);

  //retrun index of the (first vertex of the) edge
  return e;
}


function extrudeEdge(e){
  const numVerts = state.verts.length;

  // e is the index of the first vertex of the edge. so that the edge consists
  // of vertices state.path[e], and state.path[e+1]
  const a = state.path[e];
  const b = state.path[e+1];

  // get the actual vertices
  const va = state.verts[a];
  const vb = state.verts[b];

  // the vector between va and vb.
  // normalize to get a vector of length 1
  const angleVec = vb.copy().sub(va).normalize();

  // convert to the angle, and rotate it by pi*0.5 (equivalent to 90 degrees)
  const angle = Math.atan2(angleVec.y, angleVec.x)-HALF_PI;

  // get a number between 20 and 100
  const mag = rndBetween(20, 100);

  //convert the angle back to vector, of length mag
  const v = p5.Vector.fromAngle(angle).setMag(mag);

  // with a 40 percent probability, displace v inside a circle of radius
  // mag*0.7
  if (random()<0.4){
    v.add(rndInCirc(mag*0.7));
  }

  // add the vertices of the extruded edge
  state.verts.push(va.copy().add(v));
  state.verts.push(vb.copy().add(v));

  // now we split the existing path in two halves, and insert the new vertices

  // this is the first part of the path
  const newPath = state.path.slice(0, e+1);

  // add the new vertices
  newPath.push(numVerts);
  newPath.push(numVerts+1);

  // this is last part of the path.
  newPath.push.apply(newPath, state.path.slice(e+1));

  // update the path
  state.path = newPath;
}


function mouseClicked(){
  if (state.selectedEdge !== null){
    // if selectEdge exists, extrude that edge, and reset the selected edge.
    extrudeEdge(state.selectedEdge);
    state.selectedEdge = null;
  }
}

function draw(){
  const mouse = vec(mouseX, mouseY);

  clear();

  // draw the path
  drawPath(state.path.map(i => state.verts[i]));

  // if mouse is inside canvas, find the edge closest to the mouse.
  state.selectedEdge = null;
  if (state.inside(mouse)){
    state.selectedEdge = lineDistance(mouse);
  }

  drawCirc(state.verts, 10);
}
