<?php

class Zabbix {
	private $API_URL = "";
	private $API_HEADER = "Content-Type:application/json-rpc";
	private $auth = null;
	private $HostName;
	private $HostId;
	private $ItemIds;

	function __construct($server) {
		$this->API_URL = $server . "/zabbix/api_jsonrpc.php";
	}

	private function file_get($data) {
		$options = array(
			'http'=>array(
				'method'=>"GET",
				'header'=>$this->API_HEADER,
				"content" => $data)
			);
		return json_decode(file_get_contents($this->API_URL, false, stream_context_create($options)),true);
	}

	private function create_data($method, $params) {
		return json_encode(array(
				"jsonrpc" => 2.0,
				"auth"    => $this->auth,
				"method"  => $method,
				"params"  => $params,
				"id"      => 1,
			));
	}

	public function login($name, $passwd) {
		$params = array( "user" => $name, "password" => $passwd );
		$result = $this->file_get($this->create_data("user.login",$params));
		if(array_key_exists("result",$result)) {
			$this->auth = $result["result"];
			return true;
		}
		return false;
	}

	private function setHost($name) {
		$params = array(
				"output"=> "extend",
				"filter"=> array(
					"host"=> array($name)
				));
		$result = $this->file_get($this->create_data("host.get",$params));
		if(count($result["result"]) > 0) {
			$this->Hostname = $name;
			$this->HostId   = $result["result"][0]["hostid"];
			return true;
		}
		return false;
	}

	public function getItem($HostName, $search = array()) {
		assert(isset($this->HostId) ? true: $this->setHost($HostName));
		$params = array(
				"hostids"    => array($this->HostId),
				"output"     => "shorten",
				"monitored"  => 1,
				"search"     => $search
		);
		$result = $this->file_get($this->create_data("item.get",$params));
		if(count($result["result"]) > 0) {
			$this->ItemIds   = array_map(function($value){return $value["itemid"];}, $result["result"]);
			return true;
		}
		return false;
	}

	public function showHistory(){
		//var_dump($this->ItemIds);
		$params = array(
				"history" => 2,
				"output"  => "extend",
				"search"  => array("value" => "minikonoha"),
				"itemids" => $this->ItemIds
		);
		$result = $this->file_get($this->create_data("history.get",$params));
		echo json_encode(array_map(function($value){
							return array("clock" => /*date("Y.M.j H:i:s",*/$value["clock"]/*)*/,
								"value" => json_decode(substr($value["value"],strpos($value["value"],"{")),true));},
					$result["result"]));
		//var_dump($result);
	}
	/*
	public function getEvent() {
		assert(isset($this->TriggerId));
		$params = array(
				"triggerids" => array($this->TriggerId),
				"output" => "extend"
		);
		$result = $this->file_get($this->create_data("event.get",$params));
		var_dump($result);
	}
	*/
}

?>
