
/* ------------------------------------------------------------------- */
/* [common functions] */

function raw_y(y) {
  return y;
}


function node_y(y) {
  return y;
}

/* ------------------------------------------------------------------- */
/* [GSN Item Class Definition] */

var Node = function() {
  this.idx = 0;
  this.id = '';
  this.x = 0;
  this.y = 0;
  this.width = 0;
  this.chwidth = 0;
  this.height = 0;
  this.space = 0;
  this.top = new Object();
  this.bottom = new Object();
  this.node;
  this.text;
  this.children = [];
};

Node.prototype = {
  init: function(parent, idx, id, x, y, str) {
    this.idx = idx;
    this.x = x;
    this.y = y;
    var w = 220;
    var h = 50;
    this.isHidden = false;
    this.width = w;
    this.height = h;
    this.top['x'] = x + w / 2;
    this.top['y'] = y;
    this.bottom['x'] = x + w / 2;
    this.bottom['y'] = y + h;
    $(this.node).attr('id', id);
    return this.node;
  },
  enableEvent: function() {
    var self = this;
    this.node.draggable({
      drag: function(e, ui) {
        var dragnode = $(this);
        var offset = $(this).offset();
        self.setPoint(offset.left, node_y(offset.top));
        resetLine($('line'), self, ui.position.left,
                  ui.position.top - self.padY, false);
      },
      stop: function(e, ui) {
        autoArrange(viewer);
      }
    });
    this.node.click(function() {
      if (self.closed()) {
        console.log('appear');
        self.childAppear();
      }
      else {
        console.log('disappear');
        self.childDisappear();
      }
      viewer.autoArrange(true);
    });
    this.text.dblclick(function() {
      var txt = this;
      $(txt).html('<input>').attr('title', 'hoge')
            .attr('type', 'text').attr('id', 'test');
      $('input').keypress(function(e) {
        if (e.which == 13) { // Enter key
          self.rowtext = $(this).val();
          $(txt).html(self.rowtext);
          //$(txt).html('<p>' + self.rowtext + '</p>');
        }
      });
      self.textFlag = true;
    });
  },
  connectTo: function(node) {
    var l = svg.line(line, this.bottom['x'], this.bottom['y'],
                     node.top['x'], node.top['y']);
    $(l).attr('start', this.id);
    $(l).attr('end', node.id);
  },
  addChild: function(node) {
    this.children.push(node);
  },
  childrenSize: function() {
    return this.children.length;
  },
  isGoal: function() {
      return false;
  },
  isStrategy: function() {
      return false;
  },
  isEvidence: function() {
      return false;
  },
  isContext: function() {
      return false;
  },
  isUGoal: function() {
      return false;
  },
  setText: function() {
    var txtWidth = $(this.text).width() + $(this.idtext).width();
    var txtHeight = $(this.text).height() + $(this.idtext).height();
    if (this.width < txtWidth) {
      $(this).css('width', (txtWidth + 10) + 'px');
    }
    if (txtWidth >= 140) {
      this.height = this.height * 1.7;
      $(this).css('height', this.height + 'px');
    }
  },
  hide: function() {
    $(this.node).css('display', 'none');
    this.isHidden = true;
  },
  appear: function() {
    $(this.node).css('display', '');
    this.isHidden = false;
  },
  childAppear: function() {
    var $parent = this;
    if (this.isGoal()) {
      this.unsetUndev();
    }
    $.each(this.children, function() {
      this.appear();
    });
  },
  childDisappear: function() {
    var $parent = this;
    $.each(this.children, function() {
      this.hide();
      this.childDisappear();
    });
  },
  closed: function() {
    var ret = false;
    $.each(this.children, function() {
      if ($(this.node).css('display') == 'none') {
        ret = true;
      }
    });
    return ret;
  },
  doAnimate: function(x, y) {
    //console.log('doanimate');
    if (x == this.x && y == this.y) {
      return;
    }
    //console.log('id: ' + this.id + ' (' + this.x + ', ' + this.y + ') -> (' + this.x + ', ' + this.y + ')');
    $(this.node).transition({
      x: (x - this.x) + 'px',
      y: y - this.y + 'px'
    }, 500, function() {
      $(this).css({
        'left': x + 'px',
        'top': raw_y(y) + 'px',
        '-webkit-transform': ''
      });
    });
    this.x = x;
    this.y = y;
    this.top['x'] = x + this.width / 2;
    this.top['y'] = y;
    this.bottom['x'] = x + this.width / 2;
    this.bottom['y'] = y + this.height;
    if (this.isGoal() && this.closed()) {
      this.setUndev();
    }
  },
  resetChildPosition: function(x, y) {
    console.log('[resetChildPosition] ' + this.id + ': x=' + this.x + ', y=' + this.y);
    $.each(this.children, function() {
      console.log('\t' + this.id + ': x=' + x + ', y=' + y);
      this.doAnimate(x, y);
      resetLine($('line'), this, x, y, false);
    });
  }
};

