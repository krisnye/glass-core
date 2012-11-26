extends: 'Manager'
properties:
    managers:
        type: 'array'
    resolve: (baseUri, relativeUri) -> @_getManager(baseUri).resolve(baseUri, relativeUri)
    watch: (uri, handler, connect=true) -> @_getManager(uri).watch(uri, handler, connect)
    patch: (uri, patch) -> @_getManager(uri).patch(uri, patch)
    _getManager: (uri) ->
        for manager in @managers
            if manager.handles uri
                return manager
        throw new Error "No manager found for #{uri}"
test: ->
    context = new DelegatingManager
        managers: [
            new GlobalManager()
        ]
    assert context._getManager("global:/a/b/c")?
    return
