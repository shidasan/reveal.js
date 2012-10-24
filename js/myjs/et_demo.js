var isGenerated = false;
var gens = new Object;
var generatedSlide_prev = null;
var isZoom = false;

function getPos() {
  var ret = [];
  var hash = location.hash;
  var hashmap = hash.split('/');
  ret.push(parseInt(hashmap[1]));
  ret.push((hashmap.length > 2) ? parseInt(hashmap[2]) : 0);
  return ret;
}

function currentPageObject() {
  var pos = getPos();
  var $curPage = $('.reveal .slides section:eq(' + pos[0] + ')');
  $curChildPage = $curPage.children('section');
  if ($curChildPage.length > 0) {
    $curPage = $curPage.children('section:eq(' + pos[1] + ')');
  }
  console.log($curPage);
  return $curPage;
}

function generatePage($page, klass) {
  $future = $page.after('<section><h2>D-Task Editor</h2></section>').next();
  $future.addClass('future');
  $future.addClass('generate');
}

function checkBPMNPage($page) {
  return $page.hasClass('dscript_flow');
}

function generateBPMNPage($page) {
  generatePage($page, 'd_sender');
}

function generateEditorPage($page) {
  if ($page.attr('dcase')) {
    generatePage($page, 'd_editor');
  }
}

//$(function() {
//    var data = {
//        event: 'hello, world'
//    };
//  $.ajax({
//    type: 'POST',
//    url: '192.168.59.22',
//    async: false,
//    data: JSON.stringify(data),
//    accept: 'application/json',
//    success: function(data, xhr, status) {
//      console.log('Successed!');
//    },
//    error: function(xhr) {
//    },
//    complete: function(xhr) {
//      console.log('finish to send');
//    }
//  });
//});
