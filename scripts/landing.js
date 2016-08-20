var pointsArray = document.getElementsByClassName('point')

// Why is this a var instead of a function declaration?
var animatePoints = function(points) {
  function revealPoint(i) {
    var transform = 'scaleX(1) translateY(0)'
    points[i].style.opacity = 1
    points[i].style.transform = transform
    points[i].style.msTransform = transform
    points[i].style.WebkitTransform = transform
  }
  forEach(points, revealPoint)
}

window.onload = function() {
  // 950 is distance from top of page to top of selling points.
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
