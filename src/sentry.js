import * as sentry from 'raven'
import Promise from 'bluebird'

function captureError(err) {
  return new Promise((resolve, reject) => {
    const sentryClient = new sentry.Client(process.env.SENTRY_DSN, {
      release: `0.0.0.${process.env.BUILD_VER}`,
    })

    sentryClient.on('logged', resolve)
    sentryClient.on('error', reject)

    if (err instanceof Error) {
      sentryClient.captureException(err)
    } else {
      sentryClient.captureMessage(err, { level: 'error' })
    }
  })
}

export default captureError
