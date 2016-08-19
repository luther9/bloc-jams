// Original code is in Checkpoint 22.

var pointsArray = document.getElementsByClassName('point')

// Why is this a var instead of a function declaration?
var animatePoints = function(points) {
  var transform = 'scaleX(1) translateY(0)'
  for (var i = 0; i < 3; ++i) {
    // Assignment 22 has this as a function that's defined before the loop.
    points[i].style.opacity = 1
    points[i].style.transform = transform
    points[i].style.msTransform = transform
    points[i].style.WebkitTransform = transform
  }
}

window.onload = function() {
  if (window.innerHeight > 950) {
    animatePoints(pointsArray)
  }

  var sellingPoints = document.getElementsByClassName('selling-points')[0]
  var scrollDistance = sellingPoints.getBoundingClientRect().top
    - window.innerHeight + 200

  window.addEventListener(
    'scroll',
    function(event) {
      if (document.documentElement.scrollTop
	  || document.body.scrollTop >= scrollDistance) {
	animatePoints(pointsArray)
      }
    })
}
