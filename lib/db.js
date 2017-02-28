const sublevel = require('level-sublevel')
let db

if (process.env.NODE_ENV !== 'production') {
  db = require('memdb')()
} else {
  db = require('levelup')(process.env.MONGO_URI, { db: require('mongodown') })
}

db = sublevel(db)

db = db.sublevel('profiles', {keyEncoding: 'json', valueEncoding: 'json'})

module.exports = db
