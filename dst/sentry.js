'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.captureError = undefined;

var _raven = require('raven');

var sentry = _interopRequireWildcard(_raven);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function captureError(err, context) {
  return new _bluebird2.default(function (resolve, reject) {
    var sentryClient = new sentry.Client(process.env.SENTRY_DSN, {
      release: '0.0.0.' + context.functionVersion
    });

    sentryClient.setExtraContext({ invoke_id: context.invokeid });
    sentryClient.on('logged', resolve);
    sentryClient.on('error', reject);

    if (err instanceof Error) {
      sentryClient.captureException(err);
    } else {
      sentryClient.captureMessage(err, { level: 'error' });
    }
  });
}

exports.captureError = captureError;
exports.default = captureError;