var Goal = function() {
  this.svg;
  this.idx = 0;
  this.id = '';
  this.x = 0;
  this.y = 0;
  this.width = 0;
  this.chwidth = 0;
  this.height = 0;
  this.space = 0;
  this.scale = 1;
  this.top = new Object();
  this.bottom = new Object();
  this.node;
  this.text;
  this.rowtext;
  this.children = [];
  this.padY = 0;
  this.isEditable = true;
  this.isUndev = true;
  this.dimd;
};

$.extend(Goal.prototype, Node.prototype, {
  init: function(parent, idx, id, x, y, str) {
    this.idx = idx;
    this.x = x;
    this.y = y;
    var w = 220;
    var h = 50;
    this.isHidden = false;
    this.width = w;
    this.chwidth = w;
    this.height = h;
    this.top['x'] = x + w / 2;
    this.top['y'] = y;
    this.bottom['x'] = x + w / 2;
    this.bottom['y'] = y + h;
    this.node = $('#dcase_node').append('<div></div>').children('div:last');
    this.node.addClass('goal');
    this.padY = $('svg').offset().top;
    this.node.css({
      'left': this.x + 'px',
      'top': raw_y(this.y) + 'px'
    });
    $(this.node).attr('space', 10);
    this.space = 10;
    $(this.node).attr('id', id);
    this.id = id;
    this.rowtext = str;
    this.text = $(this.node).append('<p>' + str + '</p>').children('p:last');
    this.text.attr('id', 'text');
    this.idtxt = $(this.node).append('<p>ID: ' + id + '</p>')
    .children('p:last');
    this.idtxt.attr('id', 'idtext');
    this.enableEvent();
    this.setText();
    this.dimd = $(this.node).append('<div class="ugoaldiamond"></div>').children(':last');
    $(this.dimd).css('display', 'none');
    this.setUndev();
    return this.node;
  },
  isGoal: function() {
    return true;
  },
  setPoint: function(x, y) {
    this.node.css({
        left: x + 'px',
        top: raw_y(y) + 'px'
    });
    this.x = x;
    this.y = y;
    this.top['x'] = x + this.width / 2;
    this.top['y'] = y;
    this.bottom['x'] = x + this.width / 2;
    this.bottom['y'] = y + this.height;

  },
  setScale: function(scale) {
    this.scale = this.scale * scale;
    this.node.css({
      'width': (this.width * scale) + 'px',
      'height': (this.height * scale) + 'px',
      'padding': '2px'
    });
    this.width = this.width * scale;
    this.height = this.height * scale;
    this.chwidth = 0;
    $(this.node).attr('space', this.space * scale);
    $(this.text).css({
      'font-size': '0.1em'
    });
    $(this.idtext).css({
      'font-size': '0.1em'
    });
  },
  setUndev: function() {
    var goal_h = parseInt($('.goal').css('height'));
    var goal_w = parseInt($('.goal').css('width'));
    var h = (parseInt($(this.node).css('height')) > goal_h)? parseInt($(this.node).css('height')) : goal_h;
    var w = (parseInt($(this.node).css('width')) > goal_w)? parseInt($(this.node).css('width')) : goal_w;
    $(this.dimd).css({
        'margin-top': (h + 5) + 'px',
        'margin-left': (w / 2 - 20) + 'px',
        'display': ''
    });
  },
  unsetUndev: function() {
    $(this.dimd).css('display', 'none');
  }
});

var Context = function() {
  this.svg;
  this.idx = 0;
  this.id = '';
  this.x = 0;
  this.y = 0;
  this.width = 0;
  this.chwidth = 0;
  this.height = 0;
  this.scale = 1;
  this.space = 0;
  this.top = new Object();
  this.bottom = new Object();
  this.node;
  this.text;
  this.children = [];
};

