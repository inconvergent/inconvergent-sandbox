/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc
*/

let state, mid, win;



function init(s, xy){
  //state.lines = linspace(n, 100, 900).map(x =>
  //  [vec(x, 100), vec(x, 900)]);
  //
  state.verts = getBox(s.x, s.y, xy);
  state.path = getRange(state.verts.length-1);
  state.path.push(0);
  console.log(state);

}


function setup(){
  //win = vec(windowHeight, windowWidth);
  win = vec(1000, 1000);
  angleMode(RADIANS);
  createCanvas(win.x, win.y);

  state = {
    mouse: null,
    win,
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

function draw(){
  const mouse = vec(mouseX, mouseY);

  clear();

  drawPath(state.path.map(i => state.verts[i]));

  if (state.inside(mouse)){
    const pi = lineDistance(mouse);
  }

  //state.lines.forEach(p => drawPath(p));

  //fill('rgb(0, 255, 0)');
  //state.lines.forEach(p => drawCirc(p, 10));
  //noFill();

  //state.mouse = mouse;
}
