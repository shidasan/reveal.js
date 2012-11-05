function Graph_init(){
    Cpu_get();
    Memory_get();
    Network_get();
    setTimeout( function() {
        Graph_init();
    },30000);
}

function Cpu_get(){
    Graph_get("#cpu",{"name":"util", "Server": $("#cpu_select option:selected").val()});
}

function Memory_get(){
    Graph_get("#memory",{"name":"memory", "Server": $("#memory_select option:selected").val()});
}

function Network_get(){
    Graph_get("#network",{"name":"eth0", "Server": $("#network_select option:selected").val()});
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

$("#cpu_select").change(function(){Cpu_get();});
$("#memory_select").change(function(){Memory_get();});
$("#network_select").change(function(){Network_get();});
