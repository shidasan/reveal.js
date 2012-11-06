(function (window) {
   if (!window.deosc) window.deosc = {};

   var deosc = window.deosc;

   var tool_bar = 0;

   var loadConfig = function (callback) {
     var dcase, dscript;

     function load_dscript () {
       $.ajax(
         {
           url: "cgi-bin/dscript.py",
           success: function(msg) {
             dscript = new DScript(msg);
           },
           complete: function () {
             load_dcase();
           }
         }
       );
     }

     function load_dcase () {
       $.ajax(
         {
           url: "cgi-bin/dcase.py",
           success: function(msg) {
             dcase = new DCase(msg);
           },
           complete: function () {
             callback(dcase, dscript);
           }
         }
       );
     }

     load_dscript();
   };

   var loadConfigOffline = function (callback) {
     var dcase, dscript;

     function load_dscript () {
       $.ajax(
         {
           url: "dscript.xml",
           success: function(msg) {
             dscript = new DScript(msg);
           },
           complete: function () {
             load_dcase();
           }
         }
       );
     }

     function load_dcase () {
       $.ajax(
         {
           url: "dcase.xml",
           success: function(msg) {
             dcase = new DCase(msg);
           },
           complete: function () {
             callback(dcase, dscript);
           }
         }
       );
     }

     load_dscript();
   };

   deosc.loadConfig = deosc.OFFLINE ? loadConfigOffline : loadConfig;


   var create = function (dcase, dscript) {
     var tree;
     var viewer;
     var list;
     var state = "normal";
     var link_editor;

     function drawDCaseTree(arg) {
       tree.draw();
       var child = $(tree.elem).children(".dcase-sub-tree")[0];
       draggable.call(child, {bound:"outer"});
       var l = Math.floor(($(tree.elem).width() - $(child).width()) / 2);
       var t = 0;

       if (arg && arg.id) {
         var node = tree.findNodesByID(arg.id)[0];
         if (node) {
           var tree_rect = tree.elem.getBoundingClientRect();
           var node_rect = node.getBoundingClientRect();
           var sub_tree_root_rect = child.getBoundingClientRect();
           l = sub_tree_root_rect.left - node_rect.left;
           l += (tree_rect.width - node_rect.width) / 2;
           t = sub_tree_root_rect.top - node_rect.top;
           t += (tree_rect.height - node_rect.height) / 2;
         }
         $(child).css({ left: l, top: t });
       } else if (arg && (arg.left || arg.top)) {
         if (arg.left) $(child).css("left", arg.left);
         if (arg.top) $(child).css("top", arg.top);
       } else {
         $(child).css({ left: l, top: t });
       }
     }

     function openDCaseNodeEditor (node, callback) {
       if (viewer && viewer.elem) {
         $(viewer.elem).remove();
       }

       viewer = new deosc.DCaseNodeEditor(
         dcase, node, dscript,
         function () {
           if (callback) callback();
           dcase.updateCache();
           var child = $(tree.elem).children(".dcase-sub-tree")[0];
           var rect = child.getBoundingClientRect();
           drawDCaseTree({left: rect.left, top:rect.top});
           make_info();
         }
       );
       $("body").append(viewer.elem);

       var w = $(viewer.elem).width();
       var h = $(viewer.elem).height();

       if (innerWidth < w) {
         w = innerWidth;
         $(viewer.elem).css("width", w);
       }
       if (innerHeight < h) {
         h = innerHeight;
         $(viewer.elem).css("height", h);
       }

       var l = (innerWidth - w) / 2;
       var t = (innerHeight - h) / 2;

       $(viewer.elem).css("position", "fixed");
       viewer.set_position(l, t);
     }

     function createToolBar() {
       tool_bar = ToolBar();
       $("body").append(tool_bar.elem);

       var dopen = new deosc.DOpen(
         function (xml) {
           dcase.update_xml(xml);
           tree.setDCase(dcase);
           drawDCaseTree();
           make_info();
         }
       );
       $(tool_bar.elem).append(dopen.elem);

       if (deosc.OFFLINE) {
         tool_bar.append(
           $("<button>Save D-Case</button>")
             .click(
               function () {
                 var serializer = new XMLSerializer();
                 var data = serializer.serializeToString(dcase.xml);
                 var builder = new MozBlobBuilder();
                 builder.append(data);

                 var blob = builder.getBlob("application/xml");
                 var url = window.URL.createObjectURL(blob);
                 location.href = url;
               }
             )
         );
       } else {
           tool_bar.append(
           $("<button>Save D-Case</button>")
             .click(
               function () {
                 var serializer = new XMLSerializer();
                 var data = encodeURI(serializer.serializeToString(dcase.xml));
                 download(
                   {
                     ContentType: "application/xml",
                     FileName: "dcase.xml",
                     Encoding: "URL",
                     Data: data
                   }
                 );
               }
             )
         );
       }

       if (!deosc.OFFLINE) {
         tool_bar.append(
           $("<button>Deploy</button>")
             .click(
               function () {
                 var s = new XMLSerializer();
                 var dcase_str = s.serializeToString(dcase.xml);
                 var dscript_str = s.serializeToString(dscript.xml);

                 $.ajax(
                   {
                     url:"cgi-bin/deploy.py",
                     type: "POST",
                     data: {dcase: dcase_str, dscript: dscript_str},
                     success: function(msg) {
                       alert(msg);
                     },
                     error: function(a, b, c) {
                       alert(b);
                     }
                   }
                 );
               }
             )
         );
       }

       var dsearch = new deosc.DSearch(
         {
           search: function (key) {
             var nodes = tree.findNodesByName(key);
             var ret = [];
             for (var i = 0; i < nodes.length; i++) {
               var instance = $(nodes[i]).data("dcase-tree-node");
               ret.push(
                 {
                   node: nodes[i],
                   description: instance.name,
                   callback: function () {
                     move_tree_to_node(this.node);
                   }
                 }
               );
             }
             ret.sort(
               function (a, b) {
                 return a.description > b.description;
               }
             );
             return ret;
           }
         }
       );
       $(tool_bar.elem).append(dsearch.elem);


       if (deosc.OFFLINE) {
         var save_as_png = new deosc.DSaveAsPNG(
           function (node_name, scale) {
             tree.saveAsPNG(
               node_name,
               scale,
               function (url) {
                 location.href = url;
                 //location.href = url.replace("image/png","image/octet-stream");
                 //url = url.replace("image/png","image/octet-stream");
                 //window.open(url, "test.png", "download='test.png'");
               }
             );
           }
         );
         $(tool_bar.elem).append(save_as_png.elem);
       } else {
         var save_as_png = new deosc.DSaveAsPNG(
           function (node_name, scale) {
             tree.saveAsPNG(
               node_name,
               scale,
               function (url) {
                 var data = url.split(",", 2);
                 download(
                   {
                     ContentType: "image/png",
                     FileName: "dcase_" + node_name + ".png",
                     Encoding: "Base64",
                     Data: data[1]
                   }
                 );
               }
             );
           }
         );
         $(tool_bar.elem).append(save_as_png.elem);

       }

     } // createToolBar

     createToolBar();

     function onclick_node_in_normal_state(event, node) {
       var type = $(node).attr("type");
       var menu_add_child = new deosc.DSubMenu("Add Child");

       var callback = function (label) {
         var xml_new_node = dcase.createNodeXML({type: label});
         var obj_new_node = dcase.parseNode(xml_new_node);
         var obj_node = dcase.getNodeCache(node);
         var xml_new_link = dcase.createLinkXML(
           {source: obj_node.id, target: obj_new_node.id}
         );

         openDCaseNodeEditor(
           obj_new_node,
           function (){
             $(dcase.xml_nodes).append(xml_new_node);
             $(dcase.xml_links).append(xml_new_link);
           }
         );
       };

       $(dcase.SELECTABLE_NODE_TYPE[type]).each(
         function () {
           var item = new deosc.DMenuItem(this, callback);
           menu_add_child.appendItem(item);
         }
       );

       var menu = new deosc.DMenu(
         new deosc.DSubMenu()
           .appendSubMenu(menu_add_child)
           .appendItem(
             new deosc.DMenuItem(
               "Edit Node",
               function (label) {
                 openDCaseNodeEditor(dcase.getNodeCache(node));
               }
             )
           ).appendItem(
             new deosc.DMenuItem(
               "Delete Node",
               function (label) {
                 var child = $(tree.elem).children(".dcase-sub-tree")[0];
                 var rect = child.getBoundingClientRect();

                 // TODO: node.delete();
                 dcase.deleteNode(dcase.getNodeCache(node));
                 drawDCaseTree({left: rect.left, top:rect.top});
                 make_info();
               }
             )
           ).appendItem(
             new deosc.DMenuItem(
               "Edit Link",
               function (label) {
                 state = "editlink";
                 link_editor = new deosc.DCaseLinkEditor(
                   node, $(tree.elem).children(".dcase-sub-tree")[0],
                   {
                     onapply: function () {
                       dcase.updateCache();

                       var child = $(tree.elem).children(".dcase-sub-tree")[0];
                       var rect = child.getBoundingClientRect();
                       drawDCaseTree({left: rect.left, top:rect.top});

                       //drawDCaseTree({id: node.id});
                     },
                     onclose: function () {
                       state = "normal";
                     }
                   }
                 );
                 var l = (innerWidth - $(link_editor.elem).width()) / 2;
                 var t = (innerHeight - $(link_editor.elem).height()) / 2;
                 $(link_editor.elem).css({left: l, top: t});
                 $("body").append(link_editor.elem);
               }
             )
           )
       );

       menu.setPosition(event.pageX, event.pageY);
       $("body").append(menu.elem);
     }

     function onmouseover_node_in_editlink_state(event, node) {
       link_editor.setSource(node);
     }

     tree = new DCaseTree(
       dcase,
       {
         callback: function (event, node) {
           if (state == "editlink") {
           } else {
             onclick_node_in_normal_state(event, node);
           }
         },
         onmouseover: function (event, node) {
           if (state == "editlink") {
             onmouseover_node_in_editlink_state(event, node);
           }
         },
         onmouseout: function (event, node) {
           if (state == "editlink") {
           }
         },
         onclicklink: function(event, xml, elem) {
         }

       }
     );

     $("body").append(tree.elem);
     tree.draw();

     function resize_tree_box () {
       var p = $(tree.elem).position();
       $(tree.elem).css(
         {
           width: innerWidth / reveal_scale - p.left - 8,
           height: innerHeight / reveal_scale - p.top - 8
         }
       );
     }
     function set_scale() {
       $(tree.elem).css("-moz-transform", "scale("+reveal_scale+")");
       $(tree.elem).css("-moz-transform-origin", "0 0");
       $(tree.elem).css("-webkit-transform", "scale("+reveal_scale+")");
       $(tree.elem).css("-webkit-transform-origin", "0 0");
       $(tree.elem).css("-ms-transform", "scale("+reveal_scale+")");
       $(tree.elem).css("-ms-transform-origin", "0 0");
     }

     $(tree.elem).css({overflow: "hidden"});
     var child = $(tree.elem).children(".dcase-sub-tree")[0];
     $(window).resize(resize_tree_box);

     $(child).css({ left: Math.floor(($(tree.elem).width() - $(child).width()) / 2) });
     reveal_scale = $(window).width() / $(child).width() * 1.4;
     resize_tree_box();
     //tree.draw();
     draggable.call(child, {bound:"outer"});

     var action_scaleup = function() {
       reveal_scale = Math.min(reveal_scale * 1.5, 1.2);
       set_scale();
       resize_tree_box();
       $(window).resize(resize_tree_box);
       var child = $(tree.elem).children(".dcase-sub-tree")[0];
       draggable.call(child, {bound:"outer"});
     };

     var action_scaledown = function() {
       reveal_scale = Math.max(reveal_scale * 0.66, 0.1);
       set_scale();
       $(window).resize(resize_tree_box);
       resize_tree_box();
       var child = $(tree.elem).children(".dcase-sub-tree")[0];
       draggable.call(child, {bound:"outer"});
     };
     tool_bar.append($("<button>+</button>").click(action_scaleup));
     tool_bar.append($("<button>-</button>").click(action_scaledown));
     set_scale();

     function make_info () {
       $(".dinfo").remove();
       var info = dcase.scan();
       var table = $("<table>").addClass("dinfo")[0];
       $(table).css(
         {
           display: "inline-block",
           position: "absolute",
           top:40,
           margin: 10,
           border: "solid 1px silver"
         }
       );
       for (var key in info) {
         var row = $("<tr><td style=\"padding-right:10px\">" + key + "</td><td style=\"text-align: right\">" + info[key] + "</td></tr>");
         $(table).append(row);
         $("body").append(table);
       }
     }

     make_info();

     function move_tree_to_node (node) {
       var child = $(tree.elem).children(".dcase-sub-tree")[0];

       var tree_rect = tree.elem.getBoundingClientRect();
       var node_rect = node.getBoundingClientRect();
       var sub_tree_root_rect = child.getBoundingClientRect();
       var l = sub_tree_root_rect.left - node_rect.left;
       l += (tree_rect.width - node_rect.width) / 2;
       var t = sub_tree_root_rect.top - node_rect.top;
       t += (tree_rect.height - node_rect.height) / 2;

       var count = 0;
       var max = 20;
       var interval = 50;
       var x0 = sub_tree_root_rect.left;
       var y0 = sub_tree_root_rect.top;
       var x1 = l;
       var y1 = t;

       function animate() {
         setTimeout(
           function () {
             var l = ((max - count) * x0 + count * x1) / max;
             var t = ((max - count) * y0 + count * y1) / max;

             $(child).css({left: l, top: t});
             if (count < max) {
               count++;
               animate();
             }
           },
           interval
         );
       };

       animate();

     }
   };
   deosc.create = create;

   var initDCaseWeaver = function () {
     deosc.loadConfig(deosc.create);
   };
   deosc.initDCaseWeaver = initDCaseWeaver;
}) (window);


