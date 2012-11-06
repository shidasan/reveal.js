function notify_setValue(val) {
  document.AskNotifier.onBtn.value = val;
}

function zabbix_notify_info(str) {
  spinner.stop();
  $.pnotify({
    title: 'Zabbix Log',
    text: str,
    addclass: 'custom',
    icon: 'picon picon-32 picon-fill-color',
    opacity: .8,
    nonblock: true,
    nonblock_opacity: .2
  });
}

function dscript_notify_info(str) {
  spinner.stop();
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

function zabbix_form_notify() {
  spinner.stop();
  global_notice = $.pnotify({
    text: $('#form_notice').html(),
    opacity: .9,
    addclass: 'custom',
    width: '290px',
    hide: false,
    closer: false,
    sticker: false,
    insert_brs: false,
  });
  return false;
}

function notifier_allow_script() {
  alert('allow');
  global_notice.pnotify_remove();
  return false;
}

function notifier_deny_script() {
  alert('deny');
  global_notice.pnotify_remove();
  return false;
}
