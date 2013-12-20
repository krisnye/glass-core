glass = require './index'
jsonSchema = require './json-schema'

forEachInternal = (parent, name, object, schema, callback) ->
    # early exit from recursion on false
    return if not object? or (parent? and false is callback parent, name, object, schema)
    if Array.isArray object
        if schema.items?
            for item, index in object
                forEachInternal object, index, item, schema.items, callback
    else if typeof object is 'object'
        if schema.properties?
            # iterate the properties, NOT the object
            # since the objects values may not be enumerable
            for name, propertySchema of schema.properties
                forEachInternal object, name, object[name], propertySchema, callback
        if schema.additionalProperties?
            # iterate the properties
            for name, value of object when not schema.properties?[name]?
                forEachInternal object, name, value, schema.additionalProperties, callback

glass.defineProperties exports,
    validate: validate = (object, schema) ->
        result = jsonSchema.validate object, schema
        if result.valid
            return null
        else
            return result.errors
    forEach: forEach = (object, schema, callback) ->
        forEachInternal null, null, object, schema, callback
    prune: prune = (object, schema, callback) ->
        # return false to prune
        forEach object, schema, (parent, name, object, schema) ->
            if false is callback parent, name, object, schema
                delete parent[name]
        return

exports.test = do ->
    assert = require('./assert')
    forEach: ->
        Person =
            properties:
                name:
                    type: 'string'
                    required: true
                    minLength: 2
                    maxLength: 100
                age:
                    type: 'integer'
                    minimum: 0
                    maximum: 130
                recurse:
                    properties:
                        alpha:
                            type: 'string'
                        beta:
                            type: 'string'
            additionalProperties:
                type: 'integer'
        person =
            name: "good"
            age: 112
            recurse:
                alpha: "a"
                beta: "b"
            additional: 4
        # test basic branch first traversal
        results = []
        exports.forEach person, Person, (parent, name, object, schema) ->
            results.push parent, name, object, schema
        assert.deepEqual results, expected = [
            person, 'name', person.name, Person.properties.name,
            person, 'age', person.age, Person.properties.age,
            person, 'recurse', person.recurse, Person.properties.recurse,
            person.recurse, 'alpha', person.recurse.alpha, Person.properties.recurse.properties.alpha,
            person.recurse, 'beta', person.recurse.beta, Person.properties.recurse.properties.beta,
            person, 'additional', person.additional, Person.additionalProperties
        ]
        # test early traversal termination
        results = []
        exports.forEach person, Person, (parent, name, object, schema) ->
            results.push parent, name, object, schema
            return false if name is 'recurse'
        assert.deepEqual results, expected = [
            person, 'name', person.name, Person.properties.name,
            person, 'age', person.age, Person.properties.age,
            person, 'recurse', person.recurse, Person.properties.recurse,
            person, 'additional', person.additional, Person.additionalProperties
        ]
    validate: ->
        Person =
            properties:
                name:
                    type: 'string'
                    required: true
                    minLength: 2
                    maxLength: 100
                age:
                    type: 'integer'
                    minimum: 0
                    maximum: 130
                key:
                    type: 'string'
        invalid =
            name: "a"
            age: -2
        errors = validate invalid, Person
        assert errors?.length is 2, JSON.stringify errors
        valid =
            name: "good"
            age: 112
        errors = validate valid, Person
        if errors?.length > 0
            throw new Error JSON.stringify errors
        assert not errors?
    prune: ->
        Person =
            properties:
                name:
                    type: 'string'
                    required: true
                    minLength: 2
                    maxLength: 100
                age:
                    type: 'integer'
                    minimum: 0
                    maximum: 130
                recurse:
                    properties:
                        alpha:
                            type: 'string'
                        beta:
                            type: 'string'
        person =
            name: "good"
            age: 112
            recurse:
                alpha: "a"
                beta: "b"
        # test basic branch first traversal
        results = []
        exports.prune person, Person, (parent, name, object, schema) ->
            return false if name is 'age' or name is 'alpha'
        assert.deepEqual person, {name:'good',recurse:{beta:'b'}}
