'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSqlConnection = exports.createPool = undefined;

var _mysql = require('mysql');

var mysql = _interopRequireWildcard(_mysql);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

_bluebird2.default.promisifyAll(mysql);
_bluebird2.default.promisifyAll(require('mysql/lib/Connection').prototype);
_bluebird2.default.promisifyAll(require('mysql/lib/Pool').prototype);

var createPool = function createPool() {
  return mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });
};

// http://stackoverflow.com/questions/24797314/how-will-a-promisified-mysql-module-work-with-nodejs
var getSqlConnection = function getSqlConnection(pool) {
  return pool.getConnectionAsync().disposer(function (connection) {
    try {
      connection.release();
    } catch (e) {
      // do nothing
    }
  });
};

exports.createPool = createPool;
exports.getSqlConnection = getSqlConnection;