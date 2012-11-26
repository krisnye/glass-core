(function() {
    var global = (function() {
        return this;
    })();
    var reactive = this;
    var Component = global.glass.Component;
    var Set; //  assigned during _init_
    var assert; //  assigned during _init_
    var PartialManager = this.PartialManager = function PartialManager(properties) {
        var key;
        if (properties != null) {
            for (key in properties) {
                this[key] = properties[key];
            }
        }
    }
    PartialManager.properties = {
        pattern: {
            value: null,
            name: "pattern",
            writable: true
        },
        handles: {
            value: function(uri) {
                var _ref;
                return ((_ref = this.pattern) != null ? _ref.test(uri) : void 0) === true;
            },
            name: "handles"
        },
        isWatched: {
            value: function(uri) {
                var _ref;
                return ((_ref = this._watchers) != null ? _ref[uri] : void 0) != null;
            },
            name: "isWatched"
        },
        notify: {
            value: function(uri, value) {
                var _ref, _ref1;
                return (_ref = this._watchers) != null ? (_ref1 = _ref[uri]) != null ? _ref1.forEach(function(handler) {
                    return handler(value);
                }) : void 0 : void 0;
            },
            name: "notify"
        },
        watch: {
            value: function(uri, handler, connect) {
                var set, watchers, _ref, _ref1, _ref2;
                if (connect == null) {
                    connect = true;
                }
                if (connect) {
                    watchers = (_ref = this._watchers) != null ? _ref: this._watchers = {};
                    set = (_ref1 = watchers[uri]) != null ? _ref1: watchers[uri] = new Set;
                    set.add(handler);
                } else {
                    watchers = (_ref2 = this._watchers) != null ? _ref2[uri] : void 0;
                    if (! (watchers != null ? watchers["delete"](handler) : void 0)) {
                        throw new Error("" + uri + " was not watched by " + handler);
                    }
                    if (watchers.size === 0) {
                        delete this._watchers[uri];
                    }
                }
            },
            name: "watch"
        },
        patch: {
            value: function(uri, patch) {},
            name: "patch"
        }
    };
    PartialManager.test = function() {
        var handler;
        handler = new PartialManager({
            pattern: /^ab*$/
        });
        assert(handler.handles("a"));
        assert(handler.handles("abbbbb"));
        return assert(!handler.handles("abc"));
    };
    PartialManager.path = "glass.reactive.PartialManager";
    PartialManager.implements = {
        "glass.reactive.PartialManager": true,
        "glass.Component": true
    };
    PartialManager.uri = "global:/glass/reactive/PartialManager";
    (function() {
        var baseTypes = [Component];
        var i, j, baseType, a, b;
        for (i = 0; i < baseTypes.length; i++) {
            baseType = baseTypes[i];
            for (key in baseType.properties) {
                a = PartialManager.properties[key];
                b = baseType.properties[key];
                if (a != null && b != null && a.constructor === Object && b.constructor === Object) {
                    for (j in b) {
                        if (!a.hasOwnProperty(j)) a[j] = b[j];
                    }
                } else if (!PartialManager.properties.hasOwnProperty(key)) {
                    PartialManager.properties[key] = b;
                }
            }
        }
    })();
    Object.defineProperties(PartialManager.prototype, PartialManager.properties);
    PartialManager._init_ = function() {
        Set = global.glass.Set;
        assert = global.glass.assert;
        delete PartialManager._init_;
    }
}).call(glass.reactive)