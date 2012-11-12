
var Footer = function() {
  this.$dom;
  this.$ul;
  this.logos = [];
};

Footer.prototype = {
  init: function () {
    this.$dom = $('#footer-content');
    this.$ul = createLastChild(this.$dom, 'ul');
  },
  setImg: function(src, h) {
    var $li = createLastChild(this.$ul, 'li');
    var $p = createLastChild($li, 'p');
    var $img = createLastChild($p, 'img');
    $img.attr('src', CONFIG.img_dir + '/' + src);
    $img.css('width', h + 'px');
  },
  setName: function(name) {
    var $li = createLastChild(this.$ul, 'li');
    createLastChild($li, 'p', name);
  }
}

function Footer_init() {
  var footer = new Footer();
  footer.init();
  footer.setImg('dscript_logo.png', 40);
  footer.setImg('deos_logo.gif', 40);
  footer.setImg('ynu_logo.gif', 40);
  footer.setImg('Zabbix_logo_original.png', 40);
}
