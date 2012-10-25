/*
 * editor is embedded into:
 * <textarea id="editor">hello, world</textarea>
 */

function Editor_init() {
		var editor0 = CodeMirror(function(elt) {
			$("#editor").replaceWith(elt);
			}, {
				value: $("#editor").val(),
				lineNumbers: true,
				mode: "text/x-konoha"
			});
		var editor = CodeMirror(function(elt) {
			$("#editor1").replaceWith(elt);
			}, {
				value: $("#editor1").val(),
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
		var log = { getLog : function(data){
			$.ajax({
				url:'cgi-bin/zabbixlog.php',
				type:'POST',
				data:data,
				error:function() { $("#log1").text("error") },
				complete:function(data) {
					var json = eval(data.responseText);
					$("#log1").text(JSON.stringify(json));
					var t = 100;
					var arr = [];
					json.forEach(function(i) {
						if(i.value.count === undefined) {
							i.value["count"] = 1;
							arr.push(i);
							return;
						}
						setTimeout( function() {
							libs.setLineColor(i.value.ScriptLine,i.value.count);
						},t);
						t += 1000;
						});
					arr.forEach(function(i){
						setTimeout( function() {
							libs.setLineError(i.value.ScriptLine);
						},t);
						t += 1000;
						});
					},
				dataType:'json'
			});
		}};
	$(".btn").click(function(){
		var data = editor.getValue(); //script
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
	});
}
