$(document).ready(function() {
  if (multi) {
    $('.page').not(':first').hide();

    $('.menu a').on('click', function() {
      var curr = $(this).attr('href');

      $('.page').hide();
      $(curr + '.page').show();
    });

    $('.page').not('#landing').css('padding-top', '50px');
  }
});
