{
    //  shorthand to create a new expression
    function expr(op, args) {
        return new glass.Expression(op, args);
    }
    //  left associates operations
    function joinLeft(e, arrayOfOps) {
        while (arrayOfOps.length > 0) {
            array = arrayOfOps.shift();
            e = expr(array[0], [e,array[1]]);
        }
        return e;
    }
    function unaryRight(ops, e) {
        while (ops.length > 0) {
            e = expr(ops.pop(), [e]);
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
}

start = expression
expression = conditional
conditional = e:or args:("?" b:expression ":" c:expression {return [b,c];})* {
        while (args.length > 0) {
            e = expr("?:", [e].concat(args.pop()));
        }
        return e;
    }
or = a:and b:(("or") and)* { return joinLeft(a,b); }
and = a:equality b:(("and") equality)* { return joinLeft(a,b); }
equality = a:rel b:(("==" / "!=") rel)* { return joinLeft(a,b); }
rel = a:sum b:(("<=" / ">=" / "<" / ">") sum)* { return joinLeft(a,b); }
sum = a:product b:(("+" / "-") product)* { return joinLeft(a,b); }
product = a:not b:(("*" / "div" / "mod") not)* { return joinLeft(a,b); }
not = ops:(s op:("!" / "~" / "+" / "-") { return op; })* b:primary { return unaryRight(ops,b); }
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
keyvalue = s a:string s ":" b:expression { return [a,b]; }
keyvalues = first:keyvalue? rest:("," b:keyvalue {return b;})* {
    if (first) { rest.unshift(first); } return rest;
}
ref = a:("//" / "/" / "$" / "**" / "*" / ".." / ".") b:slashProperty? {
        e = expr(a); if (b) { b.args.unshift(e); e = b; } return e;
    }
    / a:id { return expr("ref", [a]); }
id = a:[a-z_]+ b:[a-z_0-9]* { return a.join('') + b.join(''); }
property = "/" a:slashProperty { return a; }
         / "{" a:expression "}" { return expr("{}", [a]); }     //  locally scoped expression
         / "[" a:expression "]" { return expr("[]", [a]); }     //  predicate
slashProperty = a:(id/number/string) { return expr("/", [a]); }
            / a:(".." / "*") { return expr(a, []); }
s "space" = [ ]* { return ''; }

path = a:root b:step* {
        while (b.length) {
            a = joinPath(a, b.shift());
        }
        return a;
    }
root = a:implicitDotRoot b:dotStep? { return joinPath(a,b); }
     / explicitDotRoot
step = "." a:dotStep { return a; }
     / noDotStep
implicitDotRoot = "/"  { return expr("root"); }
                / "@" { return expr("this"); }
                / "." a:"."+ { return expr("ancestor", [a.length]); }
explicitDotRoot = a:id { return expr("ref", [a]); }
                / "*" { return expr("values", []); }
dotStep = a:(id / string / number) { return expr("get", [a]); }
        / "*" { return expr("values", []); }
noDotStep = "{" a:expression "}" { return expr("eval", [a]); }
          / "[" a:expression "]" { return expr("pred", [a]); }
          / "(" a:values ")" { return expr("call", [a]); }
