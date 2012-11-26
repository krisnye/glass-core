extends: 'Component'
properties:
    resolve: (baseUri, relativeUri) ->
    watch: (uri, handler, connect=true) ->
    patch: (uri, patch) ->
create: ->
    new reactive.DelegatingManager
        managers: [
            new GlobalManager()
        ]

test: ->
    manager = create()
    assert manager?
    # assert context.handles "a.b.c"
    # assert not context.handles "http://a.b.c"
