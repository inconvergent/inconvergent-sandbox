/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc
*/

let mid, win;
let path;
let walker;


function setup() {
  colorMode(HSB);
  frameRate(30);

  // canvas size
  win = vec(1400, 1400);
  mid = win.copy().mult(0.5);

  createCanvas(win.x, win.y);

  path = [];
  for (var i=0;i<5;i++){
    path.push(rndInCirc(700, mid));
  }
  walker = mid.copy();
}


function draw() {
  noFill();
  //clear();

  strokeCap(SQUARE);

  strokeWeight(2);

  var mouse = walker.copy();

  var dst = 1000000;
  var index = -1;
  var position = null;
  for (var i=0; i<path.length-1;i++){
    var line = [path[i], path[i+1]];
    var res = linePointDistance(line, mouse);
    if (res.dst<dst){
      dst = res.dst;
      position = p5.Vector.lerp(line[0], line[1], res.s);
      index = i;
    }
  }

  var firstPath = path.slice(0, index+1);
  var lastPath = path.slice(index+1);

  var newPath = firstPath;
  firstPath.push(rndInCirc(60, position));
  lastPath.forEach(v => newPath.push(v));

  path = newPath;

  //stroke('red');
  //drawPath(firstPath);
  //stroke('green');
  //drawPath(lastPath);

  //stroke('white');
  //strokeWeight(15);
  //drawPath(path);
  //stroke('black');
  //strokeWeight(10);
  //drawPath(path);

  stroke('white');
  const weight = dst/10;
  strokeWeight(weight+3);
  drawPath([mouse, position]);

  stroke('black');
  strokeWeight(weight);
  drawPath([mouse, position]);

  stroke('black');

  walker.add(rndInCirc(100));

  if (walker.x<0 || walker.x>win.x || walker.y<0 || walker.y>win.y){
    walker = mid.copy();
  }
}

