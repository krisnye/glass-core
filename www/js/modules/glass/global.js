(function(){require.register('glass/global',function(module,exports,require){// Generated by CoffeeScript 1.6.2
(function() {
  var exports, global, _base, _ref, _ref1, _ref2;

  require('sugar');

  global = (function() {
    return this;
  })();

  if ((_ref = global.global) == null) {
    global.global = global;
  }

  module.exports = exports = global;

  if ((_ref1 = global.process) == null) {
    global.process = {};
  }

  if ((_ref2 = (_base = global.process).nextTick) == null) {
    _base.nextTick = function(fn) {
      return setTimeout(fn, 0);
    };
  }

}).call(this);

/*
//@ sourceMappingURL=global.map
*/

})})()