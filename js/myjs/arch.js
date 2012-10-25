//export modules to arch
function draw_archSVG(lsvg) {
  $svg = $('lsvg');
  $svg.attr('position', 'relative');
}

var Arch = function() {
  this.$dom;
  this.nodes = [];
  this.domDict = [];
};

Arch.prototype = {
  init: function () {
    this.$dom = $('#arch');
    this.$dom.svg({onLoad: draw_archSVG});
    this.line = this.$dom.svg('get').group({
      stroke: 'black',
      strokeWidth: 3
    });
  },
  setNode: function(x, y, name, ip) {
    var $ret = createLastChild(this.$dom);
    $ret.addClass('arch_node');
    var $img = createLastChild($ret, 'img');
    $img.attr('src', CONFIG.img_dir + '/server.png');
    createLastChild($ret, 'p', name);
    createLastChild($ret, 'p', ip);
    $ret.css({
      'top': (y - $ret.height()/2) + 'px',
      'left': (x - $ret.width()/2) + 'px'
    });
    this.nodes.push($ret);
    var dict = new Dict(ip, $ret);
    this.domDict.push(dict);
    return $ret;
  },
  connectTo: function(to, from) {
    var to_img = to.find('img');
    var from_img = from.find('img');
    var x1 = parseInt(to.css('left'));
    var y1 = parseInt(to.css('top'));
    var x2 = parseInt(from.css('left'));
    var y2 = parseInt(from.css('top'));
    var l = this.$dom.svg('get').line(this.line, x1, y1 + 30, x2, y2 + 30);
  },
  resetAnimation: function($node) {
    $node.removeClass('arch_running');
    $node.removeClass('arch_error');
  },
  doAnimate_running: function($node) {
    this.resetAnimation($node);
    var $stat = createLastChild($node);
    $stat.addClass('status');
    var $stat_img = createLastChild($stat, 'img');
    $stat_img.attr('src', CONFIG.img_dir + '/running.png');
    $stat_img.css({
        'width': '50px',
        'height': '50px'
    });
    $node.addClass('arch_running');
  },
  doAnimate_error: function($node) {
    this.resetAnimation($node);
  },
  getDomFromIp: function(ip) {
    return DictArray_v(this.domDict, ip);
  }
}

function Arch_init(argument) {
  var arch = new Arch();
  arch.init();
  var $node_a = arch.setNode(250, 350, MANAGER.name, MANAGER.ip);
  var $node_b = arch.setNode(650, 350, NODE_A.name, NODE_A.ip);
  arch.connectTo($node_a, $node_b);
  Arch_stat(arch);
}

function Arch_stat(arch) {
  var data = '';
  var json;
  $.ajax({
    url: CONFIG.cgi_dir + '/arch_state_controller.php',
    type:'POST',
    data: data,
    error:function() {},
    complete:function(data) {
      var json = jQuery.parseJSON(data.responseText);
      if(json.state === undefined) {
        return;
      }
      else if(json.state === "start") {
        arch.doAnimate_running($(arch.getDomFromIp(json.ip)));
      }
      else if(i.value.state === "end") {
        if (json.result === "success") {
          arch.resetAnimation(arch.getDomFromIp(json.ip));
        }
        else {
          //arch.doAnimate_error(arch.getDomFromIp(i.value.ip));
          arch.resetAnimation(arch.getDomFromIp(json.ip));
        }
      }
      setTimeout( function() {
        Arch_stat(arch);
      },1000);
    },
    dataType:'json'
  });
}
