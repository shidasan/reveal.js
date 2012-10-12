var _DUMMY_NUM = 0;

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

