builder = require "glass-build"

config =
    name: "glass"
    source:
        directory: 'src'
    node:
        directory: 'lib'
    browser:
        input:
            "sugar": true
            "gl-matrix": true
        output:
            directory: 'www/js'
            webroot: 'www'
            port: 9000

task 'build', -> builder.build config
task 'watch', -> builder.watch config
task 'test', -> builder.test config
task 'bump', -> builder.bump config
task 'publish', -> builder.publish config
