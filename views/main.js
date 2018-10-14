/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc
*/

let state, mid, win;



function init(n) {
  state.lines = linspace(n, 100, 900).map(x =>
    [vec(x, 100), vec(x, 900)]);
}


function setup() {
  //win = vec(windowHeight, windowWidth);
  win = vec(1000, 1000);
  angleMode(RADIANS);
  createCanvas(win.x, win.y);

  state = {
    mouse: null,
    win,
    inside: v => v && (v.x>0 && v.x<win.x && v.y>0 && v.y<win.y),
  };

  init(100);
}

function draw() {
  const mouse = vec(mouseX, mouseY);
  console.log(mouse);

  clear();

  if (state.inside(mouse) && state.inside(state.mouse)) {

    const cut = [mouse, state.mouse];
    const r = cut[1].copy(cut[0]).mag()*0.01;
    drawPath(cut);
    drawCirc(cut, r);

    let newLines = [];
    state.lines.forEach(p => {
      const isect = intersect(cut, p);
      if (isect.intersect) {

        //const v1 = p5.Vector.fromAngle(random(TWO_PI)).setMag(20);
        //const v2 = p5.Vector.fromAngle(random(TWO_PI)).setMag(20);

        const v1 = cut[1].copy().sub(cut[0]);
        const v2 = v1.copy().mult(-1);

        const mid = p5.Vector.lerp(cut[0], cut[1], isect.p);
        newLines.push([p[0], mid].map(v => v.copy().add(v1)));
        newLines.push([mid, p[1]].map(v => v.copy().add(v2)));
      } else {
        newLines.push(p);
      }
    });
    state.lines = newLines ;
  }

  state.lines.forEach(p => drawPath(p));

  fill('rgb(0, 255, 0)');
  //state.lines.forEach(p => drawCirc(p, 10));
  noFill();

  state.mouse = mouse;
}
