const later = require('later')
const Machine = require('./Machine.js')

class Mixer extends Machine {
  constructor(id, parameter) {
    super(id, parameter)
    const parse = later.parse.cron(parameter.mix)
    this.schedFill = later.schedule(parse)
    this.currentSpeed = 0
    this.duration = 0
  }

  run(currentDate) {
    const { rotationSpeed, rotationDuration, precision } = this.parameter
    if (this.schedFill.isValid(currentDate)) this.duration = 1
    if (this.duration) {
      this.currentSpeed = rotationSpeed * (1 - precision + Math.random() * 2 * precision)
      this.duration += 1
      if (this.duration === rotationDuration) {
        this.duration = 0
        this.currentSpeed = 0
      }
    }
    return { ts: `${this.id} value=${this.currentSpeed} ${currentDate.getTime()}000000` }
  }
}

module.exports = Mixer