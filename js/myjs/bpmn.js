//export modules to bpmn
function draw_bpmnSVG(lsvg) {
  $svg = $('lsvg');
  $svg.attr('position', 'relative');
}

var BPMN = function() {
  this.$dom;
  this.nodes = [];
  this.domDict = [];
};

BPMN.prototype = {
  init: function () {
    this.$dom = $('#bpmn');
    this.$dom.svg({onLoad: draw_bpmnSVG});
    this.line = this.$dom.svg('get').group({
      stroke: 'black',
      strokeWidth: 3
    });
  },
  setNode: function(x, y, name, str, idx) {
    var $ret = createLastChild(this.$dom);
    $ret.addClass('bpmn_node');
    createLastChild($ret, 'p', name);
    $ret.css({
      'top': (y - $ret.height()/2) + 'px',
      'left': (x - $ret.width()/2) + 'px'
    });
    $ret.click(function() {
      Reveal.slide(4, $('#bpmn').children().index(this) - 1);
    });
    this.nodes.push($ret);
    return $ret;
  },
  connectTo: function(to, from) {
    var x1 = parseInt(to.css('left'));
    var y1 = parseInt(to.css('top'));
    var x2 = parseInt(from.css('left'));
    var y2 = parseInt(from.css('top'));
    var w = to.width();
    var h = to.height();
    var l = this.$dom.svg('get').line(this.line, x1 + w, y1 + (h / 2), x2, y2 + (h / 2));
  },
  resetAnimation: function($node) {
    if($node !== undefined) {
      $node.removeClass('bpmn_running');
      $node.removeClass('bpmn_error');
      $stat = $node.children('.status');
      $stat.attr('phase', 'stop');
      $stat.empty();
    }
  },
  doAnimate_running: function($node) {
    this.resetAnimation($node);
    var $stat = createLastChild($node);
    $stat.addClass('status');
    $stat.attr('phase', 'run');
    $node.addClass('bpmn_running');
  },
  doAnimate_error: function($node) {
    this.resetAnimation($node);
  },
  getDomFromIp: function(ip) {
    return DictArray_v(this.domDict, ip);
  }
}

function BPMN_init(argument) {
  var bpmn = new BPMN();
  bpmn.init();
  var $node_a = bpmn.setNode(150, 250, TASK_A.name, parseInt(TASK_A.idx));
  var $node_b = bpmn.setNode(400, 250, TASK_B.name, parseInt(TASK_B.idx));
  var $node_c = bpmn.setNode(650, 250, TASK_C.name, parseInt(TASK_C.idx));
  bpmn.connectTo($node_a, $node_b);
  bpmn.connectTo($node_b, $node_c);
  //BPMN_stat(bpmn);
}