$.extend(Context.prototype, Node.prototype, {
  init: function(parent, idx, id, x, y, str) {
    this.idx = idx;
    this.x = x;
    this.y = y;
    var w = 220;
    var h = 50;
    this.isHidden = false;
    this.width = w;
    this.chwidth = w;
    this.height = h;
    this.top['x'] = x + w / 2;
    this.top['y'] = y;
    this.bottom['x'] = x + w / 2;
    this.bottom['y'] = y + h;
    $(this.g).attr('space', 10);
    this.space = 10;
    $(this.g).attr('id', id);
    this.id = id;
    this.text = svg.createText(); // [TODO]
    this.text.addClass('text');
    this.setText();
    return this.node;
  },
  isContext: function() {
    return true;
  },
  setPoint: function(x, y) {
    this.node.css({
      'left': x + 'px',
      'top': raw_y(y) + 'px'
    });
    $(this.node).attr('x', x);
    $(this.node).attr('y', y);
    $(this.text).attr('x', x + 10);
    $(this.text).attr('y', y + 30);

    this.x = x;
    this.y = y;
    this.top['x'] = x + this.w / 2;
    this.top['y'] = y;
    this.bottom['x'] = x + this.w / 2;
    this.bottom['y'] = y + this.h;
  },
  setScale: function(scale) {
    this.scale = this.scale * scale;
    this.node.css({
      'width': (this.width * scale) + 'px',
      'height': (this.height * scale) + 'px'
    });
    this.width = this.width * scale;
    this.height = this.height * scale;
    this.chwidth = this.chwidth * scale;
    $(this.node).attr('space', this.space * scale);
  }

});

var Strategy = function() {
  this.padX = 110;
  this.svg;
  this.idx = 0;
  this.id = '';
  this.x = 0;
  this.y = 0;
  this.width = 0;
  this.chwidth = 0;
  this.height = 0;
  this.scale = 1;
  this.space = 0;
  this.top = new Object();
  this.bottom = new Object();
  this.node;
  this.text;
  this.padY = 0;
  this.children = [];
};

$.extend(Strategy.prototype, Node.prototype, {
  init: function(parent, idx, id, x, y, str) {
    this.idx = idx;
    this.x = x;
    this.y = y;
    var w = 220;
    var h = 70;
    this.isHidden = false;
    this.width = w;
    this.chwidth = w;
    this.height = h;
    this.top['x'] = x + w / 2;
    this.top['y'] = y;
    this.bottom['x'] = x + w / 2;
    this.bottom['y'] = y + h;
    this.node = $('#dcase_node').append('<div></div>').children('div:last');
    this.node.addClass('strategy');
    this.padY = $('svg').offset().top;
    $(this.node).attr('space', 10);
    this.space = 10;
    this.node.css({
      'left': this.x + 'px',
      'top': raw_y(this.y) + 'px'
    });
    $(this.node).attr('id', id);
    this.id = id;
    this.text = $(this.node).append('<p>' + str + '</p>').children('p:last');
    this.text.attr('id', 'text');
    this.text.css({
      'transform': 'skew(30deg)',
      '-webkit-transform': 'skew(30deg)',
      '-moz-transform': 'skew(30deg)'
    });
    this.idtxt = $(this.node).append('<p>ID: ' + id + '</p>')
    .children('p:last');
    this.idtxt.attr('id', 'idtext');
    this.idtxt.css({
      'transform': 'skew(30deg)',
      '-webkit-transform': 'skew(30deg)',
      '-moz-transform': 'skew(30deg)'
    });
    this.enableEvent();
    this.setText();
    return this.node;
  },
  isStrategy: function() {
    return true;
  },

  doAnimate: function(x, y) {
    console.log('doanimate strategy');
    console.log('cur pos: x: ' + x + ', y: ' + y);
    console.log('prev pos: x: ' + this.x + ', y: ' + this.y);
    if (x == this.x && y == this.y) {
      return;
    }
    $(this.node).transition({
        x: (x - this.x) + 'px',
        y: (y - this.y) + 'px',
        skewX: '-30deg'
    }, 500, function() {
      $(this).css({
          'left': x + 'px',
          'top': raw_y(y) + 'px',
          '-webkit-transform': 'skew(-30deg)'
      });
    });
    this.x = x;
    this.y = y;
    this.top['x'] = x + this.w / 2;
    this.top['y'] = y;
    this.bottom['x'] = x + this.w / 2;
    this.bottom['y'] = y + this.h;
  },
  setPoint: function(x, y) {
    this.node.css({
        left: x + 'px',
        top: raw_y(y) + 'px',
        '-webkit-transform': 'skew(-30deg)'
    });
    this.x = x;
    this.y = y;
    this.top['x'] = x + this.w / 2;
    this.top['y'] = y;
    this.bottom['x'] = x + this.w / 2;
    this.bottom['y'] = y + this.h;
  },
  setScale: function(scale) {
    this.scale = this.scale * scale;
    this.node.css({
      'width': (this.width * scale) + 'px',
      'height': (this.height * scale) + 'px'
    });
    this.width = this.width * scale;
    this.height = this.height * scale;
    this.chwidth = this.chwidth * scale;
    $(this.node).attr('space', this.space * scale);
    $(this.text).css({
      'font-size': '0.1em'
    });
    $(this.idtext).css({
      'font-size': '0.1em'
    });
  }
});

