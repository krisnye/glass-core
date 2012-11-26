(function() {
    var global = (function() {
        return this;
    })();
    var glass = this;
    var JSONPatch; //  assigned during _init_
    var watch; //  assigned during _init_
    var patch; //  assigned during _init_
    var getId; //  assigned during _init_
    var Container = this.Container = function Container() {
        this._metaWatchers = {};
        this._components = {};
        return this;
    };
    Container.properties = {
        watch: {
            value: function(uri, watcher) {
                var id, info;
                info = this._getInfo(uri, true);
                id = getId(watcher);
                if (info.watchers.hasOwnProperty(id)) {
                    throw "" + uri + " is already watched by " + (watcher.toString());
                }
                watchers[id] = watcher;
                info.count++;
                if (info.value !== void 0) {
                    watcher(info.value, info.value);
                }
                if (info.count === 1) {
                    this._notifyMetaWatchers(uri, true);
                }
            },
            name: "watch"
        },
        unwatch: {
            value: function(uri, watcher) {
                var id, info;
                info = this._getInfo(uri, false);
                id = getId(watcher);
                if (! (info != null ? info.watchers.hasOwnProperty(id) : void 0)) {
                    throw "" + uri + " is not watched by " + (watcher.toString());
                }
                delete watchers[id];
                info.count--;
                if (info.value !== void 0) {
                    watcher(void 0, void 0);
                }
                if (info.count === 0) {
                    delete this._components[uri];
                    this._notifyMetaWatchers(uri, true);
                }
            },
            name: "unwatch"
        },
        patch: {
            value: function(uri, patch) {
                var id, info, newValue, watcher, _ref;
                info = this._getInfo(uri);
                newValue = info.value = JSONPatch.apply(info.value, patch);
                _ref = info.watchers;
                for (id in _ref) {
                    watcher = _ref[id];
                    watcher(newValue, patch);
                }
            },
            name: "patch"
        },
        _getInfo: {
            value: function(uri, create) {
                var info;
                info = this._components[uri];
                if (! (info != null) && create) {
                    info = this._components[uri] = {
                        watchers: {},
                        count: 0,
                        value: void 0
                    };
                }
                return info;
            },
            name: "_getInfo"
        },
        metaWatch: {
            value: function(watcher) {
                var id, info, uri, _ref;
                id = getId(watcher);
                this._metaWatchers[id] = watcher;
                _ref = this._components;
                for (uri in _ref) {
                    info = _ref[uri];
                    if (info.count > 0) {
                        watcher(uri, true);
                    }
                }
            },
            name: "metaWatch"
        },
        metaUnwatch: {
            value: function(watcher) {
                var id;
                id = getId(watcher);
                delete this._metaWatchers[id];
            },
            name: "metaUnwatch"
        },
        _notifyMetaWatchers: {
            value: function(uri, watched) {
                var id, watcher, _ref, _results;
                _ref = this._metaWatchers;
                _results = [];
                for (id in _ref) {
                    watcher = _ref[id];
                    _results.push(watcher(uri, watched));
                }
                return _results;
            },
            name: "_notifyMetaWatchers"
        }
    };
    Container.test = function() {
        return console.log("TODO: Test Container watch/patch/metaWatch");
    };
    Container.path = "glass.Container";
    Container.implements = {
        "glass.Container": true
    };
    Container.uri = "global:/glass/Container";
    Object.defineProperties(Container.prototype, Container.properties);
    Container._init_ = function() {
        JSONPatch = global.glass.JSONPatch;
        watch = global.glass.watch;
        patch = global.glass.patch;
        getId = global.glass.getId;
        delete Container._init_;
    }
}).call(glass)