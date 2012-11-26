extends: 'PartialManager'
evaluate: (uri) ->
    value = global
    for name in uri.split '.' when value?
        value = value?[name]
    value
properties:
    pattern: /^global:((\/[^\/]*)*)$/i
    _getPointer: (uri) -> @pattern.exec(uri)[1]
    _get: (uri) ->
        pointer = @_getPointer uri
        JSONPointer.get global, pointer
    _set: (uri, value) ->
        pointer = @_getPointer uri
        JSONPointer.set global, pointer, value
    watch: (uri, handler, connect=true) ->
        PartialManager.prototype.watch.apply this, arguments
        if connect
            handler @_get uri
        return
    patch: (uri, patch) ->
        value = JSONPatch.apply @_get(uri), patch
        @_set(uri, value)
        @notify uri, value
        return
test: ->
    observed = null
    observer = (value) -> observed = value
    manager = new GlobalManager
    assert manager.handles "global:/a/b/c"
    uri = GlobalManager.uri
    manager.watch uri, observer
    assert observed?
    assert GlobalManager is observed
    # there should be no call to handler on unwatch
    assert observed?
    # now make sure that patches to that uri work.
    observed = null
    manager.patch uri,
        foo: 2
        bar: 3
    # make sure we were called on patch
    assert observed?
    # make sure the foo and bar properties were applied
    assertEquals GlobalManager.foo, 2
    assertEquals GlobalManager.bar, 3
    delete GlobalManager.foo
    delete GlobalManager.bar
    # now unwatch
    manager.watch uri, observer, false