(function (window) {
   if (!window.deosc) window.deosc = {};

   var DSaveAsPNG = function (callback) {
     this.elem = $("<div>").addClass("dsaveaspng")[0];
     this.button_save = $("<button>").addClass("tool-bar-item").text("Save D-Case Tree")[0];
     this.label_node = $("<div>").addClass("label-node").text("Node: ")[0];
     this.input_node = $("<input type=text size='10'>").addClass("input-node").val("G_1")[0];
     this.label_scale = $("<div>").addClass("label-scale").text("Scale: ")[0];
     this.input_scale = $("<input type=text size='10'>").addClass("input-scale").val("1.0")[0];
     this.button_ok = $("<button>").text("OK")[0];

     this.sub_window = new deosc.DSubWindow();

     $(this.elem).append(
       $("<div>").append(this.button_save)
     );
     $(this.elem).append(
       $("<div>").append(this.sub_window.elem)
     );
     $(this.sub_window.content).append(
       $("<table>")
         .append(
           $("<tr>")
             .append($("<td>").append(this.label_node))
             .append($("<td>").append(this.input_node))
         )
         .append(
           $("<tr>")
             .append($("<td>").append(this.label_scale))
             .append($("<td>").append(this.input_scale))
         )
     );
     $(this.sub_window.footer).append(this.button_ok);

     $(this.sub_window.elem).hide();
     $(this.sub_window.header).hide();


     var self = this;
     $(this.button_save).click(
       function () {
         if ($(self.sub_window.elem).is(":hidden")) {
           $(self.sub_window.elem).show();
         } else {
           $(self.sub_window.elem).hide();
         }
       }
     );

     $(this.button_ok).click(
       function () {
         $(self.sub_window.elem).hide();
         callback($(self.input_node).val(), parseFloat($(self.input_scale).val()));
       }
     );
   };

   window.deosc.DSaveAsPNG = DSaveAsPNG;
}) (window);


