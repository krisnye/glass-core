(function() {
    var global = (function() {
        return this;
    })();
    var glass = this;
    var Observable = global.glass.Observable;
    var Container = this.Container = function Container(properties) {
        var key;
        if (properties != null) {
            for (key in properties) {
                this[key] = properties[key];
            }
        }
    }
    Container.properties = {
        watch: {
            value: function() {},
            name: "watch"
        },
        unwatch: {
            value: function() {},
            name: "unwatch"
        }
    };
    Container.path = "glass.Container";
    Container.implements = {
        "glass.Container": true,
        "glass.Observable": true
    };
    Container.uri = "global:/glass/Container";
    (function() {
        var baseTypes = [Observable];
        var i, j, baseType, a, b;
        for (i = 0; i < baseTypes.length; i++) {
            baseType = baseTypes[i];
            for (key in baseType.properties) {
                a = Container.properties[key];
                b = baseType.properties[key];
                if (a != null && b != null && a.constructor === Object && b.constructor === Object) {
                    for (j in b) {
                        if (!a.hasOwnProperty(j)) a[j] = b[j];
                    }
                } else if (!Container.properties.hasOwnProperty(key)) {
                    Container.properties[key] = b;
                }
            }
        }
    })();
    Object.defineProperties(Container.prototype, Container.properties);
    Container._init_ = function() {
        delete Container._init_;
    }
}).call(glass)