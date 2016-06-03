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
module.exports = function db_lambda_main(fn) {
  return function(event, context, callback) {
    db_connection.connect()
    try {
      context.callbackWaitsForEmptyEventLoop = true

      var v = fn(event, db_connection, context, callback)
      if (v && typeof v.then == 'function') {
        v.then(val => callback(null, val)).catch(callback)
        return
      }

      callback(null, v)
    } catch (err) {
      console.error(err.stack)
      sentryClient.captureException(err)
      callback(err);
    } finally {
      db_connection.end()
    }
  }
}
