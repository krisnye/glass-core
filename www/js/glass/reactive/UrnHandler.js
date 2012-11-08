(function() {
    var global = (function() {
        return this;
    })();
    var reactive = this;
    var UriHandler = global.glass.reactive.UriHandler;
    var UriHandler; //  assigned during _init_
    var Map; //  assigned during _init_
    var assert; //  assigned during _init_
    var UrnHandler = this.UrnHandler = function UrnHandler() {
        UriHandler.call(this, arguments);
        this.observed = new Map;
        return this;
    };
    UrnHandler.properties = {
        pattern: {
            name: "pattern",
            observable: true,
            handler: {
                set: function anonymous(value, oldValue) {
                    this.notifyObservers("pattern", oldValue, value);
                }
            },
        default:
            /^urn:([$A-Z_][$A-Z_0-9]*(\.[$A-Z_][$A-Z_0-9]*)*):(\{[^\(\)=]*?\})$/i,
            set: function anonymous(value) {
                var oldValue = this._pattern;
                if (value !== oldValue) {
                    this._pattern = value;
                    UrnHandler.properties.pattern.handler.set.call(this, value, oldValue);
                }
            },
            get: function anonymous() {
                var value = this._pattern;
                if (value == null) value = UrnHandler.properties.pattern['default'];
                return value;
            }
        },
        observe: {
            value: function(uri, observer) {
                var observed;
                observed = this.observed.get(uri);
                if (! (observed != null)) {
                    return observed = null;
                }
            },
            name: "observe"
        },
        unobserve: {
            value: function(uri, observer) {},
            name: "unobserve"
        }
    };
    UrnHandler.test = function() {
        var handler;
        handler = new UrnHandler;
        assert(!handler.handles('urn:foo.bar'));
        assert(handler.handles('urn:foo.bar:{}'));
        return assert(handler.handles('urn:foo.bar:{id:2}'));
    };
    UrnHandler.path = "glass.reactive.UrnHandler";
    UrnHandler.implements = {
        "glass.reactive.UrnHandler": true,
        "glass.reactive.UriHandler": true,
        "glass.Observable": true
    };
    (function() {
        var baseTypes = [UriHandler];
        var i, j, baseType, a, b;
        for (i = 0; i < baseTypes.length; i++) {
            baseType = baseTypes[i];
            for (key in baseType.properties) {
                a = UrnHandler.properties[key];
                b = baseType.properties[key];
                if (a != null && b != null && a.constructor === Object && b.constructor === Object) {
                    for (j in b) {
                        if (!a.hasOwnProperty(j)) a[j] = b[j];
                    }
                } else if (!UrnHandler.properties.hasOwnProperty(key)) {
                    UrnHandler.properties[key] = b;
                }
            }
        }
    })();
    Object.defineProperties(UrnHandler.prototype, UrnHandler.properties);
    UrnHandler._init_ = function() {
        UriHandler = global.glass.reactive.UriHandler;
        Map = global.glass.Map;
        assert = global.glass.assert;
        delete UrnHandler._init_;
    }
}).call(glass.reactive)