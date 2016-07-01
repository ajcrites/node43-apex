'use strict';

var mysql = require('mysql');
var Promise = require('bluebird');
Promise.promisifyAll(mysql);
Promise.promisifyAll(require('mysql/lib/Connection').prototype);
Promise.promisifyAll(require('mysql/lib/Pool').prototype);

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

module.exports = {
  createPool: createPool,
  getSqlConnection: getSqlConnection
};