(function() {
    var global = (function() {
        return this;
    })();
    var reactive = this;
    var Component = global.glass.Component;
    var create; //  assigned during _init_
    var GlobalManager; //  assigned during _init_
    var reactive; //  assigned during _init_
    var assert; //  assigned during _init_
    var Manager = this.Manager = function Manager(properties) {
        var key;
        if (properties != null) {
            for (key in properties) {
                this[key] = properties[key];
            }
        }
    }
    Manager.properties = {
        resolve: {
            value: function(baseUri, relativeUri) {},
            name: "resolve"
        },
        watch: {
            value: function(uri, handler, connect) {
                if (connect == null) {
                    connect = true;
                }
            },
            name: "watch"
        },
        patch: {
            value: function(uri, patch) {},
            name: "patch"
        }
    };
    Manager.create = function() {
        return new reactive.DelegatingManager({
            managers: [new GlobalManager()]
        });
    };
    Manager.test = function() {
        var manager;
        manager = create();
        return assert(manager != null);
    };
    Manager.path = "glass.reactive.Manager";
    Manager.implements = {
        "glass.reactive.Manager": true,
        "glass.Component": true
    };
    Manager.uri = "global:/glass/reactive/Manager";
    (function() {
        var baseTypes = [Component];
        var i, j, baseType, a, b;
        for (i = 0; i < baseTypes.length; i++) {
            baseType = baseTypes[i];
            for (key in baseType.properties) {
                a = Manager.properties[key];
                b = baseType.properties[key];
                if (a != null && b != null && a.constructor === Object && b.constructor === Object) {
                    for (j in b) {
                        if (!a.hasOwnProperty(j)) a[j] = b[j];
                    }
                } else if (!Manager.properties.hasOwnProperty(key)) {
                    Manager.properties[key] = b;
                }
            }
        }
    })();
    Object.defineProperties(Manager.prototype, Manager.properties);
    Manager._init_ = function() {
        create = global.glass.reactive.Manager.create;
        GlobalManager = global.glass.reactive.GlobalManager;
        reactive = global.glass.reactive;
        assert = global.glass.assert;
        delete Manager._init_;
    }
}).call(glass.reactive)