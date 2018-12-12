$(document).ready(function() {
  $('textarea').keyup(function() {
    if( 140 - $(this).val().length < 0) {
      $('.counter').addClass('charcount');
    }
    else if(140 - $(this).val().length >= 0) {
      $('.counter').removeClass('charcount');
    }
    $('.counter').val(140 - $(this).val().length);

  })
});

