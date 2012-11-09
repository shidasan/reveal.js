function notify_setValue(val) {
  document.AskNotifier.onBtn.value = val;
}

function zabbix_notify_info(str) {
  if (spinner !== undefined) {
    spinner.stop();
  }
  $.pnotify({
    title: 'Dscript Log',
    text: str,
    addclass: 'custom',
    icon: 'picon picon-32 picon-fill-color',
    opacity: .8,
    nonblock: true,
    nonblock_opacity: .2
  });
}

function notify_compile_result(str) {
  if (spinner !== undefined) {
    spinner.stop();
  }
  $.pnotify({
    title: 'Compilation result',
    text: str,
    addclass: 'custom',
    icon: 'picon picon-32 picon-fill-color',
    opacity: .8,
    nonblock: true,
    nonblock_opacity: .2
  });
}

function dscript_notify_info(str) {
  if (spinner !== undefined) {
    spinner.stop();
  }
  $.pnotify({
    title: 'Dscript Log',
    text: str,
    addclass: 'custom',
    icon: 'picon picon-32 picon-fill-color',
    opacity: .8,
    nonblock: true,
    nonblock_opacity: .2
  });
}

var global_notice;

function form_template(body, to) {
  var body_array = body.split(/\(|\)/);
  var sentence = body_array[0];
  var $notify_body = $('#form_notice');
  var recv_words = body_array[1].replace(',', '').split(' ');
  var allow_word = recv_words[0];
  var deny_word = recv_words[2];
  var allow_class = (recv_words[1] == 'Y') ? 'pf-button btn btn-primary' : 'pf-button btn';
  var deny_class = (recv_words[3] == 'N') ? 'pf-button btn btn-primary' : 'pf-button btn';
  console.log(body);
  console.log(sentence + '(' + to + '): [' + allow_word + ', ' + deny_word + ']');
  var html = '\
  <form class="pf-form pform_custom" action method="post">\
   <img src="./img/dscript_logo.png" width="80px" style="float: left; margin-left: -50px;"></img>\
   <div>\
     <div class="pf-element pf-heading">\
       <h5>' + sentence + '</h5>\
     </div>\
     <div class="pf-element pf-buttons pf-centered" style="position: relative; margin: 0 auto 0 auto;">\
       <button class="' + allow_class + '" type="button" onclick="send_userResponse(\'y\',\'' + to + '\');">' + allow_word + '</button>\
       <button class="' + deny_class + '" type="button" onclick="send_userResponse(\'n\',\'' + to + '\');">' + deny_word + '</button>\
     </div>\
   </div>\
  </form>';
  return html;
}

function zabbix_form_notify(str, to) {
  global_notice = $.pnotify({
    text: form_template(str, to),
    opacity: .9,
    addclass: 'custom',
    width: '290px',
    hide: false,
    closer: false,
    sticker: false,
    insert_brs: false,
  });
  console.log('end form notify');
  return false;
}

function send_userResponse(req, to) {
	console.log('called send_userRequest: ' + req + ', ' + to);
	var data = {
		'Method': 'userResponse',
		'Request': req,
		'Ip': to
	};
  $.ajax({
      url: 'cgi-bin/getUserResponse.cgi',
      type : 'POST',
      data : data,
      error:function(){},
      complete:function(data){
        global_notice.pnotify_remove();
      },
      dataType:'text'
  });
  return false;
}
