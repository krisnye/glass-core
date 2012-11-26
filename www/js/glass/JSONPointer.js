(function() {
    var global = (function() {
        return this;
    })();
    var glass = this;
    var _decodeStep; //  assigned during _init_
    var _getLastStep; //  assigned during _init_
    var _getParent; //  assigned during _init_
    var get; //  assigned during _init_
    var set; //  assigned during _init_
    var assertEquals; //  assigned during _init_
    var JSONPointer = this.JSONPointer = {
        _decodeStep: function(step) {
            return step.replace(/~1/g, '/').replace(/~0/g, '~');
        },
        _getLastStep: function(pointer) {
            return _decodeStep(pointer.substring(pointer.lastIndexOf('/') + 1));
        },
        _getParent: function(pointer) {
            if (! (pointer != null ? pointer.length: void 0)) {
                return null;
            } else {
                return pointer.substring(0, pointer.lastIndexOf('/'));
            }
        },
        get: function(doc, pointer) {
            var path, step, value, _i, _len;
            value = doc;
            if (pointer.length) {
                path = pointer.substring(1).split('/');
                for (_i = 0, _len = path.length; _i < _len; _i++) {
                    step = path[_i];
                    if (! (value != null)) {
                        continue;
                    }
                    step = _decodeStep(step);
                    value = value[step];
                }
            }
            return value;
        },
        set: function(doc, pointer, value) {
            var lastStep, parent, parentPointer;
            parentPointer = _getParent(pointer);
            if (parentPointer != null) {
                parent = get(doc, parentPointer);
                lastStep = _getLastStep(pointer);
                parent[lastStep] = value;
            }
            return value;
        },
        test: function() {
            var doc;
            assertEquals(_getParent("/a/b/c"), "/a/b");
            assertEquals(_getParent("/a"), "");
            assertEquals(_getParent(""), null);
            assertEquals(_getLastStep("/a/b/c"), "c");
            assertEquals(_getLastStep("/a~0~1"), "a~/");
            assertEquals(_getLastStep(""), "");
            doc = {
                "foo": ["bar", "baz"],
                "": 0,
                "a/b": 1,
                "c%d": 2,
                "e^f": 3,
                "g|h": 4,
                "i\\j": 5,
                "k\"l": 6,
                " ": 7,
                "m~n": 8
            };
            assertEquals(get(doc, ""), doc);
            assertEquals(get(doc, "/foo"), ["bar", "baz"]);
            assertEquals(get(doc, "/foo/0"), "bar");
            assertEquals(get(doc, "/"), 0);
            assertEquals(get(doc, "/a~1b"), 1);
            assertEquals(get(doc, "/c%d"), 2);
            assertEquals(get(doc, "/e^f"), 3);
            assertEquals(get(doc, "/g|h"), 4);
            assertEquals(get(doc, "/i\\j"), 5);
            assertEquals(get(doc, "/k\"l"), 6);
            assertEquals(get(doc, "/ "), 7);
            assertEquals(get(doc, "/m~0n"), 8);
            assertEquals(set(doc, "/", 10), 10);
            assertEquals(doc[""], 10);
            assertEquals(set(doc, "/foo/0", 10), 10);
            return assertEquals(doc.foo[0], 10);
        },
        path: "glass.JSONPointer",
        uri: "global:/glass/JSONPointer"
    };
    JSONPointer._init_ = function() {
        _decodeStep = global.glass.JSONPointer._decodeStep;
        _getLastStep = global.glass.JSONPointer._getLastStep;
        _getParent = global.glass.JSONPointer._getParent;
        get = global.glass.JSONPointer.get;
        set = global.glass.JSONPointer.set;
        assertEquals = global.glass.assertEquals;
        delete JSONPointer._init_;
    }
}).call(glass)