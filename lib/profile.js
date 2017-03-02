const db = require('./db')

const get = function (key, cb) {
  db.get(key, function (err, profile) {
    cb(err, profile)
  })
}

const put = function (key, newProfile, cb) {
  db.put(key, newProfile, function (err, profile) {
    cb(err, profile)
  })
}

const patch = function (key, newProfile, cb) {
  db.get(key, function (err, profile) {
    if (err) cb(err)
    newProfile = Object.assign({}, profile, newProfile)
    db.put(key, newProfile, function (err, savedProfile) {
      cb(err, savedProfile)
    })
  })
}

const subscribe = function () {
  return db.createValueStream({keys: true, values: true})
}

module.exports = {
  get,
  put,
  patch,
  subscribe
}
