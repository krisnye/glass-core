
module.exports = Channel = (require './Persistent').extend
    id: module.id
    properties:
        token:
            type: 'string'

