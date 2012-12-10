/*
 * editor is embedded into:
 * <textarea id="editor">hello, world</textarea>
 */

var dscript_editors = [];

function Editor_init() {
  dscript_editors.push(createEditor_chenji($('#chenji_editor'), "#exec"));
  dscript_editors.push(createEditor_chenji($('#chenji_editor2'), "#exec2"));
  dscript_editors.push(createEditor_chenji($('#chenji_editor3'), "#exec3"));
  dscript_editors.push(createEditor_deos($('#deos_editor')));
  dscript_editors.push(createEditor_deos2($('#deos_editor2')));
  Editor_refresh();
}

function createEditor_chenji($dom, exec) {
		var editor = CodeMirror(function(elt) {
			$dom.replaceWith(elt);
			}, {
				value: $dom.val(),
				lineNumbers: true,
				mode: "text/x-konoha",
				onCursorActivity: function() {
					editor.setLineClass(editor.getCursor().line, null);
				}
			});
		var libs = {
			setLineColor : function(line,count){
          console.log('linecoloer');
					editor.setLineClass(line - 1, null);
					editor.setLineClass(line - 1,"SGreen");
			},
			setLineError : function(line) {
          console.log('lineerror');
				editor.setLineClass(line - 1, null);
				editor.setLineClass(line - 1,"SRed");
			},
			setLineWarning : function(line) {
          console.log('linewarning');
				editor.setLineClass(line - 1, null);
				editor.setLineClass(line - 1,"SYellow");
			},
			setLineClear : function(line) {
          console.log('lineclear');
				var size = editor.lineCount();
				for(var i=0;i<size;i++) {
					editor.setLineClass(i, null);
				}
			}
		};
	$(exec).click(function(){
    //Spinner_chenji_start();
		var data = {
			"Script": editor.getValue(),
		};
		$.ajax({
			url:'cgi-bin/execute.cgi',
			type : 'POST',
			data : data,
		});
	});
	return editor;
};

function Editor_chenji_load(script) {
  $('#chenji_editor').html(script);
  Editor_refresh();
}

function Editor_refresh() {
  for(var i = 0; i < dscript_editors.length; i++) {
    dscript_editors[i].refresh();
  }
  setTimeout( function() {
    Editor_refresh();
  },1000);
}
