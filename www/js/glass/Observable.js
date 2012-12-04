(function() {
    var global = (function() {
        return this;
    })();
    var glass = this;
    var JSONMergePatch; //  assigned during _init_
    var isFunction; //  assigned during _init_
    var isPrivate; //  assigned during _init_
    var values; //  assigned during _init_
    var patch; //  assigned during _init_
    var assert; //  assigned during _init_
    var assertEquals; //  assigned during _init_
    var getId; //  assigned during _init_
    var Observable = this.Observable = function Observable(properties) {
        var key;
        if (properties != null) {
            for (key in properties) {
                this[key] = properties[key];
            }
        }
    }
    Observable.properties = {
        is: {
            value: function(type) {
                var _ref;
                return this.constructor["implements"][(_ref = type.path) != null ? _ref: type] === true;
            },
            name: "is"
        },
        watchers: {
            serializable: false,
            name: "watchers",
            writable: true
        },
        watch: {
            value: function(property, watcher) {
                var id, _this = this;
                if (isFunction(property)) {
                    watcher = property;
                    property = '';
                }
                id = getId(watcher);
                this.patch('watchers', property, id, watcher);
                return function() {
                    return _this.patch('watchers', property, getId(watcher), void 0);
                };
            },
            name: "watch"
        },
        patch: {
            value: function(change) {
                if (arguments.length > 1) {
                    change = JSONMergePatch.create.apply(null, arguments);
                }
                try {
                    JSONMergePatch.apply(this, change);
                } catch(e) {
                    console.log(e);
                } finally {
                    this.notify(change);
                }
            },
            name: "patch"
        },
        notify: {
            value: function(change) {
                var changeArg, id, property, watcher, watchers, _ref;
                if (this.watchers != null) {
                    if (arguments.length > 1) {
                        change = JSONMergePatch.create.apply(null, arguments);
                    }
                    _ref = this.watchers;
                    for (property in _ref) {
                        watchers = _ref[property];
                        if (property.length === 0 || change.hasOwnProperty(property)) {
                            changeArg = property.length === 0 ? change: change[property];
                            for (id in watchers) {
                                watcher = watchers[id];
                                watcher(this, changeArg);
                            }
                        }
                    }
                }
            },
            name: "notify"
        },
        toJSON: {
            value: function() {
                var name, property, value, values, _ref;
                values = {
                    "class": this.constructor.path
                };
                _ref = this.constructor.properties;
                for (name in _ref) {
                    property = _ref[name];
                    value = this[name];
                    if (property.serializable !== false && !isFunction(value)) {
                        values[name] = value;
                    }
                }
                if (this.constructor.additionalProperties !== false) {
                    for (name in this) {
                        if (!__hasProp.call(this, name)) continue;
                        value = this[name];
                        if (!isPrivate(name)) {
                            values[name] = value;
                        }
                    }
                }
                return values;
            },
            name: "toJSON"
        },
        toString: {
            value: function() {
                return this.toJSON();
            },
            name: "toString"
        }
    };
    Observable.test = {
        toJSON: function() {
            var a;
            a = new Observable;
            a.x = 12;
            a.y = function() {};
            a.z = true;
            return assertEquals(a, {
                "class": 'glass.Observable',
                x: 12,
                z: true
            });
        },
        watchAll: function() {
            var a, unwatch, watchArgs, watcher, _ref, _ref1;
            a = new Observable;
            watchArgs = [];
            watcher = function(source, patch) {
                return watchArgs.push(source, patch);
            };
            unwatch = a.watch(watcher);
            assert(watchArgs[0] === a);
            assert(((_ref = watchArgs[1]) != null ? (_ref1 = _ref.watchers) != null ? _ref1[""] : void 0 : void 0) != null);
            watchArgs.length = 0;
            a.patch("a", "b", 3);
            assertEquals(a.a, {
                b: 3
            });
            assert(watchArgs[0] === a);
            assertEquals(watchArgs[1], {
                a: {
                    b: 3
                }
            });
            unwatch();
            assertEquals(a.watchers[""], {});
            watchArgs.length = 0;
            a.patch("a", "b", 3);
            return assert(watchArgs.length === 0);
        },
        watchProperty: function() {
            var a, unwatch, watchArgs, watcher;
            a = new Observable;
            watchArgs = [];
            watcher = function(source, patch) {
                return watchArgs.push(source, patch);
            };
            unwatch = a.watch("foo", watcher);
            assert(watchArgs.length === 0);
            a.patch("foo", "b", 3);
            assertEquals(a.foo, {
                b: 3
            });
            assert(watchArgs[0] === a);
            assertEquals(watchArgs[1], {
                b: 3
            });
            watchArgs.length = 0;
            a.patch("a", "b", 3);
            assert(watchArgs.length === 0);
            unwatch();
            watchArgs.length = 0;
            a.patch("foo", "b", 4);
            return assert(watchArgs.length === 0);
        }
    };
    Observable.path = "glass.Observable";
    Observable.implements = {
        "glass.Observable": true
    };
    Observable.uri = "global:/glass/Observable";
    Object.defineProperties(Observable.prototype, Observable.properties);
    Observable._init_ = function() {
        JSONMergePatch = global.glass.JSONMergePatch;
        isFunction = global.glass.isFunction;
        isPrivate = global.glass.isPrivate;
        values = global.glass.values;
        patch = global.glass.patch;
        assert = global.glass.assert;
        assertEquals = global.glass.assertEquals;
        getId = global.glass.getId;
        delete Observable._init_;
    }
}).call(glass)