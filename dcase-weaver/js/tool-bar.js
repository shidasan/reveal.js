function ToolBar() {
  var elem;

  function init() {
    elem = $("<div>").addClass("tool-bar")[0];
  }

  function append(button) {
    $(button).addClass("tool-bar-item");
    $(elem).append(button);
  }

  init();

  return {
    elem: elem,
    append: append
  };
}