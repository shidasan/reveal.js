
function resetLine(lines, node, x, y, isAnimate) {
  var id = node.id;
  if (isAnimate) {
    $.each(lines, function() {
      var s = $(this).attr('start');
      var e = $(this).attr('end');
      if (s == id) {
        $(this).animate({
          svgX1: x + (110 * 0.7),
          svgY1: y + (50 * 0.7)
        }, 500);
      }
      else if (e == id) {
        $(this).animate({
          svgX2: x + (110 * 0.7),
          svgY2: y,
        }, {'duration': 500, 'queue': false});
      }
    });
  }
  else {
    $.each(lines, function() {
      var s = $(this).attr('start');
      var e = $(this).attr('end');
      if (s == id) {
        if (id.match(/^evi/)) {
            // [TODO] 0.7 -> scale
          //$(this).attr('x1', node.bottom['x']);
          //$(this).attr('y1', node.bottom['y']);
          $(this).attr('x1', x + (110 * 0.7));
          $(this).attr('y1', y + (50 * 0.7));
        }
        else {
          //$(this).attr('x1', node.bottom['x']);
          //$(this).attr('y1', node.bottom['y']);
          $(this).attr('x1', x + (110 * 0.7));
          $(this).attr('y1', y + (50 * 0.7));
        }
      }
      else if (e == id) {
        if (id.match(/^evi/)) {
          //$(this).attr('x2', node.top['x']);
          //$(this).attr('y2', node.top['y']);
          $(this).attr('x2', x + 110 * 0.7);
          $(this).attr('y2', y + 5);
        }
        else {
          //$(this).attr('x2', node.top['x']);
          //$(this).attr('y2', node.top['y']);
          $(this).attr('x2', x + 110 * 0.7);
          $(this).attr('y2', y + 5);
        }
      }
    });
  }
}

var NodeViewer = function(svg) {
  this.svg = svg;
  this.padX;
  this.padY = 120;
  this.root = new Object;
  this.goalID = 0;
  this.ugoalID = 0;
  this.eviID = 0;
  this.strID = 0;
  this.ctxID = 0;
  this.maxWidth = 0;
};

