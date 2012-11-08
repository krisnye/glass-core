(function() {
    var global = (function() {
        return this;
    })();
    var reactive = this;
    var Observable = global.glass.Observable;
    var UriHandler; //  assigned during _init_
    var DelegatingUriHandler = this.DelegatingUriHandler = function DelegatingUriHandler(properties) {
        var key;
        if (properties != null) {
            for (key in properties) {
                this[key] = properties[key];
            }
        }
    }
    DelegatingUriHandler.properties = {
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
                    DelegatingUriHandler.properties.pattern.handler.set.call(this, value, oldValue);
                }
            },
            get: function anonymous() {
                var value = this._pattern;
                return value;
            }
        },
        handles: {
            value: function(uri) {
                return (typeof pattern !== "undefined" && pattern !== null ? pattern.test(uri) : void 0) === true;
            },
            name: "handles"
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
    DelegatingUriHandler.test = function() {
        return console.log('hello UriHandler');
    };
    DelegatingUriHandler.path = "glass.reactive.DelegatingUriHandler";
    DelegatingUriHandler.implements = {
        "glass.reactive.DelegatingUriHandler": true,
        "glass.Observable": true
    };
    (function() {
        var baseTypes = [Observable];
        var i, j, baseType, a, b;
        for (i = 0; i < baseTypes.length; i++) {
            baseType = baseTypes[i];
            for (key in baseType.properties) {
                a = DelegatingUriHandler.properties[key];
                b = baseType.properties[key];
                if (a != null && b != null && a.constructor === Object && b.constructor === Object) {
                    for (j in b) {
                        if (!a.hasOwnProperty(j)) a[j] = b[j];
                    }
                } else if (!DelegatingUriHandler.properties.hasOwnProperty(key)) {
                    DelegatingUriHandler.properties[key] = b;
                }
            }
        }
    })();
    Object.defineProperties(DelegatingUriHandler.prototype, DelegatingUriHandler.properties);
    DelegatingUriHandler._init_ = function() {
        UriHandler = global.glass.reactive.UriHandler;
        delete DelegatingUriHandler._init_;
    }
}).call(glass.reactive)