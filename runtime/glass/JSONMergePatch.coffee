
# applies a patch to the target object and returns the resulting target
apply: (target, patch) ->
    if target? and target isnt patch and isPlainObject(patch) and not isPrimitive(target)
        for key, value of patch
            if value is undefined
                delete target[key]
            else
                target[key] = apply target[key], patch[key]
        return target
    else
        return patch

# (path1, path2, path3.., patch) ->
create: ->
    if arguments.length is 1
        return arguments[0]
    result = {}
    current = result
    for arg, i in arguments when i + 1 < arguments.length
        last = i + 2 is arguments.length
        current = current[arg] = if last then arguments[arguments.length-1] else {}
    result

test: ->
    assertEquals {a:{b:12}}, create 'a', 'b', 12
    assertEquals {a:3}, apply({a:1,b:2}, {a:3,b:undefined})
