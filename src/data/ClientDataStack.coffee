
module.exports = ClientDataStack = (require './DataStack').extend
    id: module.id
    properties:
        namespace:
            type: 'string'
        url:
            type: 'string'
        initialize: initialize = ->
            throw new Error "namespace is required" unless @namespace?
            throw new Error "url is required" unless @url?
            @layers ?= [
                {
                    $type: "glass-core/data/KeyLayer"
                    namespace: @namespace
                }
                {
                    $type: "glass-core/data/ChannelCacheLayer"
                    namespace: @namespace
                }
                {
                    $type: "glass-core/data/AjaxLayer"
                }
            ]

            @inner initialize
