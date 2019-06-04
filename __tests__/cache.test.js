const fs = require('fs')
const path = require('path')

const Cache = require('../src/engine/Cache.class')
const config = require('../src/config/defaultConfig.json')

jest.mock('../src/services/database.service', () => {})
jest.mock('fs')

const engine = jest.genMockFromModule('../src/engine/Engine.class')
engine.logger = jest.fn(() => {})
engine.config = config

describe('Cache', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('constructor without folder creation', () => {
    fs.existsSync.mockReturnValue(false)

    const cache = new Cache(engine)

    expect(cache.engine).toEqual(engine)
    expect(cache.logger).toEqual(engine.logger)
    expect(cache.cacheFolder).toEqual(path.resolve(config.engine.caching.cacheFolder))
    expect(cache.archiveFolder).toEqual(path.resolve(config.engine.caching.archiveFolder))
    expect(cache.archiveMode).toEqual(config.engine.caching.archiveMode)
    expect(cache.activeApis).toEqual({})

    expect(fs.existsSync).toBeCalledTimes(2)
    expect(fs.mkdirSync).toBeCalledTimes(2)
  })

  test('constructor with folder creation', () => {
    fs.existsSync.mockReturnValue(true)

    const cache = new Cache(engine)

    expect(cache.engine).toEqual(engine)
    expect(cache.logger).toEqual(engine.logger)
    expect(cache.cacheFolder).toEqual(path.resolve(config.engine.caching.cacheFolder))
    expect(cache.archiveFolder).toEqual(path.resolve(config.engine.caching.archiveFolder))
    expect(cache.archiveMode).toEqual(config.engine.caching.archiveMode)
    expect(cache.activeApis).toEqual({})

    expect(fs.existsSync).toBeCalledTimes(2)
    expect(fs.mkdirSync).not.toBeCalled()
  })
})
