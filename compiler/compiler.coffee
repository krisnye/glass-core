schematic = require 'schematic'
_ = require 'underscore'

exports.compile = (options) ->
    # what was uri used for again?

    # ((options.addon ?= {}).
    #     pregenerate ?= {}).
    #         addUri = (schema) ->
    #             # if a property is not explicitly flagged as not observable, then we consider it observable.
    #             for typeName, type of schema.types
    #                 content = type.content
    #                 continue if content.extension
    #                 content.uri ?= "global:/#{content.path.replace(/\./g, '/')}"
    #             schema

    schematic.compile options
