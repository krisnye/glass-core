(function() {
    var global = (function() {
        return this;
    })();
    var glass_Component; //  assigned during _init_
    var glass_Container; //  assigned during _init_
    var glass_JSONPatch; //  assigned during _init_
    var glass_JSONPointer; //  assigned during _init_
    var glass_reactive_Manager; //  assigned during _init_
    var glass_reactive_PartialManager; //  assigned during _init_
    var glass_Set; //  assigned during _init_
    var glass_reactive_DelegatingManager; //  assigned during _init_
    var glass_reactive_GlobalManager; //  assigned during _init_
    var glass_reactive_LocalManager; //  assigned during _init_
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
        singleTest("glass.Component", glass_Component.test);
        singleTest("glass.Container", glass_Container.test);
        singleTest("glass.JSONPatch", glass_JSONPatch.test);
        singleTest("glass.JSONPointer", glass_JSONPointer.test);
        singleTest("glass.reactive.Manager", glass_reactive_Manager.test);
        singleTest("glass.reactive.PartialManager", glass_reactive_PartialManager.test);
        singleTest("glass.Set", glass_Set.test);
        singleTest("glass.reactive.DelegatingManager", glass_reactive_DelegatingManager.test);
        singleTest("glass.reactive.GlobalManager", glass_reactive_GlobalManager.test);
        singleTest("glass.reactive.LocalManager", glass_reactive_LocalManager.test);
    };
    test._init_ = function() {
        glass_Component = global.glass.Component;
        glass_Container = global.glass.Container;
        glass_JSONPatch = global.glass.JSONPatch;
        glass_JSONPointer = global.glass.JSONPointer;
        glass_reactive_Manager = global.glass.reactive.Manager;
        glass_reactive_PartialManager = global.glass.reactive.PartialManager;
        glass_Set = global.glass.Set;
        glass_reactive_DelegatingManager = global.glass.reactive.DelegatingManager;
        glass_reactive_GlobalManager = global.glass.reactive.GlobalManager;
        glass_reactive_LocalManager = global.glass.reactive.LocalManager;
        delete test._init_;
    }
    test._init_();
    glass._init_();
    glass.Component._init_();
    glass.Container._init_();
    glass.JSONPatch._init_();
    glass.JSONPointer._init_();
    glass.reactive._init_();
    glass.reactive.Manager._init_();
    glass.reactive.PartialManager._init_();
    glass.Set._init_();
    glass.reactive.DelegatingManager._init_();
    glass.reactive.GlobalManager._init_();
    glass.reactive.LocalManager._init_();
}).call(glass)