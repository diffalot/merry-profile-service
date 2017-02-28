const jwt = require('jsonwebtoken')
const merry = require('merry')
const request = require('request')

const VERIFY_URL = `${process.env.AUTH_URL}/verify`
const secret = process.env.AUTH_SECRET

const setToken = function (req, res, ctx, done) {
  ctx.token = req.headers.authorization
  done()
}

const parseToken = function (req, res, ctx, done) {
  jwt.verify(ctx.token, secret, function (err, auth) {
    if (err) {
      done(merry.error({
        statusCode: 401,
        message: err
      }))
    } else {
      ctx.auth = auth
      done()
    }
  })
}

const verifyToken = function (req, res, ctx, done) {
  request({
    uri: VERIFY_URL,
    method: 'POST',
    json: {
      token: ctx.token
    }
  }, function (err, res, body) {
    if (err) {
      done(merry.error({
        statusCode: 400,
        message: err
      }))
    } else {
      if (body.valid) {
        done()
      } else {
        done(merry.error({
          statusCode: 401,
          message: 'Token invalid'
        }))
      }
    }
  })
}

module.exports = {
  setToken,
  parseToken,
  verifyToken
}
