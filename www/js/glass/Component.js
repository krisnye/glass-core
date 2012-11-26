(function() {
    var global = (function() {
        return this;
    })();
    var glass = this;
    var isFunction; //  assigned during _init_
    var isPrivate; //  assigned during _init_
    var values; //  assigned during _init_
    var assertEquals; //  assigned during _init_
    var Component = this.Component = function Component(properties) {
        var key;
        if (properties != null) {
            for (key in properties) {
                this[key] = properties[key];
            }
        }
    }
    Component.properties = {
        uri: {
            description: "Uniform resource identifier for this component.",
            type: "string",
            name: "uri",
            writable: true
        },
        is: {
            value: function(type) {
                var _ref;
                return this.constructor["implements"][(_ref = type.path) != null ? _ref: type] === true;
            },
            name: "is"
        },
        dispose: {
            value: function() {},
            name: "dispose"
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
    Component.test = {
        toJSON: function() {
            var a;
            a = new Component;
            a.x = 12;
            a.y = function() {};
            a.z = true;
            return assertEquals(a, {
                "class": 'glass.Component',
                x: 12,
                z: true
            });
        }
    };
    Component.path = "glass.Component";
    Component.implements = {
        "glass.Component": true
    };
    Component.uri = "global:/glass/Component";
    Object.defineProperties(Component.prototype, Component.properties);
    Component._init_ = function() {
        isFunction = global.glass.isFunction;
        isPrivate = global.glass.isPrivate;
        values = global.glass.values;
        assertEquals = global.glass.assertEquals;
        delete Component._init_;
    }
}).call(glass)