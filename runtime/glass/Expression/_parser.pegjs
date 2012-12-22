{
    //  this fixes a bug where the generated parser is missing a quote function
    global.quote = function(value) {
        return value;
    }
    //  shorthand to create a new expression
    function expr(op, args) {
        if (args == null)
            args = []
        return new glass.Expression(op, args);
    }
    //  left associates operations
    function joinLeft(e, arrayOfOps, op) {
        while (arrayOfOps.length > 0) {
            array = arrayOfOps.shift();
            e = expr(op || array[0], [e,array[1]]);
        }
        return e;
    }
    function unaryRight(ops, e, map) {
        while (ops.length > 0) {
            op = ops.pop();
            if (map.hasOwnProperty(op))
                op = map[op];
            if (op != null)
                e = expr(op, [e]);
        }
        return e;
    }
    function toString(array) {
        if (Array.isArray(array)) {
            for (var i = 0; i < array.length; i++)
                array[i] = toString(array[i]);
            return array.join('');
        }
        return array;
    }
    function joinPath(left, right) {
        if (right) {
            right.args.unshift(left);
            left = right;
        }
        return left;
    }
    function flatten(array) {
        var flat = []
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            if (Array.isArray(item)) {
                for (var k = 0; k < item.length; k++) {
                    flat.push(item[k]);
                }
            }
            else {
                flat.push(item);
            }
        }
        return flat;
    }
}

start = expression
expression = conditional
conditional = e:or args:("?" b:expression ":" c:expression {return [b,c];})* {
        while (args.length > 0) {
            e = expr("?:", [e].concat(args.pop()));
        }
        return e;
    }
or = a:and b:(("||" / "or") and)* { return joinLeft(a,b, "||"); }
and = a:equality b:(("&&" / "and") equality)* { return joinLeft(a,b, "&&"); }
equality = a:rel b:(("==" / "!=") rel)* { return joinLeft(a,b); }
rel = a:sum b:(("<=" / ">=" / "<" / ">") sum)* { return joinLeft(a,b); }
sum = a:product b:(("+" / "-") product)* { return joinLeft(a,b); }
product = a:not b:(("*" / "/" / "%") not)* { return joinLeft(a,b); }
not = ops:(s op:("!" / "+" / "-") { return op; })* b:primary
    { return unaryRight(ops,b,{"+":null,"-":"neg"}); }
primary = s a:(group / literal / path) s { return a; }
group = "(" a:expression ")" { return a; }
literal = s a:(boolean / number / string / array / object) s { return a; }
boolean = a:("true" / "false") { return a == "true"; }
number = a:([0-9]+ ("." [0-9]+)?) { return parseFloat(toString(a)); }
hex = [a-fA-F0-9]
//  as per JSON http://www.json.org
string = a:( '"' (
    [\u0000-\u0021\u0023-\u005c\u005e-\uffff] // all unicode chars except \ and "
    / ("\\" ("\"" / "\\" / "\/" / "b" / "f" / "n" / "r" / "t" / ("u" hex hex hex hex)))
    )* '"' )
    { return JSON.parse(toString(a)); }
array = "[" a:values "]" { return expr("array", a); }
values = first:expression? args:("," b:expression {return b;})* {
    if (first != "") { args.unshift(first); } return args;
}
object = "{" a:keyvalues "}" { return expr("object", a); }
keyvalue = s a:(string/id) s ":" b:expression { return [a,b]; }
keyvalues = first:keyvalue? rest:("," b:keyvalue {return b;})* {
    if (first) { rest.unshift(first); } return flatten(rest);
}
id = a:[a-zA-Z_]+ b:[a-zA-Z_0-9]* { return a.join('') + b.join(''); }
s "space" = [ ]* { return ''; }

root = "$" { return [expr("global")]; }
     / "@" { return [expr("root")]; }
     / a:"."+ { return [expr("ancestor", [Math.max(0, a.length-1)])]; }
     / a:rootOrStep { return [expr("ancestor", [0]), a]; }

rootOrStep = "."? a:id { return expr("property", [a]); }
           / "."? "*" { return expr("values"); }
           / "?(" a:expression ")" { return expr("filter", [a]); }

step = rootOrStep
     / "(" a:values ")" { return expr("call", a); }
     / "[" a:expression "]" { return expr("property", [a]); }
     / "{" a:expression "}" { return expr("eval", [a]); }

path = a:root b:step* {
    path = a.concat(b);
    result = current = path.shift();
    while (path.length) {
        current = current.next = path.shift();
    }
    return result;
}