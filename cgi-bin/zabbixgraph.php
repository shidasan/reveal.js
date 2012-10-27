<?php
require_once("action.php");
require_once("conf.php");
$zabbix = new Zabbix($_ip);
assert($zabbix->login($_user,$_pass));
$Ids = $zabbix->getGraph("et2",array("name" => $_POST["name"]));
if($Ids){
	/*
	$login_url = $_ip . "/zabbix/index.php";//"?form_refresh=1&name;=" . $_user . "&password;=" . $_pass . "&enter=Enter";
	$head =file_get_contents($login_url,false,stream_context_create(array('http' => array('method' => 'POST','content' => "name=" . $_user . "password=" . $_pass ))));
	var_dump($http_response_header);
	$cookie = $head["Set-Cookie"];
	*/
	$graph_url = $_ip . "/zabbix/chart2.php?graphid=" . $Ids[0];
	echo json_encode(array("src" => $graph_url));
	/*
	$opts = array(
			'http'=>array(
				'method'=>"GET",
				"Cookie: " . $cookie . "\r\n"
				)
			);
			*/
	//$result = file_get_contents($graph_url);//,false,stream_context_create($options));
	//var_dump($result);
}
//$result = $zabbix->getHistory("dscript");
//echo json_encode(array("Method" => "ZabbixSyslog",
//			"Value" => array_map(function($value){ return json_decode(substr($value["value"],strpos($value["value"],"{")),true);}, $result["result"])));

?>
