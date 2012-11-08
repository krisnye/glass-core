(function() {
    var global = (function() {
        return this;
    })();
    var glass = this;
    var Observable = global.glass.Observable;
    var assertEquals; //  assigned during _init_
    var getId; //  assigned during _init_
    var Map = this.Map = function Map(values) {
        var key, value;
        this._keys = {};
        this._values = {};
        if (values != null) {
            for (key in values) {
                value = values[key];
                this.set(key, value);
            }
        }
        return this;
    };
    Map.properties = {
        get: {
            value: function(key) {
                return this._values[getId(key)];
            },
            name: "get"
        },
        set: {
            value: function(key, value) {
                var id, oldValue;
                id = getId(key);
                if (this._values.hasOwnProperty(id)) {
                    oldValue = this._values[id];
                } else {
                    oldValue = void 0;
                }
                this._keys[id] = key;
                this._values[id] = value;
                if (value !== oldValue) {
                    this.notifyObservers(key, oldValue, value);
                }
            },
            name: "set"
        },
        delete: {
            value: function(key) {
                var id, oldValue, result;
                id = getId(key);
                result = this._keys.hasOwnProperty(id);
                if (result) {
                    oldValue = this._values[id];
                    delete this._keys[id];
                    delete this._values[id];
                    this.notifyObservers(key, oldValue, void 0);
                }
                return result;
            },
            name: "delete"
        },
        has: {
            value: function(key) {
                return this._keys.hasOwnProperty(getId(key));
            },
            name: "has"
        },
        keys: {
            value: function() {
                var key, value, _ref, _results;
                _ref = this._keys;
                _results = [];
                for (key in _ref) {
                    value = _ref[key];
                    _results.push(value);
                }
                return _results;
            },
            name: "keys"
        },
        values: {
            value: function() {
                var key, value, _ref, _results;
                _ref = this._values;
                _results = [];
                for (key in _ref) {
                    value = _ref[key];
                    _results.push(value);
                }
                return _results;
            },
            name: "values"
        },
        size: {
            value: function() {
                var count, id;
                count = 0;
                for (id in this._keys) {
                    count++;
                }
                return count;
            },
            name: "size"
        },
        forEach: {
            value: function(callback, scope) {
                var id, key, value, _ref;
                _ref = this._keys;
                for (id in _ref) {
                    key = _ref[id];
                    value = this._values[id];
                    callback.call(scope, key, value);
                }
            },
            name: "forEach"
        },
        forEachKey: {
            value: function(callback, scope) {
                var id, key, value, _ref;
                _ref = this._keys;
                for (id in _ref) {
                    key = _ref[id];
                    value = this._values[id];
                    callback.call(scope, key);
                }
            },
            name: "forEachKey"
        },
        forEachValue: {
            value: function(callback, scope) {
                var id, key, value, _ref;
                _ref = this._keys;
                for (id in _ref) {
                    key = _ref[id];
                    value = this._values[id];
                    callback.call(scope, value);
                }
            },
            name: "forEachValue"
        }
    };
    Map.test = {
        observable: function() {
            var lastArgs, map;
            map = new Map;
            lastArgs = null;
            map.observe(function() {
                var args;
                args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                return lastArgs = args;
            });
            map.set(4, 8);
            assertEquals(lastArgs, [4, void 0, 8]);
            map.set(4, 16);
            assertEquals(lastArgs, [4, 8, 16]);
            map["delete"](4);
            return assertEquals(lastArgs, [4, 16, void 0]);
        }
    };
    Map.path = "glass.Map";
    Map.implements = {
        "glass.Map": true,
        "glass.Observable": true
    };
    (function() {
        var baseTypes = [Observable];
        var i, j, baseType, a, b;
        for (i = 0; i < baseTypes.length; i++) {
            baseType = baseTypes[i];
            for (key in baseType.properties) {
                a = Map.properties[key];
                b = baseType.properties[key];
                if (a != null && b != null && a.constructor === Object && b.constructor === Object) {
                    for (j in b) {
                        if (!a.hasOwnProperty(j)) a[j] = b[j];
                    }
                } else if (!Map.properties.hasOwnProperty(key)) {
                    Map.properties[key] = b;
                }
            }
        }
    })();
    Object.defineProperties(Map.prototype, Map.properties);
    Map._init_ = function() {
        assertEquals = global.glass.assertEquals;
        getId = global.glass.getId;
        delete Map._init_;
    }
}).call(glass)