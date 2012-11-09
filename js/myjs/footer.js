
var Footer = function() {
  this.$dom;
  this.logos = [];
};

Footer.prototype = {
  init: function () {
    this.$dom = $('#footer-content');
    createLastChild(this.$dom, 'p', 'powered by');
  },
  setImg: function(src, h) {
    var $img = createLastChild(this.$dom, 'img');
    $img.attr('src', CONFIG.img_dir + '/' + src);
    $img.css('height', h + 'px');
  },
  setName: function(name) {
    createLastChild(this.$dom, 'p', name);
  }
}

function Footer_init() {
  var footer = new Footer();
  footer.init();
  footer.setImg('Zabbix_logo_original.png', 40);
  footer.setImg('dscript_logo.png', 80);
  footer.setName('D-Case Weaver');
  footer.setName('Alert Me');
}
