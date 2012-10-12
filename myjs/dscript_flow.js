
var FlowViewer = function(svg) {
  this.svg = svg;
  this.tasks = [];
};

FlowViewer.prototype = {
  init: function() {
    line = this.svg.group({
      stroke: 'black',
      strokeWidth: 1
    });
  },
  setSVGScope: function() {
    this.w = $('#dscript_svg').attr('width');
    this.h = $('#dscript_svg').attr('height');
  },
  addDTask: function(x, y, name) {
    var task = new DTask();
    task.init(x, y, name);
    this.tasks.push(task);
    return task;
  }
};

var DTask = function() {
  this.node;
};

DTask.prototype = {
  init: function(x, y, name) {
    this.node = $('#dscript_flow').append('<div></div>').children('div:last');
    this.node.addClass('dtask');
    this.node.css({
      'left': parseInt(x) + 'px',
      'top': parseInt(y) + 'px'
    });
    this.text = $(this.node).append('<p>' + name + '</p>').children('p:last');
    this.text.addClass('text');
    this.disable();
    this.enableEvent();
  },
  enable: function() {
    this.node.css('border-color', '#000000');
    this.text.css('color', '#000000');
  },
  disable: function() {
    this.node.css('border-color', '#aaaaaa');
    this.text.css('color', '#aaaaaa');
  },
  enableEvent: function() {
    var self = this;
    this.node.click(function() {
      console.log('appear');
      $.each(flowviewer.tasks, function() {
        this.disable();
      });
      self.enable();
      //sendGoal(neoMng, $('#goal_textarea').val());
      /* offline mode */
      sendDummyGoal(neoMng, $('#goal_textarea').val());
    });
  }
};

