const mqtt = require('mqtt')

const ApiHandler = require('../ApiHandler.class')

/**
 * Class MQTT - generates and sends MQTT messages
 */
class MQTT extends ApiHandler {
  /**
   * Constructor for MQTT
   * @constructor
   * @param {Object} applicationParameters - The application parameters
   * @param {Engine} engine - The Engine
   * @return {void}
   */
  constructor(applicationParameters, engine) {
    super(applicationParameters, engine)

    this.canHandleValues = true
  }

  /**
   * Handle values by sending them to MQTT North.
   * @param {object[]} values - The values
   * @return {Promise} - The handle status
   */
  async handleValues(values) {
    this.logger.silly(`Link handleValues() call with ${values.length} values`)
    try {
      await this.publishValues(values)
    } catch (error) {
      this.logger.error(error)
      throw error
    }
    return true
  }

  /**
   * Connection to Broker MQTT
   * @return {void}
   */
  connect() {
    super.connect()
    const { mqttProtocol, host, port, username, password } = this.application.MQTT
    this.client = mqtt.connect(`${mqttProtocol}://${host}`, { port, username, password: Buffer.from(this.decryptPassword(password)) })
    this.client.on('error', (error) => {
      this.logger.error(error)
    })

    this.client.on('connect', () => {
      this.logger.info('Connection to MQTT Broker')
    })
  }

  /**
   * Disconnection from MQTT Broker
   * @return {void}
   */
  disconnect() {
    this.logger.info('Disconnection from MQTT Broker')
    this.client.end(true)
  }

  /**
   * Makes an MQTT publish message with the parameters in the Object arg.
   * @param {Object[]} entries - The entry from the event
   * @return {Promise} - The request status
   */
  async publishValues(entries) {
    entries.forEach((entry) => {
      const { pointId, data } = entry

      // The pointId string is normally stuctured like that
      //   /xxx..xxx/yyy...yyy/.../zzz.zzz
      // In North MQTT usage we consider that the topic, to use, is given by yyy...yyy/.../zzz.zzz
      // We have to retrieve the end of the string after subtract "/xxx.xxx/" string
      const topic = pointId.split('/').slice(1).join('/')

      this.client.publish(topic, data, (error) => {
        if (error) {
          this.logger.error('Publish Error :', topic, data, error)
        }
      })
    })
    return true
  }
}

module.exports = MQTT
