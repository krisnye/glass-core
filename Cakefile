config =
    name: 'glass'
    input: 'src'
    node:
        output: 'node'
    browser:
        output: 'browser'

builder = require "./#{config.input}/build"
utility = require "./#{config.input}/build/utility"

task 'build', -> builder.build config
task 'watch', -> builder.watch config
task 'test', -> builder.test config
task 'observe', ->
    console.log Object.observe
