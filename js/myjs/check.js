(function() {
	$("#secure_execution_deos").click(function() {
		$checkboxs = $("#risk_table_deos tbody tr");
		console.log($checkboxs);
		var error_flag = false;
		$checkboxs.each(function() {
			console.log(!($(this).hasClass("success") || $(this).hasClass("info")));
			if (!($(this).hasClass("success") || $(this).hasClass("info"))) {
				$(this).addClass("error");
				error_flag = true;
			}
		});
		if (error_flag) {
			riskdb_notify_info("There was a problem with your request.\n Missing evidence.");
		}
		else {
			$("#exec_deos").click();
			Reveal.slide(5, 0);
		}
	});
})();


function make_risk_table(data, dataType) {
	function init() {
		Reveal.slide(5, 1);
		$("#risk_table_deos tbody tr").remove();
		this.$checkbox = $("<input/>")
			.attr("type", "checkbox")
			.attr("name", "q");
		this.$textarea = $("<input/>")
			.attr("type", "text")
			.attr("name", "q");
	}
	function save_to_table(keyword, words) {
		var $elem = $("<tr></tr>");
		var $new_checkbox = this.$checkbox.clone(true);
		$new_checkbox.click(function() {
			$elem.removeClass("error")
			if ($(this).attr("checked")) {
				$elem.addClass("info");
			}
			else {
				$elem.removeClass("info");
			}
		});
		// 		$elem.click(function() {
		// 			$elem.children($new_checkbox.click());
		// 		});
		var $new_textarea = this.$textarea.clone(true);
		$new_textarea.change(function() {
			if ($(this).val() != "") {
				$elem.removeClass("error")
				$elem.addClass("success");
			}
			else {
				$elem.removeClass("success");
			}
		});
		$elem.append('<td>' + keyword +'</td>');
		$elem.append('<td>' + words +'</td>');
		$elem.append($("<td></td>").append($new_textarea.clone(true)));
		$elem.append($("<td></td>").append($new_checkbox.clone(true)));
		$("#risk_table_deos").children("tbody").append($elem);
	}
	function main() {
		console.log(data);
		console.log(dataType);
		init();
		var i, j;
		var risks = data["risks"];
		for (i = 0; i < risks.length; i++) {
			var risk = risks[i]
			var count = risk["count"]
			console.log(count);
			console.log(risk["words"].length);
			for (j = 0; j < count; j++) { //fix me
				save_to_table(risk["keyword"], risk["words"][j]);
			}
		}
	}
	main();
}
