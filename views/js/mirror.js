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
}

function reflect(mirrors, v){
  let d = 100000;
  let o = null;
  let mirror = null;
  mirrors.forEach(m => {
    const dst = m.dist(v);
    if (dst < d){
      d = dst;
      o = v.copy().sub(m);
      mirror = m;
    }});
  return v.copy().sub(o.normalize()
          .mult(state.direction*Math.sqrt(2*d)));
}


function mouseClicked(){
  if (state.mouse !== null){
    state.mirrors.push(state.mouse);
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
  strokeWeight(2);
  noFill();

  state = {
    mouse: null,
    direction: 1,
    win,
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

  drawCirc(state.verts, 2);
  drawCirc(state.mirrors, 10);

}
