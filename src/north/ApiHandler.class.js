const path = require('path')

class ApiHandler {
  /**
   * Constructor for Application
   * Building a new North API means to extend this class, and to surcharge
   * the following methods:
   * - **handleValues**: receive an array of values that need to be sent to an external applications
   * - **handleFile**: receive a file that need to be sent to an external application.
   * - **connect**: to allow to establish proper connection to the external application (optional)
   * - **disconnect**: to allow proper disconnection (optional)
   *
   * The constructor of the API need to initialize:
   * - **this.canHandleValues** to true in order to receive values with handleValues()
   * - **this.canHandleFiles** to true in order to receive a file with handleFile()
   *
   * In addition, it is possible to use a number of helper functions:
   * - **getProxy**: get the proxy handler
   * - **decryptPassword**: to decrypt a password
   * - **logger**: to log an event with different levels (error,warning,info,debug)
   *
   * @constructor
   * @param {Object} applicationParameters - The application parameters
   * @param {Engine} engine - The Engine
   * @return {void}
   */
  constructor(applicationParameters, engine) {
    this.canHandleValues = false
    this.canHandleFiles = false
    this.logSource = this.constructor.name

    this.application = applicationParameters
    this.engine = engine
    this.scanModes = this.engine.scanModes
    const { engineConfig } = this.engine.configService.getConfig()
    this.engineConfig = engineConfig
  }

  /**
   * Method called by Engine to initialize a given api. This method can be surcharged in the
   * North api implementation to allow connection to a third party application for example.
   * @return {void}
   */
  connect() {
    const { applicationId, api } = this.application
    logger.info(`North API ${applicationId} started with protocol ${api}`, this.logSource)
  }

  /**
   * Method called by Engine to stop a given api. This method can be surcharged in the
   * North api implementation to allow to disconnect to a third party application for example.
   * @return {void}
   */
  disconnect() {
    const { applicationId } = this.application
    logger.info(`North API ${applicationId} disconnected`, this.logSource)
  }

  /**
   * Method called by the Engine to handle an array of values in order for example
   * to send them to a third party application.
   * @param {object[]} values - The values to handle
   * @return {Promise} - The handle status
   */
  /* eslint-disable-next-line class-methods-use-this */
  async handleValues(values) {
    logger.warn(`handleValues should be surcharged ${values}`, this.logSource)
    return true
  }

  /**
   * Method called by the Engine to handle a raw file.
   * @param {string} filePath - The path of the raw file
   * @return {Promise} - The handle status
   */
  /* eslint-disable-next-line class-methods-use-this */
  async handleFile(filePath) {
    logger.warn(`handleFile should be surcharged ${filePath}`, this.logSource)
    return true
  }

  /**
   * Get proxy by name
   * @param {String} proxyName - The name of the proxy
   * @return {*} - The proxy
   */
  getProxy(proxyName) {
    let proxy = null

    if (proxyName) {
      proxy = this.engineConfig.proxies.find(({ name }) => name === proxyName)
    }

    return proxy
  }

  /**
   * Decrypt password.
   * @param {string} password - The password to decrypt
   * @returns {string} - The decrypted password
   */
  decryptPassword(password) {
    return this.engine.decryptPassword(password)
  }

  /**
   * Get filename without timestamp from file path.
   * @param {string} filePath - The file path
   * @returns {string} - The filename
   */
  static getFilenameWithoutTimestamp(filePath) {
    const { name, ext } = path.parse(filePath)
    const filename = name.substr(0, name.lastIndexOf('-'))
    return `${filename}${ext}`
  }
}

module.exports = ApiHandler
