Component = require '../Component'

module.exports = exports =
    Element = Component.extend
        name: 'Element'
        properties:
            visible: true
            draw: draw = (c) ->
                if @visible
                    @inner draw, c
            getBoundingRect: ->
            getBoundingSphere: ->
            getBoundingBox: ->
            pick: (ray, radius) ->

