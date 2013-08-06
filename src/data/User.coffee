
module.exports = User = (require './Persistent').extend
    id: module.id
    properties:
        email:
            type: 'string'
            index: true
        authDomain:
            type: 'string'
            index: true
        federatedIdentity:
            type: 'string'
            index: true
        nickname:
            type: 'string'
        isAdmin:
            type: 'boolean'
        userToken:
            type: 'string'
            index: true
        loginUrl:
            type: 'string'
            format: 'uri'
        logoutUrl:
            type: 'string'
            format: 'uri'

