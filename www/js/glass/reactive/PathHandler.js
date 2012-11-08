(function() {
    var global = (function() {
        return this;
    })();
    var reactive = this;
    var UriHandler = global.glass.reactive.UriHandler;
    var evaluate; //  assigned during _init_
    var assert; //  assigned during _init_
    var PathHandler = this.PathHandler = function PathHandler(properties) {
        var key;
        if (properties != null) {
            for (key in properties) {
                this[key] = properties[key];
            }
        }
    }
    PathHandler.evaluate = function(uri) {
        var name, value, _i, _len, _ref;
        value = global;
        _ref = uri.split('.');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            name = _ref[_i];
            if (value != null) {
                value = value != null ? value[name] : void 0;
            }
        }
        return value;
    };
    PathHandler.properties = {
        pattern: {
            name: "pattern",
            observable: true,
            handler: {
                set: function anonymous(value, oldValue) {
                    this.notifyObservers("pattern", oldValue, value);
                }
            },
        default:
            /^[$A-Z_][$A-Z_0-9]*(\.[$A-Z_][$A-Z_0-9]*)*$/i,
            set: function anonymous(value) {
                var oldValue = this._pattern;
                if (value !== oldValue) {
                    this._pattern = value;
                    PathHandler.properties.pattern.handler.set.call(this, value, oldValue);
                }
            },
            get: function anonymous() {
                var value = this._pattern;
                if (value == null) value = PathHandler.properties.pattern['default'];
                return value;
            }
        },
        observe: {
            value: function(uri, observer) {
                return observer(evaluate(uri));
            },
            name: "observe"
        },
        unobserve: {
            value: function(uri, observer) {
                return observer(void 0);
            },
            name: "unobserve"
        }
    };
    PathHandler.test = function() {
        var handler, observed, observer, uri;
        observed = null;
        observer = function(value) {
            return observed = value;
        };
        handler = new PathHandler;
        assert(handler.handles("a.b.c"));
        uri = 'glass.reactive.PathHandler';
        handler.observe(uri, observer);
        assert(observed != null);
        assert(PathHandler === observed);
        handler.unobserve(uri, observer);
        return assert(!(observed != null));
    };
    PathHandler.path = "glass.reactive.PathHandler";
    PathHandler.implements = {
        "glass.reactive.PathHandler": true,
        "glass.reactive.UriHandler": true,
        "glass.Observable": true
    };
    (function() {
        var baseTypes = [UriHandler];
        var i, j, baseType, a, b;
        for (i = 0; i < baseTypes.length; i++) {
            baseType = baseTypes[i];
            for (key in baseType.properties) {
                a = PathHandler.properties[key];
                b = baseType.properties[key];
                if (a != null && b != null && a.constructor === Object && b.constructor === Object) {
                    for (j in b) {
                        if (!a.hasOwnProperty(j)) a[j] = b[j];
                    }
                } else if (!PathHandler.properties.hasOwnProperty(key)) {
                    PathHandler.properties[key] = b;
                }
            }
        }
    })();
    Object.defineProperties(PathHandler.prototype, PathHandler.properties);
    PathHandler._init_ = function() {
        evaluate = global.glass.reactive.PathHandler.evaluate;
        assert = global.glass.assert;
        delete PathHandler._init_;
    }
}).call(glass.reactive)