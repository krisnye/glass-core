
module.exports = Project = (require '../Persistent').extend
    id: module.id
    security:
        query: (key, get) ->
            # projects are only contained/owned by Users.
            user = get "User/me"
            if user.isAdmin or key.isAncestor user.id
                {user:user}
            else
                false
    properties:
        name:
            type: 'string'
            required: true
            minLength: 2
            maxLength: 128
        active:
            type: 'boolean'
            index: true
        complete:
            type: 'integer'
            minimum: 0
            maximum: 100
            index: true
        options:
            properties:
                public:
                    type: 'boolean'
                unreadable:
                    type: 'string'
                    security:
                        read: false
                unwriteable:
                    type: 'string'
                    security:
                        write: false
        milestones:
            foreignCopy:
                type: 'Task'
                #property: 'projectId'
                predicate: (x) -> x.milestone
                filter: (x) ->
                    id: x.id
                    name: x.name
                    complete: x.complete

