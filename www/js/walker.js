/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc
*/

let state, mid, win;



function init(n){
  state.lines = linspace(n, 100, 900).map(x =>
    [vec(x, 100), vec(x, 900)]);
}


function setup(){
  //win = vec(windowHeight, windowWidth);
  win = vec(1000, 1000);
  angleMode(RADIANS);
  createCanvas(win.x, win.y);
  strokeWeight(2);

  const stp = 5;

  state = {
    mouse: null,
    win,
    stp,
    walker: getWalker(win.copy().mult(0.5), stp),
    inside: v => v && (v.x>0 && v.x<win.x && v.y>0 && v.y<win.y),
  };

  init(50);
}


function getWalker(xy, stp){
  let pos = xy.copy();
  return function(){
    pos = pos.copy().add(rndInCirc(stp));
    return pos.copy();
  };
}


function mouseClicked(){
  const mouse = vec(mouseX, mouseY);
  state.walker = getWalker(mouse, state.stp);
}

function draw(){

  const pos = state.walker();

  clear();

  if (state.inside(pos)){
    const cut = [pos, pos.copy().add(rndInCirc(20.0))];
    const res = [];
    state.lines.forEach(l => {
      const isect = intersect(cut, l);
      if ((p5.Vector.dist(l[0], l[1]) > 20) && isect.intersect){
        const xy = p5.Vector.lerp(cut[0], cut[1], intersect.p);
        res.push([l[0], xy]);
        res.push([l[1], xy]);
      } else {
        res.push(l);
      }
    });
    state.lines = res;
  }

  state.lines.forEach(p => drawPath(p));

  drawCirc([pos], 10);

}
