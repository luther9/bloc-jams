// Original code is in Checkpoint 22.

// Why is this a var instead of a function declaration?
var animatePoints = function() {

  var points = document.getElementsByClassName('point')

  var transform = 'scaleX(1) translateY(0)'
  for (var i = 0; i < 3; ++i) {
    // Assignment 22 has this as a function that's defined before the loop.
    points[i].style.opacity = 1
    points[i].style.transform = transform
    points[i].style.msTransform = transform
    points[i].style.WebkitTransform = transform
  }
}
