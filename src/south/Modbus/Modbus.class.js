/* istanbul ignore file */

const jsmodbus = require('jsmodbus')
const net = require('net')
const { getOptimizedScanModes, parseAddr } = require('./config/getOptimizedConfig')
const ProtocolHandler = require('../ProtocolHandler.class')

/**
 * Class Modbus - Provides instruction for Modbus client connection
 * @todo: Warning: this protocol needs rework to be production ready.
 */
class Modbus extends ProtocolHandler {
  /**
   * Constructor for Modbus
   * @constructor
   * @param {Object} dataSource - The data source
   * @param {Engine} engine - The engine
   * @return {void}
   */
  constructor(dataSource, engine) {
    super(dataSource, engine)
    this.optimizedScanModes = getOptimizedScanModes(this.dataSource.points, this.logger)
    this.socket = new net.Socket()
    this.host = this.dataSource.Modbus.host
    this.port = this.dataSource.Modbus.port
    this.connected = false
    this.modbusClient = new jsmodbus.client.TCP(this.socket)
  }

  /**
   * Runs right instructions based on a given scanMode
   * @param {String} scanMode - Cron time
   * @return {void}
   */
  onScan(scanMode) {
    const { connected, optimizedScanModes } = this
    const scanGroup = optimizedScanModes[scanMode]

    // ignore if scanMode if not relevant to this data source/ or not connected
    /** @todo we should likely filter onScan at the engine level */
    if (!scanGroup || !connected) return

    Object.keys(scanGroup).forEach((modbusType) => {
      const addressesForType = scanGroup[modbusType] // Addresses of the group
      // Build function name, IMPORTANT: type must be singular
      const funcName = `read${`${modbusType.charAt(0).toUpperCase()}${modbusType.slice(1)}`}s`
      Object.entries(addressesForType).forEach(([range, points]) => {
        // console.log(`Entry with range ${range} :  ${JSON.stringify(points, null, 2)}`)
        const rangeAddresses = range.split('-')
        const startAddress = parseAddr(rangeAddresses[0]) // First address of the group
        const endAddress = parseAddr(rangeAddresses[1]) // Last address of the group
        const rangeSize = endAddress - startAddress // Size of the addresses group
        this.modbusFunction(funcName, { startAddress, rangeSize }, points)
      })
    })
  }

  /**
   * Dynamically call the right function based on the given name
   * @param {String} funcName - Name of the function to run
   * @param {Object} infos - Information about the group of addresses (first address of the group, size)
   * @param {Object} points - the points to read
   * @return {void}
   */
  modbusFunction(funcName, { startAddress, rangeSize }, points) {
    if (this.modbusClient[funcName]) {
      this.modbusClient[funcName](startAddress, rangeSize)
        .then(({ response }) => {
          const timestamp = new Date().toISOString()
          points.forEach((point) => {
            const position = parseAddr(point.address) - startAddress - 1
            let data = response.body.valuesAsArray[position]
            switch (point.type) {
              case 'boolean':
                data = !!data
                break
              case 'number':
                break
              default:
                throw new Error(`The point ${point.pointId} type was not recognized: ${point.type}`)
            }
            /** @todo: below should send by batch instead of single points */
            this.addValues([
              {
                pointId: point.pointId,
                timestamp,
                data: { value: JSON.stringify(data) },
              },
            ])
          })
        })
        .catch((error) => {
          this.logger.error(`Modbus onScan error: for ${startAddress} and ${rangeSize}, ${funcName} error : ${JSON.stringify(error)}`)
        })
    }
  }

  /**
   * Initiates a connection for every data source to the right host and port.
   * @return {void}
   */
  async connect() {
    await super.connect()
    const { host, port } = this
    this.socket.connect(
      { host, port },
      () => {
        this.connected = true
      },
    )
    this.socket.on('error', (error) => {
      this.logger.error(`Modbus connect error: ${JSON.stringify(error)}`)
    })
  }

  /**
   * Close the connection
   * @return {void}
   */
  disconnect() {
    if (this.connected) {
      this.socket.end()
      this.connected = false
    }
  }
}

module.exports = Modbus
