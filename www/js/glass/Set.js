(function() {
    var global = (function() {
        return this;
    })();
    var glass = this;
    var Observable = global.glass.Observable;
    var Map; //  assigned during _init_
    var assert; //  assigned during _init_
    var assertEquals; //  assigned during _init_
    var Set = this.Set = function Set(values) {
        var value, _i, _len;
        this._map = new Map;
        this._size = 0;
        if (values != null) {
            for (_i = 0, _len = values.length; _i < _len; _i++) {
                value = values[_i];
                this.add(value);
            }
        }
        return this;
    };
    Set.properties = {
        add: {
            value: function(value) {
                if (!this.has(value)) {
                    this._map.set(value, true);
                    this._size++;
                    return this.notifyObservers(value, void 0, value);
                }
            },
            name: "add"
        },
        delete: {
            value: function(value) {
                var result;
                result = this._map["delete"](value);
                if (result) {
                    this._size--;
                    this.notifyObservers(value, value, void 0);
                }
                return result;
            },
            name: "delete"
        },
        has: {
            value: function(value) {
                return this._map.has(value);
            },
            name: "has"
        },
        values: {
            value: function() {
                return this._map.keys();
            },
            name: "values"
        },
        size: {
            get: function() {
                return this._size;
            },
            name: "size"
        },
        forEach: {
            value: function(scope, callback) {
                return this._map.forEachKey(scope, callback);
            },
            name: "forEach"
        }
    };
    Set.test = {
        addHasDelete: function() {
            var set;
            set = new Set;
            set.add(1);
            assert(set.size === 1);
            assert(set.has(1));
            assert(set["delete"](2) === false);
            assert(set["delete"](1) === true);
            return assert(set.size === 0);
        },
        observable: function() {
            var lastArgs, set;
            set = new Set;
            lastArgs = null;
            set.observe(function() {
                var args;
                args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                return lastArgs = args;
            });
            set.add(4);
            assertEquals(lastArgs, [4, void 0, 4]);
            lastArgs = null;
            set.add(4);
            assertEquals(lastArgs, null);
            set["delete"](4);
            return assertEquals(lastArgs, [4, 4, void 0]);
        }
    };
    Set.path = "glass.Set";
    Set.implements = {
        "glass.Set": true,
        "glass.Observable": true
    };
    (function() {
        var baseTypes = [Observable];
        var i, j, baseType, a, b;
        for (i = 0; i < baseTypes.length; i++) {
            baseType = baseTypes[i];
            for (key in baseType.properties) {
                a = Set.properties[key];
                b = baseType.properties[key];
                if (a != null && b != null && a.constructor === Object && b.constructor === Object) {
                    for (j in b) {
                        if (!a.hasOwnProperty(j)) a[j] = b[j];
                    }
                } else if (!Set.properties.hasOwnProperty(key)) {
                    Set.properties[key] = b;
                }
            }
        }
    })();
    Object.defineProperties(Set.prototype, Set.properties);
    Set._init_ = function() {
        Map = global.glass.Map;
        assert = global.glass.assert;
        assertEquals = global.glass.assertEquals;
        delete Set._init_;
    }
}).call(glass)