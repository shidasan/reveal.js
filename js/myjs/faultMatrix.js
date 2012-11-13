//export modules to arch
function draw_MatrixSVG(lsvg) {
  $svg = $('lsvg');
  $svg.attr('position', 'relative');
}

var Matrix = function() {
  this.$dom;
  this.$table;
  this.nodes = [];
  this.domDict = [];
  this.flag_usr = (1 << 0);
  this.flag_sys = (1 << 1);
  this.flag_sft = (1 << 2);
  this.flag_ext = (1 << 3);

};

Matrix.prototype = {
  init: function() {
        this.$dom = $('#fault_matrix');
    this.$dom.svg({onLoad: draw_MatrixSVG});
    this.line = this.$dom.svg('get').group({
      stroke: 'black',
      strokeWidth: 3
    });

    this.$table = $('#fault_table');
  },
  createSoftwareFault: function() {
    var $ret = createLastChild(this.$dom);
    $ret.addClass('matrix_cell');
    $ret.addClass('software_fault');
    $ret.css({
        'background': '#aa4400',
        'top': '10px',
        'left': '0px',
    });
    createLastChild($ret, 'p', 'Soflware Fault');
    createLastChild($ret, 'p', '(bugs, design mistake)');
  },
  createUserFault: function() {
    var $ret = createLastChild(this.$dom);
    $ret.addClass('matrix_cell');
    $ret.addClass('user_fault');
    $ret.css('bg', '#00aa00');
    $ret.css({
        'background': '#00aa00',
        'top': '10px',
        'left': '220px',
    });
    createLastChild($ret, 'p', 'User Fault');
    createLastChild($ret, 'p', '(user mistake)');
  },
  createSystemFault: function() {
    var $ret = createLastChild(this.$dom);
    $ret.addClass('matrix_cell');
    $ret.addClass('system_fault');
    $ret.css({
        'background': '#aa0000',
        'top': '170px',
        'left': '0px',
    });
    createLastChild($ret, 'p', 'System Fault');
    createLastChild($ret, 'p', '(OS error, hardware error)');
  },
  createExternalFault: function() {
    var $ret = createLastChild(this.$dom);
    $ret.addClass('matrix_cell');
    $ret.addClass('external_fault');
    $ret.css({
        'background': '#aa00aa',
        'top': '170px',
        'left': '220px',
    });
    createLastChild($ret, 'p', 'External Fault');
    createLastChild($ret, 'p', '(external error');
  },
  setAxis: function() {
    var svg = this.$dom.svg('get');
    var w = parseInt(this.$dom.css('width'));
    var h = parseInt(this.$dom.css('height'));
    var l = svg.line(this.line, 0, h / 2, w, h / 2);
    var l = svg.line(this.line, w / 2, 0, w / 2, h);
  },
  drawMatrix: function() {
    var $software = this.createSoftwareFault();
    var $user = this.createUserFault();
    var $system = this.createSystemFault();
    var $extern = this.createExternalFault();
    this.setAxis();
  },
  addLine: function(data) {
  },
  resetAnimation: function($node) {
  },
  doAnimate_running: function($node) {
  },
  doAnimate_error: function($node) {
  },
};

function Matrix_init() {
  //var matrix = new Matrix();
  //matrix.init();
  //matrix.drawMatrix();
  $("#matrix_svg").append('<object type="image/svg+xml" data="sample.svg" height="330px" width="440px" id="svgID"></object>')
  $("#matrix_svg_deos").append('<object type="image/svg+xml" data="sample.svg" height="330px" width="440px" id="svgID_deos"></object>')
}

var Matrix_faultType = [];
function Matrix_fault(fault){
  ft = fault.split(',');
  $.each(ft,function(i,v){
      Matrix_faultType.push(v);
  });
}

var Matrix_faultType_deos = [];
function Matrix_fault_deos(fault){
  ft = fault.split(',');
  $.each(ft,function(i,v){
      Matrix_faultType_deos.push(v);
  });
}

