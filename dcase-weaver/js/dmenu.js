(function (window) {
   if (!window.deosc) window.deosc = {};

   var DMenuItem = function (label, callback) {
     this.init(label, callback);
   };

   DMenuItem.prototype = {
     init: function (label, callback) {
       var self = this;
       self.label = label;
       self.callback = callback;
       self.elem = $("<div>").addClass("dmenuitem")[0];
       self.elem_label = $("<div>").addClass("dmenuitem-label").text(label)[0];
       self.elem_arrow = $("<canvas>").addClass("dmenuitem-arrow").hide()[0];

       this.drawArrow();

       $(self.elem).append(self.elem_label);
       $(self.elem).append(self.elem_arrow);
       $(self.elem).click(
         function (event) {
           if (self.callback) {
             self.root.destroy();
             self.callback(self.label);
           }
           event.stopPropagation();
         }
       );

       $(self.elem).data("dmenuitem", self);
     },
     drawArrow: function () {
       var w = $(this.elem_arrow).width();
       var h = $(this.elem_arrow).height();
       $(this.elem_arrow).attr({ width: w, height: h });

       var ctx = this.elem_arrow.getContext("2d");
       ctx.save();
       ctx.fillStyle = $(this.elem_arrow).css("color");
       ctx.beginPath();
       ctx.moveTo(w / 3, h / 3);
       ctx.lineTo(w * 2 / 3, h / 2);
       ctx.lineTo(w / 3, h * 2 / 3);
       ctx.closePath();
       ctx.fill();
       ctx.restore();
     },
     showArrow: function () {
       $(this.elem_arrow).css("display", "inline-block");
     },
     hideArrow: function () {
       $(this.elem_arrow).hide();
     },
     setRoot: function (root) {
       this.root = root;
     }
   };

   var DSubMenu = function (label) {
     this.init(label);
   };

   DSubMenu.prototype = {
     init: function (label) {
       this.children = [];
       this.elem = $("<div>").addClass("dsubmenu")[0];
       this.label = label;
       $(this.elem).data("dsubmenu", this);
     },
     appendItem: function (item) {
       var self = this;
       this.children.push(item);

       $(self.elem).append(item.elem);
       $(item.elem).mouseover(
         function (event) {
           $(self.elem).find(".dsubmenu").hide();

           $(self.elem).find(".dmenuitem").removeClass("dmenuitem-selected");
           $(item.elem).addClass("dmenuitem-selected");

           event.stopPropagation();
         }
       );
       return self;
     },
     appendSubMenu: function (menu) {
       var self = this;
       this.children.push(menu);

       var item = new deosc.DMenuItem(menu.label);

       item.showArrow();
       $(menu.elem).hide();

       $(item.elem).append(menu.elem);
       $(self.elem).append(item.elem);

       $(item.elem).mouseover(
         function (event) {
           $(self.elem).find(".dsubmenu").hide();
           //$(menu.elem).show();
           $(menu.elem).css("display", "inline-block");

           $(self.elem).find(".dmenuitem").removeClass("dmenuitem-selected");
           $(item.elem).addClass("dmenuitem-selected");

           event.stopPropagation();
         }
       ).click(
         function (event) {
           if ($(menu.elem).is(":hidden")) {
             //$(menu.elem).show();
             $(menu.elem).css("display", "inline-block");
           } else {
             $(menu.elem).hide();
             $(menu.elem).find(".dmenuitem").removeClass("dmenuitem-selected");
           }
           event.stopPropagation();
         }
       );
       return self;
     },
     setRoot: function (root) {
       this.root = root;
       for(var i = 0; i < this.children.length; i++) {
         this.children[i].setRoot(root);
       }
     }
   };

   var DMenu = function (submenu, opt) {
     this.init(submenu, opt);
   };

   DMenu.prototype = {
     init: function (submenu, opt) {
       var self = this;
       self.menu = submenu;
       self.option = opt;
       self.menu.setRoot(this);

       self.elem = $("<div>").addClass("dmenu")[0];
       self.bg = $("<div>").addClass("dmenu-bg")[0];
       $(self.elem).append(self.bg);
       $(self.bg).append(self.menu.elem);

       $(self.bg).click(
         function (event) {
           self.destroy();
           event.stopPropagation();
         }
       );

       $(this.elem).data("dmenu", this);
     },
     setPosition: function (x, y) {
       $(this.menu.elem).css({ left: x, top: y });
     },
     destroy: function () {
       $(this.elem).remove();
       if (this.option && this.option.onclose) {
         this.option.onclose();
       }
     }
   };

   window.deosc.DMenu = DMenu;
   window.deosc.DSubMenu = DSubMenu;
   window.deosc.DMenuItem = DMenuItem;

}) (window);



