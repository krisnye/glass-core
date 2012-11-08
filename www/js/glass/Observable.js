(function() {
    var global = (function() {
        return this;
    })();
    var glass = this;
    var Map; //  assigned during _init_
    var Set; //  assigned during _init_
    var isFunction; //  assigned during _init_
    var isPrivate; //  assigned during _init_
    var assertEquals; //  assigned during _init_
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
        observers: {
            observable: false,
            serializable: false,
            name: "observers",
            writable: true
        },
        observe: {
            value: function(key, observer) {
                var keyObservers, _ref;
                if (! (observer != null)) {
                    observer = key;
                    key = null;
                }
                if ((_ref = this.observers) == null) {
                    this.observers = new Map;
                }
                keyObservers = this.observers.get(key);
                if (! (keyObservers != null)) {
                    this.observers.set(key, keyObservers = new Set);
                }
                keyObservers.add(observer);
            },
            name: "observe"
        },
        unobserve: {
            value: function(key, observer) {
                var keyObservers, _ref;
                if (! (observer != null)) {
                    observer = key;
                    key = null;
                }
                keyObservers = (_ref = this.observers) != null ? _ref.get(key) : void 0;
                if (! (keyObservers != null ? keyObservers["delete"](observer) : void 0)) {
                    throw new Error("observer not found");
                }
                if (keyObservers.size === 0) {
                    this.observers["delete"](key);
                }
            },
            name: "unobserve"
        },
        notifyObservers: {
            value: function(key, oldValue, newValue) {
                var allObservers, callback, keyObservers;
                if (this.observers != null) {
                    allObservers = this.observers.get(null);
                    keyObservers = this.observers.get(key);
                    if ((allObservers != null) || (keyObservers != null)) {
                        callback = function(observer) {
                            return observer.call(this, key, oldValue, newValue);
                        };
                        if (allObservers != null) {
                            allObservers.forEach(callback, this);
                        }
                        if (keyObservers != null) {
                            keyObservers.forEach(callback, this);
                        }
                    }
                }
            },
            name: "notifyObservers"
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
        notifyObservers: function() {
            var a, lastArgs, observer;
            a = new Observable;
            lastArgs = null;
            a.observe(observer = function() {
                var args;
                args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                return lastArgs = args;
            });
            a.foo = 1;
            a.notifyObservers('foo', void 0, 1);
            assertEquals(lastArgs, ['foo', void 0, 1]);
            a.unobserve(observer);
            lastArgs = null;
            a.notifyObservers('foo', void 0, 1);
            return assertEquals(lastArgs, null);
        },
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
        }
    };
    Observable.path = "glass.Observable";
    Observable.implements = {
        "glass.Observable": true
    };
    Object.defineProperties(Observable.prototype, Observable.properties);
    Observable._init_ = function() {
        Map = global.glass.Map;
        Set = global.glass.Set;
        isFunction = global.glass.isFunction;
        isPrivate = global.glass.isPrivate;
        assertEquals = global.glass.assertEquals;
        delete Observable._init_;
    }
}).call(glass)