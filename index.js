import raven from 'raven';
var client = new raven.Client(process.env.SENTRY_DSN, {
  release: `v${process.env.BUILD_VER}`
})

// much λ, much UX.
module.exports = function lambda_main(fn) {
  return function(e, ctx, cb) {
    try {
      var v = fn(e, ctx, cb)

      ctx.callbackWaitsForEmptyEventLoop = false
      if (v && typeof v.then == 'function') {
        v.then(val => cb(null, val)).catch(cb)
        return
      }

      cb(null, v)
    } catch (err) {
      ctx.callbackWaitsForEmptyEventLoop = false
      client.captureException(err)
      cb(err);
    }
  }
}
