function draw_dcaseSVG(lsvg) {
  $svg = $('lsvg');
  $svg.attr('position', 'relative');
}

var DManager = function() {
  this.bpmn;
  this.treemngs = [];
  this.$dom = $('#d_system');
}

DManager.prototype = {
  init: function() {
  },
  createDCase: function(str) {
    // set DOM
    var $tree = createLastChild(this.$dom);
    $tree.attr('id', 'tree');
    var $dcase_node = createLastChild($tree);
    $dcase_node.attr('id', 'dcase_node');
    var $dcase = createLastChild($tree);
    $dcase.attr('id', 'dcase');
    // add svg
    $dcase.svg({onLoad: draw_dcaseSVG});
    // create node viewer
    viewer = new NodeViewer($dcase.svg('get'));
    //viewer = new NodeViewer($dcase.children('svg'), $dcase.svg('get'));
    viewer.init();
    viewer.setSVGScope($dcase.children('svg'));
    // create tree manager
    var mng = new DummyManager('http://localhost', 7474);
    mng.init(viewer, $dcase_node, $dcase);
    this.treemngs.push(mng);
    mng.sendDummyGoal($dcase_node, $dcase, str);
  },
  createBPMN: function() {
  }
}
