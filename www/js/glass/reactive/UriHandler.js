(function() {
    var global = (function() {
        return this;
    })();
    var reactive = this;
    var Observable = global.glass.Observable;
    var assert; //  assigned during _init_
    var UriHandler = this.UriHandler = function UriHandler(properties) {
        var key;
        if (properties != null) {
            for (key in properties) {
                this[key] = properties[key];
            }
        }
    }
    UriHandler.properties = {
        pattern: {
            name: "pattern",
            observable: true,
            handler: {
                set: function anonymous(value, oldValue) {
                    this.notifyObservers("pattern", oldValue, value);
                }
            },
        default:
            null,
            set: function anonymous(value) {
                var oldValue = this._pattern;
                if (value !== oldValue) {
                    this._pattern = value;
                    UriHandler.properties.pattern.handler.set.call(this, value, oldValue);
                }
            },
            get: function anonymous() {
                var value = this._pattern;
                return value;
            }
        },
        handles: {
            value: function(uri) {
                var _ref;
                return ((_ref = this.pattern) != null ? _ref.test(uri) : void 0) === true;
            },
            name: "handles"
        },
        normalize: {
            value: function(uri) {
                return uri;
            },
            name: "normalize"
        },
        observe: {
            value: function(uri, observer) {},
            name: "observe"
        },
        unobserve: {
            value: function(uri, observer) {},
            name: "unobserve"
        }
    };
    UriHandler.test = function() {
        var handler;
        handler = new UriHandler({
            pattern: /^ab*$/
        });
        assert(handler.handles("a"));
        assert(handler.handles("abbbbb"));
        return assert(!handler.handles("abc"));
    };
    UriHandler.path = "glass.reactive.UriHandler";
    UriHandler.implements = {
        "glass.reactive.UriHandler": true,
        "glass.Observable": true
    };
    (function() {
        var baseTypes = [Observable];
        var i, j, baseType, a, b;
        for (i = 0; i < baseTypes.length; i++) {
            baseType = baseTypes[i];
            for (key in baseType.properties) {
                a = UriHandler.properties[key];
                b = baseType.properties[key];
                if (a != null && b != null && a.constructor === Object && b.constructor === Object) {
                    for (j in b) {
                        if (!a.hasOwnProperty(j)) a[j] = b[j];
                    }
                } else if (!UriHandler.properties.hasOwnProperty(key)) {
                    UriHandler.properties[key] = b;
                }
            }
        }
    })();
    Object.defineProperties(UriHandler.prototype, UriHandler.properties);
    UriHandler._init_ = function() {
        assert = global.glass.assert;
        delete UriHandler._init_;
    }
}).call(glass.reactive)