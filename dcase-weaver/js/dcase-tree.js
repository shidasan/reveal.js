var line_width = 6;

function NodeStateManager() {
  this.status = {};
  this.history = {};
  //this.nodes = {};
  this.nodes = [];
  //this.requestView();
  //this.requestHistory();
}

NodeStateManager.prototype.requestHistory = function () {
  var self = this;
  $.ajax(
    {
      url: "cgi-bin/history.py",
      success: function (msg) {
        if (!self.isInitHistory) {
          self.isInitHistory = true;
          self.initHistory(msg);
        } else {
          self.updateHistory(msg);
        }
      },
      error: function (a, b, c) {
        alert("error:" + b);
      },
      complete: function () {
        setTimeout(function () {
                     self.requestHistory();
                   }, 1000);
      }
    }
  );
};

NodeStateManager.prototype.initHistory = function (msg) {
  for(var i = 0; i < msg.length; i++) {
    this.history[msg[i].ID] = msg[i];
  }
};

NodeStateManager.prototype.updateHistory = function (msg) {
  for(var i = 0; i < msg.length; i++) {
    var id = msg[i].ID;
    var node_id = msg[i].NodeID;
    if (!(id in this.history)) {
      this.history[id] = msg[i];
      if (!node_id) { // if reset all status, then NodeID is set Null.
        this.clear();
      } else {
        $(this.nodes).each(
          function () {
            if (this.id == node_id) {
              var status = msg[i].Status || "normal";
              this.setStatus(status);
            }
          }
        );
/*TODO
       } else if (node_id in this.nodes) {
        var status = msg[i].Status || "normal";
        this.nodes[node_id].setStatus(status);
*/
      }
    }
  }
};

NodeStateManager.prototype.clear = function () {
  $(this.nodes).each(
    function () {
      this.setStatus("normal");
    }
  );
/*TODO
  for (var id in this.nodes) {
    this.nodes[id].setStatus("normal");
  }
*/
};

NodeStateManager.prototype.requestView = function () {
  var self = this;
  $.ajax(
    {
      url: "cgi-bin/view.py",
      success: function (msg) {
        self.status = self.parseView(msg);
        $(this.nodes).each(
          function () {
            if (this.id in self.status) {
              this.setStatus(self.status[this.id]);
            }
          }
        );
/*TODO
        for (var id in self.status) {
          if (id in self.nodes) {
            self.nodes[id].setStatus(self.status[id]);
          }
        }
*/
      },
      error: function (a, b, c) {
        alert("error:" + b);
      }
    }
  );
};

