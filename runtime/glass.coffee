require:
	String: true

# runtime type tests
isFunction: (object) -> object? and typeof object is 'function'
isString: (object) -> object?.constructor is String
isArray: (object) -> Array.isArray object
isBoolean: (object) -> object? and typeof object is 'boolean'
isNumber: (object) -> object? and typeof object is 'number'
isObject: (object) -> typeof object is 'object'
isPlainObject: (object) -> object?.constructor is Object
isPrototype: (object) -> object? and object is object.constructor.prototype
isDate: (object) -> object?.constructor is Date
isPrimitive: (object) -> isString(object) or isBoolean(object) or isNumber(object) or isDate(object)
isPrivate: (property) -> property?[0] is '_'

# generic utility functions
values: (object) -> (value for key, value of object)
sum: () ->
    total = 0
    for a in arguments when a?
        if Array.isArray a
            for item in a
                total += sum item
        else
            number = Number a
            if not isNaN number
                total += number
    total

# should be a method built into Array
contains: (array, item) -> array?.lastIndexOf?(item) >= 0

# generic patch method, uses patch method built into object if present
patch: (target, pathAndPatch...) ->
    patch = JSONMergePatch.create.apply null, pathAndPatch
    if isFunction target?.patch
        target.patch patch
    else
        glass.JSONMergePatch.apply target, patch

# testing assertions
_getStackLocationInfo: (e, depth) ->
    line = e.stack?.split('\n')[depth]
    return null unless line?
    match = /\(([\w\W]*?):(\d+):(\d+)\)/.exec line
    return {
        file: match[1]
        line: parseInt match[2]
        column: parseInt match[3]
    }
_throwAssertionFailure: (message) ->
    try
        throw new Error "Assertion failed: " + message
    catch e
        info = _getStackLocationInfo e, 3
        if info?
            _dumpFile info.file, info.line - 2, info.line + 2, info.line
        throw e
_dumpFile: (file, from=1, to, highlight) ->
    fs = require 'fs'
    return unless fs?
    try
        content = fs.readFileSync(file).toString()
    catch e
        content = "Source not found: #{e}"

    console.log '------------------------------------------------'
    console.log file
    console.log '------------------------------------------------'
    number = 1
    if content?
        lines = content.split /\r|\n/
        to ?= lines.length
        for line in lines
            lineNumber = number++
            if lineNumber >= from and lineNumber <= to
                num = String lineNumber
                while num.length < 3
                    num += ' '
                if lineNumber is highlight
                    `console.log("\033[91m" + num + ": " + line + "\033[0m");`
                else
                    `console.log(num + ": " + line);`
    console.log '------------------------------------------------'
assert: (a) ->
    _throwAssertionFailure JSON.stringify(a) unless a
assertTrue: (a) ->
    _throwAssertionFailure JSON.stringify(a) + " != true" unless a is true
assertEquals: (a, b) ->
    if JSON.stringify(a) isnt JSON.stringify(b)
        _throwAssertionFailure JSON.stringify(a) + ' != ' + JSON.stringify(b)
# gets a unique string identifier for any object
getId:
    do: ->
        counter = 0
        (a) ->
            if a is null
                return '__null__'
            if a is undefined
                return '__undefined__'
            if typeof a is 'object' or typeof a is 'function'
                return a.id ?= '__' + (counter++) + '__'
            # 12 == "12" under this technique
            return a.toString()
getType: (path) ->
    array = if isArray path then path else path.split '.'
    value = global
    for step in path when value?
        value = value[step]
    throw new Error "Type not found: #{path}" unless isFunction value
    value

test:
    values: ->
        assertEquals values({a:1,b:3,c:2}), [1,3,2]
    patch: ->
        x = {a:{foo:1,bar:3},b:2}
        patch x, 'a', 'foo', 5
        assertEquals x.a.foo, 5
