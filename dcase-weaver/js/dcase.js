function children_ns(ns, localName) {
  return $(this).children("*").filter(
    function () {
      var self = $(this)[0];
      if (self.namespaceURI != ns)
        return false;
      if (self.localName != localName)
        return false;
      return true;
    });
}


function DCase(xml) {
  this.update_xml(xml);
}

DCase.prototype.update_xml = function (xml) {
  this.xml = xml;
  this.xml_dcase = $(xml).children().filter(
    function () {
      return this.nodeName == "dcase:dcase";
    }
  )[0];
  this.NS_DCASE = this.xml_dcase.namespaceURI;
  //this.xml_dcase = children_ns_dcase(this.xml, "dcase")[0];
  this.xml_nodes = this.children_ns_dcase(this.xml_dcase, "nodes")[0];
  this.xml_links = this.children_ns_dcase(this.xml_dcase, "links")[0];
  this.updateCache();
};

DCase.prototype.children_ns_dcase = function (parent, localName) {
  return children_ns.call(parent, this.NS_DCASE, localName);
};

DCase.prototype.find_nodes_by_name = function (name) {
  var ret = [];

  if (this.cache) {
    var nodes = this.cache.nodes;
    for (var key in nodes) {
      if (nodes[key].name == name) {
        ret.push(nodes[key].xml);
      }
    }
    return ret;
  }

  this.children_ns_dcase(this.xml_nodes, "node").each(
    function () {
      if ($(this).attr("name") == name) {
        ret.push(this);
      }
    }
  );

  return ret;
};

DCase.prototype.find_nodes_by_id = function (id) {
  var ret = [];

  if (this.cache) {
    var node =  this.cache.nodes[id];
    if (node) ret.push(node.xml);
    return ret;
  }

  this.children_ns_dcase(this.xml_nodes, "node").each(
    function () {
      if ($(this).attr("id") == id) {
        ret.push(this);
      }
    }
  );
  return ret;
};

DCase.prototype.find_links_by_target = function (target) {
  var ret = [];
  if (this.cache) {
    var links = this.cache.links;
    for (var key in links) {
      if (links[key].target == target) {
        ret.push(links[key].xml);
      }
    }
    return ret;
  }

  this.children_ns_dcase(this.xml_links, "link").each(
    function () {
      if ($(this).attr("target") == target) {
        ret.push(this);
      }
    }
  );
  return ret;
};

DCase.prototype.find_links_by_source = function (source) {
  var ret = [];

  if (this.cache) {
    var links = this.cache.links;
    for (var key in links) {
      if (links[key].source == source) {
        ret.push(links[key].xml);
      }
    }
    return ret;
  }

  this.children_ns_dcase(this.xml_links, "link").each(
    function () {
      if ($(this).attr("source") == source) {
        ret.push(this);
      }
    }
  );
  return ret;
};

DCase.prototype.find_parent_nodes = function (node) {
  var ret = [];
  var links = this.find_links_by_target($(node).attr("id"));
  for(var i = 0; i <links.length; i++) {
    ret.push(this.find_nodes_by_id($(links[i]).attr("source"))[0]);
  }
  return ret;
};

DCase.prototype.find_child_nodes = function (node) {
  var ret = [];
  var links = this.find_links_by_source($(node).attr("id"));
  for(var i = 0; i <links.length; i++) {
    ret.push(this.find_nodes_by_id($(links[i]).attr("target"))[0]);
  }
  return ret;
};

DCase.prototype.get_root_node = function () {
  return this.children_ns_dcase(this.xml_nodes, "node")[0];
};

DCase.prototype.scan = function () {
  var info = {};
  function _scan(node) {
    var type =  $(node).attr("type");
    if (type in info) {
      info[type]++;
    } else {
      info[type] = 1;
    }

    var children = this.find_child_nodes(node);
    for (var i = 0; i < children.length; i++) {
      _scan.call(this, children[i]);
    }
  }

  var node = this.get_root_node();

  _scan.call(this, node);

  return info;
};

DCase.prototype.updateCache = function () {
  var self = this;
  self.cache = {};
  self.cache.ids = [];
  self.cache.names = [];
  var nodes = self.children_ns_dcase(self.xml_dcase, "nodes")[0];
  var links = self.children_ns_dcase(self.xml_dcase, "links")[0];
  self.cache.nodes = {};
  self.children_ns_dcase(nodes, "node").each(
    function () {
      var obj = self.parseNode(this);
      self.cache.nodes[obj.id] = obj;
      self.cache.ids.push(obj.id);
      self.cache.names.push(obj.name);
    }
  );
  self.cache.links = {};
  self.children_ns_dcase(links, "link").each(
    function () {
      var obj = self.parseLink(this);
      self.cache.links[obj.id] = obj;
      self.cache.ids.push(obj.id);
      self.cache.names.push(obj.name);
    }
  );
};

DCase.prototype.parseNode = function (xml) {
  var self = this;
  var obj= {
    xml: xml,
    id: $(xml).attr("id"),
    name: $(xml).attr("name"),
    type: $(xml).attr("type")
  };

  self.children_ns_dcase(xml, "description").each(
    function () {
      obj.description = $(this).text();
      return false;
    }
  );

  self.children_ns_dcase(xml, "d-script").each(
    function() {
      var dscript = {};
      self.children_ns_dcase(this, "full-name").each(
        function () {
          dscript["full-name"] = $(this).text();
          return false;
        }
      );
      self.children_ns_dcase(this, "values").each(
        function () {
          dscript.values = {};
          self.children_ns_dcase(this, "value").each(
            function () {
              var name = $(this).attr("name");
              dscript.values[name] = $(this).text();
            }
          );
          return false;
        }
      );
      obj["d-script"] = dscript;
      return false;
    }
  );

  return obj;
};

