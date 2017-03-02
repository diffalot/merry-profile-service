require('dotenv').config()

const AUTH_URL = process.env.AUTH_URL

const test = require('tape')
const request = require('request')
// const Socket = require('simple-websocket')

const API_URL = `http://localhost:${process.env.PORT}`
// const WS_URL = process.env.WS_URL

require('./')

getToken(function (err, auth) {
  if (err) console.log(err)

  let headers = {
    Authorization: auth.token
  }

  test('GET /profile fails with bad token', function (t) {
    let options = {
      uri: `${API_URL}/profile`,
      method: 'GET',
      headers: {
        Authorization: 'this does not decode to anything'
      }
    }
    request(options, function (err, res, body) {
      if (err) console.log(err)
      body = JSON.parse(body)
      t.same(res.statusCode, 401, 'Received 401')
      t.ok(body.error, 'Received error')
      t.ok(body.message, 'Received error message')
      t.end()
    })
  })

  test('GET /profile fails with no profile', function (t) {
    let options = {
      uri: `${API_URL}/profile`,
      method: 'GET',
      headers: headers
    }
    request(options, function (err, res, body) {
      if (err) console.log(err)
      body = JSON.parse(body)
      t.same(res.statusCode, 400, 'Received 400')
      t.ok(body.error, 'Received error')
      t.ok(body.message, 'Received error message')
      t.end()
    })
  })

  test('PUT /profile creates new profile', function (t) {
    let options = {
      uri: `${API_URL}/profile`,
      method: 'PUT',
      headers: headers,
      json: {
        profile: {
          name: 'Test User'
        }
      }
    }
    request(options, function (err, res, body) {
      if (err) console.log(err)
      t.same(res.statusCode, 200, 'Received 200')
      t.same(body.name, 'Test User', 'Received profile')
      options.method = 'GET'
      delete options.json
      request(options, function (err, res, body) {
        if (err) console.log(err)
        body = JSON.parse(body)
        t.same(res.statusCode, 200, 'Received 200')
        t.same(body.name, 'Test User', 'Received profile')
        t.end()
      })
    })
  })

  test('GET /profile retrieves profile', function (t) {
    let options = {
      uri: `${API_URL}/profile`,
      method: 'GET',
      headers: headers
    }
    request(options, function (err, res, body) {
      if (err) console.log(err)
      body = JSON.parse(body)
      t.same(res.statusCode, 200, 'Received 200')
      t.same(body.name, 'Test User', 'Received profile')
      t.end()
    })
  })
/*
  test('WS connection is established', function (t) {
    let socket = new Socket(WS_URL)
    socket.on('connect', function (arg) {
      console.log('test connection', arg)
    })
  })
*/
  test('app exits', function (t) {
    t.ok(true, 'app will exit')
    t.end()
    process.exit()
  })
})

function getToken (cb) {
  let email = 'user@example.com'
  let options = {
    uri: `${AUTH_URL}/register`,
    method: 'POST',
    json: {
      email: email,
      password: 'password'
    }
  }
  request(options, function (err, res, body) {
    if (err || res.statusCode !== 200) {
      options.uri = `${AUTH_URL}/login`
      request(options, function (err, res, body) {
        if (err) console.log(err)
        cb(err, body)
      })
    } else {
      cb(null, body)
    }
  })
}
