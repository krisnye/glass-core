(function() {
    var global = (function() {
        return this;
    })();
    var reactive = this;
    var Manager = global.glass.reactive.Manager;
    var GlobalManager; //  assigned during _init_
    var patch; //  assigned during _init_
    var assert; //  assigned during _init_
    var DelegatingManager = this.DelegatingManager = function DelegatingManager(properties) {
        var key;
        if (properties != null) {
            for (key in properties) {
                this[key] = properties[key];
            }
        }
    }
    DelegatingManager.properties = {
        managers: {
            type: "array",
            name: "managers",
            writable: true
        },
        resolve: {
            value: function(baseUri, relativeUri) {
                return this._getManager(baseUri).resolve(baseUri, relativeUri);
            },
            name: "resolve"
        },
        watch: {
            value: function(uri, handler, connect) {
                if (connect == null) {
                    connect = true;
                }
                return this._getManager(uri).watch(uri, handler, connect);
            },
            name: "watch"
        },
        patch: {
            value: function(uri, patch) {
                return this._getManager(uri).patch(uri, patch);
            },
            name: "patch"
        },
        _getManager: {
            value: function(uri) {
                var manager, _i, _len, _ref;
                _ref = this.managers;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    manager = _ref[_i];
                    if (manager.handles(uri)) {
                        return manager;
                    }
                }
                throw new Error("No manager found for " + uri);
            },
            name: "_getManager"
        }
    };
    DelegatingManager.test = function() {
        var context;
        context = new DelegatingManager({
            managers: [new GlobalManager()]
        });
        assert(context._getManager("global:/a/b/c") != null);
    };
    DelegatingManager.path = "glass.reactive.DelegatingManager";
    DelegatingManager.implements = {
        "glass.reactive.DelegatingManager": true,
        "glass.reactive.Manager": true,
        "glass.Component": true
    };
    DelegatingManager.uri = "global:/glass/reactive/DelegatingManager";
    (function() {
        var baseTypes = [Manager];
        var i, j, baseType, a, b;
        for (i = 0; i < baseTypes.length; i++) {
            baseType = baseTypes[i];
            for (key in baseType.properties) {
                a = DelegatingManager.properties[key];
                b = baseType.properties[key];
                if (a != null && b != null && a.constructor === Object && b.constructor === Object) {
                    for (j in b) {
                        if (!a.hasOwnProperty(j)) a[j] = b[j];
                    }
                } else if (!DelegatingManager.properties.hasOwnProperty(key)) {
                    DelegatingManager.properties[key] = b;
                }
            }
        }
    })();
    Object.defineProperties(DelegatingManager.prototype, DelegatingManager.properties);
    DelegatingManager._init_ = function() {
        GlobalManager = global.glass.reactive.GlobalManager;
        patch = global.glass.patch;
        assert = global.glass.assert;
        delete DelegatingManager._init_;
    }
}).call(glass.reactive)