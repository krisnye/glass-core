builder = require 'glass-build'

config =
    name: 'glass-core'
    source:
        directory: 'src'
    node:
        directory: 'lib'
    browser:
        input:
            '': true
            'sugar': true
            'gl-matrix': true
            'glass-test': true
            'json-schema': true
        output:
            directory: 'www/js'
            webroot: 'www'
            test: 'glass-test'
        port: 9000

task 'build', -> builder.build config
task 'watch', -> builder.watch config
task 'test', -> builder.test config
task 'bump', -> builder.bump config
task 'publish', -> builder.publish config
