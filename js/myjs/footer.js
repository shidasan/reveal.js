
var Footer = function() {
  this.$dom;
  this.$ul;
  this.logos = [];
};

Footer.prototype = {
  init: function () {
    this.$dom = $('#footer-content');
  },
  setImg: function(src, h) {
    var $img = createLastChild(this.$dom, 'img');
    $img.attr('src', CONFIG.img_dir + '/' + src);
    $img.css('width', h + 'px');
    $($img).click(function(e) {
        console.log("CLICK!!");
    });
  },
  setName: function(name) {
    var $li = createLastChild(this.$ul, 'li');
    createLastChild($li, 'p', name);
  }
}

function Footer_init() {
  var footer = new Footer();
  footer.init();
  //footer.setImg('dscript_logo.png', 128);
  //footer.setImg('deos_logo.gif', 128);
  //footer.setImg('ynu_logo.gif', 128);
  //footer.setImg('Zabbix_logo_original.png', 128);
}
