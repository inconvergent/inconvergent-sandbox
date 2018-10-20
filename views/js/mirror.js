/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc
*/

let state, mid, win;



function init(n, m){
  state.mirrors = [];
  state.verts = [];
  linspace(n, 100, 900).forEach(x =>
    linspace(n, 100, 900).forEach(y =>
      state.verts.push(vec(x, y))));

  let edgeSet = new Set();
  let edges = [];

  function compareAdd(a) {
    v = JSON.stringify(a.sort());
    if (!edgeSet.has(v)) {
      edgeSet.add(v);
      edges.push(a);
    }
  }

  for (let i=1; i<n-1; i++) {
    for (let j=1; j<n-1; j++) {
      const a = i*n+j;
      compareAdd([a, a-1]);
      compareAdd([a, a-n]);
      compareAdd([a, a+n]);
      compareAdd([a, a+1]);
    }
  }

  state.edges = edges;
  console.log(state.edges.length);
}

function reflect(mirrors, v){
  let d = 100000;
  let o = null;
  let s = 0;
  let ind = -1;

  for (let i=0; i<state.mirrors.length-1; i++){
    const mirror = [state.mirrors[i], state.mirrors[i+1]];
    const res = linePointDistance(mirror, v);
    if (res.dst<d){
      o = p5.Vector.lerp(mirror[0], mirror[1], res.s);
      d = res.dst;
      s = res.s;
      ind = i;
    }
  }

  if (ind===(state.mirrors.length-2) && (s>0.0 && s<1.0)){
    return o.copy().add(o.copy().sub(v));
  }
  return v;
}


function mouseClicked(){
  if (state.mouse !== null){
    state.mirrors.push(state.mouse);
    //state.mirrors = [state.mouse.copy()];
    if (state.mirrors.length > 1) {
      state.verts = state.verts.map(v =>
        reflect(state.mirrors, v));
    }
  }
  console.log(state.mouse);
}


function setup(){
  win = vec(1000, 1000);
  angleMode(RADIANS);
  createCanvas(win.x, win.y);
  noFill();

  state = {
    mouse: null,
    win,
    lightColor: color('rgba(0, 0, 0, 0.5)'),
    cyanColor: color('rgb(0, 180, 180)'),
    inside: v => v && (v.x>0 && v.x<win.x && v.y>0 && v.y<win.y),
  };

  init(100, 20);
}

function draw(){
  const mouse = vec(mouseX, mouseY);

  clear();

  if (state.inside(mouse)){
    state.mouse = mouse;
  }


  strokeWeight(1);
  stroke(state.lightColor);
  drawCirc(state.verts, 2);

  //stroke(state.lightColor);
  //state.edges.forEach(e =>
  //  drawPath(e.map(v => state.verts[v])));

  stroke(state.cyanColor);
  strokeWeight(2);
  drawPath(state.mirrors);
  drawCirc(state.mirrors, 10);

}
