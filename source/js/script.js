var pageHeader = document.querySelector('.page-header');
var nav = pageHeader.querySelector('.nav');
var navToggle = pageHeader.querySelector('.nav__toggle');

nav.classList.remove('nav--nojs');
nav.classList.remove('nav--opened');
nav.classList.add('nav--closed');

navToggle.addEventListener('click', function() {
  if (nav.classList.contains('nav--closed')) {
    nav.classList.remove('nav--closed');
    nav.classList.add('nav--opened');
  } else {
    nav.classList.add('nav--closed');
    nav.classList.remove('nav--opened');
  }
});

function rangeSlider() {
  var slider = document.querySelector('.slide__slider');
  var slideBefore = document.querySelector('.slide__before');
  console.log(slider.value);
  slideBefore.style.width = slider.value + '%';
  console.log(slideBefore.style.width);
}
