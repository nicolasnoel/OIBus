/**
 * Get the configuration.
 * @param {Object} ctx - The KOA context
 * @return {void}
 */
const getConfig = (ctx) => {
  ctx.ok({ config: ctx.app.engine.config })
}

/**
 * Add North application.
 * @param {Object} ctx - The KOA context
 * @return {void}
 */
const addNorth = async (ctx) => {
  if (ctx.app.engine.hasNorth(ctx.request.body.applicationId)) {
    ctx.throw(409, 'The given application ID already exists')
  }

  try {
    ctx.app.engine.addNorth(ctx.request.body)
    ctx.ok()
  } catch (error) {
    ctx.throw(500, 'Unable to add new application')
  }
}

/**
 * Update North application.
 * @param {Object} ctx - The KOA context
 * @return {void}
 */
const updateNorth = (ctx) => {
  if (!ctx.app.engine.hasNorth(ctx.request.params.applicationId)) {
    ctx.throw(404, 'The given application ID doesn\'t exists')
  }

  if (ctx.request.params.applicationId !== ctx.request.body.applicationId) {
    ctx.throw(400, 'Inconsistent application ID')
  }

  try {
    ctx.app.engine.updateNorth(ctx.request.body)
    ctx.ok('Reloading...')
  } catch (error) {
    ctx.throw(500, 'Unable to update application')
  }
}

/**
 * Delete North application.
 * @param {Object} ctx - The KOA context
 * @return {void}
 */
const deleteNorth = (ctx) => {
  if (!ctx.app.engine.hasNorth(ctx.request.params.applicationId)) {
    ctx.throw(404, 'The given application ID doesn\'t exists')
  }

  try {
    ctx.app.engine.deleteNorth(ctx.request.params.applicationId)
    ctx.ok('Reloading...')
  } catch (error) {
    ctx.throw(500, 'Unable to delete application')
  }
}

/**
 * Add South equipment.
 * @param {Object} ctx - The KOA context
 * @return {void}
 */
const addSouth = (ctx) => {
  ctx.ok()
}

/**
 * Update South equipment.
 * @param {Object} ctx - The KOA context
 * @return {void}
 */
const updateSouth = (ctx) => {
  ctx.ok()
}

/**
 * Delete South equipment.
 * @param {Object} ctx - The KOA context
 * @return {void}
 */
const deleteSouth = (ctx) => {
  ctx.ok()
}

module.exports = {
  getConfig,
  addNorth,
  updateNorth,
  deleteNorth,
  addSouth,
  updateSouth,
  deleteSouth,
}
