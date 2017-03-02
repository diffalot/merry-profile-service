require('dotenv').config()

const merry = require('merry')
const http = require('http')
const Socket = require('simple-websocket/server')

const routes = require('./lib/routes')

const options = {}

if (process.env.NODE_ENV === 'development') {
  options.logLevel = 'fatal'
}

const app = merry(options)

app.router(routes)

const server = http.createServer(app.start())

const io = new Socket({server})

const jwt = require('jsonwebtoken')
const secret = process.env.AUTH_SECRET
const valueStream = require('./lib/profile').subscribe()
const connections = {}

io.on('connection', function (socket) {
  app.log.info('new ws connection', socket)
  console.log('new connection', socket)
  socket.on('subscribe', function (token) {
    jwt.verify(token, secret, function (err, auth) {
      if (err) {
        app.log.error(err)
      } else {
        auth.socket = socket
        app.log.info('new subscription', auth)
        console.log('new subscription', auth)
        connections[auth.basic.key] = auth
      }
    })
  })
  /*
  socket.on('close', function () {
    delete connections[auth.basic.key]
  })
  */
})

valueStream.on('data', function (data) {
  console.log('changed data', data)
  if (connections[data.key]) {
    connections[data.key].socket.emit('profile', data)
  }
})

server.listen(process.env.PORT)
