# we don't yet implement standard JSON Patch
# we implement a simplified object based alternative

_applyObjectPatch: (target, patch) ->
    if target isnt patch and isPlainObject(patch) and not isPrimitive(target)
        for key, value of patch
            target[key] = _applyObjectPatch target[key], patch[key]
        return target
    else
        return patch

_applyArrayPatch: (target, patch) ->
    throw new Error "Not implemented"

    # applies a patch to the target object and returns the resulting target
apply: (target, patch) ->
    if isArray patch
        _applyArrayPatch target, patch
    else
        _applyObjectPatch target, patch

create: (path, patch) ->
    result = {}
    current = result
    for arg, i in path
        last = i + 1 is path.length
        current = current[arg] = if last then patch else {}
    result

test: ->
    assertEquals {a:{b:12}}, create ['a', 'b'], 12
