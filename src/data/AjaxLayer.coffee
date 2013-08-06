XMLHttpRequest = require './XMLHttpRequest'

module.exports = exports = AjaxLayer = (require './DataLayer').extend
    id: module.id
    properties:
        error: (e) -> console.error e
        url: "/data/"
        headers: {}
        send: (key, object, callback) ->
            ajax = new XMLHttpRequest()
            url = @url + key
            method = if object isnt undefined then "POST" else "GET"
            ajax.open method, url, true
            for key, value of @headers
                ajax.setRequestHeader key, value
            content = undefined
            if object isnt undefined
                ajax.setRequestHeader "Content-Type", "application/json"
                content = JSON.stringify object
            ajax.send content
            ajax.onreadystatechange = =>
                if ajax.readyState is 4
                    if ajax.status < 300
                        callback JSON.parse(ajax.responseText)
                    else
                        @error "#{ajax.status} " + ajax.responseText
        patch: (key, object) ->
            @send key, object, (result) ->
                # console.log "patch response: #{JSON.stringify result}"
            return undefined
        watch: (key, handler) ->
            throw new Error "handler function is required" unless Object.isFunction handler
            # 1: GET the values immediately
            @send key, undefined, handler
            # 2: WATCH them with an open channel
            return unwatch = ->