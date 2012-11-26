# json pointer implementation as per
# http://tools.ietf.org/html/draft-ietf-appsawg-json-pointer-05
_decodeStep: (step) -> step.replace(/~1/g, '/').replace(/~0/g, '~')
_getLastStep: (pointer) ->
    _decodeStep pointer.substring(pointer.lastIndexOf('/') + 1)
_getParent: (pointer) ->
    if not pointer?.length
        null
    else
        pointer.substring(0, pointer.lastIndexOf('/'))
get: (doc, pointer) ->
    value = doc
    if pointer.length
        path = pointer.substring(1).split('/')
        for step in path when value?
            step = _decodeStep step
            value = value[step]
    value
set: (doc, pointer, value) ->
    parentPointer = _getParent pointer
    if parentPointer?
        parent = get doc, parentPointer
        lastStep = _getLastStep pointer
        parent[lastStep] = value
    value
test: ->
    assertEquals _getParent("/a/b/c"), "/a/b"
    assertEquals _getParent("/a"), ""
    assertEquals _getParent(""), null
    assertEquals _getLastStep("/a/b/c"), "c"
    assertEquals _getLastStep("/a~0~1"), "a~/"
    assertEquals _getLastStep(""), ""
    # tests as per spec
    doc = {
        "foo": ["bar", "baz"],
        "": 0,
        "a/b": 1,
        "c%d": 2,
        "e^f": 3,
        "g|h": 4,
        "i\\j": 5,
        "k\"l": 6,
        " ": 7,
        "m~n": 8
    }
    assertEquals get(doc, ""), doc
    assertEquals get(doc, "/foo"), ["bar", "baz"]
    assertEquals get(doc, "/foo/0"), "bar"
    assertEquals get(doc, "/"), 0
    assertEquals get(doc, "/a~1b"), 1
    assertEquals get(doc, "/c%d"), 2
    assertEquals get(doc, "/e^f"), 3
    assertEquals get(doc, "/g|h"), 4
    assertEquals get(doc, "/i\\j"), 5
    assertEquals get(doc, "/k\"l"), 6
    assertEquals get(doc, "/ "), 7
    assertEquals get(doc, "/m~0n"), 8
    # now test set
    assertEquals set(doc, "/", 10), 10
    assertEquals doc[""], 10
    assertEquals set(doc, "/foo/0", 10), 10
    assertEquals doc.foo[0], 10