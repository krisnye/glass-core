constructor: (op, args) ->
    @op = op
    @args = args if args?
    @operation = operations[op]
    throw new Error "Operation not found: #{op}" unless @operation
    @operation.initialize?.call @
    @
properties:
    op:
        type: 'string'
    args:
        type: 'array'
    next:
        type: 'object'
    operation:
        serializable: false
    toJSON: ->
        json = { op: @op, args: @args }
        if @next
            json.next = @next
        json
    toString: ->
        # returns the normalized string for this expression
        format = @operation.format
        # toString the args.
        args = if @args then Expression.toString arg for arg in @args else null
        value =
            if format?
                format.apply this, args
            else if args?
                "(#{args[0]} #{@op} #{args[1]})"
            else
                "Need format for op: #{@op}"
        if @next?
            value += Expression.toString @next
        value
operations:
    '+': evaluate: (a,b) -> a + b
    '-': evaluate: (a,b) -> a - b
    '*': evaluate: (a,b) -> a * b
    '/': evaluate: (a,b) -> a / b
    '%': evaluate: (a,b) -> a % b
    '!':
        format: (a) -> "!#{a}"
        evaluate: (a) -> !a
    'neg':
        format: (a) -> "-#{a}"
        evaluate: (a) -> -a
    '&&':
        evaluateArgs: false
        evaluate: (a,b) ->
            a = Expression.evaluate this, a
            # TODO: toBoolean on a?
            if not a
                return a
            b = Expression.evaluate this, b
            return b
    '||':
        evaluateArgs: false
        evaluate: (a,b) ->
            a = Expression.evaluate this, a
            # TODO: toBoolean on a?
            if a
                return a
            b = Expression.evaluate this, b
            return b
    '<':
        vector: false
        evaluate: (a,b) -> a < b
    '>':
        vector: false
        evaluate: (a,b) -> a > b
    '<=':
        vector: false
        evaluate: (a,b) -> a <= b
    '>=':
        vector: false
        evaluate: (a,b) -> a >= b
    '==':
        vector: false
        expandArgs: false
        evaluate: (a,b) ->
            return contains a, b if Array.isArray a
            return contains b, a if Array.isArray b
            return a == b
    '!=':
        vector: false
        expandArgs: false
        evaluate: (a,b) ->
            return not contains a, b if Array.isArray a
            return not contains b, a if Array.isArray b
            return a != b
    '?:':
        format: (a, b, c) -> "(#{a} ? #{b} : #{c})"
        evaluate: (a) ->
    values:
        format: () -> "*"
        evaluate: () ->
            value = getContext()
            if value? and typeof value is 'object' and not Array.isArray value
                glass.values value
            else
                value
        evaluateNext: (value) ->
            results = []
            # evaluate the next expression on every item
            for item in value
                result = e @next, item
                if result isnt undefined
                    results.push result
            results
    array:
        format: (args...) -> "[#{args.join ','}]"
        evaluate: (args...) -> args
    object:
        format: (args...) ->
            buffer = []
            buffer.push "{"
            for i in [0..args.length-1] by 2
                key = args[i]
                value = args[i+1]
                buffer.push "," if i > 0
                buffer.push key, ":", value
            buffer.push "}"
            buffer.join ''
        evaluate: (args...) ->
            object = {}
            for i in [0..args.length-1] by 2
                key = args[i]
                value = args[i+1]
                object[key] = value
            object
    global:
        format: -> '$'
        evaluate: () -> global
    ancestor:
        format: (a) ->
            dots = []
            for i in [0..a]
                dots.push '.'
            dots.join ''
        evaluateArgs: false
        evaluate: (offset) ->
            stack[Math.max(0, stack.length - 1 - offset)]
        evaluateNext: (value) ->
            # we either backtrack the stack and must restore it, OR we do nothing
            offset = @args[0]
            if offset is 0
                e @next
            else
                hold = stack.slice -offset
                stack.length -= hold.length
                value = e @next
                stack.push item for item in hold
                value
    root:
        format: -> '@'
        evaluate: () -> stack[0]
    property:
        format: (a) -> "[#{a}]"
        evaluate: (a) ->
            context = getContext()
            # support negative indexers relative to the end
            if isNumber(a) and a < 0 && isNumber(context.length)
                a += context.length
            context[a]
    path:
        format: (args...) ->
            args.join ''
        evaluateArgs: false
        evaluate: (steps...) ->
    call:
        format: (args...) -> "(#{args.join ','})"
        evaluateNext: (value) ->
            # don't push to stack
            e @next
        evaluateArgs: false
        evaluate: (args...) ->
            if args.length > 0
                # everything within a function call is always scoped to the root.
                hold = stack.slice 1
                stack.length -= hold.length
                args = (e arg for arg in args)
                stack.push item for item in hold

            fn = stack[stack.length-1]
            if fn?.apply?
                scope = stack[stack.length-2]
                fn.apply scope, args
            else
                undefined
    filter:
        push: -> false
        format: (a) -> "?(#{a})"
        evaluate: (a) -> if toBoolean a then getContext() else undefined
        evaluateNext: (value) ->
            # don't push to stack
            e @next
    eval:
        format: (a) -> "{#{a}}"
        evaluate: (a) -> a
