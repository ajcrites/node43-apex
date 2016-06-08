//Test two exception providers
//*** Sentry
var sentry = require('raven')
var mysql = require('mysql')

var sentryClient = new sentry.Client(process.env.SENTRY_DSN, {
  release: `0.0.0.${process.env.BUILD_VER}`
})

var db_connection = mysql.createConnection({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

// much λ, much UX.
module.exports = {
  db_lambda_main: function (fn) {
    return function(event, context, callback) {
      db_connection.connect()
      try {
        var v = fn(event, db_connection, context, callback)

        if (v && typeof v.then == 'function') {
          v.then(val => {
            callback(null, val)
            db_connection.end()
          }).catch(err => {
            console.error(err.stack)
            sentryClient.captureException(err)
            callback(err)
          })
          return
        }

        // This is the non-promise logic, but should be able to remove this branch and do both the same way
        callback(null, v)
        db_connection.end()
      } catch (err) {
        console.error(err.stack)
        sentryClient.captureException(err)
        callback(err)
      }
    }
  },

  lambda_main: function (fn) {
    return function(event, context, callback) {
      try {
        var v = fn(event, context, callback)

        if (v && typeof v.then == 'function') {
          v.then(val => {
            callback(null, val)
          }).catch(err => {
            console.error(err.stack)
            sentryClient.captureException(err)
            callback(err)
          })
          return
        }

        // This is the non-promise logic, but should be able to remove this branch and do both the same way
        callback(null, v)
      } catch (err) {
        console.error(err.stack)
        sentryClient.captureException(err)
        callback(err)
      }
    }
  }
}
