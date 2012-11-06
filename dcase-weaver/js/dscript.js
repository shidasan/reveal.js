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


function DScript(xml) {
  var NS_DSCRIPT = "http://www.dependable-os.net/d-script";
  var dscript = {
    xml: xml,
    dscript_editor: dscript_editor,
    get_modules: get_modules,
    children_ns_dscript: children_ns_dscript,
    find_modules_by_name: find_modules_by_name,
    parse_module: parse_module
  };

  return dscript;

  function dscript_editor(type, name, values) {
    var editor = DScriptEditor(dscript, type);
    editor.set_module(name, values);
    return editor;
  }

  function get_modules(type) {
    if (type == "Action") {
      return get_actions();
    } else if (type == "Monitor") {
      return get_monitors();
    }
    return null;
  }

  function get_monitors() {
    var dscript = children_ns_dscript.call(xml, "d-script");
    var monitors = children_ns_dscript.call(dscript, "monitors");
    return children_ns_dscript.call(monitors, "monitor");
  }

  function get_actions() {
    var dscript = children_ns_dscript.call(xml, "d-script");
    var actions = children_ns_dscript.call(dscript, "actions");
    return children_ns_dscript.call(actions, "action");
  }

  function children_ns_dscript(localName) {
    return children_ns.call(this, NS_DSCRIPT, localName);
  }

  function find_modules_by_name(type, name) {
    if (type == "Action") {
      return find_actions_by_name(name);
    } else if (type == "Monitor") {
      return find_monitors_by_name(name);
    }
    return null;
  }

  function find_monitors_by_name(_name) {
    var monitors = get_monitors();
    for (var i = 0; i < monitors.length; i++) {
      var name = children_ns_dscript.call(monitors[i], "name")[0];
      if ($(name).text() == _name) {
	return monitors[i];
      }
    }
    return null;
  }

  function find_actions_by_name(_name) {
    var actions = get_actions();
    for (var i = 0; i < actions.length; i++) {
      var name = children_ns_dscript.call(actions[i], "name")[0];
      if ($(name).text() == _name) {
	return actions[i];
      }
    }
    return null;
  }

  function parse_module(module) {
    var ret = {};
    var name = children_ns_dscript.call(module, "name")[0];
    var desc = children_ns_dscript.call(module, "description")[0];
    var version = children_ns_dscript.call(module, "version")[0];
    var license = children_ns_dscript.call(module, "license")[0];
    var author = children_ns_dscript.call(module, "author")[0];
    var template = children_ns_dscript.call(module, "config_template")[0];

    if (name)        ret.name            = $(name).text();
    if (desc)        ret.description     = $(desc).text();
    if (version)     ret.version         = $(version).text();
    if (license)     ret.license         = $(license).text();
    if (author)      ret.author          = $(author).text();
    if (template)    ret.config_template = $(template).text();

    var path = children_ns_dscript.call(module, "config_path")[0];
    if (path) {
      ret.config_path = $(path).text();
      var extension = $(path).attr("extension");
      if (extension)
	ret.extension = extension;
    }

    var explanations = children_ns_dscript.call(module, "explanations")[0];
    if (explanations) {
      var explanation = children_ns_dscript.call(explanations, "explanation")[0];
      if (explanation)
	ret.explanation = $(explanation).text();
    }

    var params = children_ns_dscript.call(module, "parameters");
    if (params) {
      ret.parameters = {};
      children_ns_dscript.call(params, "parameter").each(
	function () {
	  var name = $(this).attr("name");
	  if (!name) return;

	  var type = $(this).attr("type");
	  var min = $(this).attr("min");
	  var max = $(this).attr("max");
	  var desc = children_ns_dscript.call(this, "description")[0];
	  var def = children_ns_dscript.call(this, "default")[0];

	  var param = {};
	  if (type) param.type        = type;
	  if (min)  param.min         = min;
	  if (max)  param.max         = max;
	  if (desc) param.description = $(desc).text();
	  if (def)  param.default     = $(def).text();

	  ret.parameters[name] = param;
	}
      );
    }

    return ret;
  }
}


