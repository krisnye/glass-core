(function() {
    var global = (function() {
        return this;
    })();
    if (String.prototype.startsWith == null) {
        Object.defineProperty(String.prototype, "startsWith", {
            value: function(s) {
                return this.slice(0, s.length) === s;
            },
            name: "startsWith"
        });
    }
    if (String.prototype.endsWith == null) {
        Object.defineProperty(String.prototype, "endsWith", {
            value: function(s) {
                return this.slice( - s.length) === s;
            },
            name: "endsWith"
        });
    }
    if (String.prototype.contains == null) {
        Object.defineProperty(String.prototype, "contains", {
            value: function(s) {
                return this.indexOf(s) >= 0;
            },
            name: "contains"
        });
    }
    if (String.prototype.toArray == null) {
        Object.defineProperty(String.prototype, "toArray", {
            value: function() {
                return this.split('');
            },
            name: "toArray"
        });
    }
    String._init_ = function() {
        delete String._init_;
    }
}).call()