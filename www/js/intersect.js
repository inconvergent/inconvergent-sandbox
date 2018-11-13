/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc
*/

let state;


function init(n){
  state.lines = linspace(n, 100, 900).map(x =>
    [vec(x, 100), vec(x, 900)]);

  Array.prototype.push.apply(state.lines ,
    linspace(n, 100, 900).map(y =>
      [vec(100, y), vec(900, y)]));
}


function setup(){
  const win = vec(1000, 1000);
  angleMode(RADIANS);
  createCanvas(win.x, win.y);
  strokeWeight(2);

  state = {
    mouse: null,
    win,
    inside: v => v && (v.x>0 && v.x<win.x && v.y>0 && v.y<win.y),
  };

  init(100);
}

function draw(){
  const mouse = vec(mouseX, mouseY);

  clear();

  if (state.inside(mouse) && state.inside(state.mouse)){

    // cut from the previous position to current positon (mouse)
    const cut = [mouse, state.mouse];

    // show position of mouse
    drawCirc([state.mouse], 15);

    let newLines = [];

    // look for an intersection between cut and every line
    state.lines.forEach(line => {

      // checks for intersections
      const isect = intersect(cut, line);
      if (isect.intersect){

        // alternate vectors. try this.
        //const v1 = p5.Vector.fromAngle(random(TWO_PI)).setMag(20);
        //const v2 = p5.Vector.fromAngle(random(TWO_PI)).setMag(20);

        // this vector points in the same as the cut vector
        // (and it has the same length)
        const v1 = cut[1].copy().sub(cut[0]);
        // this vector points in the oposite direction
        const v2 = v1.copy().mult(-1);

        // lerp is the linear interpolation between its arguments.  that is, it
        // returns the position p between arguments a (line[0]) and b
        // (line[1]).  for instance, if p is 0.2, it will return the position
        // 20 percent from a on the way to b.
        //
        // mid is the point on line where cut intersects.
        const mid = p5.Vector.lerp(line[0], line[1], isect.q);

        // make two new lines, and move each new line in the direction of v1
        // and v2, respectively
        newLines.push([line[0], mid].map(v => v.copy().add(v1)));
        newLines.push([mid, line[1]].map(v => v.copy().add(v2)));

      } else {
        // if there is no intersection, keep the original line
        newLines.push(line);
      }
    });

    // update the state with all new (and old) lines.
    state.lines = newLines ;
  }

  // draw all lines
  state.lines.forEach(line => drawPath(line));

  // store the mose position for the next iteration
  state.mouse = mouse;
}