function getElementsByClass(doc,searchClass) {
  var classElements = new Array();
  var allElements = doc.getElementsByTagName("*");
  for (var i = 0, j = 0; i < allElements.length; i++) {
    if (allElements[i].className == searchClass) {
      classElements[j] = allElements[i];
      j++;
    }
  }
  return classElements;
}

function Matrix_animation(){
  var svgDoc = document.getElementById("svgID").contentDocument;
  $.each(Matrix_faultType,function(i,v){
    if(v == "SystemFault"){
      var fa = getElementsByClass(svgDoc,"system_f");
      $.each(fa, function(j,vv){
        vv.setAttribute("to","2.0");
      });
    }else if(v == "SoftwareFault") {
      var fa = getElementsByClass(svgDoc,"software_f");
      $.each(fa, function(j,vv){
        vv.setAttribute("to","2.0");
      });
    }else if(v == "UserFault"){
      var fa = getElementsByClass(svgDoc,"user_f");
      $.each(fa, function(j,vv){
        vv.setAttribute("to","2.0");
      });
    }else if(v == "ExternalFault") {
      var fa = getElementsByClass(svgDoc,"external_f");
      $.each(fa, function(j,vv){
        vv.setAttribute("to","2.0");
      });
    }
  });
  svgDoc.getElementById("external0").beginElement();
}

function Matrix_animation_init(){
  $(".fault_element").remove();
  var svgDoc = document.getElementById("svgID").contentDocument;
  var fa = getElementsByClass(svgDoc,"system_f");
  $.each(fa, function(j,vv){
    vv.setAttribute("to","0.0");
  });
  fa = getElementsByClass(svgDoc,"software_f");
  $.each(fa, function(j,vv){
    vv.setAttribute("to","0.0");
  });
  fa = getElementsByClass(svgDoc,"user_f");
  $.each(fa, function(j,vv){
    vv.setAttribute("to","0.0");
  });
  fa = getElementsByClass(svgDoc,"external_f");
  $.each(fa, function(j,vv){
    vv.setAttribute("to","0.0");
  });
  svgDoc.getElementById("external0").beginElement();
}

function Matrix_animation_deos(){
  var svgDoc = document.getElementById("svgID_deos").contentDocument;
  $.each(Matrix_faultType_deos,function(i,v){
    if(v == "SystemFault"){
      var fa = getElementsByClass(svgDoc,"system_f");
      $.each(fa, function(j,vv){
        vv.setAttribute("to","2.0");
      });
    }else if(v == "SoftwareFault") {
      var fa = getElementsByClass(svgDoc,"software_f");
      $.each(fa, function(j,vv){
        vv.setAttribute("to","2.0");
      });
    }else if(v == "UserFault"){
      var fa = getElementsByClass(svgDoc,"user_f");
      $.each(fa, function(j,vv){
        vv.setAttribute("to","2.0");
      });
    }else if(v == "ExternalFault") {
      var fa = getElementsByClass(svgDoc,"external_f");
      $.each(fa, function(j,vv){
        vv.setAttribute("to","2.0");
      });
    }
  });
  svgDoc.getElementById("external0").beginElement();
}

function Matrix_animation_init_deos(){
  $(".fault_element_deos").remove();
  //var svgDoc = document.getElementById("svgID_deos").contentDocument;
  //var fa = getElementsByClass(svgDoc,"system_f");
  //$.each(fa, function(j,vv){
  //  vv.setAttribute("to","0.0");
  //});
  //fa = getElementsByClass(svgDoc,"software_f");
  //$.each(fa, function(j,vv){
  //  vv.setAttribute("to","0.0");
  //});
  //fa = getElementsByClass(svgDoc,"user_f");
  //$.each(fa, function(j,vv){
  //  vv.setAttribute("to","0.0");
  //});
  //fa = getElementsByClass(svgDoc,"external_f");
  //$.each(fa, function(j,vv){
  //  vv.setAttribute("to","0.0");
  //});
  //svgDoc.getElementById("external0").beginElement();
}
