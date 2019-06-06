const fs = require('fs')
const path = require('path')

const Cache = require('../src/engine/Cache.class')
const config = require('../src/config/defaultConfig.json')
const databaseService = require('../src/services/database.service')

jest.mock('../src/services/database.service', () => ({
  createFilesDatabase: jest.fn(() => 'filesDatabase'),
  createValuesDatabase: jest.fn(() => 'valuesDatabase'),
}))
jest.mock('fs')

const engine = jest.genMockFromModule('../src/engine/Engine.class')
engine.logger = jest.fn(() => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}))
engine.config = config

const invalidApi = {
  application: {
    applicationId: 'applicationId',
    caching: { sendInterval: 666 },
    subscribedTo: 'subscribedTo',
  },
  canHandleValues: false,
  canHandleFiles: false,
}
const validFileApi = {
  application: {
    applicationId: 'applicationId',
    caching: { sendInterval: 666 },
    subscribedTo: 'subscribedTo',
  },
  canHandleValues: false,
  canHandleFiles: true,
}
const validActiveFileApi = {
  canHandleValues: false,
  canHandleFiles: true,
  applicationId: 'applicationId',
  config: { sendInterval: 666 },
  subscribedTo: 'subscribedTo',
}
const validValueApi = {
  application: {
    applicationId: 'applicationId',
    caching: { sendInterval: 666 },
    subscribedTo: 'subscribedTo',
  },
  canHandleValues: true,
  canHandleFiles: false,
}
const validActiveValueApi = {
  canHandleValues: true,
  canHandleFiles: false,
  applicationId: 'applicationId',
  config: { sendInterval: 666 },
  subscribedTo: 'subscribedTo',
  database: 'valuesDatabase',
}

describe('Cache', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('constructor without cacheFolder/archiveFolder folder creation', () => {
    fs.existsSync.mockReturnValue(false)

    const cache = new Cache(engine)

    expect(cache).toBeInstanceOf(Cache)
    expect(cache.engine).toEqual(engine)
    expect(cache.logger).toEqual(engine.logger)
    expect(cache.cacheFolder).toEqual(path.resolve(config.engine.caching.cacheFolder))
    expect(cache.archiveFolder).toEqual(path.resolve(config.engine.caching.archiveFolder))
    expect(cache.archiveMode).toEqual(config.engine.caching.archiveMode)
    expect(cache.activeApis).toEqual({})

    expect(fs.existsSync).toBeCalledTimes(2)
    expect(fs.mkdirSync).toBeCalledTimes(2)
  })

  test('constructor with cacheFolder/archiveFolder folder creation', () => {
    fs.existsSync.mockReturnValue(true)

    const cache = new Cache(engine)

    expect(cache).toBeInstanceOf(Cache)
    expect(cache.engine).toEqual(engine)
    expect(cache.logger).toEqual(engine.logger)
    expect(cache.cacheFolder).toEqual(path.resolve(config.engine.caching.cacheFolder))
    expect(cache.archiveFolder).toEqual(path.resolve(config.engine.caching.archiveFolder))
    expect(cache.archiveMode).toEqual(config.engine.caching.archiveMode)
    expect(cache.activeApis).toEqual({})

    expect(fs.existsSync).toBeCalledTimes(2)
    expect(fs.mkdirSync).not.toBeCalled()
  })

  test('initialize should not initialize activeApis with invalid application', () => {
    const applications = [invalidApi]

    const cache = new Cache(engine)
    cache.resetTimeout = jest.fn()

    cache.initialize(applications)

    expect(databaseService.createFilesDatabase).toBeCalledWith(`${cache.cacheFolder}/fileCache.db`)
    expect(cache.filesDatabase).not.toBeDefined()
    expect(databaseService.createValuesDatabase).not.toBeCalled()
    expect(cache.resetTimeout).not.toBeCalled()
    expect(cache.activeApis).toEqual({})
  })

  test('initialize should initialize activeApis with a file handler application', async () => {
    const applications = [validFileApi]

    const cache = new Cache(engine)
    cache.resetTimeout = jest.fn()

    await cache.initialize(applications)

    expect(databaseService.createFilesDatabase).toBeCalledWith(`${cache.cacheFolder}/fileCache.db`)
    expect(cache.filesDatabase).toBe('filesDatabase')
    expect(databaseService.createValuesDatabase).not.toBeCalled()
    expect(cache.resetTimeout).toBeCalledWith(validActiveFileApi, validActiveFileApi.config.sendInterval)
    expect(cache.activeApis).toEqual({ applicationId: validActiveFileApi })
  })

  test('initialize should initialize activeApis with a value handler application', async () => {
    const applications = [validValueApi]

    const cache = new Cache(engine)
    cache.resetTimeout = jest.fn()

    await cache.initialize(applications)

    expect(databaseService.createFilesDatabase).toBeCalledWith(`${cache.cacheFolder}/fileCache.db`)
    expect(cache.filesDatabase).toBe('filesDatabase')
    expect(databaseService.createValuesDatabase).toBeCalledWith(`${cache.cacheFolder}/${validValueApi.application.applicationId}.db`)
    expect(cache.resetTimeout).toBeCalledWith(validActiveValueApi, validActiveValueApi.config.sendInterval)
    expect(cache.activeApis).toEqual({ applicationId: validActiveValueApi })
  })
})
