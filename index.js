var raven = require('raven')
var client = new raven.Client(process.env.SENTRY_DSN, {
  release: `v${process.env.BUILD_VER}`
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
      console.log(`Error in ${process.env.BUILD_VER}`)
      client.captureException(err)
      callback(err);
    }
  }
}
