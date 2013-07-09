

module.exports = Person = (require '../../Component').extend
    id: module.id
    persistent: true
    security:
        query: (key, get) ->
            user = get "User/me"
            return null unless user?
            {user:user}
        access: (c) ->
            # you can only access your own person record
            c.document.userId is c.user.id
    properties:
        userId:
            type: 'string'
            required: true
        name:
            type: 'string'
            required: true
            minLength: 2
            maxLength: 32
            index: true
        age:
            type: 'integer'
            required: true
            minimum: 0
            maximum: 100
            index: true
        sex:
            enum: ["male","female"]
        comments:
            type: 'string'
        birthday:
            format: 'date-time'
