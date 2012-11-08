(function() {
    var global = (function() {
        return this;
    })();
    var reactive = this;
    var UriHandler = global.glass.reactive.UriHandler;
    var createDefault; //  assigned during _init_
    var PathHandler; //  assigned during _init_
    var assert; //  assigned during _init_
    var Context = this.Context = function Context(properties) {
        var key;
        if (properties != null) {
            for (key in properties) {
                this[key] = properties[key];
            }
        }
    }
    Context.properties = {
        handlers: {
            type: "array",
            required: true,
            name: "handlers",
            observable: true,
            handler: {
                set: function anonymous(value, oldValue) {
                    this.notifyObservers("handlers", oldValue, value);
                }
            },
            set: function anonymous(value) {
                var oldValue = this._handlers;
                if (value !== oldValue) {
                    this._handlers = value;
                    Context.properties.handlers.handler.set.call(this, value, oldValue);
                }
            },
            get: function anonymous() {
                var value = this._handlers;
                return value;
            }
        },
        handles: {
            value: function(uri) {
                return this._getHandler(uri, false) != null;
            },
            name: "handles"
        },
        observe: {
            value: function(uri, observer) {
                return this._getHandler(uri).observe(uri, observer);
            },
            name: "observe"
        },
        unobserve: {
            value: function(uri, observer) {
                return this._getHandler(uri).unobserve(uri, observer);
            },
            name: "unobserve"
        },
        _getHandler: {
            value: function(uri, throwError) {
                var handler, _i, _len, _ref;
                _ref = this.handlers;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    handler = _ref[_i];
                    if (handler.handles(uri)) {
                        return handler;
                    }
                }
                if (throwError !== false) {
                    throw new Error("No handler found for " + uri);
                }
            },
            name: "_getHandler"
        }
    };
    Context.createDefault = function() {
        return new Context({
            handlers: [new PathHandler()]
        });
    };
    Context.test = function() {
        var context;
        context = createDefault();
        assert(context.handles("a.b.c"));
        return assert(!context.handles("http://a.b.c"));
    };
    Context.path = "glass.reactive.Context";
    Context.implements = {
        "glass.reactive.Context": true,
        "glass.reactive.UriHandler": true,
        "glass.Observable": true
    };
    (function() {
        var baseTypes = [UriHandler];
        var i, j, baseType, a, b;
        for (i = 0; i < baseTypes.length; i++) {
            baseType = baseTypes[i];
            for (key in baseType.properties) {
                a = Context.properties[key];
                b = baseType.properties[key];
                if (a != null && b != null && a.constructor === Object && b.constructor === Object) {
                    for (j in b) {
                        if (!a.hasOwnProperty(j)) a[j] = b[j];
                    }
                } else if (!Context.properties.hasOwnProperty(key)) {
                    Context.properties[key] = b;
                }
            }
        }
    })();
    Object.defineProperties(Context.prototype, Context.properties);
    Context._init_ = function() {
        createDefault = global.glass.reactive.Context.createDefault;
        PathHandler = global.glass.reactive.PathHandler;
        assert = global.glass.assert;
        delete Context._init_;
    }
}).call(glass.reactive)