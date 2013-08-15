AjaxLayer = require './AjaxLayer'
Key = require './Key'

module.exports = exports = ChannelCacheLayer = (require './CacheLayer').extend
    id: module.id
    properties:
        initialize: initialize = ->
            # set the watch header in the ajax layer so the server
            # will know that we want channel updates on any queries
            # ensure that the google channel api is loaded on the client
            unless global.goog?.appengine?.Channel?
                throw new Error "Missing google channel api: /_ah/channel/jsapi" 

            @openChannel()
            @inner initialize
        namespace:
            type: 'string'
            required: true
        openChannel: ->
            ajaxLayer = @get AjaxLayer
            ajaxLayer.headers[require('./').watchHeader] ?= 'true'
            # we send our channel open request directly through the AjaxLayer
            ajaxLayer.send "Channel/default", {}, (result) =>
                token = result.token
                @channel = new goog.appengine.Channel token
                @channelSocket = @channel.open
                    onopen: =>
                        # console.log 'CHANNEL OPEN'
                    onerror: (e) =>
                        console.log 'CHANNEL ERROR'
                        console.log e
                    onmessage: (message) =>
                        # console.log 'CHANNEL MESSAGE', message.data
                        json = JSON.parse message.data
                        for id, value of json
                            key = new Key @namespace, id
                            @_patchLocal key, value
                    onclose: =>
                        # console.log 'CHANNEL CLOSE'
            # 
        # patch: patch = (key, object) ->
        #     @inner patch, key, object
        # watch: watch = (key, handler) ->
        #     @inner watch, key, handler
