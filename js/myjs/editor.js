/*
 * editor is embedded into:
 * <textarea id="editor">hello, world</textarea>
 */

var dscript_editors = [];

function Editor_init() {
  dscript_editors.push(createEditor_chenji($('#chenji_editor')));
  dscript_editors.push(createEditor_deos($('#deos_editor')));
  Editor_refresh();
}

function createEditor_chenji($dom) {
		var editor = CodeMirror(function(elt) {
			$dom.replaceWith(elt);
			}, {
				value: $dom.val(),
				lineNumbers: true,
				mode: "text/x-konoha"
			});
    editor.setSize('100%', 400);
		var libs = {
			setLineColor : function(line,count){
          console.log('linecoloer');
					editor.setLineClass(line - 1,"SGreen");
			},
			setLineError : function(line) {
          console.log('lineerror');
				editor.setLineClass(line - 1, null);
				editor.setLineClass(line - 1,"SRed");
			},
			setLineClear : function(line) {
          console.log('lineclear');
				editor.setLineClass(line - 1, null);
			}
		};
		var log = { getLog : function(data,index){
			//var data = (JSON.stringify({ "Method": "RequestDSE","Script" : editor.getValue()}));
			$.ajax({
				//url:'cgi-bin/zabbixlog.php',
				url:'cgi-bin/zabbixpol.php',
				type:'POST',
				data: {"JSON" : data},
				error:function() { $("#error_log").text("error") },
				complete:function(res_data) {
					var res_json = JSON.parse(res_data.responseText);
					var t = 100;
					var script_flag = true;
					var idx = index;
					console.log(res_json.Value);
					for(var i = index + 1; i < res_json.Value.length; i++) {
						console.log('----------------------------------');
						var value = res_json.Value[i];
						var key = i;
						if(value === null) {
							continue;
						}
						//index = key;
						if(value.ScriptName === ".\/dse.k") {
							continue;
						}
						console.log(value.Method);
						switch(value.Method) {
						case "StartTask":
							break;
						case "EndTask":
							spinner.stop();
							script_flag = false;
							return false;
						case "DScriptMessage":
							zabbix_notify_info(value.Body.replace(/\#(.+)$/, ""));
							$("#error_log").append(value.Body.replace(/\#(.+)$/, ""));
							break;
						case "DScriptApproval":
							if (value.Ip !== undefined) {
								zabbix_form_notify(value.Body.replace(/\#(.+)$/, ""), value.Ip);
							}
							break;
						default :
							$("#error_log").append(JSON.stringify(value) + "\n");
							//if(value.ScriptLine !== undefined) {
							//	setTimeout( function() {
							//		libs.setLineError(value.ScriptLine);
							//	},t);
							//}
						}
						t += 100;
						idx = i;
					}
					if(script_flag) {
							setTimeout( function() {
								log.getLog(data, idx);
							},1000);
					}
				},
				dataType:'json'
			});
		}
		};
  $('#script_select').change(function() {
    var data = {
			'Method': 'SendScriptName',
			'ScriptName': $('#script_select option:selected').val(),
		};
		$.ajax({
			url:'/cgi-bin/scriptSender.cgi',
			type : 'POST',
			data : data,
			error:function(){},
			complete:function(data){
					console.log(data.responseText);
					var res = JSON.parse(data.responseText);
          var script = res['Script'];
          editor.setValue(script);
			},
			dataType:'json'
		});

  });
	$("#exec").click(function(){
	console.log($('#ip_select option:selected').val());
    Spinner_start();
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
			complete:function(data){
					var json_data = JSON.parse(data.responseText);
					if(data.To == "192.168.59.151:8080") {
						json_data["server"] = "et2";
					}else {
						json_data["server"] = "Zabbix server";
					}
					log.getLog(data.responseText,0);
			},
			dataType:'json'
		});
	});
	$("#check").click(function(){
		var data = {
			'Method': 'SendDSE',
			'Script': editor.getValue(),
			'Option': '',
			'From': '127.0.0.1:80',
			'event': 'D-Task'
		};
		console.log('----------------------------');
		console.log(data);
		$.ajax({
			url:'cgi-bin/findRisk.cgi',
			type : 'POST',
			data : data,
			success:make_risk_table,
			error:function(XMLHttpRequest, textStatuc, errorThrown){
				console.log("error");
				console.log(XMLHttpRequest);
				console.log(textStatuc);
				console.errorThrown();
//				$("#log1").text("error1");
			},
			complete:function(data){
				console.log("complete");
//				log.getLog(data.responseText,0);
			},
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
