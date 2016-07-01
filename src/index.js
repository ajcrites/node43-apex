import * as sql from './sql'
import * as sentry from 'raven'
import { Promise } from 'bluebird'

const sentryClient = new sentry.Client(process.env.SENTRY_DSN, {
  release: `0.0.0.${process.env.BUILD_VER}`,
})

const sqlize = fn => (
  async (event, context, callback) => {
    let result = undefined

    console.log('Sqlize Start')

    const pool = sql.createPool()

    try {
      await Promise.using(sql.getSqlConnection(pool), async connection => {
        result = await Promise.resolve(fn(event, connection, context, callback))
      })
    } finally {
      await pool.endAsync()

      console.log('Sqlize done')
    }

    return result
  }
)

const sentryize = fn => (
  async (event, context, callback) => {
    let result = undefined

    console.log('Sentryize Start')

    try {
      result = await Promise.resolve(fn(event, context, callback))
    } catch (err) {
      console.error(err.stack)
      console.log('Sending to Sentry')
      sentryClient.captureException(err)
      throw err
    } finally {
      console.log('Sentryize done')
    }

    return result
  }
)

const lambda = fn => (
  async (event, context, callback) => {
    try {
      var v = await Promise.resolve(fn(event, context, callback))

      callback(null, v)
    } catch (err) {
      console.error(err.stack)
      callback(err)
    }
  }
)

export {
  sqlize,
  sentryize,
  lambda
}