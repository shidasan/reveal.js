
function zabbix_notify_info(str) {
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

function notify_test_form() {
  var notice = $.pnotify({
    text: $('#form_notice').html(),
    opacity: .9,
    addclass: 'custom',
    width: '290px',
    hide: false,
    closer: false,
    sticker: false,
    insert_brs: false,
  });
  notice.find('form.pf-form').submit(function() {
    notice.pnotify_remove();
    //if ($('#form_notice [name=')) {
    //  notice.pnotify({
    //    text: 'running script...',
    //    icon: true,
    //    width: $.pnotify.defaults.width,
    //    hide: true,
    //    closer: true,
    //    sticker: true,
    //    type: 'success'
    //  });
    //}
    return false;
  });
}
