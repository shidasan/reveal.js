var spinner_chenji;
var spinner_deos;

function Spinner_chenji_start() {
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
  var $load_ch = $('#load_chenji');
  if ($load_ch.children('.spinner').length == 0) {
    spinner_chenji = new Spinner(opts).spin($('#load_chenji'));
    $('#load_chenji').append(spinner_chenji.el);
  }
  //$('.load').css('display', 'none');
}

function Spinner_deos_start() {
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
  var $load_de = $('#load_deos');
  if ($load_de.children('.spinner').length == 0) {
    spinner_deos = new Spinner(opts).spin($('#load_deos'));
    $('#load_deos').append(spinner_deos.el);
  }
  //$('.load').css('display', 'none');
}
