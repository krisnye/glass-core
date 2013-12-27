fs = require 'fs'
cp = require 'child_process'

task "dev", "create development symlinks", ->
    try
        fs.mkdirSync "node_modules" if not fs.existsSync "node_modules"
        fs.symlinkSync "../../ion/lib", "node_modules/ion", "dir" if not fs.existsSync "node_modules/ion"
        fs.symlinkSync "../node_modules", "lib/node_modules", "dir" if not fs.existsSync "lib/node_modules"
    catch e
        console.log "You need to run as an administrator to create symlinks: #{e}"

task "watch", "incrementally builds the project", ->
    require('ion/builder').runTemplate './build.ion', {}