NodeStateManager.prototype.parseView = function(msg) {
  var status = {};
  var x = msg.split("\n");
  for (var i = 0; i < x.length; i++) {
    var y = x[i].split(" ");
    var tmp = {};
    for (var j = 0; j < y.length; j++) {
      var z = y[j].split("=");
      if (z.length == 2) {
        tmp[z[0]] = z[1];
      }
    }
    if (tmp.id && tmp.status) {
      status[tmp.id.replace(/\"/g,"")] = tmp.status.replace(/\"/g,"");
    }
  }
  return status;
};

NodeStateManager.prototype.addNode = function (node) {
  //this.nodes[node.id] = node;
  this.nodes.push(node);
  if (node.id in this.status) {
    node.setStatus(this.status[node.id]);
  }
};

var node_state_manager;
$(document).ready(
  function () {
    node_state_manager = new NodeStateManager();
  }
);

function DCaseTree(dcase, option) {
  this.elem = $("<div>").addClass("dcase-tree")[0];
  this.dcase = dcase;
  this.option = option;
}

DCaseTree.prototype.setDCase = function (dcase) {
  this.dcase = dcase;
};

DCaseTree.prototype.draw = function () {
  $(this.elem).empty();
  var node = this.dcase.get_root_node();
  var item = new DCaseTree.SubTree(this.dcase, node, this.option);
  $(this.elem).append(item.elem);
  item.draw();
  this.item = item;
};

DCaseTree.prototype.findNodesByName = function (node_name) {
  var re = new RegExp(node_name, "i");
  var nodes = $(this.elem).find(".dcase-tree-node").filter(
    function () {
      var instance = $(this).data("dcase-tree-node");
      return instance && re.test(instance.name);
    }
  );

  return nodes;
};

DCaseTree.prototype.findNodesByID = function (node_id) {
  var nodes = $(this.elem).find(".dcase-tree-node").filter(
    function () {
      var instance = $(this).data("dcase-tree-node");
      return instance && instance.id == node_id;
    }
  );

  return nodes;
};

DCaseTree.prototype.findSubTreesByName = function (node_name) {
  var re = new RegExp(node_name, "i");
  var nodes = $(this.elem).find(".dcase-sub-tree").filter(
    function () {
      var instance = $(this).data("dcase-sub-tree");
      return instance ? re.test(instance.name) : false;
    }
  );

  return nodes;
};

DCaseTree.prototype.saveAsPNG = function (node_name, scale, callback) {
  var sub_tree = this.findSubTreesByName(node_name)[0];
  if (!sub_tree) {
    alert("No such node: \"" + node_name + "\"");
    return;
  }

  var base = (
    function (elem) {
      var rect = elem.getBoundingClientRect();
      var l = Math.floor(rect.left);
      var t = Math.floor(rect.top);
      var w = Math.floor(rect.width);
      var h = Math.floor(rect.height);

      var canvas = $("<canvas>").attr({width: w * scale, height: h * scale})[0];
      var ctx = canvas.getContext("2d");

      if (scale != 1) ctx.scale(scale, scale);

      ctx.fillStyle = "#FFF";
      ctx.fillRect(0, 0, w, h);

      return {
        canvas: canvas,
        ctx: ctx,
        left: l,
        top : t,
        width: w,
        height: h
      };
    }
  ) (sub_tree);


  $(sub_tree).find(".dcase-tree-link").each(
    function () {
      var rect = this.getBoundingClientRect();
      var l = Math.floor(rect.left - base.left);
      var t = Math.floor(rect.top - base.top);
      base.ctx.drawImage(this, l, t);
    }
  );

  $(sub_tree).find(".dcase-tree-node-bg").each(
    function () {
      var rect = this.getBoundingClientRect();
      var l = Math.floor(rect.left - base.left);
      var t = Math.floor(rect.top - base.top);
      base.ctx.drawImage(this, l, t);
    }
  );

  $(sub_tree).find(".dcase-tree-node").each(
    function () {
      $(this).find(".dcase-tree-node-name").each(
        function () {
          var rect = this.getBoundingClientRect();
          var l = Math.floor(rect.left);
          var t = Math.floor(rect.top);
          var pad_l = parseInt($(this).css("padding-left"));
          var pad_t = parseInt($(this).css("padding-top"));
          var size = parseInt($(this).css("font-size"));
          var font = $(this).css("font-size") + " " +$(this).css("font-family");
          var text = $(this).text();

          base.ctx.save();
          base.ctx.fillStyle = "#000";
          base.ctx.font = font;
          base.ctx.fillText(text, l + pad_l - base.left, t + pad_t + size - base.top);
          base.ctx.restore();

          return false;
        }
      );

      $(this).find(".dcase-tree-node-desc").each(
        function () {
          var rect = this.getBoundingClientRect();
          var l = Math.floor(rect.left);
          var t = Math.floor(rect.top);
          var pad_l = parseInt($(this).css("padding-left"));
          var pad_t = parseInt($(this).css("padding-top"));
          var size = parseInt($(this).css("font-size"));
          var font = $(this).css("font-size") + " " +$(this).css("font-family");

          base.ctx.save();
          base.ctx.fillStyle = "#000";
          base.ctx.font = font;

          var x = l + pad_l - base.left;
          var y = t + pad_t + size - base.top;
          $(this).contents().each(
            function () {
              if (this.nodeType == 3) {
                var text = $(this).text();
                base.ctx.fillText(text, x, y);
                y += size;
              }
            }
          );

          base.ctx.restore();

          return false;
        }
      );
    }

  );

  callback(base.canvas.toDataURL());
};


DCaseTree.SubTree = function (dcase, xml, option) {
  this.dcase = dcase;
  this.xml = xml;
  this.option = option;
  this.elem = $("<div>").addClass("dcase-sub-tree")[0];
  $(this.elem).data("dcase-sub-tree", this);
  this.id = $(xml).attr("id");
  this.type = $(xml).attr("type");
  this.name = $(xml).attr("name");
  var desc = $(dcase.children_ns_dcase(xml, "description")[0]).text();
  this.desc = desc.replace(/\n/g,"<br/>");
  this.node = new DCaseTree.SubTree.Node(this);
  this.children = [];

  // TODO: Multi parents
  this.parentLink = dcase.find_links_by_target(this.id)[0];
};

DCaseTree.SubTree.prototype = {
  draw: function () {
    $(this.elem).empty();

    var i;

    var node_box = $("<div>").addClass("dcase-tree-node-box")[0];
    var context_box = $("<div>").addClass("dcase-tree-contexts-box")[0];
    var spacer = $("<div>").addClass("dcase-tree-spacer")[0];

    $(node_box).append(spacer);
    $(node_box).append(this.node.elem);
    $(node_box).append(context_box);
    $(this.elem).append(node_box);

    this.node.draw();
    $(this.node.elem)
      .click(function (self) {
               return function (e) {
                 self.option.callback(e, self);
               };
             }(this))
      .mouseover(function (self) {
               return function (e) {
                 self.option.onmouseover(e, self);
               };
             }(this))
      .mouseout(function (self) {
               return function (e) {
                 self.option.onmouseout(e, self);
               };
             }(this));

    var child_nodes = this.dcase.find_child_nodes(this.xml);

    this.children = [];
    if (0 < child_nodes.length) {

      var spacer2 = $("<div>").addClass("dcase-tree-spacer2")[0];
      var children_box = $("<div>").addClass("dcase-tree-children-box")[0];

      $(this.elem).append(spacer2);
      $(this.elem).append(children_box);

      for(i = 0; i < child_nodes.length; i++) {
        var item = new DCaseTree.SubTree(this.dcase, child_nodes[i], this.option);
        if (item.type == "Context") {
          $(context_box).css("padding-left", 50)
            .append($("<div>").append(item.elem));
        } else {
          $(children_box).append(item.elem);
        }
        item.draw();
        this.children.push(item);
      }

      $(spacer).css(
        {
          width: $(context_box).outerWidth(),
          height: $(context_box).outerHeight()
        });

      this.draw_link(this.node.elem, this.children);
    }

    node_state_manager.addNode(this.node);

  },
  draw_link: function(node, children) {
    var root_bounding = this.elem.getBoundingClientRect();
    var rl = root_bounding.left;
    var rt = root_bounding.top;

    var node_bounding = node.getBoundingClientRect();
    var nl = node_bounding.left;
    var nt = node_bounding.top;
    var nw = $(node).outerWidth();
    var nh = $(node).outerHeight();
    var nr = nl + nw;
    var nb = nt + nh;
    var nc = nl + nw / 2;
    var nm = nt + nh / 2;

    for (var i = 0; i < children.length; i++) {
      var child_node = children[i].node.elem;
      var child_node_bounding
        = child_node.getBoundingClientRect();
      var cl = child_node_bounding.left;
      var ct = child_node_bounding.top;
      var cw = $(child_node).outerWidth();
      var ch = $(child_node).outerHeight();
      var cr = cl + cw;
      var cb = ct + ch;
      var cc = cl + cw / 2;
      var cm = ct + ch / 2;

      if (children[i].type == "Context") {
        var t = nt < ct ? nt : ct;
        var b = nb < cb ? cb : nb;
        var w = cl - nr;
        var h = b - t;
        var l = nr;

        var link = $("<canvas>").addClass("dcase-tree-link")
          .css({left: l - rl, top: t - rt})
          .attr({width: w, height:h})[0];
        $(link).click(
          function (self, link) {
            return function (e) {
              self.option.onclicklink(e, self.xml, link);
            };
          } (this, link)
        );

        var ctx = link.getContext("2d");
        ctx.beginPath();
        ctx.lineWidth = line_width;
        ctx.moveTo(0, nm - t);
        ctx.lineTo(w, cm - t);
        ctx.stroke();

        $(link).data("dcase-tree-link", {x0: 0, y0: nm -t, x1: w, y1: cm - t});

        $(this.elem).append(link);

      } else {
        var l = nl < cl ? nl : cl;
        var r = nr < cr ? cr : nr;
        var w = r - l;
        var h = ct - nb;
        var t = nb;

        var link = $("<canvas>").addClass("dcase-tree-link")
          .css({left: l - rl, top: t - rt})
          .attr({width: w, height:h})[0];
        $(link).click(
          function (self, link) {
            return function (e) {
              self.option.onclicklink(e, self.xml, link);
            };
          } (this, link)
        );

        var ctx = link.getContext("2d");
        ctx.beginPath();
        ctx.lineWidth = line_width;
        ctx.moveTo(nc - l, 0);
        ctx.lineTo(cc - l, h);
        ctx.stroke();

        $(link).data("dcase-tree-link", {x0: nc - l, y0: 0, x1: cc - l, y1: h});

        $(this.elem).append(link);
      }
    }
  }
};

DCaseTree.SubTree.Node = function (tree) {
  this.elem = $("<div>").addClass("dcase-tree-node")[0];
  $(this.elem).data("dcase-tree-node", this);
  this.id = tree.id;
  this.name = tree.name;
  this.type = tree.type;
  this.desc = tree.desc;
  this.status = "normal";

  if (this.type == "Action") this.type = "Goal";
};

DCaseTree.SubTree.Node.prototype = {
  draw : function () {
    var node_name = $("<div>").addClass("dcase-tree-node-name")
      .text(this.type + ": " + this.name)[0];
    var node_desc = $("<div>").addClass("dcase-tree-node-desc")
      .html(this.desc)[0];
    $(this.elem).append(node_name);
    if (0 < this.desc.length) {
      $(this.elem).append(node_desc);
    }
    this.node_bg = new DCaseTree.SubTree.NodeBG(this.type, this.elem);
  },
  setStatus: function (s) {
    if (this.name == "M_68") {
      var hoge = 1;
    }

    if (this.status != s) {
      this.status = s;
      if (this.node_bg)
        this.node_bg.draw(this.status, this.status == "normal");
    }
  }
};

DCaseTree.SubTree.NodeBG = function (type, parent) {
  this.type = type;
  this.parent = parent;
  this.elem = $("<canvas>")
    .addClass("dcase-tree-node-bg")
    .attr({width:0, height:0})[0];
  this.init();
};

DCaseTree.SubTree.NodeBG.prototype.init = function () {
  if (this.type == "Strategy") {
    $(this.parent).css("padding-left", 8);
    $(this.parent).css("padding-right", 8);

//  } else if (this.type == "Monitor" || this.type == "Action" || this.type == "Evidence") {
  } else if (this.type == "Monitor" || this.type == "Evidence") {
    var w = $(this.parent).width();
    var h = $(this.parent).height();

    var outer_w = w * Math.sqrt(2);
    var outer_h = h * Math.sqrt(2);

    var padding_lr = (outer_w - w) / 2;
    var padding_tb = (outer_h - h) / 2;

    $(this.parent).css("padding-top", padding_tb);
    $(this.parent).css("padding-bottom", padding_tb);
    $(this.parent).css("padding-left", padding_lr);
    $(this.parent).css("padding-right", padding_lr);

  } else if (this.type == "Undeveloped") {
    var digree = 24;
    var w = $(this.parent).width();
    var h = $(this.parent).height();

    var outer_h = h + w * Math.tan(digree * (Math.PI / 180));
    var outer_w = outer_h / Math.tan(digree * (Math.PI / 180));

    var padding_lr = (outer_w - w) / 2;
    var padding_tb = (outer_h - h) / 2;

    $(this.parent).css({
                    "padding-left": padding_lr,
                    "padding-right": padding_lr,
                    "padding-top": padding_tb,
                    "padding-bottom": padding_tb
                  });
  }

  $(this.elem).attr({
                      width: $(this.parent).outerWidth(),
                      height: $(this.parent).outerHeight()
                    });

  $(this.parent).append(this.elem);

  this.draw();
};

DCaseTree.SubTree.NodeBG.prototype._preDraw = function () {
  this.ctx = this.elem.getContext("2d");
  this.ctx.save();

  var parent_w = $(this.parent).outerWidth();
  var parent_h = $(this.parent).outerHeight();

  this.ctx.beginPath();
  this.ctx.lineWidth = line_width;

  var lw = 2;
//  if (this.type == "Monitor" || this.type == "Action" || this.type == "Evidence") {
  if (this.type == "Monitor" || this.type == "Evidence") {
    var min = parent_w < parent_h ? parent_w : parent_h;
    var max = parent_w > parent_h ? parent_w : parent_h;
    this.ctx.scale(parent_w/max, parent_h/max);
    this.ctx.arc(max/2, max/2, max/2 -2, 0, 2 * Math.PI, false);
  } else if (this.type == "Strategy") {
    var l = lw/2;
    var t = lw/2;
    var r = parent_w - lw/2;
    var b = parent_h - lw/2;
    this.ctx.moveTo(l + 10, t);
    this.ctx.lineTo(r, t);
    this.ctx.lineTo(r - 10, b);
    this.ctx.lineTo(l, b);
    this.ctx.closePath();
  } else if (this.type == "Context") {
    var r = 10;
    this.ctx.arc(r, r, r - lw/2, -Math.PI, - 0.5 * Math.PI, false);
    this.ctx.arc(parent_w - r, r, r - lw/2, - 0.5 * Math.PI, 0, false);
    this.ctx.arc(parent_w - r, parent_h - r, r - lw/2, 0, 0.5 * Math.PI, false);
    this.ctx.arc(r, parent_h - r, r - lw/2, 0.5 * Math.PI, Math.PI, false);
    this.ctx.closePath();
  } else if (this.type == "Undeveloped") {
    var l = lw/2;
    var c = parent_w / 2;
    var r = parent_w - lw/2;
    var t = lw/2;
    var m = parent_h / 2;
    var b = parent_h - lw/2;
    this.ctx.moveTo(c, t);
    this.ctx.lineTo(r, m);
    this.ctx.lineTo(c, b);
    this.ctx.lineTo(l, m);
    this.ctx.closePath();
  } else {
    var l = lw/2;
    var t = lw/2;
    var r = parent_w - lw/2;
    var b = parent_h - lw/2;
    this.ctx.moveTo(l, t);
    this.ctx.lineTo(r, t);
    this.ctx.lineTo(r, b);
    this.ctx.lineTo(l, b);
    this.ctx.closePath();
  }
};

DCaseTree.SubTree.NodeBG.prototype._draw = function (color) {
  this.ctx.fillStyle = this.color = color;
  this.ctx.fill();
  this.ctx.stroke();
};

DCaseTree.SubTree.NodeBG.prototype._postDraw = function () {
  this.ctx.restore();
};

DCaseTree.SubTree.NodeBG.prototype.draw = function (status, animation) {
  var color;
  if (!status) status = "normal";
  if (status == "running") {
    color = "#8af";
  } else if (status == "error") {
    color = "#f88";
  } else {
    color = "#fff";
  }

  if (this.animation_running) {
    clearInterval(this.animation_tid);
    this._postDraw();
  }
  this._preDraw();

  if (animation) {
    this.animation_running = true;

    this.animation_tid = setInterval(
      function (self, from, to) {
        var count = 0;
        var max = 60;
        return function () {
          var color = from.multi((max - count) / max).add(to.multi(count / max));
          if (count == max) {
            self.ctx.clearRect(0, 0, $(self.elem).width(), $(self.elem).height());
            self._draw(to.toString());
            self._postDraw();
            clearInterval(self.animation_tid);
            this.animation_running = false;
          } else {
            self._draw(color.toString());
          }
          count++;
        };
      } (this, new Color(this.color), new Color(color)),
      50
    );
  } else {
    this.ctx.clearRect(0, 0, $(this.elem).width(), $(this.elem).height());
    this._draw(color);
    this._postDraw();
  }
};
