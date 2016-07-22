import * as sentry from 'raven'
import Promise from 'bluebird'

function captureError(err, context) {
  return new Promise((resolve, reject) => {
    const sentryClient = new sentry.Client(process.env.SENTRY_DSN, {
      release: `0.0.0.${context.functionVersion}`,
    })

    sentryClient.setExtraContext({ invoke_id: context.invokeid })
    sentryClient.on('logged', resolve)
    sentryClient.on('error', reject)

    if (err instanceof Error) {
      sentryClient.captureException(err)
    } else {
      sentryClient.captureMessage(err, { level: 'error' })
    }
  })
}

export {
  captureError,
}

export default captureError
