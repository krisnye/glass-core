(function(){require.register('glass/ui/webgl/index',function(module,exports,require){// Generated by CoffeeScript 1.6.2
(function() {
  var Enum, key, value, webglConstants, _ref;

  Enum = require('../../Enum');

  Object.merge(exports, require('gl-matrix'));

  _ref = webglConstants = require('./constants');
  for (key in _ref) {
    value = _ref[key];
    exports[key] = new Enum(key, value);
  }

}).call(this);

/*
//@ sourceMappingURL=index.map
*/

})})()