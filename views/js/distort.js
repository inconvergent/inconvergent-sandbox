/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc
*/

let state, mid, win;




function getind(v){
  return JSON.stringify(v);
}


function toZone(rad, v){
  return [Math.floor(v.x/rad), Math.floor(v.y/rad)];
}


function addToZone(zm, v){
  const z = getind(toZone(zm.maxRad, v));
  if (!zm.zones[z]){
    zm.zones[z] = new Set();
  }
  zm.zones[z].add(zm.i);
  zm.i += 1;
  return zm.i-1;
}


function inRad(zm, verts, v, rad){
  const [zx, zy] = toZone(zm.maxRad, v);
  const res = [];
  for (let i=zx-1;i<=zx+1;i++){
    for (let j=zy-1;j<=zy+1;j++){
      const zij = zm.zones[getind([i, j])];
      if (zij){
        zij.forEach(w => {
          const dst = verts[w].copy().dist(v);
          if (dst<rad){
            res.push({ind: w, dst});
          }
        });
      }
    }
  }
  return res;
}


function createZoneMap(maxRad, init=[]){
  const zm = {
    maxRad,
    zones: {},
    i: 0,
  };
  init.forEach(v => addToZone(zm, v));
  return zm;
}



function init(n){
  state.verts = [];
  linspace(n, 50, 950).forEach(x =>
    linspace(n, 50, 950).forEach(y =>
      state.verts.push(vec(x, y))));

  state.zm = createZoneMap(50, state.verts);

  const edgeSet = new Set();
  const edges = [];

  function compareAdd(a) {
    v = JSON.stringify(a.sort());
    if (!edgeSet.has(v)) {
      edgeSet.add(v);
      edges.push(a);
    }
  }

  for (let i=1; i<n-1; i++) {
    for (let j=1; j<n-1; j++) {
      const a = i*n+j;
      compareAdd([a, a-1]);
      compareAdd([a, a-n]);
      compareAdd([a, a+n]);
      compareAdd([a, a+1]);
    }
  }

  state.edges = edges;
}


function setup(){
  win = vec(1000, 1000);
  angleMode(RADIANS);
  createCanvas(win.x, win.y);
  noFill();

  state = {
    mouse: null,
    win,
    lightColor: color('rgba(0, 0, 0, 0.5)'),
    //cyanColor: color('rgb(0, 180, 180)'),
    inside: v => v && (v.x>0 && v.x<win.x && v.y>0 && v.y<win.y),
  };

  init(60);
}

function draw(){
  const mouse = vec(mouseX, mouseY);

  clear();

  if (state.inside(mouse)){
    const near = inRad(state.zm, state.verts, mouse, 40);
    near.forEach(v => {
      state.verts[v.ind].add(rndInCirc(10));
    });
    //drawCirc(near.map(v => state.verts[v.ind]));
    state.zm = createZoneMap(state.zm.maxRad, state.verts);
  }

  strokeWeight(1);
  stroke(state.lightColor);
  state.edges.forEach(e => {
    if (p5.Vector.dist(state.verts[e[0]], state.verts[e[1]])<40){
      drawPath(e.map(v => state.verts[v]));
    }
  });
}