private:
    evalPath: (path, context=global) ->
        for step in path when context?
            context = context[step]
        context
    stack: []
    getContext: () -> stack[stack.length-1]
    e: (expr, push) ->
        if not isExpression expr
            return expr

        # if push, push it onto the stack
        stack.push push if push?

        op = expr.operation
        args = expr.args

        # maybe pre-evaluate the arguments
        if expr.args? and op.evaluateArgs isnt false
            args = (e arg for arg in args)
        # maybe expand the arguments
        # call the op with the stack and arguments
        value = op.evaluate.apply expr, args

        if value? and expr.next?
            if op.evaluateNext?
                value = op.evaluateNext.call expr, value
            else
                value = e expr.next, value

        # if push, pop it off the stack
        stack.pop() if push?

        return value
parse: (text) ->
    try
        Expression._parser.parse text
    catch e
        e.text = text
        throw e
evaluate: (expression, context=global) ->
    # there may have been something left on the stack if there was an exception
    stack.length = 0
    e expression, context
isIdentifier: (a) -> isString(a) and /^[a-zA-Z_][a-zA-Z_0-9]*$/.test a
isExpression: (expression) -> expression?.constructor is Expression
toBoolean: (value) ->
    if Array.isArray value
        for item in value
            if toBoolean item
                return true
        return false
    return Boolean value
toString: (expression) ->
    if isExpression expression
        expression.toString()
    else
        JSON.stringify expression
