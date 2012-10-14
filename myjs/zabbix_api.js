function login(ipaddr) {
  var the_object;
  var http_request = new XMLHttpRequest();
  var jsonrpc = '{"jsonrpc": "2.0","method": "user.login","params": {"user": "Admin", "password": "zabbix"},"id": 1}';
  http_request.open( "POST", 'http://192.168.144.132/zabbix/api_jsonrpc.php', true );
  http_request.setRequestHeader('Content-Type', 'application/json-rpc');
  http_request.send(jsonrpc);
  http_request.onreadystatechange = function () {
  if ( http_request.readyState == 4 ) {
    if ( http_request.status == 200 ) {
        the_object = eval( "(" + http_request.responseText + ")" );
        document.getElementById("zone").innerHTML = http_request.responseText;
      } else {
        alert( "There was a problem with the URL." );
      }
      http_request = null;
    }
  };

  //var jsonrpc = "{'jsonrpc': '2.0','method': 'user.login','params': {'user': 'Admin', 'password': 'zabbix'},'id': 1}";
  //var node = {
  //  jsonrpc: '2.0',
  //  method: 'user.login',
  //  params: {
  //    user: 'Admin',
  //    password: 'zabbix'
  //  },
  //  //auth: null,
  //  id: 1
  //};
  //var url = 'http://' + ipaddr + '/zabbix/api_jsonrpc.php';
  //$.ajax({
  //  type: 'POST',
  //  accepts: 'application/json',
  //  contentType: 'application/json-rpc',
  //  dataType: 'json',
  //  url: url,
  //  async: true,
  //  data: JSON.stringify(node),
  //  success: function(msg) {
  //    console.log('POST login Method Successed!');
  //  },
  //  error: function(msg) {
  //    console.log('POST login Method Successed!');
  //  },
  //  complete: function(msg) {
  //    console.log('POST login Method Successed!');
  //  }
  //});
}
