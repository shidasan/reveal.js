function DCaseLinkList(dcase, node) {
  var table_list = [];
  //TODO: if node has multi parents
  while (node) {
    var name_text = $(node).attr("name");
    var desc = dcase.children_ns_dcase(node, "description")[0];
    table_list.unshift([$("<div>").text(name_text)[0], $(desc).text()]);
    node = dcase.find_parent_nodes(node)[0];
  }

  for(var i = 1; i < table_list.length; i++) {
    $(table_list[i][0]).css("padding-left", i*8);
  }

  var elem = create_table(table_list);
  $(".td-1", elem).css("min-width", 300);

  return {
    elem: elem
  };
}

(function (window) {
   if (!window.deosc) window.deosc = {};

   var DCaseNodeEditor = function (dcase, node, dscript, callback) {
     this.init(dcase, node, dscript, callback);
   };

   DCaseNodeEditor.prototype = {
     init: function (dcase, node, dscript, callback) {
       var self = this;
       self.dcase = dcase;
       self.node = node;
       self.dscript = dscript;
       self.callback = callback;

       self.subwin = new deosc.DSubWindow();

       self.elem = self.subwin.elem;
       $(self.elem).addClass("dcase-node-editor");

       $(self.subwin.title).text("Node Editor");
       $(self.subwin.close).click(
         function () {
           self.onclose();
         }
       );

       self.edit_name = $("<input type='text'>").val(node.name)[0];
       self.edit_type = $("<select>")[0];
       $(dcase.SELECTABLE_NODE_TYPE["All"]).each(
         function () {
           var option = $("<option>").val(this).text(this)[0];
           $(self.edit_type).append(option);
         }
       );
       $(self.edit_type).val(node.type);
       //self.edit_id = $("<input type='text'>").val(node.id)[0];
       self.edit_id = $("<div>").text(node.id)[0];
       self.edit_desc = $("<textarea>").val(node.description)[0];

       var table_list = [
         ["Name", self.edit_name],
         ["Type", self.edit_type],
         ["ID", self.edit_id],
         ["Description", self.edit_desc]
       ];

       table_list.push(["Link", DCaseLinkList(dcase, node.xml).elem]);

       if ("type" in node && (node.type == "Action" || node.type == "Monitor")) {
         if ("d-script" in node) {
	       self.dscript_editor = dscript.dscript_editor(
	         node.type,
	         node["d-script"]["full-name"],
	         node["d-script"].values
	       );
         } else {
	       self.dscript_editor = dscript.dscript_editor(node.type);
         }

         table_list.push([node.type, self.dscript_editor.elem]);
       }

       $(self.subwin.content).append(create_table(table_list));
       $(self.subwin.content).css("max-width", Math.floor(innerWidth * 0.8));
       $(self.subwin.content).css("max-height", Math.floor(innerHeight * 0.8));

       $(self.subwin.footer).append(
         $("<button>").text("OK").click(
           function () {
             self.onapply();
           }
         )
       ).append(
         $("<button>").text("Cancel").click(
           function () {
             self.onclose();
           }
         )
       );

     },
     onapply: function () {
       this.node.name = $(this.edit_name).val();
       this.node.type = $(this.edit_type).val();
       //this.node.id = $(this.edit_id).val();
       this.node.description = $(this.edit_desc).val();

       if (self.dscript_editor) {
         this.node["d-script"] = {
           "full-name": self.dscript_editor.get_name(),
           "values": self.dscript_editor.get_parameters()
         };
       }
       // TODO: this.node.edit();
       this.dcase.editNode(this.node);
       this.onclose();
       this.callback();
     },
     onclose: function () {
       $(this.elem).remove();
     },
     set_position: function (x, y) {
       $(this.elem).css({left:x, top: y});
     }
   };

   window.deosc.DCaseNodeEditor = DCaseNodeEditor;

}) (window);


function DCaseNodeViewer(dcase, dscript) {
  var dcase_node;
  var dcase_node_header;
  var content;
  var apply;
  var dscript_editor;
  var this_node;

  init();

  $(apply).click(onapply);

  return {
    elem: dcase_node,
    show: show,
    hide: hide,
    set_position: set_position
  };

  function init () {
    dcase_node = $("<div>").css({"position": "absolute", "background-color": "lightgray", "border": "2px solid gray", "padding": "4px"})[0];
    dcase_node_header = $("<div>").addClass("dcase-node-header").css({padding: 2, "background-color":"whitesmoke"})[0];
    content = $("<div>").addClass("dcase-node-content").css({padding: 2, "background-color":"white"})[0];
    var footer = $("<div>").css({padding: 2, "background-color":"whitesmoke", "text-align": "center"})[0];
    var headerL = $("<div>").css({display:"inline-block", width: "80%"}).text("Node Editor")[0];
    var headerR = $("<div>").css({display:"inline-block", "text-align": "right", width: "20%"})[0];
    var close_button = $("<button>X</button>").css({})[0];
    apply = $("<button>apply</button>").addClass("dcase-node-apply")[0];


    $(close_button).click(
      function () {
	$(dcase_node).hide();
      }
    );

    $(dcase_node_header).append(headerL);
    $(headerR).append(close_button);
    $(dcase_node_header).append(headerR);
    $(dcase_node).append(dcase_node_header);
    $(dcase_node).append(content);
    $(footer).append(apply);
    $(dcase_node).append(footer);

    $(dcase_node).hide();
  }

  function show (node) {
    this_node = node;

    $(content).empty();

    var desc = $("<pre>").text(node.description)[0];

    var table_list = [
      ["Name", node.name],
      ["Type", node.type],
      ["ID", node.id],
      ["Description", desc]
    ];

    table_list.push(["Link", DCaseLinkList(dcase, node.xml).elem]);

    if ("type" in node && (node.type == "Action" || node.type == "Monitor")) {
      if ("d-script" in node) {
	dscript_editor = dscript.dscript_editor(
	  node.type,
	  node["d-script"]["full-name"],
	  node["d-script"].values
	);
      } else {
	dscript_editor = dscript.dscript_editor(node.type);
      }

      table_list.push([node.type, dscript_editor.elem]);
    }

    $(content).append(create_table(table_list));
    $(content).css("overflow", "auto");
    $(content).css("max-width", Math.floor(innerWidth * 0.8));
    $(content).css("max-height", Math.floor(innerHeight * 0.8));

    $(dcase_node).show();
  }

  function hide () {
    $(dcase_node).hide();
  }

  function onapply() {
    if (!dscript_editor) return;

    this_node["d-script"] = {
      "full-name": dscript_editor.get_name(),
      "values": dscript_editor.get_parameters()
    };
    dcase.editNode(this_node);
  }

  function set_position(l, t) {
    $(dcase_node).css({left:l, top:t});
  }
}



