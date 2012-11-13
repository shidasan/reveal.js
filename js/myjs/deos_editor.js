/*
 * editor is embedded into:
 * <textarea id="editor">hello, world</textarea>
 */

function createEditor_deos($dom) {
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
    editor.setSize('100%', 380);
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
			setLineWarning : function(line) {
          console.log('linewarning');
				editor.setLineClass(line - 1, null);
				editor.setLineClass(line - 1,"SYellow");
			},
			setLineClear : function() {
          console.log('lineclear');
				var size = editor.lineCount();
				for(var i=0;i<size;i++) {
					editor.setLineClass(i, null);
				}
			}
		};
		var log = { getLog : function(data,index){
			//var data = (JSON.stringify({ "Method": "RequestDSE","Script" : editor.getValue()}));
			$.ajax({
				//url:'cgi-bin/zabbixlog.php',
				url:'cgi-bin/zabbixpol.php',
				type:'POST',
				data: {"JSON" : data},
				error:function() { $("#error_log_deos").text("error") },
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
						if(value.ScriptName === ".\/dse.k") {
							continue;
						}
						console.log(value.Method);
						switch(value.Method) {
						case "StartTask":
							break;
						case "EndTask":
							spinner_deos.stop();
							script_flag = false;
							Matrix_animation_deos();
							return false;
						case "DScriptMessage":
							zabbix_notify_info(value.Body.replace(/\#(.+)$/, ""));
							$("#error_log_deos").append(value.Body.replace(/\#(.+)$/, ""));
							break;
						case "DScriptApproval":
							if (value.Ip !== undefined) {
								zabbix_form_notify(value.Body.replace(/\#(.+)$/, ""), value.Ip);
							}
							break;
						case "DScriptError":
							value = value.Body;
							$("#error_log_deos").append(JSON.stringify(value) + "<br>");
							if(value.FaultType !== undefined) {
								$("#fault_body_deos").append('<tr class="fault_element_deos"><td>' + value.Api + "</td>" +"<td>"+value.ScriptLine+"</td>" + "<td>"+value.FaultType + "</td></tr>")
                                Matrix_fault_deos(value.FaultType);
							}
							break;
						case "DScriptCompilerMessage":
						case undefined:
							$("#error_log_deos").append(JSON.stringify(value) + "<br>");
							if(value.ScriptLine === undefined && value.Body.match(/GlobalObject/) == null) {
								value.ScriptLine = value.Body.match(/k:(.*)\)/)[1];
							}
							if(value.ScriptLine !== undefined) {
								if(value.Body.match(/\(warning\)/)) {
									libs.setLineWarning(value.ScriptLine);
								}else {
									libs.setLineError(value.ScriptLine);
									if(value.FaultType === undefined) {
										$("#fault_body_deos").append('<tr class="fault_element_deos"><td>CompileError</td><td>'+value.ScriptLine+"</td><td>SoftwareFault</td></tr>")
										Matrix_fault_deos("SoftwareFault");
									}
								}
								if(value.FaultType !== undefined) {
									$("#fault_body_deos").append('<tr class="fault_element_deos"><td>' + value.Api + "</td>" +"<td>"+value.ScriptLine+"</td>" + "<td>"+value.FaultType + "</td></tr>")
                                    Matrix_fault_deos(value.FaultType);
								}
							}
							break;
						default :
							$("#error_log_deos").append(JSON.stringify(value) + "\n");
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
	for(var key in DSCRIPTS) {
		$('#script_select_deos').append('<option value="' + key + '">' + key + '</option>');
	}
	$('#script_select_deos').change(function() {
		editor.setValue(DSCRIPTS[$('#script_select_deos option:selected').val()]);
	});
	$("#exec_deos").click(function(){
	console.log($('#ip_select_deos option:selected').val());
    Spinner_deos_start();
		var data = {
			'Method': 'SendDSE',
      'Name': $('#script_select_deos option:selected').val(),
			'Script': editor.getValue(),
			'Option': '',
			'To': $('#ip_select_deos option:selected').val(),
			'From': '127.0.0.1:80',
			'event': 'D-Task'
		};
		$.ajax({
			//url:'cgi-bin/checkKillSender.cgi',
			url:'cgi-bin/testSender.cgi',
			//url:'cgi-bin/DCtrlSender.cgi',
			type : 'POST',
			data : data,
			error:function(){$("#log1").text("error1"); },
			complete:function(data){
					var json_data = JSON.parse(data.responseText);
					if(data.To == "192.168.59.151:8080") {
						json_data["server"] = "Node 1";
					}else {
						json_data["server"] = "DSE Manager";
					}
					$("#error_log_deos").text("");
					Matrix_faultType_deos = [];
					Matrix_animation_init_deos();
					libs.setLineClear();
					log.getLog(data.responseText,0);
			},
			dataType:'json'
		});
	});
	$("#check_deos").click(function(){
		var data = {
			'Method': 'SendDSE',
//			'Name': $('#script_select option:selected').val(),
			'Script': editor.getValue(),
			'Option': '',
//			'To': $('#ip_select option:selected').val(),
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
				var json = JSON.parse(data.responseText);
				for(var i=0;i<json.errors.length;i++) {
					if(json.errors[i].match(/\(error\)/)) {
						var line = json.errors[i].match(/:(.*)\)/)[1];
						if(parseInt(line, 10) >= 5) {
							libs.setLineError(line - 5);
						}
					}
					else if(json.errors[i].match(/\(warning\)/)) {
						var line = json.errors[i].match(/:(.*)\)/)[1];
						if(parseInt(line, 10) >= 5) {
							libs.setLineWarning(line - 5);
						}
					}
				}
				console.log("complete");
//				log.getLog(data.responseText,0);
			},
			dataType:'json'
		});
	});
	return editor;
};

function createEditor_deos2($dom) {
		var editor = CodeMirror(function(elt) {
			$dom.replaceWith(elt);
			}, {
				value: $dom.val(),
				lineNumbers: true,
				mode: "text/x-konoha"
			});
    editor.setSize('100%', 440);
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
			setLineWarning : function(line) {
          console.log('linewarning');
				editor.setLineClass(line - 1, null);
				editor.setLineClass(line - 1,"SYellow");
			},
			setLineClear : function() {
          console.log('lineclear');
				var size = editor.lineCount();
				for(var i=0;i<size;i++) {
					editor.setLineClass(i, null);
				}
			}
		};
		var log = { getLog : function(data,index){
			//var data = (JSON.stringify({ "Method": "RequestDSE","Script" : editor.getValue()}));
			$.ajax({
				//url:'cgi-bin/zabbixlog.php',
				url:'cgi-bin/zabbixpol.php',
				type:'POST',
				data: {"JSON" : data},
				error:function() { $("#error_log_deos2").text("error") },
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
						if(value.ScriptName === ".\/dse.k") {
							continue;
						}
						console.log(value.Method);
						switch(value.Method) {
						case "StartTask":
							break;
						case "EndTask":
							spinner_deos.stop();
							script_flag = false;
							Matrix_animation_deos();
							return false;
						case "DScriptMessage":
							zabbix_notify_info(value.Body.replace(/\#(.+)$/, ""));
							$("#error_log_deos2").append(value.Body.replace(/\#(.+)$/, ""));
							break;
						case "DScriptApproval":
							if (value.Ip !== undefined) {
								zabbix_form_notify(value.Body.replace(/\#(.+)$/, ""), value.Ip);
							}
							break;
						case "DScriptError":
							value = value.Body;
							$("#error_log_deos2").append(JSON.stringify(value) + "<br>");
							if(value.FaultType !== undefined) {
								$("#fault_body_deos").append('<tr class="fault_element_deos"><td>' + value.Api + "</td>" +"<td>"+value.ScriptLine+"</td>" + "<td>"+value.FaultType + "</td></tr>")
                                Matrix_fault_deos(value.FaultType);
							}
							break;
						case "DScriptCompilerMessage":
						case undefined:
							$("#error_log_deos").append(JSON.stringify(value) + "<br>");
							if(value.ScriptLine === undefined && value.Body.match(/GlobalObject/) == null) {
								value.ScriptLine = value.Body.match(/k:(.*)\)/)[1];
							}
							if(value.ScriptLine !== undefined) {
								if(value.Body.match(/\(warning\)/)) {
									libs.setLineWarning(value.ScriptLine);
								}else {
									libs.setLineError(value.ScriptLine);
									if(value.FaultType === undefined) {
										$("#fault_body_deos2").append('<tr class="fault_element_deos"><td>CompileError</td><td>'+value.ScriptLine+"</td><td>SoftwareFault</td></tr>")
										Matrix_fault_deos("SoftwareFault");
									}
								}
								if(value.FaultType !== undefined) {
									$("#fault_body_deos2").append('<tr class="fault_element_deos"><td>' + value.Api + "</td>" +"<td>"+value.ScriptLine+"</td>" + "<td>"+value.FaultType + "</td></tr>")
                                    Matrix_fault_deos(value.FaultType);
								}
							}
							break;
						default :
							$("#error_log_deos2").append(JSON.stringify(value) + "\n");
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
	$('#script_select_deos2').change(function() {
			var scripts = {
				'script_chenji.ds': '// script_chenji.ds\n\
\n\
import("dscript.shell");\n\
\n\
boolean KillHeavyProcess() {\n\
	String pid = getHeavyProcess();\n\
	kill -9 ${pid}\n\
}\n\
\n\
KillHeavyProcess();',
				'script_deos.ds': '// script_deos.ds\n\
\n\
import("dscript.shell");\n\
\n\
boolean KillHeavyProcess() {\n\
	String pid = getHeavyProcess();\n\
	String procName = getProcessNameFromPid(pid);\n\
	if(ask("プロセス ${procName} をkillしてもよろしいですか？")) {\n\
		kill -9 ${pid}\n\
	}\n\
}\n\
\n\
KillHeavyProcess();',
				'fopen_fail.ds': '// fopen_faile.ds\n\
\n\
import("cstyle.file");\n\
\n\
boolean TestOpendir() {\n\
	\/\/ directory "/etc/passwd" is not permitted to write\n\
	FILE fp = fopen("/etc/passwd", "w");\n\
}\n\
\n\
TestOpendir();'
			};
			editor.setValue(scripts[$('#script_select_deos2 option:selected').val()]);
	});
	$("#exec_deos2").click(function(){
	console.log($('#ip_select_deos2 option:selected').val());
    Spinner_deos_start();
		var data = {
			'Method': 'SendDSE',
      'Name': $('#script_select_deos2 option:selected').val(),
			'Script': editor.getValue(),
			'Option': '',
			'To': $('#ip_select_deos2 option:selected').val(),
			'From': '127.0.0.1:80',
			'event': 'D-Task'
		};
		$.ajax({
			//url:'cgi-bin/checkKillSender.cgi',
			url:'cgi-bin/testSender.cgi',
			//url:'cgi-bin/DCtrlSender.cgi',
			type : 'POST',
			data : data,
			error:function(){$("#log1").text("error1"); },
			complete:function(data){
					var json_data = JSON.parse(data.responseText);
					if(data.To == "192.168.59.151:8080") {
						json_data["server"] = "Node 1";
					}else {
						json_data["server"] = "DSE Manager";
					}
					$("#error_log_deos2").text("");
					Matrix_faultType_deos = [];
					Matrix_animation_init_deos();
					libs.setLineClear();
					log.getLog(data.responseText,0);
			},
			dataType:'json'
		});
	});
	$("#check_deos2").click(function(){
		var data = {
			'Method': 'SendDSE',
//			'Name': $('#script_select option:selected').val(),
			'Script': editor.getValue(),
			'Option': '',
//			'To': $('#ip_select option:selected').val(),
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
				var json = JSON.parse(data.responseText);
				for(var i=0;i<json.errors.length;i++) {
					if(json.errors[i].match(/\(error\)/)) {
						libs.setLineError(json.errors[i].match(/:(.*)\)/)[1]);
					}
					else if(json.errors[i].match(/\(warning\)/)) {
						libs.setLineWarning(json.errors[i].match(/:(.*)\)/)[1]);
					}
				}
				console.log("complete");
//				log.getLog(data.responseText,0);
			},
			dataType:'json'
		});
	});
	return editor;
};

