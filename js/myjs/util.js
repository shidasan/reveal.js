/* =========================================================== */
/* ----------------------------------------------------------- */
/* Dictionaly Class */

Dict = function(key, value) {
  this.data = {'key': key, 'value': value};
  return this;
};

Dict.prototype = {
  set: function(key, val) {
    this.data = {'key': key, 'value': val};
  },
  getKey: function() {
    return this.data['key'];
  },
  getVal: function() {
    return this.data['value'];
  },
  print: function () {
      console.log('[\'' + this.data['key'] + '\':\'' + this.data['value'] + '\']');
  }
};

function DictArray_v(d, key) {
  var ret = undefined;
  d.forEach(function(i) {
    if (key == i.getKey()) {
      ret = i.getVal();
    }
  });
  return ret;
}

/* =========================================================== */
/* DOM Operator function */

function createLastChild($parent, type, content) {
  if (typeof type === 'undefined') {
    type = 'div';
  }
  if (typeof content === 'undefined') {
    content = '';
  }
  return $parent.append('<' + type + '>' + content + '</' + type + '>')
                .children(type + ':last');
}

function createFirstChild($parent, type) {
  if (typeof type === undefined) {
    type = 'div';
  }
  if (typeof content === undefined) {
    content = '';
  }
  return $parent.append('<' + type + '>' + content + '</' + type + '>')
                .children(type + ':first');
}

function createNthChild($parent, type, n) {
  if (typeof type === undefined) {
    type = 'div';
  }
  if (typeof content === undefined) {
    content = '';
  }
  return $parent.append('<' + type + '>' + content + '</' + type + '>')
                .children(type + ':nth-child(' + n + ')');
}

//function import() {
//  var s = createLastChildAsDiv($('.generated_js'));
//}
