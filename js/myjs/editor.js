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
    editor.setSize('100%', 350);
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
							console.log("end"+value.Method);
							spinner_chenji.stop();
							script_flag = false;
							Matrix_animation();
							return;
						case "DScriptMessage":
							zabbix_notify_info(value.Body.replace(/\#(.+)$/, ""));
							$("#error_log").append(value.Body.replace(/\#(.+)$/, ""));
							break;
						case "DScriptApproval":
							if (value.Ip !== undefined) {
								zabbix_form_notify(value.Body.replace(/\#(.+)$/, ""), value.Ip);
							}
							break;
						case "DScriptError":
							value = value.Body;
							$("#error_log").append(JSON.stringify(value) + "<br>");
							if(value.FaultType !== undefined) {
								$("#fault_body").append('<tr class="fault_element"><td>' + value.Api + "</td>" +"<td>"+value.ScriptLine+"</td>" + "<td>"+value.FaultType + "</td></tr>")
                                Matrix_fault(value.FaultType);
							}
							break;
						case "DScriptCompilerMessage":
						case undefined:
							$("#error_log").append(JSON.stringify(value) + "<br>");
							if(value.ScriptLine === undefined && value.Body.match(/GlobalObject/) == null) {
								value.ScriptLine = value.Body.match(/k:(.*)\)/)[1];
							}
							if(value.ScriptLine !== undefined) {
								if(value.Body.match(/\(warning\)/)) {
									libs.setLineWarning(value.ScriptLine);
								}else {
									libs.setLineError(value.ScriptLine);
									if(value.FaultType === undefined) {
										$("#fault_body").append('<tr class="fault_element"><td>CompileError</td><td>'+value.ScriptLine+"</td><td>SoftwareFault</td></tr>")
										Matrix_fault("SoftwareFault");
									}
								}
								if(value.FaultType !== undefined) {
									$("#fault_body").append('<tr class="fault_element"><td>' + value.Api + "</td>" +"<td>"+value.ScriptLine+"</td>" + "<td>"+value.FaultType + "</td></tr>")
                                    Matrix_fault(value.FaultType);
								}
							}
							break;
						default :
							$("#error_log").append(JSON.stringify(value) + "<br>");
							if(value.ScriptLine !== undefined) {
									libs.setLineError(value.ScriptLine);
							}
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
			$('#script_select').append('<option value="' + key + '">' + key + '</option>');
		}
		$('#script_select').change(function() {
			editor.setValue(DSCRIPTS[$('#script_select option:selected').val()]);
		});
	$("#exec").click(function(){
	console.log($('#ip_select option:selected').val());
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
			complete:function(data){
					var json_data = JSON.parse(data.responseText);
					if(data.To == "192.168.59.151:8080") {
						json_data["server"] = "Node 1";
					}else {
						json_data["server"] = "DSE Manager";
					}
					$("#error_log").text("");
					Matrix_faultType = [];
					Matrix_animation_init();
					libs.setLineClear();
					log.getLog(data.responseText,0);
			},
			dataType:'json'
		});
	});
	$("#exec2").click(function(){
		$alert = $("<div/>");
		$alert.addClass("modal fade");
		$alert_body = $("<div/>");
		$alert_body.addClass("modal-body");
		$alert_body.append($("<img/>")
						   .attr("src", "img/deos_logo.gif")
						   .css("height", "128px"));
		$alert_body.append($("<h3/>").text("D-Case認証のないスクリプトを実行しようとしています．"));
		$alert_footer = $("<div/>");
		$alert_footer.addClass("modal-footer");
		$alert_footer.append($("<button/>")
							 .addClass("close")
							 .attr("type", "button")
							 .attr("data-dismiss", "modal")
							 .text("close"));
		$alert.append($alert_body);
		$alert.append($alert_footer);
		$alert.modal();
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
