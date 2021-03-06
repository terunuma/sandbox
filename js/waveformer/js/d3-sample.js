// Generated by CoffeeScript 1.6.3
var App, D3Component;

D3Component = (function() {
  D3Component.prototype.selector = '#d3-window';

  D3Component.prototype.$el = null;

  D3Component.prototype.numberOfLayers = 20;

  D3Component.prototype.numberOfSamples = 200;

  D3Component.prototype.layers0 = null;

  D3Component.prototype.layers1 = null;

  D3Component.prototype.windowWidth = 960;

  D3Component.prototype.windowHeight = 500;

  D3Component.prototype.stack = null;

  D3Component.prototype.color = null;

  D3Component.prototype.area = null;

  D3Component.prototype.svg = null;

  D3Component.prototype.durationTime = 1000;

  function D3Component() {
    this.initEl();
    this.init();
    this.reloadData();
    this.resetArea();
  }

  D3Component.prototype.initEl = function() {
    this.$el = $(this.selector);
    this.windowWidth = this.$el.width();
    return this.windowHeight = this.$el.height();
  };

  D3Component.prototype.init = function() {
    this.stack = window.d3.layout.stack().offset("wiggle");
    this.layers0 = this.createLayer();
    this.layers1 = this.createLayer();
    return this.color = window.d3.scale.linear().range(['#aad', '#556']);
  };

  D3Component.prototype.resetArea = function() {
    var graphX, graphY, _getMaxY,
      _this = this;
    this.$el.css({
      width: this.windowWidth,
      height: this.windowHeight
    });
    graphX = window.d3.scale.linear().domain([0, this.numberOfSamples - 1]).range([0, this.windowWidth]);
    _getMaxY = function() {
      return window.d3.max(_this.layers0.concat(_this.layers1), function(layer) {
        return window.d3.max(layer, function(d) {
          return d.y0 + d.y;
        });
      });
    };
    graphY = window.d3.scale.linear().domain([0, _getMaxY()]).range([this.windowHeight, 0]);
    this.area = window.d3.svg.area().x(function(d) {
      return graphX(d.x);
    }).y0(function(d) {
      return graphY(d.y0);
    }).y1(function(d) {
      return graphY(d.y0 + d.y);
    });
    return this.initSVG();
  };

  D3Component.prototype.initSVG = function() {
    var _this = this;
    if (this.svg == null) {
      this.svg = window.d3.selectAll(this.$el).append('svg');
      this.svg.selectAll('path').data(this.layers0).enter().append('path').attr('d', this.area).style('fill', function() {
        return _this.color(Math.random());
      });
    }
    return this.svg.attr('width', this.windowWidth).attr('height', this.windowHeight);
  };

  D3Component.prototype.reloadData = function() {
    var _this = this;
    return window.d3.selectAll('path').data(function() {
      _this.layers1 = _this.layers0;
      return _this.layers0 = _this.createLayer();
    });
  };

  D3Component.prototype.transition = function() {
    return window.d3.selectAll('path').transition().duration(this.durationTime).attr('d', this.area);
  };

  D3Component.prototype.createLayer = function() {
    var _bumpLayer,
      _this = this;
    _bumpLayer = function() {
      var array, i, __bump, _i, _j, _ref;
      __bump = function(array1) {
        var i, w, x, y, z, _i, _ref, _results;
        x = 1 / (.1 + Math.random());
        y = 2 * Math.random() - .5;
        z = 10 / (.1 + Math.random());
        _results = [];
        for (i = _i = 0, _ref = _this.numberOfSamples; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          w = (i / _this.numberOfSamples - y) * z;
          _results.push(array1[i] += x * Math.exp(-w * w));
        }
        return _results;
      };
      array = [];
      for (i = _i = 0, _ref = _this.numberOfSamples; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        array[i] = 0;
      }
      for (i = _j = 0; _j < 5; i = ++_j) {
        __bump(array);
      }
      return array.map(function(d, i) {
        return {
          x: i,
          y: Math.max(0, d)
        };
      });
    };
    return this.stack(window.d3.range(this.numberOfLayers).map(function() {
      return _bumpLayer();
    }));
  };

  D3Component.prototype._getDefaultOrMax = function(val, defaultValue, max) {
    if (defaultValue == null) {
      defaultValue = 0;
    }
    if (max == null) {
      max = 0;
    }
    if (!_.isNumber(val)) {
      val = defaultValue;
    }
    return Math.max(val, max);
  };

  D3Component.prototype.resetWindow = function() {
    this.windowWidth = this._getDefaultOrMax(parseInt($('[name="graph-width"]').val()), 640, 40);
    this.windowHeight = this._getDefaultOrMax(parseInt($('[name="graph-height"]').val()), 480, 30);
    return this.resetArea();
  };

  D3Component.prototype.resetLayersAndSamples = function() {
    var numberOfLayers_prev;
    numberOfLayers_prev = this.numberOfLayers;
    this.numberOfLayers = this._getDefaultOrMax(parseInt($('[name="number-of-layers"]').val()), 20, 1);
    this.numberOfSamples = this._getDefaultOrMax(parseInt($('[name="number-of-samples"]').val()), 200, 1);
    if (this.numberOfLayers !== numberOfLayers_prev) {
      this.$el.find('svg path').remove();
      this.svg.remove();
      return this.svg = null;
    }
  };

  return D3Component;

})();

App = (function() {
  function App() {}

  App.prototype.run = function() {
    $(document).ready(function() {
      var _this = this;
      this.d3Component = new D3Component();
      return $('[js-update]').on('click', function() {
        _this.d3Component.resetLayersAndSamples();
        _this.d3Component.reloadData();
        _this.d3Component.resetWindow();
        return _this.d3Component.transition();
      });
    });
  };

  return App;

})();

window.app = new App();

app.run();
