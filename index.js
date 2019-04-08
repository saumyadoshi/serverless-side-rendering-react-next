// server.js
const express = require('express')
const path = require('path')
const dev = process.env.NODE_ENV !== 'production'
const next = require('next')
const pathMatch = require('path-match')
const app = next({ dev })
const handle = app.getRequestHandler()
const { parse } = require('url')

app.prepare()
  .then(() => {
    const server = express()
    const route = pathMatch()
    server.use('/_next', express.static(path.join(__dirname, '.next')))
    server.get('/', (req, res) => app.render(req, res, '/'))
    server.get('/dogs', (req, res) => app.render(req, res, '/dogs'))
    server.get('/dogs/:breed', (req, res) => {
      const params = route('/dogs/:breed')(parse(req.url).pathname)
      return app.render(req, res, '/dogs/_breed', params)
    })
    server.get('*', (req, res) => handle(req, res))
    server.listen(3000, (err) => {
    if (err) throw err
            console.log('> We are Ready on http://localhost:3000')
    })
    .catch((ex) => {
      console.error(ex.stack)
      process.exit(1)
  })
})
//module.exports = server