DCase.prototype.parseLink = function (xml) {
  return {
    xml: xml,
    id: $(xml).attr("id"),
    name: $(xml).attr("name"),
    source: $(xml).attr("source"),
    target: $(xml).attr("target")
  };
};

DCase.prototype.getNewID = function (prefix) {
  var ids = this.cache.ids;
  var re = new RegExp("^" + prefix + "([0-9]+)$");
  var max = 0;
  for (var i = 0; i < ids.length; i++) {
    if (ids[i].match(re)) {
      var n = RegExp.$1;
      n = parseInt(n);
      if (max < n) max = n;
    }
  }
  return prefix + ++max;
};

DCase.prototype.getNewName = function (prefix) {
  var names = this.cache.names;
  var exp = "^" + prefix + "([0-9]+)$";
  var re = new RegExp(exp);
  var max = 0;
  for (var i = 0; i < names.length; i++) {
    if (names[i].match(re)) {
      var n = RegExp.$1;
      n = parseInt(n);
      if (max < n) max = n;
    }
  }
  return prefix + ++max;
};

DCase.prototype.createNodeXML = function (opt) {
  var type = ("type" in opt) ? opt.type : "Goal";
  var node = document.createElementNS(this.NS_DCASE, "node");
  var desc = document.createElementNS(this.NS_DCASE, "description");
  var prop = document.createElementNS(this.NS_DCASE, "properties");

  $(node).attr(
    {
      name: this.getNewName(this.NODE_NAME_PREFIX[type]),
      id: this.getNewID("_dcase_node_"),
      type: type,
      status: ""
    }
  ).append(desc).append(prop);

  $(desc).text(("description" in opt) ? opt.description : "");

  $(prop).append(
    $(document.createElementNS(this.NS_DCASE, "property"))
      .attr({name: "Attachment", value:""})
  );
  $(prop).append(
    $(document.createElementNS(this.NS_DCASE, "property"))
      .attr({name: "Userdef002", value:""})
  );

  return node;
};

DCase.prototype.createLinkXML = function (opt) {
  var link = document.createElementNS(this.NS_DCASE, "link");
  var desc = document.createElementNS(this.NS_DCASE, "description");
  var prop = document.createElementNS(this.NS_DCASE, "properties");

  $(link).attr(
    {
      name: this.getNewName(this.LINK_NAME_PREFIX),
      id: this.getNewID("_dcase_link_"),
      target: ("target" in opt) ? opt.target : "",
      source: ("source" in opt) ? opt.source : ""
    }
  ).append(desc).append(prop);

  return link;
};

DCase.prototype.getNodeCache = function (node) {
  return this.cache.nodes[$(node).attr("id")];
};

DCase.prototype.getLinkCache = function (link) {
  return this.cache.links[$(link).attr("id")];
};

DCase.prototype.editNode = function (node) {

  if ("name" in node) {
    $(node.xml).attr("name", node.name);
  }

  if ("type" in node) {
    $(node.xml).attr("type", node.type);
  }

  if ("id" in node) {
    $(node.xml).attr("id", node.id);
  }

  if ("description" in node) {
    this.children_ns_dcase(node.xml, "description").each(
      function () {
        $(this).text(node.description);
        return false;
      }
    );
  }

  this.children_ns_dcase(node.xml, "d-script").remove();

  if ("d-script" in node) {

    var dscript = document.createElementNS(this.NS_DCASE, "d-script");
    var full_name = document.createElementNS(this.NS_DCASE, "full-name");
    var values = document.createElementNS(this.NS_DCASE, "values");

    $(full_name).text(node["d-script"]["full-name"]);

    for (var name in node["d-script"].values) {
      var value = document.createElementNS(this.NS_DCASE, "value");
      $(value).attr("name", name).text(node["d-script"].values[name]);
      $(values).append(value);
    }

    $(dscript).append(full_name);
    $(dscript).append(values);

    $(node.xml).append(dscript);
  }
};

DCase.prototype.deleteNode = function (node) {
  $(node.xml).remove();

  $(this.find_links_by_target(node.id)).each(
    function () {
      console.log("target: " + node.id);
      $(this).remove();
    }
  );

  $(this.find_links_by_source(node.id)).each(
    function () {
      console.log("source: " + node.id);
      $(this).remove();
    }
  );

  this.updateCache();
};

DCase.prototype.deleteLink = function (link) {
  $(link.xml).remove();
};

DCase.prototype.NODE_TYPE = [
  "Goal", "Evidence", "Strategy", "Context", "Monitor", "Undeveloped", "Action"
];

DCase.prototype.SELECTABLE_NODE_TYPE = {
  Goal: ["Evidence", "Strategy", "Context", "Monitor", "Undeveloped"],
  Strategy: ["Goal", "Context"],
  Evidence: ["Context"],
  Monitor: ["Context"],
  Action: ["Context"],
  All: DCase.prototype.NODE_TYPE
};

DCase.prototype.NODE_NAME_PREFIX = {
  Goal: "G_", Strategy: "S_", Evidence: "E_", Context: "C_",
  Monitor: "M_", Undeveloped: "U_", Action: "G_"
};

DCase.prototype.LINK_NAME_PREFIX = "LINK_";

