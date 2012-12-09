/*
 * editor is embedded into:
 * <textarea id="editor">hello, world</textarea>
 */

var dscript_editors = [];

function Editor_init() {
  dscript_editors.push(createEditor_chenji($('#chenji_editor')));
  dscript_editors.push(createEditor_deos($('#deos_editor')));
  dscript_editors.push(createEditor_deos2($('#deos_editor2')));
  Editor_refresh();
}

function createEditor_chenji($dom) {
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
    //editor.setSize('100%', 550);
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
	$("#exec").click(function(){
    Spinner_chenji_start();
		var data = {
			'Method': 'SendDSE',
      'Name': $('#script_select option:selected').val(),
			'Script': editor.getValue(),
			'Option': '',
			'To': $('#ip_select option:selected').val(),
			'From': '127.0.0.1:80',
			'event': 'D-Task'
		};
		$.ajax({
			url:'cgi-bin/testSender.cgi',
			type : 'POST',
			data : data,
			error:function(){$("#log1").text("error1"); },
			//complete:function(data){
			//		var json_data = JSON.parse(data.responseText);
			//		if(data.To == "192.168.59.151:8080") {
			//			json_data["server"] = "Node 1";
			//		}else {
			//			json_data["server"] = "DSE Manager";
			//		}
			//		$("#error_log").text("");
			//		Matrix_faultType = [];
			//		Matrix_animation_init();
			//		libs.setLineClear();
			//		log.getLog(data.responseText,0);
			//},
			dataType:'json'
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
