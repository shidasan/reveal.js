function Graph_init(){
    Cpu_get();
    Memory_get();
    Network_get();
    setTimeout( function() {
        Graph_init();
    },30000);
}

function Cpu_get(){
    Graph_get("#cpu",{"name":"util"});
}

function Memory_get(){
    Graph_get("#memory",{"name":"memory"});
}

function Network_get(){
    Graph_get("#network",{"name":"eth0"});
}

function Graph_get(selector,data) {
  $.ajax({
    url: CONFIG.cgi_dir + '/zabbixgraph.php',
    type:'POST',
    data: data,
    error:function() {},
    complete:function(data) {
      $(selector).attr(JSON.parse(data.responseText));
    },
    dataType:'json'
  });
}
