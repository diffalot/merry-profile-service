const merry = require('merry')

const auth = require('./auth-middleware')
const profile = require('./profile')
const { profileSchema } = require('./schemas')

const notFound = merry.notFound
const mw = merry.middleware

let cors = mw.cors({
  methods: 'GET, PUT, POST, OPTIONS',
  origin: process.env.ALLOWED_CORS || '*'
})

module.exports = [
  [ '/profile', {
    get: mw([
      cors,
      auth.setToken,
      auth.parseToken,
      auth.verifyToken,
      getProfile
    ]),
    put: mw([
      cors,
      auth.setToken,
      auth.parseToken,
      auth.verifyToken,
      mw.schema(profileSchema),
      putProfile
    ]),
    patch: mw([
      cors,
      auth.setToken,
      auth.parseToken,
      auth.verifyToken,
      mw.schema(profileSchema),
      notFound()
    ])
  }],
  [ '/404', notFound() ]
]

function getProfile (req, res, ctx, done) {
  profile.get(ctx.auth.auth.key, function (err, profile) {
    if (err) {
      done(merry.error({
        statusCode: 400,
        message: err
      }))
    } else {
      done(null, profile)
    }
  })
}

function putProfile (req, res, ctx, done) {
  profile.put(ctx.auth.auth.key, ctx.body.profile, function (err, profile) {
    if (err) {
      done(merry.error({
        statusCode: 400,
        message: err
      }))
    } else {
      done(null, ctx.body.profile)
    }
  })
}
