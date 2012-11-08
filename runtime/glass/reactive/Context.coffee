extends: 'UriHandler'
properties:
    handlers:
        type: 'array'
        required: true
    handles: (uri) -> @_getHandler(uri, false)?
    observe: (uri, observer) -> @_getHandler(uri).observe(uri, observer)
    unobserve: (uri, observer) -> @_getHandler(uri).unobserve(uri, observer)
    _getHandler: (uri, throwError) ->
        for handler in @handlers
            if handler.handles uri
                return handler
        if throwError isnt false
            throw new Error "No handler found for #{uri}"
createDefault: ->
    return new Context
        handlers: [
            new PathHandler()
        ]
test: ->
    context = createDefault()
    assert context.handles "a.b.c"
    assert not context.handles "http://a.b.c"
