$("#fault").click(function(){
	$.ajax({
		url:'cgi-bin/fault.cgi',
		complete:function(data){
			console.log(data);
		}
	});
	dscript_notify_info("Fault was injected.");
});
$("#fault_stop").click(function(){
	$.ajax({
		url:'cgi-bin/fault_stop.cgi',
		complete:function(data){
			console.log(data);
		}
	});
	dscript_notify_info("Fault was excluded.");
});
$("#reboot_dse").click(function(){
	$.ajax({
		url:'cgi-bin/rebootDse.cgi',
		complete:function(data){
			console.log(data);
		}
	});
});

