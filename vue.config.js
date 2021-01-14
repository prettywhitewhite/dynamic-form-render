const libConfig = require('./webpack.lib.config')
const exampleConfig = require('./webpack.example.config')
const isBuildLibary = process.env.NODE_ENV === 'production'
module.exports = isBuildLibary ? libConfig : exampleConfig
