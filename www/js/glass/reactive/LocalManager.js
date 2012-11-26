(function() {
    var global = (function() {
        return this;
    })();
    var reactive = this;
    var PartialManager = global.glass.reactive.PartialManager;
    var PartialManager; //  assigned during _init_
    var assert; //  assigned during _init_
    var getType; //  assigned during _init_
    var LocalManager = this.LocalManager = function LocalManager(properties) {
        var key;
        if (properties != null) {
            for (key in properties) {
                this[key] = properties[key];
            }
        }
    }
    LocalManager.properties = {
        pattern: {
            value: /^local:([$A-Z_][$A-Z_0-9]*(\.[$A-Z_][$A-Z_0-9]*)*)\/(\{[^\(\)=]*?\})$/i,
            name: "pattern",
            writable: true
        },
        _createObject: {
            value: function(uri) {
                var config, result, type;
                result = this.pattern.exec(uri);
                type = getType(result[1]);
                config = JSON.parse(result[3]);
                return new type(config);
            },
            name: "_createObject"
        },
        watch: {
            value: function(uri, handler, connect) {
                var object, _ref;
                if (connect == null) {
                    connect = true;
                }
                PartialManager.prototype.watch.apply(this, arguments);
                if (connect) {
                    object = ((_ref = this.objects) != null ? _ref: this.objects = {})[uri];
                    if (! (object != null)) {
                        objects[uri] = object = this._createObject(uri);
                    }
                    handler(object);
                } else if (!this.isWatched(uri)) {
                    object = this.objects[uri];
                    delete this.objects[uri];
                    if (object != null) {
                        if (typeof object.dispose === "function") {
                            object.dispose();
                        }
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
    LocalManager.test = function() {
        var handler;
        handler = new LocalManager;
        assert(!handler.handles('local:foo.bar'));
        assert(handler.handles('local:foo.bar/{}'));
        return assert(handler.handles('local:foo.bar/{"id":2}'));
    };
    LocalManager.path = "glass.reactive.LocalManager";
    LocalManager.implements = {
        "glass.reactive.LocalManager": true,
        "glass.reactive.PartialManager": true,
        "glass.Component": true
    };
    LocalManager.uri = "global:/glass/reactive/LocalManager";
    (function() {
        var baseTypes = [PartialManager];
        var i, j, baseType, a, b;
        for (i = 0; i < baseTypes.length; i++) {
            baseType = baseTypes[i];
            for (key in baseType.properties) {
                a = LocalManager.properties[key];
                b = baseType.properties[key];
                if (a != null && b != null && a.constructor === Object && b.constructor === Object) {
                    for (j in b) {
                        if (!a.hasOwnProperty(j)) a[j] = b[j];
                    }
                } else if (!LocalManager.properties.hasOwnProperty(key)) {
                    LocalManager.properties[key] = b;
                }
            }
        }
    })();
    Object.defineProperties(LocalManager.prototype, LocalManager.properties);
    LocalManager._init_ = function() {
        PartialManager = global.glass.reactive.PartialManager;
        assert = global.glass.assert;
        getType = global.glass.getType;
        delete LocalManager._init_;
    }
}).call(glass.reactive)