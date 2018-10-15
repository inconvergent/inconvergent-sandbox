/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc, sqrt, PI, TWO_PI
*/



// MATH

function linspace(n, mi, ma) {
  let res = [];
  const s = (ma - mi) / (n-1);
  let y = mi;
  for (let i = 0; i < n; i++) {
    res.push(y);
    y += s;
  }
  return res;
}

function ease(t) {
  return (t<0.5) ? 16.0*t*t*t*t*t : 1.0+16.0*(--t)*t*t*t*t;
}


// VEC

function vec(x, y) {
  return createVector(x, y || x);
}

function zero() {
  return vec(0);
}

function box(w, h, v) {
   return [vec(v.x - w, v.y - h),
           vec(v.x + w, v.y - h),
           vec(v.x + w, v.y + h),
           vec(v.x - w, v.y + h),
           vec(v.x - w, v.y - h)];
}

function intersect(aa, bb) {
  const a0 = aa[0];
  const a1 = aa[1];
  const b0 = bb[0];
  const b1 = bb[1];

  const sa = a1.copy().sub(a0);
  const sb = b1.copy().sub(b0);
  const u = (-sb.x * sa.y) + (sa.x * sb.y);

  if (Math.abs(u) < 0.0000001) {
    // almost parallel;
    return {intersect: false, p: null, q: null};
  }

  const q =  ((-sa.y * (a0.x - b0.x)) +
              ( sa.x * (a0.y - b0.y))) / u;

  const p =  ((sb.x * (a0.y - b0.y)) -
              (sb.y * (a0.x - b0.x))) / u;

  return {intersect: (p >= 0 && p <= 1 && q >= 0 && q <= 1), p, q};
}


// function rot(s, angle) {
//   const r = Math.atan2(s.y, s.x) + angle;
//   return vec(Math.cos(r), Math.sin(r));
// }

// function angleToVec(a) {
//   return vec(Math.cos(a), Math.sin(a));
// }


// RANDOM

let rnd = {};

rnd.inCirc = function(rad, xy=vec(0.0)) {
  let a = random(TWO_PI);
  let r = rad * sqrt(random(1));
  return vec(xy.x + r * cos(a), xy.y + r * sin(a));
};



// DRAW

//let drawing = {};

function drawPath(path) {
  noFill();
  beginShape();
  path.forEach(v => {
    if (v) {
      vertex(v.x, v.y);
    }});
  endShape();
}


function drawCirc(path, rad=10) {
  path.forEach(v => {
    if (v) {
      ellipse(v.x, v.y, rad, rad);
    }});
}

