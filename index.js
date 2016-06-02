//Test two exception providers
//*** Sentry
var sentry = require('raven')
var sentryClient = new sentry.Client(process.env.SENTRY_DSN, {
  release: `0.0.0.${process.env.BUILD_VER}`
})

// much λ, much UX.
module.exports = function lambda_main(fn) {
  return function(event, context, callback) {
    try {
      var v = fn(event, context, callback)

      context.callbackWaitsForEmptyEventLoop = true
      if (v && typeof v.then == 'function') {
        v.then(val => callback(null, val)).catch(callback)
        return
      }

      callback(null, v)
    } catch (err) {
      console.error(err.stack)
      sentryClient.captureException(err)
      callback(err);
    }
  }
}
