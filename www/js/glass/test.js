(function() {
    var global = (function() {
        return this;
    })();
    var glass_Observable; //  assigned during _init_
    var glass_List; //  assigned during _init_
    var glass_Map; //  assigned during _init_
    var glass_reactive_UriHandler; //  assigned during _init_
    var glass_Set; //  assigned during _init_
    var glass_reactive_Context; //  assigned during _init_
    var glass_reactive_PathHandler; //  assigned during _init_
    var glass_reactive_UrnHandler; //  assigned during _init_
    var test = this.test = function anonymous(callback) {
        if (callback == null) {
            callback = function(path, result) {
                if (result == null) {
                    console.log("\033[92mPass\033[0m: " + path + "");
                } else {
                    console.log("\033[91mFail\033[0m: " + path + "");
                    console.log(result.stack || result);
                }
            }
        }
        function singleTest(path, test) {
            if (test == null) {
                callback(path, "test not found");
                return;
            } else if (typeof test == 'object') {
                for (var key in test) singleTest(path + '.' + key, test[key]);
                return;
            }
            try {
                callback(path, test());
            } catch(e) {
                callback(path, e);
            }
        }
        singleTest("glass.Observable", glass_Observable.test);
        singleTest("glass.List", glass_List.test);
        singleTest("glass.Map", glass_Map.test);
        singleTest("glass.reactive.UriHandler", glass_reactive_UriHandler.test);
        singleTest("glass.Set", glass_Set.test);
        singleTest("glass.reactive.Context", glass_reactive_Context.test);
        singleTest("glass.reactive.PathHandler", glass_reactive_PathHandler.test);
        singleTest("glass.reactive.UrnHandler", glass_reactive_UrnHandler.test);
    };
    test._init_ = function() {
        glass_Observable = global.glass.Observable;
        glass_List = global.glass.List;
        glass_Map = global.glass.Map;
        glass_reactive_UriHandler = global.glass.reactive.UriHandler;
        glass_Set = global.glass.Set;
        glass_reactive_Context = global.glass.reactive.Context;
        glass_reactive_PathHandler = global.glass.reactive.PathHandler;
        glass_reactive_UrnHandler = global.glass.reactive.UrnHandler;
        delete test._init_;
    }
    test._init_();
    glass._init_();
    glass.Observable._init_();
    glass.reactive._init_();
    glass.List._init_();
    glass.Map._init_();
    glass.reactive.UriHandler._init_();
    glass.Set._init_();
    glass.reactive.Context._init_();
    glass.reactive.PathHandler._init_();
    glass.reactive.UrnHandler._init_();
}).call(glass)