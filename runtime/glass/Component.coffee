properties:
    uri:
        description: 'Uniform resource identifier for this component.'
        type: 'string'
    is: (type) -> @constructor.implements[type.path ? type] is true
    dispose: ->
    toJSON: ->
        values =
            class: @constructor.path
        # serialize statically defined properties
        for name, property of @constructor.properties
            value = @[name]
            if property.serializable isnt false and not isFunction(value)
                values[name] = value
        # serialize custom properties if allowed by schema
        if @constructor.additionalProperties isnt false
            for own name, value of @ when not isPrivate name
                values[name] = value
        values
    toString: -> @toJSON()

test:
    toJSON: ->
        # I need this test later
        # on a class that actually has serializable properties
        a = new Component
        a.x = 12
        a.y = ->
        a.z = true
        assertEquals a, {class:'glass.Component', x:12,z:true}