(function (window) {
   if (!window.deosc) window.deosc = {};

   var DSearch = function (args) {
     this.args = args;

     this.elem = $("<div>").addClass("dsearch")[0];

     this.open = $("<button>").text("Search").addClass("tool-bar-item")[0];
     this.input = $("<input type='text' size='16'>")[0];
     this.list = $("<div>").addClass("dsearch-list")[0];

     this.sub_window = new deosc.DSubWindow();

     $(this.elem).append(
       $("<div>").append(this.open)
     );
     $(this.elem).append(
       $("<div>").append(this.sub_window.elem)
     );
     $(this.sub_window.content).append(this.input);
     $(this.sub_window.content).append(this.list);

     $(this.list).hide();
     $(this.sub_window.elem).hide();
     $(this.sub_window.header).hide();
     $(this.sub_window.footer).hide();

     var self = this;
     $(this.open).click(
       function () {
         if ($(self.sub_window.elem).is(":hidden")) {
           $(self.sub_window.elem).show();
         } else {
           $(self.sub_window.elem).hide();
         }
       }
     );

     $(this.input).keyup(
       function (event) {
         if (event.keyCode == 13) {
           var item = $(self.list).find(".dsearch-item")[0];
           $(item).click();
         } else {
           self.onchange();
         }
       }
     );
   };

   DSearch.prototype.onchange = function () {
     if (0 < $(this.input).val().length) {
       var ret = [];
       ret = this.args.search($(this.input).val());
       $(this.list).empty();
       for (var i = 0; i < ret.length; i++) {
         var item = $("<div>").addClass("dsearch-item")[0];
         $(item).text(ret[i].description);
         $(item).click(
           function (self, data) {
             return function () {
               data.callback();
               $(self.sub_window.elem).hide();
               $(self.input).val("");
               $(self.list).hide();
             };
           } (this, ret[i])
         );
         $(this.list).append(item);
       }
       $(this.list).show();
     } else {
       $(this.list).hide();
     }
   };

   window.deosc.DSearch = DSearch;
}) (window);


