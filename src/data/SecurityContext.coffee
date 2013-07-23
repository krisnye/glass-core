Key = require './Key'
glassSchema = require '../schema'

getGetFunction = (key, data) ->
    (path...) -> data.watch new Key(key.namespace, path...)

module.exports = SecurityContext = (require '../Component').extend
    id: module.id
    properties:
        key:
            description: 'the key for the resource we are accessing'
        document:
            description: 'the document we are checking access to'
        value:
            description: 'the value we are checking access to'
        schema:
            description: 'the schema for the current value'
        canAccess: (accessName) ->
            schema = @schema ? @key.type
            security = schema.security
            securityValue = security?[accessName] ? security?.access
            if Object.isBoolean securityValue
                return securityValue
            else if Object.isFunction securityValue
                return securityValue.call(security, @) is true
            else
                return true
        canRead: -> @canAccess "read"
        canWrite: -> @canAccess "write"
        prune: (document, access) ->
            throw new Error "access required" unless access?
            @value = @document = document
            @schema = @key.type
            return undefined unless @canAccess access
            # we can access the document, now prune properties
            glassSchema.prune @document, @schema, (parent, name, object, schema) =>
                @value = object
                @schema = schema
                return @canAccess access
            return @document

    getSecurityContext: (key, data) ->
        type = key.type
        throw new Error "403 kindless queries not allowed" unless type?

        if type.security?.query?
            properties = type.security.query key, getGetFunction(key, data)
            throw new Error "403 unauthorized query" unless properties
            # make sure we don't use any reserved properties
            for name of properties
                if SecurityContext.properties[name]?
                    throw new Error "500 cannot use SecurityContext reserved property: #{name}"
            properties.key = key
            return new SecurityContext properties
        else
            return null
