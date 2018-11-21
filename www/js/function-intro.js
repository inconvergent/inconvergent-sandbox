/* global createCanvas, mouseIsPressed, fill, mouseX, mouseY, ellipse,
   windowHeight, windowWidth, cos, sin, random, vec, rndInCirc
*/

let circles;

function setup(){
  const win = vec(1000, 1000);
  createCanvas(win.x, win.y);
  strokeWeight(2);
  noFill();
  circles = linspace(10, 100, 900).map(x => vec(x, 500));
}

function draw(){
  clear();

  // all these examples do the same thing.
  //
  // 1. regular for loop that changes circles in place
  for (let i=0; i<circles.length; i++){
    circles[i].add(rndInCirc(3));
  }

  // 2. regular for loop that replaces circles
  // this is useful if you need to use circles for something before you change
  // the positions
  //const newCircles = [];
  //for (let i=0; i<circles.length; i++){
  //  newCircles.push(rndInCirc(3, circles[i]));
  //}
  //circles = newCircles;

  // 3. forEach lets you do something for every element in circles
  //const newCircles = [];
  //circles.forEach(v => newCircles.push(rndInCirc(3, v)));
  //circles = newCircles;

  // 4. we can also use for each to change the value in place
  //circles.forEach(v => v.add(rndInCirc(3)));

  // 5. map does the same as forEach, but it also returns a new list
  //circles = circles.map(v => rndInCirc(3, v));

  drawCirc(circles, 10);

  //arrow functions can be a little confusing. but they can also make the code
  //quite elegant once you get used to them. you can read more about arrow
  //functions in javascript here:
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions

}
