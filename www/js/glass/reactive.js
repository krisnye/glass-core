(function() {
    var global = (function() {
        return this;
    })();
    var glass = this;
    var reactive = this.reactive = {
        path: "glass.reactive"
    };
    reactive._init_ = function() {
        delete reactive._init_;
    }
}).call(glass)