(function (window) {
   if (!window.deosc) window.deosc = {};

   var DCaseLinkEditor = function (node, parent, options) {
     this.init(node, parent, options);
   };

   DCaseLinkEditor.prototype = {
     init: function (dst, root, options) {
       this.root = root;
       this.options = options;
       this.setDestination(dst);
       this.subwin = new deosc.DSubWindow();
       this.elem = this.subwin.elem;
       this.elemDescription = $("<div>").text("Select parent node")[0];
       this.elemNodeName = $("<div>").text("Parent node:")[0];
       this.elemOKButton = $("<button>").text("OK")[0];
       this.elemCancelButton = $("<button>").text("Cancel")[0];
       $(this.elem).addClass("dcase-link-editor");
       $(this.subwin.title).text("Link Editor: " + dst.name);
       $(this.subwin.content).append(this.elemDescription);
       $(this.subwin.content).append(this.elemNodeName);
       $(this.subwin.footer).append(this.elemOKButton);
       $(this.subwin.footer).append(this.elemCancelButton);

       var self = this;
       $(this.subwin.close).click(
         function () {
           self.onclose();
         }
       );
       $(this.elemCancelButton).click(
         function () {
           self.onclose();
         }
       );
       $(this.elemOKButton).click(
         function () {
           self.onapply();
         }
       );
     },
     setSource: function(src) {
       this.srcTree = src;
       this.drawSourceForcus();
       this.drawLink();
       $(this.elemNodeName).text("Parent node: " + src.name);
     },
     setDestination: function(dst) {
       this.dstTree = dst;
       this.drawDestinationForcus();
     },
     drawLink: function () {
       $("#dcase-link-editor-link").remove();
       var rootRect = this.root.getBoundingClientRect();
       var rootX = rootRect.left;
       var rootY = rootRect.top;

       var srcRect = this.srcTree.node.elem.getBoundingClientRect();
       var srcX = srcRect.left;
       var srcY = srcRect.top;
       var srcW = srcRect.width;
       var srcH = srcRect.height;

       var dstRect = this.dstTree.node.elem.getBoundingClientRect();
       var dstX = dstRect.left;
       var dstY = dstRect.top;
       var dstW = dstRect.width;
       var dstH = dstRect.height;

       var dSrcR2DstL = dstX - (srcX + srcW);
       var dSrcL2DstR = srcX - (dstX + dstW);
       var dSrcB2DstT = dstY - (srcY + srcH);
       var dSrcT2DstB = srcY - (dstY + dstH);

       var canvasSrcX, canvasSrcY, canvasDstX, canvasDstY;
       if (0 < dSrcR2DstL) {
         canvasSrcX = srcX + srcW;
         canvasSrcY = srcY + srcH / 2;
         canvasDstX = dstX;
         canvasDstY = dstY + dstH / 2;
       } else if (0 < dSrcL2DstR) {
         canvasSrcX = srcX;
         canvasSrcY = srcY + srcH / 2;
         canvasDstX = dstX + dstW;
         canvasDstY = dstY + dstH / 2;
       } else if (0 < dSrcB2DstT) {
         canvasSrcX = srcX + srcW / 2;
         canvasSrcY = srcY + srcH;
         canvasDstX = dstX + dstW / 2;
         canvasDstY = dstY;
       } else if (0 < dSrcT2DstB) {
         canvasSrcX = srcX + srcW / 2;
         canvasSrcY = srcY;
         canvasDstX = dstX + dstW / 2;
         canvasDstY = dstY + dstH;
       } else {
         canvasSrcX = srcX + srcW / 2;
         canvasSrcY = srcY + srcH / 2;
         canvasDstX = dstX + dstW / 2;
         canvasDstY = dstY + dstH / 2;
       }

       var baseX = canvasSrcX < canvasDstX ? canvasSrcX : canvasDstX;
       var baseY = canvasSrcY < canvasDstY ? canvasSrcY : canvasDstY;

       canvasSrcX -= baseX;
       canvasDstX -= baseX;
       canvasSrcY -= baseY;
       canvasDstY -= baseY;

       var canvasW = Math.abs(canvasSrcX - canvasDstX);
       var canvasH = Math.abs(canvasSrcY - canvasDstY);

       var canvas = $("<canvas>").attr(
         {
           "id": "dcase-link-editor-link",
           width: Math.floor(canvasW + 2), height: Math.floor(canvasH + 2)
         }
       ).css(
         {
           position: "absolute",
           left: Math.floor(baseX - rootX),
           top: Math.floor(baseY - rootY)
         }
       )[0];

       var ctx = canvas.getContext("2d");
       ctx.strokeStyle = "#F00";
       ctx.lineWidth = 2;
       ctx.beginPath();
       ctx.moveTo(Math.floor(canvasSrcX), Math.floor(canvasSrcY));
       ctx.lineTo(Math.floor(canvasDstX), Math.floor(canvasDstY));
       ctx.stroke();

       $(this.root).append(canvas);
     },
     drawSourceForcus: function () {
       $("#dcase-link-editor-src-forcus").remove();
       var forcus = this._createForcus(this.srcTree.node.elem, "#F00");
       $(forcus).attr("id", "dcase-link-editor-src-forcus");
       $(this.root).append(forcus);
     },
     drawDestinationForcus: function () {
       $("#dcase-link-editor-dst-forcus").remove();
       var forcus = this._createForcus(this.dstTree.node.elem, "#00F");
       $(forcus).attr("id", "dcase-link-editor-dst-forcus");
       $(this.root).append(forcus);
     },
     _createForcus: function (node, color) {
       var rootRect = this.root.getBoundingClientRect();
       var rect = node.getBoundingClientRect();
       return $("<div>").css(
         {
           position: "absolute",
           display: "inline-block",
           left: rect.left - rootRect.left,
           top: rect.top - rootRect.top,
           width: rect.width,
           height: rect.height,
           border: "3px solid " + color
         }
       );
     },
     draw: function () {
       this.drawLink();
       this.drawSourceForcus();
       this.drawDestinationForcus();
     },
     onapply: function () {
       var parentLink = this.dstTree.parentLink;
       var newParentID = this.srcTree.id;
       $(parentLink).attr("source", newParentID);
       if (this.options.onapply) this.options.onapply();
       this.onclose();
     },
     onclose: function () {
       $(this.elem).remove();
       $("#dcase-link-editor-src-forcus").remove();
       $("#dcase-link-editor-dst-forcus").remove();
       $("#dcase-link-editor-link").remove();
       if (this.options.onclose) this.options.onclose();
     }
   };

   window.deosc.DCaseLinkEditor = DCaseLinkEditor;

}) (window);