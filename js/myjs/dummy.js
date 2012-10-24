var _DUMMY_NUM = 0;

var DCASE_TYPE_NUM = {
  None: -1,
  Goal: 0,
  Strategy: 1,
  Evidence: 2,
  Context: 3,
  UGoal: 4
};

var DCASE_TYPE = {
  None: 'None',
  Goal: 'Goal',
  Strategy: 'Strategy',
  Evidence: 'Evidence',
  Context: 'Context',
  UGoal: 'UGoal',
  isGoal: function(type) {
    if (type.match(this.Goal)) {
      return true;
    }
    return false;
  },
  isStrategy: function(type) {
    if (type.match(this.Strategy)) {
      return true;
    }
    return false;
  },
  isEvidence: function(type) {
    if (type.match(this.Evidence)) {
      return true;
    }
    return false;
  },
  isContext: function(type) {
    if (type.match(this.Context)) {
      return true;
    }
    return false;
  },
  isUGoal: function(type) {
    if (type.match(this.UGoal)) {
      return true;
    }
    return false;
  }
};

var DummyManager = function(url, port) {
  this.restServerURL = url + ':' + port + '/db/data';
  this.topGoal;
  this.topStrategy;
  this.nodes = [];
  this.keynodes = [];
  this.parent = new Object();
  this.trees = [];
  this.$dcase_node;
  this.$dcase;
};

DummyManager.prototype = {
  init: function(viewer, $dcase_node, $dcase) {
   this.viewer = viewer;
   this.$dcase_node = $dcase_node;
   this.$dcase = $dcase;
  },
  createTopGoal_Dummy: function(str) {
    var self = this;
    var res = DummyTopGoal();
    var num = self.displayNode(null, res);
    self.topGoal = self.nodes[num];
  },
  createTopStrategy_Dummy: function(parent, type, str) {
    var self = this;
    var res = DummyTopStrategy();
    var num = self.displayNode(parent, res);
    self.topStrategy = self.nodes[num];
  },
  createNode_Dummy: function(parent, type, str) {
    var self = this;
    var res = DummyEmptyEvidence();
    self.displayNode(parent, res);
  },
  createGoal_Dummy: function(parent, type, str, suffix) {
    var self = this;
    var url = 'http://localhost/data/node/' + _DUMMY_NUM;
    var res = {
      data: {
        sentence: str,
        type: 'Goal'
      },
      self: url
    }
    var num = self.displayNode(parent, res, suffix);
    var goal = self.nodes[num];
    self.keynodes[str] = goal;
    _DUMMY_NUM++;
  },
  _getNodeID: function(str) {
    if (typeof str == 'string') {
      return str.match(/[0-9]+$/);
    }
    return null;
  },
  displayNode: function(parent, res, suffix) {
    var data = res['data'];
    var num = this._getNodeID(res['self']);
    var type = data['type'];
    var str = data['sentence'];
    var node;
    for (key in this.nodes) {
      if (num == key) {
        return this.nodes[num];
      }
    }
    if (DCASE_TYPE.isGoal(type)) {
      if (parent == null) {
        node = this.viewer.createTopGoal(num, str);
      }
      else {
          if (suffix != undefined) {
            node = this.viewer.createGoal(num, parent, str + suffix);
          }
          else {
            node = this.viewer.createGoal(num, parent, str);
          }
      }
    }
    else if (DCASE_TYPE.isStrategy(type)) {
      node = this.viewer.createStrategy(num, parent, str);
    }
    else if (DCASE_TYPE.isEvidence(type)) {
      node = this.viewer.createEvidence(num, parent, str);
    }
    else if (DCASE_TYPE.isContext(type)) {
      node = this.viewer.createContext(num, parent, str);
    }
    else if (DCASE_TYPE.isUGoal(type)) {
      node = this.viewer.createUGoal(num, parent, str);
    }
    else {
      alert('undefined D-Case type: ' + JSON.stringify(data));
    }
    this.nodes[num] = node;
    return num;
  },
  sendDummyGoal: function($dcase_node, $dcase, str) {
    var res = DummyAjax();
    this.createTopGoal_Dummy(str);
    this.createTopStrategy_Dummy(this.topGoal, 'Strategy', DummyStrategy());
    var goals = [];
    var kw = '';
    var parent = this.topStrategy;
    self = this;
    $.each(res['goal'], function() {
      if (typeof self.keynodes[this['keyword']] == 'undefined') {
        self.createGoal_Dummy(self.topStrategy, 'Goal', this['keyword'], 'に対して未対応のリスクがない');
      }
      self.createGoal_Dummy(self.keynodes[this['keyword']],
                    'Goal', this['sentence']);
      self.createNode_Dummy(self.keynodes[this['sentence']], 'Evidence', '');
    });
    this.$dcase.addClass('animated fadeInDown');
    this.$dcase_node.addClass('animated fadeInDown');
  }
}

function DummyKeywordSubGoal(key) {
  return key + 'に対して未対応のリスクがない';
}

function DummyTopGoal() {
  var url = 'http://localhost/data/node/' + _DUMMY_NUM;
  var res = {
      data: {
        sentence: 'RAMディスクにデータをコピーする',
        type: 'Goal'
      },
      self: url
  }
  _DUMMY_NUM++;
  return res;
};

function DummyTopStrategy() {
  var url = 'http://localhost/data/node/' + _DUMMY_NUM;
  var res = {
      data: {
        sentence: 'D-Script の設計から個別リスクを抽出する',
        type: 'Strategy'
      },
      self: url
  }
  _DUMMY_NUM++;
  return res;
};

function DummyEmptyEvidence() {
  var url = 'http://localhost/data/node/' + _DUMMY_NUM;
  var res = {
      data: {
        sentence: '',
        type: 'Evidence'
      },
      self: url
  }
  _DUMMY_NUM++;
  return res;
};


function DummyStrategy() {
  return 'D-Script の設計から個別リスクを抽出する';
}

function DummyAjax() {
  var node = {
    'goal': [
      {'sentence': '停電が起きてもデータが消えない', 'keyword': 'RAMディスク'},
      {'sentence': '容量不足になっても入らないことがない', 'keyword': 'RAMディスク'},
      {'sentence': 'データのエンコードが不正でない', 'keyword': 'データ'},
      {'sentence': 'データのファイルシステムが不正でない', 'keyword': 'データ'},
      {'sentence': 'データにアクセスできないことがない', 'keyword': 'データ'},
      {'sentence': 'データが壊れていない', 'keyword': 'データ'},
      {'sentence': 'コピー先の容量が不十分でない', 'keyword': 'コピー'},
      {'sentence': 'コピー中に内容が書き変わらない', 'keyword': 'コピー'},
      {'sentence': '正しくコピーされないことがない', 'keyword': 'コピー'},
      {'sentence': '権限がないことがない', 'keyword': 'コピー'}
    ]
  };
  return node;
}

