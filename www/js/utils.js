/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc, sqrt, PI, TWO_PI
*/


function getInd(v){
  return JSON.stringify(v.sort());
}

function revInd(v){
  return JSON.parse(v);
}


// MATH

function linspace(n, mi, ma){
  // get n numbers evenly distributed between (mi, ma).
  // includes the end values.
  const res = [];
  const s = (ma - mi) / (n-1);
  let y = mi;
  for (let i = 0; i < n; i++){
    res.push(y);
    y += s;
  }
  return res;
}

function getRange(a, b=null){
  // get integers from 0 to a-1, or from a to b-1 if b is not null.
  if (b === null){
    b = a;
    a = 0;
  }

  const res = [];
  for (let i=a; i<b; i++){
    res.push(i);
  }
  return res;
}

function last(l, i=1){
  // get last element of l, (or null)
  // use i to get second last element and so forth.
  return l.length>(i-1) ? l[l.length-i] : null;
}


function cross(a, b){
  return (a.x * b.y) - (b.x * a.y);
}

// VEC

function vec(x, y=null){
  // create a vector (x, y). if y is not provided, the vector will be
  // (x, x).
  return createVector(x, y || x);
}

function zero(){
  // zero vector
  return vec(0);
}

function getBox(ww, hh, v, closed=false){
  // returns a box of width ww and height hh, centered at v.
  const w = ww*0.5;
  const h = hh*0.5;
  const res = [vec(v.x - w, v.y - h), vec(v.x + w, v.y - h),
             vec(v.x + w, v.y + h), vec(v.x - w, v.y + h)];
  if (closed){
    res.push(res[0].copy());
  }
  return res;
}

function intersect(aa, bb){
  // tests whether lines aa and bb intersect.
  // if they intersect, it returns p and q so that
  // p5.Vector.lerp(aa[0], aa[1], p), and
  // p5.Vector.lerp(bb[0], bb[1], q) is the intersection point.
  const a0 = aa[0];
  const a1 = aa[1];
  const b0 = bb[0];
  const b1 = bb[1];

  const sa = a1.copy().sub(a0);
  const sb = b1.copy().sub(b0);
  const u = cross(sa, sb);

  // this is just a safe-guard so we do not divide by zero below.
  // it is not a good way to test for parallel lines
  if (Math.abs(u) <= 0){
    return {intersect: false, p: null, q: null};
  }

  const ba = a0.copy().sub(b0);
  const q = cross(sa, ba)/u;
  const p = cross(sb, ba)/u;

  return {intersect: (p >= 0 && p <= 1 && q >= 0 && q <= 1), p, q};
}


function linePointDistance(line, v){
  // find the closest point on line to point v.
  // returns the distance (dst) and s, so that
  // p5.Vector.lerp(line[0], line[1], s) is the point on line closest to v.
  const va = line[0];
  const vb = line[1];
  const l2 = Math.pow(p5.Vector.dist(va, vb), 2.0);

  // line is a point
  if (l2 <= 0){
    return {dst: p5.Vector.dist(v, va), s: 0.0, xy: va.copy()};
  }

  const s = min(1, max(0, (((v.x - va.x) * (vb.x - va.x)) +
                           ((v.y - va.y) * (vb.y - va.y))) / l2));
  const xy = p5.Vector.lerp(va, vb, s);
  return {dst: p5.Vector.dist(v, xy), s, xy};
}

function rotAngle(a, r){
  return p5.Vector.fromAngle(Math.atan2(a.y, a.x)+r);
}


function ddxy(path, i){
  const n = path.length;
  const s = 2/(n-1);
  const pl = path[i+1];
  const pm = path[i];
  const pr = path[i-1];
  return {
    d: pr.copy().sub(pl).mult(s),
    dd: pr.copy().add(pl).sub(pm.copy().mult(2)).mult(s*s)
  };
}

function kappa(path, i){
  const n = path.length;
  if (i<1||i>=n){
    return 0;
  }
  const deriv = ddxy(path, i);
  return Math.abs((deriv.d.x * deriv.dd.y) -
                  (deriv.d.y * deriv.dd.x)) /
    Math.pow((deriv.d.x * deriv.d.x) +
             (deriv.d.y * deriv.d.y), 3/2);
}


// RANDOM

function rndInCirc(rad, xy=vec(0.0)){
  // return a p5.Vector uniformly distributed in a circle with radius rad,
  // centered at xy.
  const a = random(TWO_PI);
  const r = rad * sqrt(random(1));
  return vec(xy.x + r * cos(a), xy.y + r * sin(a));
}

function random2(a){
  // get a number between (-a, +a)
  return a*(1-2*random());
}


function rndBetween(a, b){
  // return a random number in range (a, b).
  return a + random(b-a);
}

function rndAngle(r=PI, a=null){
  // make a random angle in range (-r, +r) around a.
  a = a ? a.copy().normalize() : vec(1, 0);
  const angle = random2(r);
  const around = Math.atan2(a.y, a.x);
  return p5.Vector.fromAngle(angle+around);
}

function prob(p, dofx, elsefx=null){
  //execute dofx with a probability of p,
  //or elsefx with a probability of (1-p)
  if (random()<p){
    return dofx();
  } else if (elsefx !== null) {
    return elsefx();
  }
  return null;
}

function either(p, dofx, elsefx=null){
  //execute either dofx or elsefx with a probability of 0.5
  return prob(0.5, dofx, elsefx);
}


// DRAW

function drawPath(path, closed=false){
  //draw a path as a list of p5.Vector.
  //falsy elements are ignored.
  //
  //if closed === true a line will be drawn between the first and last elements
  //in path.

  beginShape();
  path.forEach(v => {
    if (v){
      vertex(v.x, v.y);
    }});
  const first = path[0];
  if (closed && first){
    vertex(first.x, first.y);
  }
  endShape();
}


function drawCirc(path, rad=10){
  // draw circles of radius rad for every p5.Vector in path.
  // ignores falsy elements.
  path.forEach(v => {
    if (v){
      ellipse(v.x, v.y, rad, rad);
    }});
}

