(function() {
    var global = (function() {
        return this;
    })();
    var glass = this;
    var Observable = global.glass.Observable;
    var indexOfIdentical; //  assigned during _init_
    var lastIndexOfIdentical; //  assigned during _init_
    var assertEquals; //  assigned during _init_
    var List = this.List = function List(values) {
        if (this.constructor !== List) {
            return new List(values);
        } else {
            this._values = values ? values.slice(0) : [];
            return this;
        }
    };
    List.properties = {
        add: {
            value: function(value) {
                var index;
                index = this._values.length;
                this._values.push(value);
                this.notifyObservers(index, void 0, value);
            },
            name: "add"
        },
        delete: {
            value: function(value) {
                var index;
                index = this.lastIndexOf(value);
                if (index >= 0) {
                    this._values.splice(index, 1);
                    this.notifyObservers(index, value, void 0);
                    return true;
                } else {
                    return false;
                }
            },
            name: "delete"
        },
        has: {
            value: function(value) {
                return this.lastIndexOfIdentical(value) >= 0;
            },
            name: "has"
        },
        length: {
            get: function() {
                return this._values.length;
            },
            name: "length"
        },
        values: {
            value: function() {
                return this._values.slice(0);
            },
            name: "values"
        },
        indexOf: {
            value: function(value) {
                return indexOfIdentical(this._values, value);
            },
            name: "indexOf"
        },
        lastIndexOf: {
            value: function(value) {
                return lastIndexOfIdentical(this._values, value);
            },
            name: "lastIndexOf"
        },
        forEach: {
            value: function(callback, scope) {
                var value, _i, _len, _ref;
                _ref = this._values;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    value = _ref[_i];
                    callback.call(scope, value);
                }
            },
            name: "forEach"
        },
        toJSON: {
            value: function() {
                return this._values;
            },
            name: "toJSON"
        }
    };
    List.indexOfIdentical = function(array, item) {
        var index, value, _i, _len;
        for (index = _i = 0, _len = array.length; _i < _len; index = ++_i) {
            value = array[index];
            if (value === item) {
                return index;
            }
        }
        return - 1;
    };
    List.lastIndexOfIdentical = function(array, item) {
        var index, value, _i, _ref;
        for (index = _i = _ref = array.length - 1; _i >= 0; index = _i += -1) {
            value = array[index];
            if (value === item) {
                return index;
            }
        }
        return - 1;
    };
    List.test = {
        compatibility: function() {
            var list, list2;
            list = new List([1, 2, 3, 4, 3, 5]);
            assertEquals(list, [1, 2, 3, 4, 3, 5]);
            list["delete"](3);
            assertEquals(list, [1, 2, 3, 4, 5]);
            list["delete"](5);
            assertEquals(list, [1, 2, 3, 4]);
            list["delete"](1);
            assertEquals(list, [2, 3, 4]);
            assertEquals(list.length, 3);
            list2 = List([1, 2, 3]);
            if (list2.constructor !== List) {
                throw new Error("list2 isn't a List");
            }
            assertEquals(list2, [1, 2, 3]);
        },
        observable: function() {
            var lastArgs, list;
            list = new List([1, 2, 3]);
            lastArgs = null;
            list.observe(function() {
                var args;
                args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                return lastArgs = args;
            });
            list.add(4);
            assertEquals(lastArgs, [3, void 0, 4]);
            list["delete"](2);
            return assertEquals(lastArgs, [1, 2, void 0]);
        }
    };
    List.path = "glass.List";
    List.implements = {
        "glass.List": true,
        "glass.Observable": true
    };
    (function() {
        var baseTypes = [Observable];
        var i, j, baseType, a, b;
        for (i = 0; i < baseTypes.length; i++) {
            baseType = baseTypes[i];
            for (key in baseType.properties) {
                a = List.properties[key];
                b = baseType.properties[key];
                if (a != null && b != null && a.constructor === Object && b.constructor === Object) {
                    for (j in b) {
                        if (!a.hasOwnProperty(j)) a[j] = b[j];
                    }
                } else if (!List.properties.hasOwnProperty(key)) {
                    List.properties[key] = b;
                }
            }
        }
    })();
    Object.defineProperties(List.prototype, List.properties);
    List._init_ = function() {
        indexOfIdentical = global.glass.List.indexOfIdentical;
        lastIndexOfIdentical = global.glass.List.lastIndexOfIdentical;
        assertEquals = global.glass.assertEquals;
        delete List._init_;
    }
}).call(glass)