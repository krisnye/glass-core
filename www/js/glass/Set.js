(function() {
    var global = (function() {
        return this;
    })();
    var glass = this;
    var Component = global.glass.Component;
    var values; //  assigned during _init_
    var assert; //  assigned during _init_
    var getId; //  assigned during _init_
    var Set = this.Set = function Set(values) {
        var value, _i, _len;
        this._values = {};
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
                    this._values[getId(value)] = value;
                    return this._size++;
                }
            },
            name: "add"
        },
        delete: {
            value: function(value) {
                if (!this.has(value)) {
                    return false;
                } else {
                    delete this._values[getId(value)];
                    this._size--;
                    return true;
                }
            },
            name: "delete"
        },
        has: {
            value: function(value) {
                return this._values.hasOwnProperty(getId(value));
            },
            name: "has"
        },
        values: {
            value: function() {
                return glass.values(this._values);
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
            value: function(callback, scope) {
                var key, value, _ref;
                _ref = this._values;
                for (key in _ref) {
                    value = _ref[key];
                    callback.call(scope, value);
                }
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
        }
    };
    Set.path = "glass.Set";
    Set.implements = {
        "glass.Set": true,
        "glass.Component": true
    };
    Set.uri = "global:/glass/Set";
    (function() {
        var baseTypes = [Component];
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
        values = global.glass.values;
        assert = global.glass.assert;
        getId = global.glass.getId;
        delete Set._init_;
    }
}).call(glass)