schematic = require 'schematic'
_ = require 'underscore'

exports.compile = (options) ->
    ((options.addon ?= {}).
        pregenerate ?= {}).
            createObservableHandlers = (schema) ->
                # if a property is not explicitly flagged as not observable, then we consider it observable.
                for typeName, type of schema.types
                    content = type.content
                    continue if content.extension
                    for propertyName, property of content.properties when not property.get or property.set
                        if typeof property.value isnt 'function'
                            property.observable ?= true
                        if property.observable
                            # write the handler function
                            property.handler = Function "value", "oldValue", """
                                this.notifyObservers(#{JSON.stringify propertyName}, oldValue, value);
                                """

                schema

    schematic.compile options
