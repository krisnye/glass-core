(function() {
    var global = (function() {
        return this;
    })();
    var glass; //  assigned during _init_
    var glass_Expression; //  assigned during _init_
    var glass_JSONMergePatch; //  assigned during _init_
    var glass_JSONPointer; //  assigned during _init_
    var glass_Observable; //  assigned during _init_
    var glass_Component; //  assigned during _init_
    var allTests = this.allTests = function anonymous(callback) {
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
        singleTest("glass", glass.test);
        singleTest("glass.Expression", glass_Expression.test);
        singleTest("glass.JSONMergePatch", glass_JSONMergePatch.test);
        singleTest("glass.JSONPointer", glass_JSONPointer.test);
        singleTest("glass.Observable", glass_Observable.test);
        singleTest("glass.Component", glass_Component.test);
    };
    allTests._init_ = function() {
        glass = global.glass;
        glass_Expression = global.glass.Expression;
        glass_JSONMergePatch = global.glass.JSONMergePatch;
        glass_JSONPointer = global.glass.JSONPointer;
        glass_Observable = global.glass.Observable;
        glass_Component = global.glass.Component;
        delete allTests._init_;
    }
    allTests._init_();
    glass._init_();
    glass.Expression._init_();
    glass.JSONMergePatch._init_();
    glass.JSONPointer._init_();
    glass.Observable._init_();
    glass.Component._init_();
    glass.Expression._parser._init_();
}).call(glass)