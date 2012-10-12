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

var Neo4jManager = function(url, port) {
   this.restServerURL = url + ':' + port + '/db/data';
   this.topGoal;
   this.topStrategy;
   this.nodes = [];
   this.keynodes = [];
   this.parent = new Object();
};

Neo4jManager.prototype = {
  init: function(viewer) {
   this.viewer = viewer;
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
  getStartNode: function(url) {
    var self = this;
    $.ajax({
      type: 'GET',
      url: url,
      async: false,
      data: '',
      accept: 'application/json',
      success: function(data, xhr, status) {
        console.log('GET START NODE Method Successed!');
      },
      error: function(xhr) {
        console.log('ERROR: getStartNode()');
      },
      complete: function(xhr) {
        var res = jQuery.parseJSON(xhr['responseText']);
        var start = self._getNodeID(res[0]['start']);
        self.parent = self.nodes[start];
      }
    });
  },
  //traverse: function(root) {
  traverse: function() {
    var self = this;
    var num = self.topGoal.idx;
    var node = {
      order: 'breadth_first',
      relationships: [{
        direction: 'all',
        type: 'RELATED_TO'
      }],
      //uniqueness: 'node_global',
      max_depth: 128
    };
    this.setTopGoal(num);
    $.ajax({
      type: 'POST',
      url: self.restServerURL + '/node/' + num + '/traverse/node',
      data: JSON.stringify(node),
      async: false,
      dataType: 'application/json',
      contentType: 'application/json',
      success: function(data, xhr, status) {
        //console.log('GET Method Successed!');
        //console.log(data);
      },
      error: function(xhr) {
        console.log('ERROR: setTopGoal()');
      },
      complete: function(xhr) {
        var res = jQuery.parseJSON(xhr['responseText']);
        for (var i = 0; i < res.length; i++) {
          var node = res[i];
          var data = node['data'];
          var rel = res[i]['incoming_relationships'];
          self.getStartNode(rel);
          self.displayNode(self.parent, node);
        }
        viewer.autoArrange(false);
        //viewer.autoArrange(true);
      }
    });
  },
  createTopGoal: function(str) {
    var self = this;
    var node = {
       'type': 'Goal',
       'sentence': str
    };
    $.ajax({
      type: 'POST',
      url: self.restServerURL + '/node',
      async: false,
      data: JSON.stringify(node),
      dataType: 'application/json',
      contentType: 'application/json',
      success: function(data, xhr, status) {
        //var res = jQuery.parseJSON(xhr['responseText']);
        //self.topGoal = res;
        //self.displayNode(null, res);
      },
      error: function(xhr) {
        console.log('ERROR: createTopGoal()');
      },
      complete: function(xhr) {
        var res = jQuery.parseJSON(xhr['responseText']);
        var num = self.displayNode(null, res);
        self.topGoal = self.nodes[num];
      }
    });
  },
  createTopStrategy: function(parent, type, str) {
    var self = this;
    var node = {
       'type': 'Strategy',
       'sentence': str
    };
    $.ajax({
      type: 'POST',
      url: self.restServerURL + '/node',
      async: false,
      data: JSON.stringify(node),
      dataType: 'application/json',
      contentType: 'application/json',
      success: function(data, xhr, status) {
      },
      error: function(xhr) {
        console.log('ERROR: createTopStrategy()');
      },
      complete: function(xhr) {
        var res = jQuery.parseJSON(xhr['responseText']);
        var num = self.displayNode(parent, res);
        self.topStrategy = self.nodes[num];
        var rel = {
          'to': self.restServerURL + '/node/' + self._getNodeID(res['self']),
          'type': 'RELATED_TO'
        };
        $.ajax({
          type: 'POST',
          url: self.restServerURL + '/node/' + parent.idx + '/relationships',
          async: false,
          data: JSON.stringify(rel),
          dataType: 'application/json',
          contentType: 'application/json',
          success: function(data, xhr, status) {
          },
          error: function(xhr) {
            console.log('ERROR: createTopStrategy()');
          },
          complete: function(xhr) {
          }
        });
      }
    });
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
  createNode: function(parent, type, str) {
    var self = this;
    var node = {
       'type': type,
       'sentence': str
    };
    $.ajax({
      type: 'POST',
      url: self.restServerURL + '/node',
      async: false,
      data: JSON.stringify(node),
      dataType: 'application/json',
      contentType: 'application/json',
      success: function(data, xhr, status) {
      },
      error: function(xhr) {
        console.log('ERROR: createNode() post node');
      },
      complete: function(xhr) {
        var res = jQuery.parseJSON(xhr['responseText']);
        self.displayNode(parent, res);
        var rel = {
          'to': self.restServerURL + '/node/' + self._getNodeID(res['self']),
          'type': 'RELATED_TO'
        };
        $.ajax({
          type: 'POST',
          url: self.restServerURL + '/node/' + parent.idx + '/relationships',
          async: false,
          data: JSON.stringify(rel),
          dataType: 'application/json',
          contentType: 'application/json',
          success: function(data, xhr, status) {
          },
          error: function(xhr) {
            console.log('ERROR: createNode() post relationships');
          },
          complete: function(xhr) {
          }
        });
      }
    });
  },
  createGoal: function(parent, type, str, suffix) {
    var self = this;
    var node = {
       'type': 'Goal',
       'sentence': str
    };
    $.ajax({
      type: 'POST',
      url: self.restServerURL + '/node',
      async: false,
      data: JSON.stringify(node),
      dataType: 'application/json',
      contentType: 'application/json',
      success: function(data, xhr, status) {
      },
      error: function(xhr) {
        console.log('ERROR: createGoal() post node');
      },
      complete: function(xhr) {
        var res = jQuery.parseJSON(xhr['responseText']);
        console.log("------------------ ");
        console.log(res);
        var num = self.displayNode(parent, res, suffix);
        var goal = self.nodes[num];
        self.keynodes[str] = goal;
      }
    });
  },
  setTopGoal: function(num) {
    var self = this;
    $.ajax({
      type: 'GET',
      url: self.restServerURL + '/node/' + num,
      async: false,
      data: '',
      dataType: 'application/json',
      contentType: 'application/json',
      success: function(data, xhr, status) {
      },
      error: function(xhr) {
        console.log('ERROR: setTopGoal() GET Method');
      },
      complete: function(xhr) {
        var res = jQuery.parseJSON(xhr['responseText']);
        console.log(res);
        var data = res['data'];
        self.topGoal = res;
        self.displayNode(null, res);
      }
    });
  },
  setNode: function(parent, num) {
    var self = this;
    $.ajax({
      type: 'GET',
      url: self.restServerURL + '/node/' + num,
      async: false,
      data: '',
      dataType: 'application/json',
      contentType: 'application/json',
      success: function(data, xhr, status) {
      },
      error: function(xhr) {
        console.log('ERROR: setNode()');
      },
      complete: function(xhr) {
        var res = jQuery.parseJSON(xhr['responseText']);
        var data = res['data'];
        self.displayNode(parent, res);
      }
    });
  }
};