NodeViewer.prototype = {
  init: function() {
    line = this.svg.group({
      stroke: 'black',
      strokeWidth: 1
    });
  },
  setSVGScope: function($svg) {
    $svg.attr('height', '100%');
    this.w = 900;
    this.h = $svg.attr('height');
    this.y = $svg.offset().top;
  },
  createTopGoal: function(idx, str) {
    var top = new Goal();
    top.init(this.svg, null, idx, 'goal' + this.goalID,
             this.w / 2 - 110, 50, str);
    this.goalID++;
    this.root = top;
    return top;
  },
  createGoal: function(idx, parent, str) {
    var node = new Goal();
    node.init(this.svg, parent, idx, 'goal' + this.goalID, parent.x, parent.y, str);
    node.hide();
    this.goalID++;
    parent.addChild(node);
    parent.connectTo(node);
    return node;
  },
  createStrategy: function(idx, parent, str) {
    var node = new Strategy();
    node.init(this.svg, parent, idx, 'str' + this.strID, parent.x, parent.y, str);
    node.hide();
    this.strID++;
    parent.addChild(node);
    parent.connectTo(node);
    return node;

  },
  createEvidence: function(idx, parent, str) {
    var node = new Evidence();
    node.init(this.svg, parent, idx, 'evi' + this.eviID, parent.x, parent.y, str);
    node.hide();
    this.eviID++;
    parent.addChild(node);
    parent.connectTo(node);
    return node;
  },
  createContext: function(idx, str) {
    var node = new Goal();
    node.init(this.svg, parent, idx, 'ugoal' + this.goalID, parent.x, parent.y, str);
    node.hide();
    this.goalID++;
    parent.addChild(node);
    parent.connectTo(node);
    return node;
  },
  setEachScale: function(node, scale) {
    var mng = this;
    node.setScale(scale);
    $.each(node.children, function() {
      mng.setEachScale(this, scale);
    });
  },
  setEachWidth: function(node) {
    var mng = this;
    this.maxWidth = 0;
    var width = 0;
    if (node.closed()) {
      node.chwidth = node.width;
      width = node.chwidth;
    }
    else if (node.childrenSize() == 0) {
      width = node.width;
      node.chwidth = width;
    }
    else if (node.childrenSize() == 1) {
      var child = node.children[0];
      width = mng.setEachWidth(child);
      if (node.width > width) {
        width = node.width;
        child.chwidth = width;
      }
      node.chwidth = width;
    }
    else {
      $.each(node.children, function() {
        width += mng.setEachWidth(this);
        width += this.space;
      });
      width -= node.space;
      node.chwidth = width;
    }
    if (width > this.maxWidth) {
      this.maxWidth = width;
    }
    return width;
  },
  setLocate: function(node, x, y, isAnimate) {
    this.visualLine($('line'), node, '');
    if (isAnimate) {
      node.doAnimate(x, y);
      resetLine($('line'), node, x, y, true);
    }
    else {
      node.setPoint(x, y, this.y);
      resetLine($('line'), node, x, y, false);
    }
  },
  makeTree: function(node, base, xlm, depth, isAnimate) {
    var mng = this;
    var w = node.chwidth;
    var x = xlm + w / 2;
    var x2 = base + x - node.width / 2;
    if (depth == 0) {
      this.setLocate(node, x2, 30, isAnimate);
    }
    else {
      this.setLocate(node, x2, depth * this.padY, isAnimate);
    }
    if (node.closed()) {
      this.visualLine($('line'), node, 'none');
      node.resetChildPosition(node.x, node.y);
      return w;
    }
    if (node.childrenSize() == 0) {
      return w;
    }
    else {
      $.each(node.children, function() {
        var tmp = mng.makeTree(this, base, xlm, depth + 1, isAnimate);
        xlm += tmp + this.space;
      });
      if (w > xlm) {
          xlm = w;
      }
      return w;
    }
  },
  autoArrange: function(isAnimate) {
    this.setEachWidth(this.root);
    if (this.maxWidth > $('svg').width()) {
      var ratio = $('svg').width() / this.maxWidth;
      this.maxWidth = this.maxWidth * ratio;
      this.setEachScale(this.root, ratio);
      this.setEachWidth(this.root);
      this.makeTree(this.root, 20 + this.w / 2 - this.maxWidth / 2, 0, 0, isAnimate);
    }
    else {
      this.makeTree(this.root, this.w / 2 - this.maxWidth / 2, 0, 0, isAnimate);
    }
  },
  zoomUp: function(isAnimate) {
    this.padX *= 1.5;
    this.padY *= 1.5;
    this.setEachScale(this.root, 1.5);
    this.setEachWidth(this.root);
    this.makeTree(this.root, this.w / 2 - this.maxWidth / 2, 0, 0, isAnimate);
  },
  zoomDown: function(isAnimate) {
    this.padX *= 0.666;
    this.padY *= 0.666;
    this.setEachScale(this.root, 0.666);
    this.setEachWidth(this.root);
    this.makeTree(this.root, this.w / 2 - this.maxWidth / 2, 0, 0, isAnimate);
  },
  visualLine: function(lines, node, stat) {
    var self = this;
    $.each(lines, function() {
      var s = $(this).attr('start');
      var e = $(this).attr('end');
      if (s == node.id) {
        $(this).css('display', stat);
      }
    });
    $.each(node.children, function() {
      self.visualLine(lines, this, stat);
    });
  },
  checkExecFlag: function(node) {
    var mng = this;
    var ret = true;
    if (node.isEvidence()) {
      return node.isEmpty();
    }
    else {
      $.each(node.children, function() {
        ret &= mng.checkExecFlag(this);
      });
      return ret;
    }
  }
};