function DScriptEditor(dscript, type) {
  var elem = $("<div>")[0];
  var select = $("<select>").change(onchange)[0];
  var module_table = ModuleTable(dscript);

  $(select).append($("<option>").val(null).text("Select Module"));

  var modules = dscript.get_modules(type);

  modules.each(
    function() {
      var name = $(dscript.children_ns_dscript.call(this, "name")[0]).text();
      $(select).append($("<option>").val(name).text(name));
    }
  );

  $(elem).append(select);
  $(elem).append(module_table.elem);

  return {
    elem: elem,
    set_module: set_module,
    get_name: get_name,
    get_parameters: get_parameters
  };

  function onchange() {
    var name = $(select).val();
    var module = dscript.find_modules_by_name(type, name);
    module_table.set_module(module);
  }

  function set_module(name, params) {
    $(select).val(name);
    var module = dscript.find_modules_by_name(type, name);
    module_table.set_module(module, params);
  }

  function get_name() {
    return module_table.get_name();
  }

  function get_parameters() {
    return module_table.get_parameters();
  }
}


function ModuleTable(dscript, type) {
  var elem = $("<div>");
  var module;

  return {
    elem: elem,
    set_module: set_module,
    get_name: get_name,
    get_parameters: get_parameters
  };

  function set_module(_module, params) {
    module = dscript.parse_module(_module);
    if (module && module.parameters) {
      for (var key in params) {
	if (module.parameters[key]) {
	  module.parameters[key].value = params[key];
	}
      }
    }
    draw();
  }

  function draw() {
    $(elem).empty();

    if (!module) return;

    var module_table = [];

    if (("name" in module)) {
      module_table.push(["Name", module.name]);
    }

    if ("version" in module) {
      module_table.push(["Version", module.version]);
    }

    if ("license" in module) {
      module_table.push(["License", module.license]);
    }

    if ("author" in module) {
      module_table.push(["Author", module.author]);
    }

    if ("config_template" in module) {
      var pre = $("<pre>").text(module.config_template)[0];
      module_table.push(["Template", pre]);
    }

    if ("config_path" in module) {
      module_table.push(["config_path", module.config_path]);
    }

    if ("extension" in module) {
      module_table.push(["Extension", module.extension]);
    }

    if ("explanation" in module) {
      var pre = $("<pre>").text(module.explanation)[0];
      module_table.push(["Explanation", pre]);
    }

    if ("parameters" in module) {
      var param_list = $("<div>")[0];

      for (var name in module.parameters) {
	var param = module.parameters[name];
	var param_table = [];
	param_table.push(["Name", name]);

	if (param.type) {
	  param_table.push(["Type", param.type]);
	}

	if (param.min) {
	  param_table.push(["Min", param.min]);
	}

	if (param.max) {
	  param_table.push(["Max", param.max]);
	}

	if (param.default) {
	  param_table.push(["Default", param.default]);
	}

	if (param.description) {
	  var pre = $("<pre>").text(param.description)[0];
	  param_table.push(["Description", pre]);
	}

	var input = $("<input type='text'>")
	  .change(
	    function (param) {
	      return function () {
		param.value = $(this).val();
	      };
	    } (module.parameters[name])
	  )[0];

	if (param.value) {
	  $(input).val(param.value);
	} else if (param.default) {
	  $(input).val(param.default);
	  module.parameters[name].value = param.default;
	}

	param_table.push(["Value", input]);

	$(param_list).append(create_table(param_table));
      }

      module_table.push(["Parameters", param_list]);
    }

    $(elem).append(create_table(module_table));
  }

  function get_name() {
    return module.name;
  }

  function get_parameters() {
    var params = {};
    for (var name in module.parameters) {
      params[name] = module.parameters[name].value;
    }
    return params;
  }
}