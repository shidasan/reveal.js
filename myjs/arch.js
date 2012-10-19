//export modules to archi
var archi = {};

(function() {
    //	config
    var server_height = (window.innerHeight / 4.5);
    var server_width = (window.innerWidth / 12);
    var layout_height = (window.innerHeight * 0.8);
    var layout_width = (window.innerWidth * 0.8);

    function new_$line($canvas, from, to) {
        $line_context = $canvas[0].getContext("2d");
        $line_context.beginPath();
        $line_context.lineWidth = 2;
        $line_context.strokeStyle = "D3D3D3";
        $line_context.moveTo(from[0], from[1]);
        $line_context.lineTo(to[0], to[1]);
        $line_context.stroke();
    }
    function new_$img(src) {
        $new_img = $("<img/>");
        $new_img.attr("src", src);
        return $new_img;
    }
    function new_$node(id, imgsrc) {
        var $new_node = $("<div/>");
        $new_node.attr("id", id);
        $new_node.append(new_$img(imgsrc)
                         .attr("id", id + "_img")
                         .attr("height", server_height)
                         .attr("widhth", server_width)
                         .css("display", "inline-block"));
        var $description = $("<div/>")
            .css({"display" : "inline-block"});
        $new_node.append($description);
        $description.append($("<div/>")
                           .attr("id", id + "_name")
                           .text("name:" + id)
                          );
        $description.append($("<div/>")
                           .attr("id", id + "_state")
                           .text("state:waiting") // FIX ME !!
                          );
        return $new_node;
    }
    function new_$architecture_section(id) {
        var $load_balancer = new_$node("lb", "architecture/pic/server.png");
        var $web_server1 = new_$node("ws1", "architecture/pic/server.png");
        var $web_server2 = new_$node("ws2", "architecture/pic/server.png");
        var $db_server = new_$node("dbs", "architecture/pic/server.png");

        var $layout = $("<table/>")
			.css({"position" : "relative",
				  "z-index" : 0});
        $layout.attr("height", layout_height);
        $layout.attr("width", layout_width);
        $layout.append(
            (function() {
                $new_row = $("<tr/>");
                $new_row.append($("<td/>"));
                $new_row.append($("<td/>").append($web_server1));
                return $new_row;
            })()
        );
        $layout.append(
            (function() {
                $new_row = $("<tr/>");
                $new_row.append($("<td/>").append($load_balancer));
                $new_row.append($("<td/>"));
                $new_row.append($("<td/>").append($db_server));
                return $new_row;
            })()
        );
        $layout.append(
            (function() {
                $new_row = $("<tr/>");
                $new_row.append($("<td/>"));
                $new_row.append($("<td/>").append($web_server2));
                return $new_row;
            })()
        )

		$new_canvas = $("<canvas/>")
			.attr("width", layout_width)
			.attr("height", layout_height)
			.css({"position" : "absolute",
				  "top" : "0",
				  "left" : "0",
				  "z-index" : "1"});
		$layout.append($new_canvas);
		new_$line($new_canvas, [layout_width / 9, layout_height / 2.5], [layout_width / 3.1, layout_height / 5]);
		new_$line($new_canvas, [layout_width / 9, layout_height / 1.37], [layout_width / 3.1, layout_height / 1.1]);
        new_$line($new_canvas, [layout_width / 2, layout_height / 1.05], [layout_width / 1.4, layout_height / 1.38]);
        new_$line($new_canvas, [layout_width / 1.5, layout_height / 2.8], [layout_width / 1.4, layout_height / 2.45]);

        $new_section = $("<section/>");
        $new_section.append($layout);

        return $new_section;
    }
    function add_$section($new_section) {
        $(".slides").append($new_section);
    }
    function to_running_state($node) {
		node_id = $node.attr("id");

		node_img_id = "#" + node_id + "_img";
		$(node_img_id).addClass("animated shake");
		$(node_img_id).css({
			"-webkit-animation-iteration-count" : "infinite",
			"-moz-animation-iteration-count" : "infinite"
		});

		node_state_id = "#" + node_id + "_state";
		$(node_state_id).text("state:running");
    }
    function to_error_state($node) {
		node_id = $node.attr("id");

		node_img_id = "#" + node_id + "_img";
		$(node_img_id).addClass("animated flash");
		$(node_img_id).css({
			"-webkit-animation-iteration-count" : "infinite",
			"-moz-animation-iteration-count" : "infinite"
		});

		node_state_id = "#" + node_id + "_state";
		$(node_state_id).text("state:error");
    }
    function to_waiting_state($node) {
		node_id = $node.attr("id");

		node_img_id = "#" + node_id + "_img";
		$(node_img_id).css({
			"-webkit-animation-iteration-count" : "0",
			"-moz-animation-iteration-count" : "0"
		});

		node_state_id = "#" + node_id + "_state";
		$(node_state_id).text("state:waiting");
    }

//export function
	archi.new_$architecture_section = new_$architecture_section;
	archi.add_$section = add_$section;
	archi.to_running_state = to_running_state;
	archi.to_error_state = to_error_state;
	archi.to_waiting_state = to_waiting_state;

//dubug
	console.log("#######################################");
    console.log("window.innerHeight:" + window.innerHeight);
    console.log("window.innerWidth:" + window.innerWidth);
    console.log("server_height:" + server_height);
    console.log("server_width:" + server_width);
    console.log("layout_height:" + layout_height);
    console.log("layout_width:" + layout_width);
    console.log("#######################################");
})();

//sample code
var $architecture_section = archi.new_$architecture_section();
archi.add_$section($architecture_section);
archi.to_running_state($("#ws1"));
archi.to_error_state($("#ws2"));
archi.to_error_state($("#dbs"));
archi.to_waiting_state($("#dbs"));
