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
  let ind = null;
  let mirror = null;
  mirrors.forEach((m, i) => {
    const dst = m.dist(v);
    if (dst < d){
      d = dst;
      o = m.copy().sub(v);
      mirror = m;
      ind = i;
    }});
  if (ind == (mirrors.length-1)){
    //return mirror.copy().add(o);
    return v.copy().add(o.normalize()
            .mult(state.direction*Math.sqrt(d)));
  }
  return v;
}


function mouseClicked(){
  if (state.mouse !== null){
    state.mirrors.push(state.mouse);
    //state.mirrors = [state.mouse.copy()];
    state.verts = state.verts.map(v =>
      reflect(state.mirrors, v));
    state.direction *= -1;
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
    direction: 1,
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
  state.edges.forEach(e =>
    drawPath(e.map(v => state.verts[v])));

  stroke(state.cyanColor);
  strokeWeight(2);
  drawCirc(state.mirrors, 10);

}
