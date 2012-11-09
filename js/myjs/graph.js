function Graph_init(){
  Cpu_get();
  Memory_get();
  Network_get();
  TriggerLog_get();
  //NetArch_get();
  setTimeout( function() {
      Graph_init();
  },5000);
}
/*
function NetArch_get() {
  $("#archzbx").attr({
    src : "/zabbix/map.php?sysmapid=1"
  });
}
*/
function Cpu_get(){
  Graph_get("#cpu",{"name":"util", "Server": $("#cpu_select option:selected").val()});
}

function Memory_get(){
  Graph_get("#memory",{"name":"memory", "Server": $("#memory_select option:selected").val()});
}

function Network_get(){
  Graph_get("#network",{"name":"eth0", "Server": $("#network_select option:selected").val()});
}

function getHostName(name) {
  var host = {"Zabbix server":"DSE Manager","et2":"node 1","et3":"node 2"};
  return host[name];
}

function DatetoString(unixtime) {
    var d = new Date(unixtime*1000);
    return (d.getMonth() + 1) + "月" + d.getDate() + "日 " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
}

function TriggerLog_setTable(result) {
  var classname = "trigger_element";
  $("." + classname).remove();
  result.forEach(function(i){
    $("#trigger_log").append('<tr class="trigger_element"><td>' + getHostName(i.hostname) + "</td>" +"<td>"+i.description+"</td>" + "<td>"+DatetoString(i.lastchange) + "</td></tr>");
    });
}
function TriggerLog_get(){
  var data = {};
  $.ajax({
    url: CONFIG.cgi_dir + '/zabbixevent.php',
    type:'POST',
    data: data,
    error:function() {},
    complete:function(data) {
      var log = JSON.parse(data.responseText);
      if(log.result.length === 0) {
        $(".trigger_element").remove();
        $("#trigger_log").append('<div class="trigger_element">現在正常に稼動しています。</div>');
      } else {
        TriggerLog_setTable(log.result);
      }
    },
    dataType:'json'
  });
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
