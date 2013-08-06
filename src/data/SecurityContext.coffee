Key = require './Key'
glassSchema = require '../schema'

getGetFunction = (key, dataLayer) ->
    (path...) -> dataLayer.watch new Key(key.namespace, path...)

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
        prune: (object, access) ->
            throw new Error "access required" unless access?
            @value = object
            @schema = @key.type
            return undefined unless @canAccess access
            # we can access the document, now prune properties
            glassSchema.prune object, @schema, (parent, name, object, schema) =>
                @value = object
                @schema = schema
                return @canAccess access
            return object
        pruneResults: (results, access = 'read') ->
            # now apply security rules to prune the results
            if @key.id?
                # single results
                @document = results
                results = @prune results, access
            else
                # multiple results
                for name, value of results
                    @document = value
                    value = @prune value, access
                    if not value?
                        # we really shouldn't need to prune any entire results from a query.
                        console.log 'WARNING: Pruning results #{name} from query: #{key}'
                        delete results[name]
            return results
    getSecurityContext: (key, dataLayer) ->
        type = key.type
        throw new Error "403 kindless queries not allowed" unless type?

        if type.security?.query?
            properties = type.security.query key, getGetFunction(key, dataLayer)
            throw new Error "403 unauthorized query" unless properties
            # make sure we don't use any reserved properties
            for name of properties
                if SecurityContext.properties[name]?
                    throw new Error "500 cannot use SecurityContext reserved property: #{name}"
            properties.key = key
            return new SecurityContext properties
        else
            return null
