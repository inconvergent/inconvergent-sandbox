/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse, 
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc, sqrt, PI, TWO_PI
*/

class vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    // this.anim = anim;
  }

  pt() {
    return {x: this.x, y: this.y};
  }

  // setAnim(a) {
  //   this.anim = a;
  //   return this;
  // }

  slide(n, to) {
    const start = this.copy();
    const stp = to.sub(this);
    return this.setAnim({
      type: 'slide',
      curr: 0.0,
      inc: 1.0/n,
      fx: s => start.add(stp.scale(ease(s)))});
  }
  
  draw(rad) {
    ellipse(this.x, this.y, rad, rad);
  }

  // doAnim() {
  //   if (this.anim) {
  //     const anim = this.anim;
  //     let newVec = anim.fx(anim.curr);
  //     if (anim.curr < 1) {
  //       anim.curr += anim.inc;
  //       newVec.setAnim(anim);
  //     }
  //     return newVec;
  //   }
  //   return this;
  // }

  copy() {
    return new vec(this.x, this.y);
  }

  sub(v) {
    return new vec(this.x - v.x, this.y - v.y);
  }
  
  neg() {
    return new vec(-this.x, -this.y);
  }

  add(v) {
    return new vec(this.x + v.x, this.y + v.y);
  }

  scale(s) {
    return new vec(this.x*s, this.y*s);
  }

  vscale(v) {
    return new vec(this.x*v.x, this.y*v.y);
  }

  len() {
    const d2 = Math.pow(this.x, 2.0) + Math.pow(this.y, 2.0);
    if (d2 > 0.0) {
      return Math.sqrt(d2);
    }
    return 0.0;
  }

  norm() {
    const d2 = Math.pow(this.x, 2.0) + Math.pow(this.y, 2.0);
    if (d2 > 0.0) {
      const d = Math.sqrt(d2);
      return new vec(this.x/d, this.y/d);
    }
    return new vec(0.0, 0.0);
  }
}

class ln {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  
  len() {
    return this.a.sub(this.b).len();
  }
  
  draw() {
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}

function ease(t) {
  return (t<0.5) ? 16.0*t*t*t*t*t : 1.0+16.0*(--t)*t*t*t*t;
}

// LINEAR
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



// RANDOM

function rndInCirc(rad, xy=new vec(0.0, 0.0)) {
  let a = random(TWO_PI);
  let r = rad * sqrt(random(1));
  return new vec(xy.x + r * cos(a), xy.y + r * sin(a));
}


// export function box(w, h, v) {
//   return [new vec(v.x - w, v.y - h),
//           new vec(v.x + w, v.y - h),
//           new vec(v.x + w, v.y + h),
//           new vec(v.x - w, v.y + h),
//           new vec(v.x - w, v.y - h)];}

// export function rot(s, angle) {
//   const r = Math.atan2(s.y, s.x) + angle;
//   return new vec(Math.cos(r), Math.sin(r));
// }

// export function angleToVec(a) {
//   return new vec(Math.cos(a), Math.sin(a));
// }
