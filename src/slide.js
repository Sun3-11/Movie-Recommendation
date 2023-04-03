$(document).ready(function() {
  var duration = 5000;
  var interval;
  var slideWidth = $('.slide').width();

  $('.slide:last-child').prependTo('.slides-container');
  $('.slides-container').css('transform', 'translateX(' + (-slideWidth) + 'px)');

  function startSlider() {
    interval = setInterval(function() {
      $('.slides-container').animate({ 'margin-left': -slideWidth }, 1000, function() {
        $('.slide:first-child').appendTo('.slides-container');
        $('.slides-container').css('margin-left', 0);
     $('.slide').removeClass('active');
        $('.slide:first-child').addClass('active');
      });
    }, duration);
  }

  function stopSlider() {
    clearInterval(interval);
  }

  $('.slider').hover(function() {
    stopSlider();
  }, function() {
    startSlider();
  });

  $('.next').click(function() {
    $('.slides-container').animate({ 'margin-left': -slideWidth }, 1000, function() {
      $('.slide:first-child').appendTo('.slides-container');
      $('.slides-container').css('margin-left', 0);
      $('.slide').removeClass('active');
      $('.slide:first-child').addClass('active');
    });
  });

  $('.prev').click(function() {
    $('.slide:last-child').prependTo('.slides-container');
    $('.slides-container').css('margin-left', -slideWidth);
    $('.slides-container').animate({ 'margin-left': 0 }, 1000);
    $('.slide').removeClass('active');
    $('.slide:first-child').addClass('active');
  });

  startSlider();
});