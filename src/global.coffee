require 'sugar'

# get the global object
global = do -> @
# define some global functions we need for compatibility between browser and nodejs
global.global ?= global
# export the global object
module.exports = exports = global

# will have to figure out how to shim this correctly.
global.process ?= {}
global.process.nextTick ?= (fn) -> setTimeout fn, 0

global.Float32Array ?= Array
