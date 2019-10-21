var _ = require('underscore')
var polka = require('polka')

var about = require('./src/about')
var user = require('./src/user')
var block = require('./src/block')
var raw = require('./src/raw')
var static = require('./lib/static')
var fetchCache = require('./lib/fetch-cache')

var exec = require('await-exec')
var argv = require('minimist')(process.argv.slice(2))
var PORT = argv.port || 3002
var DEV = argv.dev


async function init(){
  polka()
    .get('/static/:file', (req, res) => {
      if (DEV) static = requireUncached('./lib/static')
      static(req, res)
    })
    .get('/cache-bust', (req, res) => {
      fetchCache.bust()
      res.writeHead(301, {Location: '/'})
    })
    .get('/', (req, res) => {
      if (DEV) about = requireUncached('./src/about')
      about(req, res)
    })
    .get('/:user', (req, res) => {
      if (DEV) user = requireUncached('./src/user')
      user(req, res)
    })
    .get('/:user/:id', (req, res) => {
      if (DEV) block = requireUncached('./src/block')
      block(req, res)
    })
    .get('/:user/raw/:id/:file', (req, res) => {
      if (DEV) raw = requireUncached('./src/raw')
      raw(req, res)
    })
    .listen(PORT, err => {
      if (err) throw err
      console.log(`http://localhost:${PORT}`)
      // exec(`open http://localhost:${PORT}`)
    })
}

init()


function requireUncached(module){
  delete require.cache[require.resolve(module)]
  return require(module)
}

