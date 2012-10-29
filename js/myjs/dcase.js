var field_height = 0;
var field_width = 0;
var line;
var flowviewer;
var dscript_svg;

function DCase_init() {
  var dmng = new DManager();
  dmng.init();
  dmng.createDCase('RAMディスクにデータをコピーする');
  //dmng.createDCase('RAMディスクにデータをコピーする2');
}
