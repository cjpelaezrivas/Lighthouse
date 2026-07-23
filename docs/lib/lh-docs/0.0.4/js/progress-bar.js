function calculateProgressBarWidth() {
  var winTop = window.scrollY;
  var winHeight = window.innerHeight;
  var docHeight = document.documentElement.scrollHeight;
  var totalScroll = Math.min((winTop / (docHeight - winHeight)) * 100, 100);
  document.getElementsByClassName('progress-bar')[0].style.width = totalScroll + "%";
}

document.addEventListener('DOMContentLoaded', function () {
  window.addEventListener("scroll", calculateProgressBarWidth);
});

calculateProgressBarWidth();