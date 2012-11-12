function risk_db_demo_init() {
	console.log("risk_db_demo_init");

	function risk_db_table_update_success(data, dataType) {
		console.log("success!!");
		var risks = data["risks"];
		for (i = 0; i < risks.length; i++) {
			var risk = risks[i]
			var count = risk["count"]
			console.log(count);
			console.log(risk["words"].length);
			for (j = 0; j < count; j++) { //fix me
				var keyword = risk["keyword"];
				var words = risk["words"][j];
				var $elem = $("<tr></tr>");
				$elem.append('<td>' + keyword +'</td>');
				$elem.append('<td>' + words +'</td>');
				$("#risk_db_demo table tbody").append($elem);
			}
		}
	}
	function risk_db_table_update_error() {
		console.log("error occured!!");
		console.log(XMLHttpRequest);
		console.log(textStatuc);
		console.errorThrown();
	}

	function risk_db_table_update(keyword) {
		console.log("risk_db_table_update");
		$.ajax({
			url:'cgi-bin/findRisk.cgi',
			type : 'POST',
			data : {id:keyword},
			success:risk_db_table_update_success,
			error:risk_db_table_update_error,
			complete:function(data){
				console.log("complete");
				//				log.getLog(data.responseText,0);
			},
			dataType:'json'
		});
	}
	$("#risk_db_demo input").change(function() {
		var keyword = $(this).val();
		if (keyword != "") {
			risk_db_table_update(keyword);
		}
	});
	$("#risk_db_demo button").change(function() {
		var keyword = $("risk_db_demo input").val();
		if (keyword != "") {
			risk_db_demo_table_update(keyword);
		}
	});
}
risk_db_demo_init();