test:
    isIdentifier: ->
        assert isIdentifier "alpha95"
        assert isIdentifier "_alpha95"
        assert not isIdentifier "95alpha95"
        assert not isIdentifier "alpha 95"
    evaluation: ->
        data =
            clothes: [
                { name: 'Shirt', sizes: ['S','M','L'], price:14.50, quantity: 8 }
                { name: 'Pants', sizes: [29,30,31,32], price:20.19, quantity: 6  }
                { name: 'Shoes', sizes: [8,9,10], price:25.85, quantity: 15  }
                { name: 'Ties' , sizes: [2], price:3.99, quantity: 3  }
            ]
            codes:
                alpha:   { discount: 10, items:4 }
                beta:    { discount: 20, items:2 }
                charlie: { discount: 30, items:1 }
            favoriteChild: 'pat'
            children:
                pat:
                    name: 'pat'
                    age: 28
                    children:
                        jay: { name: 'jay', age: 4 }
                        bob: { name: 'bob', age:8 }
                skip:
                    name: 'skip'
                    age: 30
                    children:
                        joe: { name: 'joe', age: 7 }

        evaluate = (path) ->
            expression = Expression.parse path
            Expression.evaluate expression, data
        check = (path, expected) ->
            value = evaluate path
            if expected isnt value and JSON.stringify(expected) isnt JSON.stringify(value)
                console.error message = path + " did not result in expected value: " + JSON.stringify expected
                console.error "\nit resulted in: " + JSON.stringify value
                # throw new Error message
        check "@", data
        check "codes", data.codes
        check "codes.alpha", data.codes.alpha
        check "codes.alpha.discount", 10
        check "$Math.min", Math.min
        check "$Math.min(codes.alpha.discount,codes.beta.discount)", 10
        # test negative indexers
        check "clothes[-1]", data.clothes[data.clothes.length-1]
        # filters
        check "?(clothes != null)", data
        check "?(clothes == null)", undefined
        # object literal
        check "{a:1+1,\"b\":true}", {a:2,b:true}
        # array literal
        check "[10/2,8]", [5,8]

        check "clothes.length", 4
        check "$", global

        check "codes.*", [data.codes.alpha, data.codes.beta, data.codes.charlie]

        # step through array
        check "codes.*.discount", [10,20,30]

        # filters
        check "codes.*?(discount > 10)", [data.codes.beta, data.codes.charlie]

        check "$glass.sum(@clothes.*{price * quantity})", 636.86

        check '{alpha:codes.alpha.discount,"beta":2,charlie:[3,2,codes.beta.discount]}', {alpha:data.codes.alpha.discount, beta:2, charlie:[3,2,data.codes.beta.discount]}

        check 'children.*?(name == ...favoriteChild)', [data.children.pat]
        check 'children.*?(name == @favoriteChild)', [data.children.pat]
        check 'children[@favoriteChild]', data.children.pat
        check 'children[..favoriteChild]', data.children.pat

        # local evaluations etc
        return
    isExpression: ->
        assert not isExpression parse "45.8"
        assert isExpression parse "x"
    parser: ->
        # convert these to an expectation of the normalized resulting string.
        tests =
            "a.b.c": ".[\"a\"][\"b\"][\"c\"]"
            "..foo": "..[\"foo\"]"
            "+++++++12": "12"
            "a[1]": ".[\"a\"][1]"
            "true": "true"
            "false": "false"
            "45.8": "45.8"
            "(45.8)": "45.8"
            "((45.8))": "45.8"
            "alpha": ".[\"alpha\"]"
            "35 + true * 2": "(35 + (true * 2))"
            " 5 * ( 2 + 2 ) ": "(5 * (2 + 2))"
            " ! ! true": "!!true"
            "5 + -x": "(5 + -.[\"x\"])"
            "true == 5 >= 2": "(true == (5 >= 2))"
            "1 or 2 and 3": "(1 || (2 && 3))"
            "1 ? 2 : 3": "(1 ? 2 : 3)"
            "1 ? 2 : 3 ? 4 : 5": "(1 ? 2 : (3 ? 4 : 5))"
            "Math.max(1,2)": ".[\"Math\"][\"max\"](1,2)"
            "@": "@"
            "@foo": "@[\"foo\"]"
            "\"hello\"": "\"hello\""
            "\"\\t\\r\\n\\b\\\\foo/\"": "\"\\t\\r\\n\\b\\\\foo/\""
            "[]": "[]"
            ".[1][2]": ".[1][2]"
            "[1,2]": "[1,2]"
            "[1+2]": "[(1 + 2)]"
            "{}": "{}"
            "{\"a\":2}": "{\"a\":2}"
            "{\"a\":2,\"b\":1+2}": "{\"a\":2,\"b\":(1 + 2)}"
            "@[\"alpha\"]": "@[\"alpha\"]"
            "$": "$"
            "$glass": "$[\"glass\"]"
            "$.glass": "$[\"glass\"]"
            "*": ".*"
            "*.*": ".**"
            "foo.*": ".[\"foo\"]*"
            "*{1+2}": ".*{(1 + 2)}"
            "foo?(@x > 2)": ".[\"foo\"]?((@[\"x\"] > 2))"
        for text, expected of tests
            result = parse text
            stringResult = Expression.toString(result)
            # console.log JSON.stringify(text) + ": " + JSON.stringify(stringResult)
            if stringResult isnt expected
                console.log text, stringResult, JSON.stringify result

        return
