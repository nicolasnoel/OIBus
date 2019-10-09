/**
 * Module dependencies.
 */
const crypto = require('crypto')
const basicAuth = require('basic-auth')
const Logger = require('../../engine/Logger.class')

/**
 * Return basic auth middleware with
 * the given options:
 *
 *  - `name` username
 *  - `pass` password
 *  - `realm` realm
 *
 * @param {Object} opts - The options
 * @return {GeneratorFunction} The middleware function
 * @api public
 */
const auth = (opts = {}) => {
  if (!opts.realm) opts.realm = 'Secure Area'

  return (ctx, next) => {
    const user = basicAuth(ctx)
    if (user && user.pass && user.name === opts.name) {
      const hash = crypto.createHash('sha256').update(user.pass).digest('hex')
      if (hash === opts.pass) return next()
      const logger = Logger.getInstance()
      logger.error(new Error(`Bad hash: ${hash}`))
    }
    return ctx.throw(401, null, { headers: { 'WWW-Authenticate': `Basic realm="${opts.realm.replace(/"/g, '\\"')}"` } })
  }
}

module.exports = auth
