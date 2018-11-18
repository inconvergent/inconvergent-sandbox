/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc
*/

let state, mid, win;


function init(n){
  state.verts = [];
  linspace(n, 50, 950).forEach(x =>
    linspace(n, 50, 950).forEach(y =>
      state.verts.push(vec(x, y))));

  let edgeSet = new Set();
  let edges = {};
  let c = 0;

  function compareAdd(a) {
    const v = getInd(a);
    if (!edgeSet.has(v)) {
      edgeSet.add(v);
      edges[v] = 0;
      c += 1;
    }
  }

  for (let i=1; i<n-1; i++) {
    for (let j=1; j<n-1; j++) {
      const a = i*n+j;
      compareAdd([a, a-1]);
      compareAdd([a, a-n]);
      compareAdd([a, a+n]);
      compareAdd([a, a+1]);
      compareAdd([a, a-n-1]);
      compareAdd([a, a-n+1]);
      compareAdd([a, a+n-1]);
      compareAdd([a, a+n+1]);
    }
  }

  state.edges = edges;
  state.numEdges = c;
  console.log(c);
}


//function mouseClicked(){
//  if (state.mouse !== null){
//    state.mirrors.push(state.mouse);
//    //state.mirrors = [state.mouse.copy()];
//    if (state.mirrors.length > 1) {
//      state.verts = state.verts.map(v =>
//        reflect(state.mirrors, v));
//    }
//  }
//  console.log(state.mouse);
//}


function setup(){
  win = vec(1000, 1000);
  angleMode(RADIANS);
  createCanvas(win.x, win.y);
  noFill();

  strokeCap(SQUARE);
  state = {
    mouse: null,
    win,
    black: color('rgba(0, 0, 0, 1)'),
    lightColor: color('rgba(0, 0, 0, 0.5)'),
    cyanColor: color('rgb(0, 180, 180)'),
    inside: v => v && (v.x>0 && v.x<win.x && v.y>0 && v.y<win.y),
  };

  init(50);
}

function diminish(){
  Object.keys(state.edges).forEach(i => {
    state.edges[i] = Math.max(state.edges[i]*0.995, 0);
  });
}

function lineDistance(mouse){
  let dst = 1000000;
  let xy = vec(0, 0);
  let ind = null;
  const verts = state.verts;
  Object.keys(state.edges).forEach(i => {
    const e = revInd(i);
    distance = linePointDistance([verts[e[0]], verts[e[1]]], mouse);
    if (distance.dst < dst){
      dst = distance.dst;
      xy = distance.xy;
      ind = i;
    }
  });

  //strokeWeight(1);
  //drawCirc([mouse]);
  //stroke(state.lightColor);
  //drawPath([xy, mouse]);
  state.edges[ind] += 10;
}

function draw(){
  const mouse = vec(mouseX, mouseY);

  clear();

  if (state.inside(mouse)){
    state.mouse = mouse;
    lineDistance(mouse);
  }

  diminish();

  //strokeWeight(1);
  //stroke(state.lightColor);
  //drawCirc(state.verts, 2);

  stroke(state.lightColor);
  Object.keys(state.edges).forEach(i => {
    const w = state.edges[i];
    if (w<0.5){
      return;
    }
    strokeWeight(state.edges[i]);
    const e = revInd(i);
    drawPath(e.map(v => state.verts[v]));
  });
}

