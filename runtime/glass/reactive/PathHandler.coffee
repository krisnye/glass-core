extends: 'UriHandler'
evaluate: (uri) ->
    value = global
    for name in uri.split '.' when value?
        value = value?[name]
    value
properties:
    pattern: /^[$A-Z_][$A-Z_0-9]*(\.[$A-Z_][$A-Z_0-9]*)*$/i
    observe: (uri, observer) -> observer evaluate uri
    unobserve: (uri, observer) -> observer undefined
test: ->
    observed = null
    observer = (value) -> observed = value
    handler = new PathHandler
    assert handler.handles "a.b.c"
    uri = 'glass.reactive.PathHandler'
    handler.observe uri, observer
    assert observed?
    assert PathHandler is observed
    handler.unobserve uri, observer
    assert not observed?
    
