glass = require '../'

#             (parent                )     (type    )   (id      )       (query )
keyRegex = /^((([^\/\?]+\/[^\/\?]+\/?)+)\/)?(([^\/\?]+)(\/([^\/\?]+))?)?(\?(\{.*\}))?$/
keyMap =
    parent: 2
    type: 5
    id: 7
    query: 9
parse = (key) ->
    result = glass.match keyRegex, keyMap, key
    throw new Error "invalid key: #{key}" unless result?
    if result.query?
        try
            result.query = JSON.parse result.query
        catch e
            throw new Error "invalid key query: #{key}, #{e}"
    return result

stringify = (properties) ->
    buffer = []
    if properties.parent?
        buffer.push properties.parent, '/'
    if properties.type?
        buffer.push properties.type.name ? properties.type
        if properties.id
            buffer.push '/', properties.id
    if properties.query?
        buffer.push '?', JSON.stringify properties.query
    buffer.join ''

module.exports = exports = class Key
    constructor: (keystring, namespace) ->
        throw new Error "keystring is required" unless keystring?
        throw new Error "namespace is required" unless namespace?
        # parse values
        properties = if Object.isObject(keystring) then keystring else parse keystring
        # turn the parent into a key
        if properties.parent?
            properties.parent = new Key properties.parent, namespace
        # deep freeze the properties
        glass.freeze properties, true
        # set properties on this key
        Object.merge @, properties
        if namespace?
            @namespace = namespace
        # if a namespace is present then convert the type to an actual type
        if @namespace? and @type?
            try
                @type = require @namespace + @type
            catch e
                throw "#{JSON.stringify @type} not found in key: #{JSON.stringify keystring} (#{e})"
        # shallow freeze these properties (we don't want to freeze the type)
        glass.freeze @, false
        return @
    toString: -> @_toStringValue ?= stringify @
    valueOf: -> @toString()
    toJSON: -> @toString()

exports.test = do ->
    assert = require('chai').assert
    toString: ->
        key = new Key 'Project/2/Task/2?{"alpha":2}', "./sample/"
        assert key.parent instanceof Key
        assert.equal key.parent.toString(), 'Project/2'
        assert.equal key.query.alpha, '2'
    frozen: ->
        key = new Key 'Project/2/Task/2?{"alpha":2}', "./sample/"
        # try to set a value, should fail
        key.query.beta = 3
        assert.equal key.query.beta, undefined
    parse: ->
        tests =
            # parent, type, id, query
            'a/2/b/2?{"alpha":2}': {"parent":"a/2","type":"b","id":"2","query":{"alpha":2}}
            # parent, type, id
            'a/2/b/2': {"parent":"a/2","type":"b","id":"2"}
            # parent, type
            'a/2/b': {"parent":"a/2","type":"b"}
            # type, id
            'a/2': {"type":"a", "id":"2" }
            # type
            'a': {"type":"a"}
            # type, query
            'a?{"alpha":2}': {"type":"a","query":{"alpha":2}}
            # parent, query
            'a/2/?{"alpha":2}': {"parent":"a/2","query":{"alpha":2}}
            # parent
            'a/2/': {"parent":"a/2"}
            # query
            '?{"alpha":2}': {"query":{"alpha":2}}
        for string, result of tests
            # check parse
            assert.deepEqual result, parsed = parse string
            # round trip parse to stringify
            string2 = stringify parsed
            assert.equal string, string2
        errors = [
            'a/'
            'a/1/b/'
            '?{a:1}'
            '/a'
        ]
        for string in errors
            assert.throws (-> parse string)
        return








