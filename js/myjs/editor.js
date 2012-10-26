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
					var arr = [];
					res_json.Value.forEach(function(i) {
						if(i.Method !== "DScriptResult") {
							arr.push(i);
							return;
						}
						setTimeout( function() {
							libs.setLineColor(i.ScriptLine,i.Count);
						},t);
						t += 100;
						});
					arr.forEach(function(i){
						$("#error_log").append(JSON.stringify(i) + "\n");
						setTimeout( function() {
							libs.setLineError(i.ScriptLine);
						},t);
						t += 100;
						});
					},
				dataType:'json'
			});
		}};
	$(".btn").click(log.getLog
		/*function(){ //TODO
		var data = {"JSON" : JSON.stringify({ "Method": "RequestDSE","Script" : editor.getValue()})}; //script
		$.ajax({
			url  : 'cgi-bin/DTaskSender.k',
			type : 'POST',
			data : data,
			error:function(){$("#log1").text("error1"); },
			complete:function(data){
				log.getLog(data.responseText);
			},
			dataType:'json'
		});
		*/
	/*}*/);
};