(function (window) {
   if (!window.deosc) window.deosc = {};

   var DOpen = function (callback) {
     this.elem = $("<div>").addClass("dopen")[0];
     this.open1 = $("<button>").text("Open D-Case").addClass("tool-bar-item")[0];
     this.input = $("<input type=\"file\" name=\"dcase\">")[0];
     this.open2 = $("<button>").text("open")[0];

     this.sub_window = new deosc.DSubWindow();

     $(this.elem).append(
       $("<div>").append(this.open1)
     );
     $(this.elem).append(
       $("<div>").append(this.sub_window.elem)
     );
     $(this.sub_window.content).append(
       $("<div>").append(this.input)
     );
     $(this.sub_window.footer).append(
       $("<div>").append(this.open2)
     );

     $(this.sub_window.elem).hide();
     $(this.sub_window.header).hide();

     var self = this;
     $(this.open1).click(
       function () {
         if ($(self.sub_window.elem).is(":hidden")) {
           $(self.sub_window.elem).show();
         } else {
           $(self.sub_window.elem).hide();
         }
       }
     );

     $(this.open2).click(
       function (event) {
         var f = self.input.files[0];
         var reader = new FileReader();
         reader.onload = function(event) {
           var parser = new DOMParser();
           var doc = parser.parseFromString(event.target.result, "text/xml");
           callback(doc);
         };
         reader.readAsText(f, "utf-8");
         $(self.sub_window.elem).hide();
       }
     );
   };

   window.deosc.DOpen = DOpen;

}) (window);


$(document).ready(
  function () {
    deosc.initDCaseWeaver();
  }
);
