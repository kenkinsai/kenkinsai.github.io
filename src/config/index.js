let env = process.env.NODE_ENV || 'development'; console.log('RUNNING ' + env)
let loadedModule = require('./config.' + env + '.js')
module.exports = loadedModule
