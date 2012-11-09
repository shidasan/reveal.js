function make_risk_table(data, dataType) {
	function init() {
		Reveal.slide(4,1);
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
			if ($(this).attr("checked")) {
				if ($elem.hasClass("info")) {
					//pass
				}
				else if ($elem.hasClass("success") && !($elem.hasClass("info"))) {
					$elem.removeClass("success");
					$elem.addClass("info");
					$elem.addClass("success");
				}
				else {
					$elem.addClass("info");
				}
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
			if ($(this).val() != "") {$elem.addClass("success");}
			else {$elem.removeClass("success");}
		});
		$elem.append('<td>' + keyword +'</td>');
		$elem.append('<td>' + words +'</td>');
		$elem.append($("<td></td>").append($new_textarea.clone(true)));
		$elem.append($("<td></td>").append($new_checkbox.clone(true)));
		$("#risk_table").children("tbody").append($elem);
	}
	function main() {
		console.log(data);
		console.log(dataType);
		init();
		var i, j;
		var risks = data["risks"];
		for (i = 0; i < risks.length; i++) {
			var risk = risks[i]
			for (j = 0; j < risk.length; j++) {
				save_to_table(risk[j]["keyword"], risk[j]["words"]);
			}
		}
	}
	main();
}
