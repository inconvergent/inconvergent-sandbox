/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse, 
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc
*/

let obj, mid, win;


function animate() {
  const mouse = new vec(mouseX, mouseY);
  obj = obj.map(o => {
    const df = o.sub(mouse);
    const l = df.len()*0.2;
    o.draw(random(l))
    return o.sub(df.norm()).add(rndInCirc(5));
  });
}

function init(n) {
  // for (let i=0; i < n ; i++) {
  //   obj.push(new rndInCirc(500, mid));
  // }
  obj = linspace(n, 0, 1000).map(x => new vec(x, 500))
}

function setup() {
  //win = new vec(windowHeight, windowWidth);
  win = new vec(1000, 1000);
  mid = win.scale(0.5);
  
  // noFill()
  
  createCanvas(win.x, win.y);
  
  init(10);
}

function draw() {
  animate();
}
