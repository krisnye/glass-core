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
    throw new Error "400 invalid key: #{key}" unless result?
    if result.query?
        try
            result.query = JSON.parse result.query
        catch e
            throw new Error "400 invalid key query: #{key}, #{e}"
    return result

join = (steps) ->
    # in the future, consider escaping any '/' values in the steps
    # probably consistent with json-pointer spec
    path = ""
    for step, i in steps when step?
        if step.constructor is Object
            path += "?" + JSON.stringify step
        else
            if Object.isFunction step
                step = step.name
            if path.length > 0
                path += "/"
            path += step
    path

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
    constructor: (namespace, path) ->
        throw new Error "namespace is required" unless namespace?
        # allow leaving off namespace if first part of path is a type
        pathStart = 1
        missingNamespace = Object.isFunction(namespace) and namespace.id?
        if missingNamespace
            pathStart = 0
        path = join Array.prototype.slice.call arguments, pathStart
        if missingNamespace
            namespace = Key.getNamespaceFromModuleId namespace.id
        # parse values
        properties = parse path
        # turn the parent into a key
        if properties.parent?
            properties.parent = new Key namespace, properties.parent
        # deep freeze the properties
        glass.freeze properties, true
        # set properties on this key
        Object.merge @, properties
        if namespace?
            @namespace = namespace
        # if a namespace is present then convert the type to an actual type
        if @namespace? and @type?
            try
                @type = require typeId = @namespace + @type
            catch e
                throw new Error "#{JSON.stringify typeId} not found in key: #{JSON.stringify path} (#{e})"
        # shallow freeze these properties (we don't want to freeze the type)
        s = @_toStringValue = stringify @
        @path =
            if @query?
                s.substring 0, s.indexOf('?')
            else
                s
        glass.freeze @, false
        return @
glass.defineProperties Key.prototype,
    isAncestor: (key) -> key? and @path.startsWith key
    isMatch: (key, object) ->
        # first check parentage
        return false unless key.toString().startsWith(@path)
        # then check query
        if @query?.if?
            return false unless object?
            return require('./query').matches(@query.if, object)
        return true
    toString: -> @_toStringValue ?= stringify @
    valueOf: -> @toString()
    toJSON: -> @toString()

Key.id = module.id
Key.join = (steps...) -> join steps
Key.getNamespaceFromModuleId = (moduleId) ->
    /^(([^\/\\]+[\/\\])*)/.exec(moduleId)[1]

exports.test = do ->
    assert = require '../assert'
    toString: ->
        key = new Key "./sample/", 'Project/2/Task/2?{"if":{"alpha":2}}'
        assert key.parent instanceof Key
        assert.equal key.parent.toString(), 'Project/2'
        assert.equal key.query.if.alpha, '2'
    frozen: ->
        key = new Key "./sample/", 'Project/2/Task/2?{"if":{"alpha":2}}'
        # try to set a value, should fail
        key.query.beta = 3
        assert.equal key.query.beta, undefined
    impliedNamespace: ->
        key0 = new Key Key, "12"
        assert.equal "Key/12", key0.toString()
        key1 = new Key key0.namespace, key0, Key, "12"
        assert key1?
    isAncestor: ->
        key1 = new Key "./sample/", 'User/3/Project/2/Task/2?{"if":{"alpha":2}}'
        assert key1.isAncestor new Key "./sample/", "User/3"
        assert key1.isAncestor "User/3/Project/2"
        assert not key1.isAncestor "Project/2"
        assert not key1.isAncestor "Task/2"
    creation: ->
        key1 = new Key "./sample/", 'Project/2/Task/2?{"if":{"alpha":2}}'
        key2 = new Key "./sample/", 'Project', '2', 'Task', '2', {"if":{"alpha":2}}

        assert.deepEqual key1.toString(), key2.toString()
        key3 = new Key "./sample/", null, 'Project', 'me'
        assert.equal 'Project/me', key3.toString()
    path: ->
        key1 = new Key "./sample/", 'Project/2/Task/2?{"if":{"alpha":2}}'
        key2 = new Key "./sample/", 'Project/2/Task/2'
        assert.equal key1.path, 'Project/2/Task/2'
        assert.equal key2.path, 'Project/2/Task/2'
    isMatch: ->
        key1 = new Key "./sample/", 'Project/2/Task/2?{"if":{"alpha":2}}'
        key2 = new Key "./sample/", 'Project/2/Task/2/Task/3'
        assert key1.isMatch key2, {alpha:2}
        assert not key1.isMatch key2, {alpha:3}
        key3 = new Key "./sample/", 'Project/2/Task/3/Task/3'
        assert not key1.isMatch key3, {alpha:2}
    join: ->
        path = Key.join "Foo", "12314123"
        assert.equal "Foo/12314123", path
    getNamespaceFromModuleId: ->
        ns = Key.getNamespaceFromModuleId "foo/bar/baz"
        assert.equal ns, "foo/bar/"
        ns = Key.getNamespaceFromModuleId "foo\\bar\\baz"
        assert.equal ns, "foo\\bar\\"
        ns = Key.getNamespaceFromModuleId "foo-bar"
        assert.equal ns, ""
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








