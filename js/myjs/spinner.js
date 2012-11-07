var spinner;

function Spinner_start() {
  var opts = {
    lines: 13, // The number of lines to draw
    length: 16, // The length of each line
    width: 10, // The line thickness
    radius: 28, // The radius of the inner circle
    rotate: 0, // The rotation offset
    color: '#000', // #rgb or #rrggbb
    speed: 0.9, // Rounds per second
    trail: 69, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
  };
  var $load = $('.load');
  if ($load.children('.spinner').length == 0) {
    spinner = new Spinner(opts).spin($('.load'));
    $('.load').append(spinner.el);
  }
  //$('.load').css('display', 'none');
}
