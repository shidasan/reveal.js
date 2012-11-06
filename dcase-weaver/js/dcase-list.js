function DCaseList(dcase) {
  var elem;

  function init() {
    elem = $("<div>")[0];
  }

  function draw() {
    $(elem).empty();
    var node = dcase.get_root_node();
    var list_item = DCaseListItem(dcase, node);
    $(elem).append(list_item.elem);
    list_item.draw();
  }

  init();

  return {
    elem: elem,
    draw: draw
  };
}

function DCaseListItem(dcase, node) {
  var elem;

  function init() {
    elem = $("<div>").css({"padding-left": 10})[0];
  }

  function draw() {
    $(elem).empty();

    var child_nodes = dcase.find_child_nodes(node);

    var name = $(node).attr("name");
    var desc = dcase.children_ns_dcase(node, "description")[0];
    var name_elem = $("<div>").css("display","inline-block").text(name)[0];
    var children_elem = $("<div>")[0];

    if (0 < child_nodes.length) {
      var button = $("<div>-</div>").css({display:"inline-block", border:"1px solid black",width:16, height:16, "text-align":"center", margin:2})[0];
      $(button).click(
	function () {
	  if ($(button).text() == "-") {
            $(children_elem).hide();
            $(button).text("+");
          } else {
            $(children_elem).show();
            $(button).text("-");
          }
	});
      $(elem).append(button);
    } else {
      var dmy_button = $("<div>").css({display: "inline-block", width:16, height:16, margin:2});
      $(elem).append(dmy_button);
    }

    $(elem).append(name_elem);

    $(child_nodes).each(
      function() {
	var list_item = DCaseListItem(dcase, this);
	$(children_elem).append(list_item.elem);
	list_item.draw();
      }
    );

    $(elem).append(children_elem);
  }

  init();

  return {
    elem: elem,
    draw: draw
  };
}