import * as mysql from 'mysql'
import Promise from 'bluebird'
Promise.promisifyAll(mysql)
Promise.promisifyAll(require('mysql/lib/Connection').prototype)
Promise.promisifyAll(require('mysql/lib/Pool').prototype)

const createPool = () => (mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
}))

// http://stackoverflow.com/questions/24797314/how-will-a-promisified-mysql-module-work-with-nodejs
const getSqlConnection = (pool) => (
  pool.getConnectionAsync().disposer(connection => {
    try {
      connection.release()
    } catch (e) {
      // do nothing
    }
  })
)

export {
  createPool,
  getSqlConnection,
}
