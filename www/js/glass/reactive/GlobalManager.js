(function() {
    var global = (function() {
        return this;
    })();
    var reactive = this;
    var PartialManager = global.glass.reactive.PartialManager;
    var PartialManager; //  assigned during _init_
    var JSONPatch; //  assigned during _init_
    var JSONPointer; //  assigned during _init_
    var patch; //  assigned during _init_
    var assert; //  assigned during _init_
    var assertEquals; //  assigned during _init_
    var GlobalManager = this.GlobalManager = function GlobalManager(properties) {
        var key;
        if (properties != null) {
            for (key in properties) {
                this[key] = properties[key];
            }
        }
    }
    GlobalManager.evaluate = function(uri) {
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
    GlobalManager.properties = {
        pattern: {
            value: /^global:((\/[^\/]*)*)$/i,
            name: "pattern",
            writable: true
        },
        _getPointer: {
            value: function(uri) {
                return this.pattern.exec(uri)[1];
            },
            name: "_getPointer"
        },
        _get: {
            value: function(uri) {
                var pointer;
                pointer = this._getPointer(uri);
                return JSONPointer.get(global, pointer);
            },
            name: "_get"
        },
        _set: {
            value: function(uri, value) {
                var pointer;
                pointer = this._getPointer(uri);
                return JSONPointer.set(global, pointer, value);
            },
            name: "_set"
        },
        watch: {
            value: function(uri, handler, connect) {
                if (connect == null) {
                    connect = true;
                }
                PartialManager.prototype.watch.apply(this, arguments);
                if (connect) {
                    handler(this._get(uri));
                }
            },
            name: "watch"
        },
        patch: {
            value: function(uri, patch) {
                var value;
                value = JSONPatch.apply(this._get(uri), patch);
                this._set(uri, value);
                this.notify(uri, value);
            },
            name: "patch"
        }
    };
    GlobalManager.test = function() {
        var manager, observed, observer, uri;
        observed = null;
        observer = function(value) {
            return observed = value;
        };
        manager = new GlobalManager;
        assert(manager.handles("global:/a/b/c"));
        uri = GlobalManager.uri;
        manager.watch(uri, observer);
        assert(observed != null);
        assert(GlobalManager === observed);
        assert(observed != null);
        observed = null;
        manager.patch(uri, {
            foo: 2,
            bar: 3
        });
        assert(observed != null);
        assertEquals(GlobalManager.foo, 2);
        assertEquals(GlobalManager.bar, 3);
        delete GlobalManager.foo;
        delete GlobalManager.bar;
        return manager.watch(uri, observer, false);
    };
    GlobalManager.path = "glass.reactive.GlobalManager";
    GlobalManager.implements = {
        "glass.reactive.GlobalManager": true,
        "glass.reactive.PartialManager": true,
        "glass.Component": true
    };
    GlobalManager.uri = "global:/glass/reactive/GlobalManager";
    (function() {
        var baseTypes = [PartialManager];
        var i, j, baseType, a, b;
        for (i = 0; i < baseTypes.length; i++) {
            baseType = baseTypes[i];
            for (key in baseType.properties) {
                a = GlobalManager.properties[key];
                b = baseType.properties[key];
                if (a != null && b != null && a.constructor === Object && b.constructor === Object) {
                    for (j in b) {
                        if (!a.hasOwnProperty(j)) a[j] = b[j];
                    }
                } else if (!GlobalManager.properties.hasOwnProperty(key)) {
                    GlobalManager.properties[key] = b;
                }
            }
        }
    })();
    Object.defineProperties(GlobalManager.prototype, GlobalManager.properties);
    GlobalManager._init_ = function() {
        PartialManager = global.glass.reactive.PartialManager;
        JSONPatch = global.glass.JSONPatch;
        JSONPointer = global.glass.JSONPointer;
        patch = global.glass.patch;
        assert = global.glass.assert;
        assertEquals = global.glass.assertEquals;
        delete GlobalManager._init_;
    }
}).call(glass.reactive)