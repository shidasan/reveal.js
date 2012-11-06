var reveal_scale = 1.0;

function draggable(options) {
  var self = this;
  var anchor;
  var html = $("html")[0];
  var dragging = false;
  var mouse = {
    position: {
      x: 0, y: 0
    }
  };
  var position = {
    x: 0, y: 0
  };

  if ($(self).css("position") != "absolute"
      && $(self).css("position") != "relative") {
    $(self).css({position: "relative"});
  }

  anchor = (!options || !options.anchor) ? this : options.anchor;

  var mousedown = function (e) {
    dragging = true;
    mouse.position.x = e.pageX;
    mouse.position.y = e.pageY;
    var rect = self.getBoundingClientRect();
    position.x = rect.left / reveal_scale;
    position.y = rect.top  / reveal_scale;
    //position.x = $(self).position().left;
    //position.y = $(self).position().top;

    $(html).mouseup(mouseup);
    $(html).mousemove(mousemove);
    $(html).mouseout(mouseout);

    return false;
  };

  var mousemove = function (e) {
    if (dragging) {
      var dx = e.pageX - mouse.position.x;
      var dy = e.pageY - mouse.position.y;
      var x = position.x + dx / reveal_scale;
      var y = position.y + dy / reveal_scale;

      if (options && options.bound) {
        if(options.bound == "outer") {
          var w = $(self).width();
          var h = $(self).height();
          var r = x + w;
          var b = y + h;
          var pw = $(self.parentNode).width();
          var ph = $(self.parentNode).height();
          var rect = self.parentNode.getBoundingClientRect();
          var pl = rect.left;
          var pt = rect.top;
          //var pl = $(self.parentNode).position().left;
          //var pt = $(self.parentNode).position().top;
          var pr = pl + pw;
          var pb = pt + ph;

          if (pl < x) x = pl;
          if (pt < y) y = pt;
          if (r < pr) x = pr - w;
          if (b < pb) y = pb - h;
          $(self).css({left: x - pl, top: y - pt});
        } else if (options.bound == "inner") {
          //TODO:
        }
      } else {
        $(self).css({left: x, top: y});
      }
    }
    return true;
  };

  var mouseup = function (e) {
    dragging = false;
    $(html).unbind("mouseup", mouseup);
    $(html).unbind("mouseout", mouseout);
    $(html).unbind("mousemove", mousemove);
  };

  var mouseout = function (e) {
    if (e.target != html) return;
    dragging = false;
    $(html).unbind("mouseup", mouseup);
    $(html).unbind("mouseout", mouseout);
    $(html).unbind("mousemove", mousemove);
  };

  $(anchor).mousedown(mousedown);
}

function create_table(list) {
  var table = $("<table>")[0];
  var ilength = list.length;
  for (var i = 0; i < ilength; i++) {
    var tr = $("<tr>")[0];
    $(tr).addClass("tr-" + i);
    if (i == ilength - 1) $(tr).addClass("tr-end");
    (i % 2) ? $(tr).addClass("tr-even") : $(tr).addClass("tr-odd");

    var jlength = list[i].length;
    for (var j = 0; j < jlength; j++) {
      var data = list[i][j];
      var td = $("<td>")[0];
      $(td).addClass("td-" + j);
      if (j == jlength - 1) $(td).addClass("td-end");

      if (data instanceof HTMLElement) {
        $(td).append(data);
      } else if (!(data instanceof Object)) { //number or string
        $(td).text(data);
      }
      $(tr).append(td);
    }
    $(table).append(tr);
  }
  return table;
}

function post(url, data) {
  var form = $("<form method='POST'>")
    .attr("action", url)[0];
  for(var key in data) {
    var input = $("<input type='hidden'>").attr('name', key).attr('value', data[key])[0];
    $(form).append(input);
  }

  $(form).hide();
  $("body").append(form);
  form.submit();
  $(form).remove();
}

function download(obj) {
  var re = new RegExp("^/dre-test/");
  if (re.test(location.pathname)) {
    post("/dre-test/cgi-bin/download.py", obj);
  } else {
    post("/dre/cgi-bin/download.py", obj);
  }
}

function isString(obj) {
  return (obj instanceof String || typeof obj == "string");
}

function isNumber(obj) {
  return (obj instanceof Number || typeof obj == "number");
}

function Color() {
  this.r = 0;
  this.g = 0;
  this.b = 0;

  if (arguments.length == 1) {
    var color = arguments[0];
    if (isString(color)) {
      if (color[0] == "#") {
        if (color.length == 4) {
          this.r = 255 * parseInt(color[1], 16) / 15;
          this.g = 255 * parseInt(color[2], 16) / 15;
          this.b = 255 * parseInt(color[3], 16) / 15;
        } else if (color.length == 7) {
          this.r = parseInt(color.substring(1, 3), 16);
          this.g = parseInt(color.substring(3, 5), 16);
          this.b = parseInt(color.substring(5, 7), 16);
        }
      }
    }
  } else if (arguments.length == 3) {
    if(isNumber(arguments[0])) this.r = this.bound(arguments[0]);
    if(isNumber(arguments[1])) this.g = this.bound(arguments[1]);
    if(isNumber(arguments[2])) this.b = this.bound(arguments[2]);
  }
}

Color.prototype.toString = function () {
  var str_r = this.r.toString(16); if (str_r.length == 1) str_r = "0" + str_r;
  var str_g = this.g.toString(16); if (str_g.length == 1) str_g = "0" + str_g;
  var str_b = this.b.toString(16); if (str_b.length == 1) str_b = "0" + str_b;
  return "#" + str_r + str_g + str_b;
};

Color.prototype.red = function (r) {
  if (r) this.r = r;
  return this.r;
};

Color.prototype.green = function (g) {
  if (g) this.g = g;
  return this.g;
};

Color.prototype.blue = function (b) {
  if (b) this.b = b;
  return this.b;
};

Color.prototype.bound = function (c) {
  c = Math.floor(c);
  if (255 < c) return 255;
  if (c < 0) return 0;
  return c;
};

Color.prototype.multi = function (c) {
  var r, g, b;
  if (c instanceof Color) {
    r = this.bound(this.r * c.red());
    g = this.bound(this.g * c.green());
    b = this.bound(this.b * c.blue());
  } else if (isNumber(c)) {
    r = this.bound(this.r * c);
    g = this.bound(this.g * c);
    b = this.bound(this.b * c);
  } else {
    r = this.r;
    g = this.g;
    b = this.b;
  }
  return new Color(r, g, b);
};

Color.prototype.add = function (c) {
  var r, g, b;
  if (c instanceof Color) {
    r = this.bound(this.r + c.red());
    g = this.bound(this.g + c.green());
    b = this.bound(this.b + c.blue());
  } else if (isNumber(c)) {
    r = this.bound(this.r + c);
    g = this.bound(this.g + c);
    b = this.bound(this.b + c);
  } else {
    r = this.r;
    g = this.g;
    b = this.b;
  }
  return new Color(r, g, b);
};
