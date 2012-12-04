constructor: (op, args) ->
    @op = op
    @args = args if args?
    @
properties:
    op:
        type: 'string'
    args:
        type: 'array'
parse: (text) -> Expression._parser.parse text
test: ->
    tests =
        "a.b.c": {op:"get",args:[{op:"get",args:[{op:"ref",args:["a"]},"b"]},"c"]}
        "a.1": {op:"get",args:[{op:"ref",args:["a"]},1]}
        "true": true
        "false": false
        "45.8": 45.8
        "(45.8)": 45.8
        "((45.8))": 45.8
        "alpha": {op:"ref",args:["alpha"]}
        "35 + true * 2": {op:"+", args:[35, {op:"*", args:[true,2]}]}
        " 5 * ( 2 + 2 ) ": {op:"*", args:[5, {op:"+", args:[2,2]}]}
        " ! ! true": {op:"!",args:[{op:"!",args:[true]}]}
        "5 + -x": {op:"+",args:[5,{op:"-",args:[{op:"ref",args:["x"]}]}]}
        "true == 5 >= 2": {op:"==",args:[true,{op:">=",args:[5,2]}]}
        "1 or 2 and 3": {op:"or",args:[1,{op:"and",args:[2,3]}]}
        "1 ? 2 : 3": {op:"?:",args:[1,2,3]}
        "1 ? 2 : 3 ? 4 : 5" : {op:"?:",args:[1,2,{op:"?:",args:[3,4,5]}]}
        "a()(1,2)" : {op:"call",args:[{op:"call",args:[{op:"ref",args:["a"]},[]]},[1,2]]}
        "@" : {op:"this"}
        "@foo" : {op:"get",args:[{op:"this"},"foo"]}
        '"hello"': "hello"
        '"\\t\\r\\n\\b\\\\foo\\\/"' : "\t\r\n\b\\foo\/"
        "[]": {op:"array",args:[]}
        "[1,2]": {op:"array",args:[1,2]}
        "[1+2]": {op:"array",args:[{op:"+",args:[1,2]}]}
        "{}": {op:"object",args:[]}
        '{"a":2}': {op:"object",args:[["a",2]]}
        '{"a":2,"b":1+2}': {op:"object",args:[["a",2],["b",{op:"+",args:[1,2]}]]}
        '@"alpha"': {op:"get",args:[{op:"this"},"alpha"]}
        '*': {op:"values",args:[]}
        '*.*': {op:"values",args:[{op:"values",args:[]}]}
        "foo.*": {op:"values",args:[{op:"ref",args:["foo"]}]}
        "..":  {op:"ancestor",args:[1]}
        "...": {op:"ancestor",args:[2]}
        "@*{1+2}": {op:"eval",args:[{op:"values",args:[{op:"this"}]},{op:"+",args:[1,2]}]}
        "/": {op:"root"}
        "/foo": {op:"get",args:[{op:"root"},"foo"]}
        "/*": {op:"values",args:[{op:"root"}]}

    for text, expected of tests
        result = parse text
        if JSON.stringify(result) isnt JSON.stringify(expected)
            console.log text, JSON.stringify result

    return
