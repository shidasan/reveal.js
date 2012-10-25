<?php
require_once("action.php");
require_once("conf.php");

$zabbix = new Zabbix($_ip);
assert($zabbix->login($_user,$_pass));
#assert($zabbix->getItem("et2",array("name" => "D-script")));
assert($zabbix->getItem("et2",array("name" => "Syslog")));
$zabbix->showHistory();
?>
