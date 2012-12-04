(function() {
    var global = (function() {
        return this;
    })();
    var glass = this;
    var Observable = global.glass.Observable;
    var Observable; //  assigned during _init_
    var isString; //  assigned during _init_
    var patch; //  assigned during _init_
    var assert; //  assigned during _init_
    var assertEquals; //  assigned during _init_
    var getId; //  assigned during _init_
    var Component = this.Component = function Component(properties) {
        var id;
        this.patch(properties);
        if (this.parent) {
            id = getId(this);
            patch(this.parent, id, this);
        }
        return this;
    };
    Component.properties = {
        id: {
            description: "string which uniquely identifies this component within its parent",
            type: "string",
            name: "id",
            writable: true
        },
        parent: {
            description: "the object that contains this component",
            serializable: false,
            type: "object",
            name: "parent",
            writable: true
        },
        disposed: {
            value: false,
            name: "disposed",
            writable: true
        },
        dispose: {
            value: function() {
                return this.patch('disposed', true);
            },
            name: "dispose"
        },
        notify: {
            value: function(change) {
                var child, id;
                Observable.prototype.notify.apply(this, arguments);
                if (change != null ? change.disposed: void 0) {
                    for (id in this) {
                        child = this[id];
                        if ((child != null ? child.parent: void 0) === this) {
                            if (typeof child.dispose === "function") {
                                child.dispose();
                            }
                        }
                    }
                    if (this.id && this.parent) {
                        patch(this.parent, this.id, void 0);
                    }
                }
            },
            name: "notify"
        }
    };
    Component.test = {
        lifecycle: function() {
            var child, parent;
            parent = new Component;
            assert(!(parent.id != null));
            assert(!(parent.parent != null));
            child = new Component({
                parent: parent
            });
            assert(isString(child.id));
            assert(parent === child.parent);
            assert(parent[child.id] === child);
            assert(parent.hasOwnProperty(child.id));
            parent.dispose();
            assert(child.disposed === true);
            return assert(!parent.hasOwnProperty(child.id));
        },
        nonEnumerability: function() {
            var key, visibleKeys;
            visibleKeys = (function() {
                var _results;
                _results = [];
                for (key in new Component) {
                    _results.push(key);
                }
                return _results;
            })();
            return assertEquals(visibleKeys, []);
        }
    };
    Component.path = "glass.Component";
    Component.implements = {
        "glass.Component": true,
        "glass.Observable": true
    };
    Component.uri = "global:/glass/Component";
    (function() {
        var baseTypes = [Observable];
        var i, j, baseType, a, b;
        for (i = 0; i < baseTypes.length; i++) {
            baseType = baseTypes[i];
            for (key in baseType.properties) {
                a = Component.properties[key];
                b = baseType.properties[key];
                if (a != null && b != null && a.constructor === Object && b.constructor === Object) {
                    for (j in b) {
                        if (!a.hasOwnProperty(j)) a[j] = b[j];
                    }
                } else if (!Component.properties.hasOwnProperty(key)) {
                    Component.properties[key] = b;
                }
            }
        }
    })();
    Object.defineProperties(Component.prototype, Component.properties);
    Component._init_ = function() {
        Observable = global.glass.Observable;
        isString = global.glass.isString;
        patch = global.glass.patch;
        assert = global.glass.assert;
        assertEquals = global.glass.assertEquals;
        getId = global.glass.getId;
        delete Component._init_;
    }
}).call(glass)