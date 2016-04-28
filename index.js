
// much λ, much UX.
module.exports = function λ(fn) {
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
      cb(err);
    }
  }
}
