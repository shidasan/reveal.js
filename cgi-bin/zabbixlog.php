<?php
require_once("action.php");
require_once("conf.php");
$zabbix = new Zabbix($_ip);
assert($zabbix->login($_user,$_pass));
assert($zabbix->getItem("Zabbix server",array("name" => "Syslog")));
//assert($zabbix->getItem("et2",array("name" => "Syslog")));
$result = $zabbix->getHistory("minikonoha");
echo json_encode(array("Method" => "ZabbixSyslog",
			"Value" => array_map(function($value){ return json_decode(substr($value["value"],strpos($value["value"],"{")),true);}, $result["result"])));

?>
