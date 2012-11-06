/*
 * editor is embedded into:
 * <textarea id="editor">hello, world</textarea>
 */

var yoan_dscript_editors = [];

function Editor_init() {
  var i = 0;
  $.each($('.editor'), function() {
    console.log(i++);
    console.log($(this));
    yoan_dscript_editors.push(createEditor($(this)));
  });
  Editor_refresh();
}

function createEditor($dom) {
		var editor = CodeMirror(function(elt) {
			$dom.replaceWith(elt);
			}, {
				value: $dom.val(),
				lineNumbers: true,
				mode: "text/x-konoha"
			});
		EDITOR_FILE.forEach(function(i){
			$("#editor_select").append('<option value="'+ i.file +'">'+i.file);
		});
		var libs = {
			setLineColor : function(line,count){
					editor.setLineClass(line - 1,"SGreen");
			},
			setLineError : function(line) {
				editor.setLineClass(line - 1, null);
				editor.setLineClass(line - 1,"SRed");
			},
			setLineClear : function(line) {
				editor.setLineClass(line - 1, null);
			}
		};
		var log = { getLog : function(){
			var data = (JSON.stringify({ "Method": "RequestDSE","Script" : editor.getValue()}));
			$.ajax({
				url:'cgi-bin/zabbixlog.php',
				type:'POST',
				data:{"JSON" : data},
				error:function() { $("#error_log").text("error") },
				complete:function(res_data) {
					var res_json = JSON.parse(res_data.responseText);
					//$("#error_log").text(JSON.stringify(res_json[0].Value));
					var t = 100;
					var script_flag = false;
					$.each(res_json.Value,function(key,value) {
						switch(value.Method) {
						case "Alert":
              $('#myModal').modal();
						case "DScriptResult":
							if(script_flag) {
								setTimeout( function() {
									libs.setLineColor(value.ScriptLine,value.Count);
								},t);
							}
							break;
						case "EndTask":
							return false;
						case "StartTask":
						script_flag = true;
							break;
						default :
							$("#error_log").append(JSON.stringify(value) + "\n");
							if(value.ScriptLine !== undefined) {
								setTimeout( function() {
									libs.setLineError(value.ScriptLine);
								},t);
							}
						}
						t += 100;
						});
					},
				dataType:'json'
			});
		}};
	$("#exec").click(function(){
		var data = {
			'Method': 'SendDSE',
      'Name': $('#script_select option:selected').val(),
			'Script': editor.getValue(),
			'Option': '',
			'To': $('#ip_select option:selected').val(),
			'From': '127.0.0.1:80',
			'event': 'D-Task'
		};
    console.log('----------------------------');
    console.log(data);
		$.ajax({
			url:'cgi-bin/testSender.cgi',
			//url:'cgi-bin/DCtrlSender.cgi',
			type : 'POST',
			data : data,
			error:function(){$("#log1").text("error1"); },
			complete:function(data){
				log.getLog(data.responseText);
			},
			dataType:'json'
		});
	});
	$("#editor_select").change(function(){
		var value = $("#editor_select option:selected").val();
		editor.setValue(EDITOR_FILE);
	})
	return editor;
};


function Editor_refresh() {
  console.log('refresh');
  for(var i = 0; i < yoan_dscript_editors.length; i++) {
    console.log(yoan_dscript_editors[i]);
    yoan_dscript_editors[i].refresh();
  }
  console.log(yoan_dscript_editors.length);
  setTimeout( function() {
    Editor_refresh();
  },1000);
}
