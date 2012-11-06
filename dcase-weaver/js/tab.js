function Tab (tabs) {
  var elem = $("<div>")[0];
  var tab_box = $("<div>").addClass("tab-box")[0];
  var content_box = $("<div>").addClass("content-box")[0];
  var contents = [];
  var current = 0;

  $(tabs).each(
    function (index) {
      var content = $("<div>").addClass("content")[0];
      $(content).append(this.elem);
      $(content_box).append(content);

      var name = this.name ? this.name : "tab " + index;
      var tab = $("<div>").addClass("tab").text(name)[0];
      $(tab_box).append(tab);

      contents.push(
        {
          tab: tab,
          content: content,
          option: this
        });
    }
  );

  $(elem).append(tab_box);
  $(elem).append(content_box);

  return {
    elem: elem,
    draw: draw
  };

  function draw() {
    $(contents).each(
      function (index) {
        if (index == current) {
          $(this.content).show();
          if (this.option.show) this.option.show();
          $(this.tab)
            .addClass("selected")
            .unbind("click");
        } else {
          $(this.content).hide();
          if (this.option.hide) this.option.hide();
          $(this.tab)
            .removeClass("selected")
            .click(
              function (index) {
                return function () {
                  current = index;
                  draw();
                };
              } (index)
            );
        }
      }
    );
  }
}