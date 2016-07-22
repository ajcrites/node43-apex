'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lambda = exports.sentryize = exports.sqlize = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _sql = require('./sql');

var sql = _interopRequireWildcard(_sql);

var _sentry = require('./sentry');

var sentry = _interopRequireWildcard(_sentry);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('babel-polyfill');

var sqlize = function sqlize(fn) {
  return function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(event, context, callback) {
      var result, pool;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              result = undefined;


              console.log('Sqlize Start');

              pool = sql.createPool();
              _context2.prev = 3;
              _context2.next = 6;
              return _bluebird2.default.using(sql.getSqlConnection(pool), function () {
                var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(connection) {
                  return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return _bluebird2.default.resolve(fn(event, connection, context, callback));

                        case 2:
                          result = _context.sent;

                        case 3:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, undefined);
                }));

                return function (_x4) {
                  return _ref2.apply(this, arguments);
                };
              }());

            case 6:
              _context2.prev = 6;
              _context2.next = 9;
              return pool.endAsync();

            case 9:

              console.log('Sqlize done');
              return _context2.finish(6);

            case 11:
              return _context2.abrupt('return', result);

            case 12:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined, [[3,, 6, 11]]);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
};

var sentryize = function sentryize(fn) {
  return function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(event, context, callback) {
      var result;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              result = undefined;


              console.log('Sentryize Start');

              _context3.prev = 2;
              _context3.next = 5;
              return _bluebird2.default.resolve(fn(event, context, callback));

            case 5:
              result = _context3.sent;
              _context3.next = 15;
              break;

            case 8:
              _context3.prev = 8;
              _context3.t0 = _context3['catch'](2);

              console.error(_context3.t0.stack);
              console.log('Sending to Sentry');

              _context3.next = 14;
              return sentry.captureError(_context3.t0, context);

            case 14:
              throw _context3.t0;

            case 15:
              _context3.prev = 15;

              console.log('Sentryize done');
              return _context3.finish(15);

            case 18:
              return _context3.abrupt('return', result);

            case 19:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined, [[2, 8, 15, 18]]);
    }));

    return function (_x5, _x6, _x7) {
      return _ref3.apply(this, arguments);
    };
  }();
};

var lambda = function lambda(fn) {
  return function () {
    var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(event, context, callback) {
      var v;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return _bluebird2.default.resolve(fn(event, context, callback));

            case 3:
              v = _context4.sent;


              callback(null, v);
              _context4.next = 11;
              break;

            case 7:
              _context4.prev = 7;
              _context4.t0 = _context4['catch'](0);

              console.error(_context4.t0.stack);
              callback(_context4.t0);

            case 11:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined, [[0, 7]]);
    }));

    return function (_x8, _x9, _x10) {
      return _ref4.apply(this, arguments);
    };
  }();
};

exports.sqlize = sqlize;
exports.sentryize = sentryize;
exports.lambda = lambda;