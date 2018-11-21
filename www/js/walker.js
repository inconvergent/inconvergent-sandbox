/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc
*/

let state;


function init(n){
  const res = [];
  linspace(n, 100, 900).forEach(y => {
    res.push([vec(y, 100), vec(y, 900)]);
    res.push([vec(100, y), vec(900, y)]);
  });
  return res;
}


function setup(){
  const win = vec(1000, 1000);
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
    lines: init(50),
  };

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

  // every time state.walker is called we get a new position of the random
  // walker.
  const pos = state.walker();

  clear();

  if (state.inside(pos)){
    const cut = [pos, pos.copy().add(rndInCirc(20.0))];
    const res = [];
    state.lines.forEach(l => {
      const isect = intersect(cut, l);
      // only do something if l is longer than 20,
      // and there is an intersection
      if ((p5.Vector.dist(l[0], l[1]) > 20) && isect.intersect){
        // this is point where cut and l intersect
        const xy = p5.Vector.lerp(cut[0], cut[1], isect.p);
        // move this point randomly
        const rxy = rndInCirc(10, xy);

        //create two new lines from l and rxy
        res.push([l[0], rxy]);
        res.push([l[1], rxy]);
      } else {
        // keep the old l if there was no intersection
        res.push(l);
      }
    });
    state.lines = res;
  }

  state.lines.forEach(p => drawPath(p));

  drawCirc([pos], 10);

}