var Evidence = function() {
  this.svg;
  this.idx = 0;
  this.id = '';
  this.x = 0;
  this.y = 0;
  this.r = 0;
  this.width = 0;
  this.chwidth = 0;
  this.height = 0;
  this.scale = 1;
  this.space = 20;
  this.top = new Object();
  this.bottom = new Object();
  this.node;
  this.text;
  this.padY = 0;
  this.children = [];
  this.str;
  this.rowtext = '';
  this.textFlag = false;
};

$.extend(Evidence.prototype, Node.prototype, {
  init: function(parent, idx, id, x, y, str) {
    this.idx = idx;
    this.x = x;
    this.y = y;
    var w = 220;
    var h = 50;
    this.isHidden = false;
    this.str = 'Evidenceを入力してください';
    this.width = w;
    this.chwidth = w;
    this.height = h;
    this.top['x'] = x + w / 2;
    this.top['y'] = y;
    this.bottom['x'] = x + w / 2;
    this.bottom['y'] = y + h / 2;
    this.node = $('#dcase_node').append('<div></div>').children('div:last');
    this.node.addClass('evidence');
    $(this.node).attr('space', 20);
    this.space = 15;
    $(this.node).attr('id', id);
    this.id = id;
    this.padY = $('svg').offset().top;
    this.text = $(this.node).append('<p>' + this.str + '</p>')
    .children('p:last');
    this.text.attr('id', 'evitext');
    this.idtxt = $(this.node).append('<p>ID: ' + id + '</p>')
    .children('p:last');
    this.idtxt.attr('id', 'idevitext');
    //this.text.attr('align', 'center');
    this.enableEvent();
    this.setText();
    return this.node;
  },
  enableEvent: function() {
    var self = this;
    this.node.draggable({
      drag: function(e, ui) {
        var dragnode = $(this);
        var offset = $(this).offset();
        self.setPoint(offset.left, offset.top);
        resetLine($('line'), self, ui.position.left,
                  ui.position.top - self.padY, false);
      },
      stop: function(e, ui) {
        autoArrange(viewer);
      }
    });
    this.text.dblclick(function() {
      var txt = this;
      $(txt).html('<input>').attr('title', 'hoge')
            .attr('type', 'text').attr('id', 'test');
      $('input').keypress(function(e) {
        if (e.which == 13) { // Enter key
          self.rowtext = $(this).val();
          $(txt).html('<p>' + self.rowtext + '</p>');
        }
      });
      self.textFlag = true;
    });
  },

  isEvidence: function() {
    return true;
  },
  setPoint: function(x, y) {
    this.node.css({
        left: x + 'px',
        top: raw_y(y) + 'px'
    });
    this.x = x;
    this.y = y;
    this.top['x'] = x + this.width / 2 + 50;
    this.top['y'] = y;
    this.bottom['x'] = x + this.width / 2 + 50;
    this.bottom['y'] = y + this.height;
  },
  setScale: function(scale) {
    this.scale = this.scale * scale;
    this.node.css({
      'width': (this.width * scale) + 'px',
      'height': (this.height * scale) + 'px',
      'border-radius': '75px/30px',
      '-webkit-radius': '750px/30px',
      '-moz-radius': '120px',
      '-o-border-radius': '120px'
    });
    this.width = this.width * scale;
    this.height = this.height * scale;
    this.chwidth = this.chwidth * scale;
    $(this.node).attr('space', this.space * scale);
    $(this.text).css({
      'font-size': '0.1em'
    });
    $(this.idtext).css({
      'font-size': '0.1em'
    });

  },
  setText: function() {
    var txtWidth = $(this.text).width() + $(this.idtext).width();
    var txtHeight = $(this.text).height() + $(this.idtext).height();
    if (this.width < txtWidth) {
      $(this).css('width', (txtWidth + 10) + 'px');
    }
    if (txtWidth >= 140) {
      this.height = this.height * 1.7;
      $(this).css({
        'height': this.height + 'px',
        'border-radius': '75px/30px',
        '-webkit-radius': '750px/30px',
        '-moz-radius': '120px',
        '-o-border-radius': '120px'
      });
    }
  },
  isEmpty: function() {
    console.log(this.rowtext);
    console.log('return: ' + this.textFlag);
    return this.textFlag;
  }
});

