const fs = require('fs')
const TransportStream = require('winston-transport')
const sqlite = require('sqlite')

const LOGS_TABLE_NAME = 'logs'
const NUMBER_OF_RECORDS_TO_DELETE = 1
const DEFAULT_MAX_FILE_SIZE = 2000000

/**
 * class to support Winston logging to sqlite
 *
 * @class SqliteTransport
 * @extends {TransportStream}
 */
class SqliteTransport extends TransportStream {
  constructor(options) {
    super(options)
    // Expose the name of this Transport on the prototype.
    this.name = options.name || 'sqlite'
    this.database = null
    this.filename = options.filename || ':memory:'
    this.tableName = options.tableName || 'logs'
    this.maxFileSize = options.maxFileSize || DEFAULT_MAX_FILE_SIZE
  }

  /**
   * Core logging method exposed to Winston.
   * @param {Object} payload - object with logging info
   * @param {Function} callback - to be called when finished
   * @returns {undefined}
   */
  async log(payload, callback) {
    setImmediate(() => this.emit('logged', payload.level))

    // Perform the writing to the remote service
    if (!this.database) {
      this.database = await this.createLogsDatabase()
    }
    await this.addLog(payload.timestamp, payload.level, payload.message)

    const logFile = fs.statSync(this.filename)
    if (logFile.size > this.maxFileSize) {
      await this.deleteOldLogs()
    }

    if (callback) callback()
  }

  /**
   * Initiate SQLite3 database and create the logs table.
   * @return {BetterSqlite3.Database} - The SQLite3 database
   */
  async createLogsDatabase() {
    const database = await sqlite.open(this.filename)

    const query = `CREATE TABLE IF NOT EXISTS ${LOGS_TABLE_NAME} (
                    id INTEGER PRIMARY KEY, 
                    timestamp DATE,
                    level TEXT,
                    message TEXT
                  );`
    const stmt = await database.prepare(query)
    await stmt.run()

    return database
  }

  /**
   * Add logs
   * @param {string} timestamp - The timestamp
   * @param {string} level - The level
   * @param {string} message - The message
   * @return {void}
   */
  async addLog(timestamp, level, message) {
    const query = `INSERT INTO ${LOGS_TABLE_NAME} (timestamp, level, message) 
                   VALUES (?, ?, ?)`
    const stmt = await this.database.prepare(query)
    await stmt.run(timestamp, level, message)
  }

  /**
   * Delete old logs.
   * @return {void}
   */
  async deleteOldLogs() {
    const query = `DELETE FROM ${LOGS_TABLE_NAME} 
                  WHERE id IN (
                    SELECT id FROM ${LOGS_TABLE_NAME} 
                    ORDER BY id ASC 
                    LIMIT ?
                    )`
    const stmt = await this.database.prepare(query)
    await stmt.run(NUMBER_OF_RECORDS_TO_DELETE)
  }
}
module.exports = SqliteTransport
