/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc, sqrt, PI, TWO_PI
*/



// MATH

function linspace(n, mi, ma){
  let res = [];
  const s = (ma - mi) / (n-1);
  let y = mi;
  for (let i = 0; i < n; i++){
    res.push(y);
    y += s;
  }
  return res;
}

function getRange(a, b=null){
  if (b === null){
    b = a;
    a = 0;
  }

  let res = [];
  for (let i=a; i<b; i++){
    res.push(i);
  }
  return res;
}

function ease(t){
  return (t<0.5) ? 16.0*t*t*t*t*t : 1.0+16.0*(--t)*t*t*t*t;
}


// VEC

function vec(x, y=null){
  return createVector(x, y || x);
}

function zero(){
  return vec(0);
}

function getBox(w, h, v, closed=false){
  let res = [vec(v.x - w, v.y - h), vec(v.x + w, v.y - h),
             vec(v.x + w, v.y + h), vec(v.x - w, v.y + h)];

  if (closed){
    res.push(res[0].copy());
  }
  return res;
}

function intersect(aa, bb){
  const a0 = aa[0];
  const a1 = aa[1];
  const b0 = bb[0];
  const b1 = bb[1];

  const sa = a1.copy().sub(a0);
  const sb = b1.copy().sub(b0);
  const u = (-sb.x * sa.y) + (sa.x * sb.y);

  // this is just a safe-guard so we do not divide by zero below.
  // it is not a good way to test for parallel lines
  if (Math.abs(u) <= 0){
    return {intersect: false, p: null, q: null};
  }

  const q = ((-sa.y * (a0.x - b0.x)) +
             ( sa.x * (a0.y - b0.y))) / u;
  const p = ((sb.x * (a0.y - b0.y)) -
             (sb.y * (a0.x - b0.x))) / u;

  return {intersect: (p >= 0 && p <= 1 && q >= 0 && q <= 1), p, q};
}


function linePointDistance(line, v){
  const va = line[0];
  const vb = line[1];
  const l2 = Math.pow(p5.Vector.dist(va, vb), 2.0);

  // line is a point
  if (l2 <= 0){
    return {dst: p5.Vector.dist(v, va), s: 0.0, xy: va.copy()};
  }

  const t = min(1, max(0, (((v.x - va.x) * (vb.x - va.x)) +
                           ((v.y - va.y) * (vb.y - va.y))) / l2));
  const xy = p5.Vector.lerp(va, vb, t);
  return {dst: p5.Vector.dist(v, xy), s: t, xy};
}


// RANDOM

function rndInCirc(rad, xy=vec(0.0)){
  const a = random(TWO_PI);
  const r = rad * sqrt(random(1));
  return vec(xy.x + r * cos(a), xy.y + r * sin(a));
}

function rndBetween(a, b){
  return a + random(b-a);
}


// DRAW

function drawPath(path){
  noFill();
  beginShape();
  path.forEach(v => {
    if (v){
      vertex(v.x, v.y);
    }});
  endShape();
}


function drawCirc(path, rad=10){
  path.forEach(v => {
    if (v){
      ellipse(v.x, v.y, rad, rad);
    }});
}

