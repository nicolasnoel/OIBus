/**
 * Class Protocol : provides general attributes and methods for protocols.
 */
class Protocol {
  /**
   * @constructor for Protocol
   * @param {Object} engine
   */
  constructor(engine) {
    this.engine = engine
    this.equipments = {}
  }
}

module.exports = Protocol