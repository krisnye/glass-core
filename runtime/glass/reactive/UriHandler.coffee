extends: 'Observable'
properties:
    pattern: null
    handles: (uri) -> @pattern?.test(uri) is true
    normalize: (uri) -> uri
    observe: (uri, observer) ->
    unobserve: (uri, observer) ->
test: ->
    handler = new UriHandler {pattern:/^ab*$/}
    assert handler.handles "a"
    assert handler.handles "abbbbb"
    assert not handler.handles "abc"
