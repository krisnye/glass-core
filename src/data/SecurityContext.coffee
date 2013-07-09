Key = require './Key'

PermissiveSecurityContext =
    canRead: -> true
    canWrite: -> true
    toString: -> "PermissiveSecurityContext"
    toJSON: -> @toString()

getGetFunction = (key, data) ->
    (keystring) -> data.watch new Key(keystring, key.namespace)

module.exports = SecurityContext = (require '../Component').extend
    id: module.id
    properties:
        _canAccess: (accessName) ->
            schema = @schema ? @key.type
            security = schema.security
            securityValue = security?[accessName] ? security.access
            if Object.isBoolean securityValue
                return securityValue
            else if Object.isFunction securityValue
                return securityValue(@) is true
            else
                return true
        canRead: -> @_canAccess "read"
        canWrite: -> @_canAccess "write"
    getSecurityContext: (key, data) ->
        type = key.type
        throw new Error "403 kindless queries not allowed" unless type?

        if type.security?.query?
            properties = type.security.query key, getGetFunction(key, data)
            properties.key = key
            throw new Error "403 unauthorized query" unless properties?
            return new SecurityContext properties
        else
            return PermissiveSecurityContext
