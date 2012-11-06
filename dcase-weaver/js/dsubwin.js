(function (window) {
   if (!window.deosc) window.deosc = {};

   var DSubWindow = function () {
     this.init();
   };

   DSubWindow.prototype.init = function () {
     this.elem = $("<div>").addClass("sub-window")[0];
     this.header = $("<div>").addClass("sub-window-header")[0];
     this.title = $("<div>").addClass("sub-window-title").text("Title")[0];
     this.close = $("<button>x</button>").addClass("sub-window-close")[0];
     this.content = $("<div>").addClass("sub-window-content")[0];
     this.footer = $("<div>").addClass("sub-window-footer")[0];

     $(this.header).append(this.title);
     $(this.header).append(this.close);
     $(this.elem).append(this.header);
     $(this.elem).append(this.content);
     $(this.elem).append(this.footer);
   };

   window.deosc.DSubWindow = DSubWindow;

}) (window);
