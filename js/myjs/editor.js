/*
 * editor is embedded into:
 * <textarea id="editor">hello, world</textarea>
 */
function Editor_init() {
		var editor = CodeMirror(function(elt) {
			$("#editor").replaceWith(elt);
			}, {
				value: $("#editor").val(),
				lineNumbers: true,
				mode: "text/x-konoha"
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
	$(".btn").click(function(){
		var data = {
			'Method': 'SendDSE',
			'Script': editor.getValue(),
			'Option': '',
			'To': '127.0.0.1:8080',
			'From': '127.0.0.1:80',
			'event': 'D-Task'
		};
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
};

