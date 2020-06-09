const testConfig = {
  engine: {
    port: 2223,
    user: 'admin',
    password: '23423423',
    filter: ['127.0.0.1', '::1', '::ffff:127.0.0.1', '*'],
    logParameters: {
      consoleLevel: 'debug',
      fileLevel: 'error',
      filename: './logs/journal.log',
      maxsize: 1000000,
      maxFiles: 5,
      tailable: true,
      sqliteLevel: 'error',
      sqliteFilename: './logs/journal.db',
      sqliteMaxFileSize: 50000000,
    },
    caching: { cacheFolder: './cache', archiveMode: 'delete', archiveFolder: './cache/archived/' },
    scanModes: [
      { scanMode: 'everySecond', cronTime: '* * * * * *' },
      { scanMode: 'every10Second', cronTime: '* * * * * /10' },
      { scanMode: 'every1Min', cronTime: '* * * * *' },
      { scanMode: 'listen', cronTime: 'listen' },
    ],
    proxies: [
      {
        name: 'sss',
        protocol: '',
        host: 'hhh',
        port: 123,
        username: 'uuu',
        password: 'pppppppppp',
      },
      {
        name: 'ff',
        protocol: '',
        host: 'tt',
        port: 1,
        username: 'uii',
        password: 'ppppppppppppp',
      },
    ],
    engineName: 'OIBus',
    aliveSignal: {
      enabled: true,
      host: 'https://demo.host',
      endpoint: '/api/optimistik/oibus/info',
      authentication: {
        type: 'Basic',
        username: 'username',
        password: 'password',
      },
      id: 'OIBus-test',
      frequency: 300,
      proxy: '',
    },
    httpRequest: {
      stack: 'fetch',
      timeout: 30,
    },
  },
  south: {
    dataSources: [
      {
        dataSourceId: 'MQTTServer',
        protocol: 'MQTT',
        enabled: false,
        MQTT: {
          server: 'simulator.factorythings.com',
          mqttProtocol: 'mqtt',
          username: 'bai',
          password: 'pppppppppppppppppppppp',
          url: 'mqtt://simulator.factorythings.com:1883',
          timeStampOrigin: 'oibus',
          timeStampKey: 'timestamp',
          timeStampFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
          timeStampTimezone: 'Europe/Paris',
        },
        points: [
          { pointId: '/fttest.base/Tank 5.tank/Sensor22.temperature', scanMode: 'listen', topic: 'temperatureTank1' },
          { pointId: '/fttest.base/Tank 6.tank/Sensor23.temperature', scanMode: 'listen', topic: 'temperatureTank2' },
        ],
      },
      {
        dataSourceId: 'SimulationServer',
        protocol: 'OPCUA',
        enabled: false,
        OPCUA: {
          opcuaPort: 53530,
          httpsPort: 53443,
          host: '35.180.179.217',
          endPoint: 'Server/Simulation',
          timeOrigin: 'server',
        },
        points: [
          { ns: 5, pointId: '/fttest.base/Tank 5.tank/333333.temperature', scanMode: 'everySecond', s: 'Counter1' },
          { ns: 5, pointId: '/fttest.base/Tank 5.tank/333333.temperature', scanMode: 'everyNoon', s: 'Random1' },
        ],
      },
      {
        dataSourceId: 'SimulationServerBis',
        protocol: 'OPCUA',
        enabled: false,
        OPCUA: {
          opcuaPort: 53530,
          httpsPort: 53443,
          host: '35.180.179.217',
          endPoint: 'Server/Simulation',
          timeOrigin: 'server',
        },
        points: [
          { ns: 5, pointId: '/fttest.base/Tank 9.tank/333333.temperature', scanMode: 'everySecond', s: 'Sinusoid1' },
        ],
      },
      {
        dataSourceId: 'PLC-35',
        protocol: 'Modbus',
        enabled: false,
        Modbus: { port: 502, host: 'http://35.180.153.134' },
        points: [
          {
            pointId: '/fttest.base/Tank 3.tank/333333.fill_level',
            scanMode: 'everySecond',
            address: '0x0031',
            type: 'boolean',
          },
          {
            pointId: '/fttest.base/Tank 2.tank/222222.valve_state',
            scanMode: 'everyNoon',
            address: '0x0f8',
            type: 'boolean',
          },
          {
            pointId: '/fttest.base/Tank 2.tank/222222.fill_level',
            scanMode: 'everySecond',
            address: '0x76a0',
            type: 'boolean',
          },
          {
            pointId: '/fttest.base/Tank 2.tank/222333.fill_level',
            scanMode: 'everySecond',
            address: '0x76b0',
            type: 'boolean',
          },
          {
            pointId: '/fttest.base/Tank 3.tank/111111.valve_state',
            scanMode: 'everySecond',
            address: '0x83a6',
            type: 'boolean',
          },
        ],
      },
      {
        dataSourceId: 'PLC-42',
        protocol: 'Modbus',
        enabled: false,
        Modbus: { port: 502, host: 'http://35.180.153.134' },
        points: [
          {
            pointId: '/fttest.base/Tank4.tank/111111.fill_level',
            scanMode: 'everySecond',
            address: '0x0f',
            type: 'boolean',
          },
          {
            pointId: '/fttest.base/Tank4.tank/111111.flow_rate',
            scanMode: 'everySecond',
            address: '0x20',
            type: 'boolean',
          },
        ],
      },
      {
        dataSourceId: 'FolderScanner',
        protocol: 'FolderScanner',
        enabled: true,
        FolderScanner: {
          preserve: true,
          minAge: 1000,
          inputFolder: './input/',
          scanMode: 'every5Second',
          regex: '.txt',
        },
        points: [],
        scanMode: 'every10Second',
      },
      {
        dataSourceId: 'SQLDbToFile',
        protocol: 'SQLDbToFile',
        enabled: false,
        SQLDbToFile: {
          port: 1433,
          password: 'popopopopopopopopo',
          connectionTimeout: 1000,
          requestTimeout: 1000,
          host: '192.168.0.11',
          driver: 'mssql',
          username: 'oibus_user',
          database: 'oibus',
          query:
            'SELECT created_at AS timestamp, value1 AS temperature FROM oibus_test WHERE created_at > @date1 AND created_at <= @date2',
          delimiter: ',',
          filename: 'sql-@date.csv',
          scanMode: 'everySecond',
          timeColumn: 'timestamp',
          timezone: 'Europe/Paris',
          dateFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
          timeFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
        },
        scanMode: 'every10Second',
        points: [],
      },
      {
        dataSourceId: 'OPC-HDA',
        protocol: 'OPCHDA',
        enabled: false,
        OPCHDA: {
          tcpPort: 3333,
          retryInterval: 10000,
          agentFilename: '.\\deps\\win\\HdaAgent\\HdaAgent.exe',
          logLevel: 'debug',
          host: 'http://opcserver',
          serverName: 'Matrikon.OPC.Simulation',
          maxReturnValues: 10000,
          maxReadInterval: 3600,
        },
        points: [
          { pointId: 'A13518/AI1/PV.CV', scanMode: 'everySecond' },
          { pointId: '_FC42404/PID1/OUT.CV', scanMode: 'everySecond' },
          { pointId: '_FC42404/PID1/PV.CV', scanMode: 'every10Second' },
        ],
        scanGroups: [
          { scanMode: 'everySecond', aggregate: '', resampling: 'Minute' },
          { scanMode: 'every10Second', aggregate: '', resampling: 'Minute' },
        ],
      },
    ],
  },
  north: {
    applications: [
      {
        applicationId: 'c',
        api: 'Console',
        enabled: true,
        Console: {},
        caching: { sendInterval: 10000, retryInterval: 5000, groupCount: 1, maxSendCount: 10000 },
        subscribedTo: ['MQTTServer'],
      },
      {
        applicationId: 'monoiconnect',
        api: 'OIConnect',
        enabled: false,
        OIConnect: {
          authentication: { password: '', type: 'Basic', username: '' },
          timeout: 180000,
          host: '',
          endpoint: '',
          proxy: '',
          stack: 'fetch',
        },
        caching: { sendInterval: 10000, retryInterval: 5000, groupCount: 1000, maxSendCount: 10000 },
        subscribedTo: [],
        OIAnalyticsFile: { stack: 'fetch' },
      },
    ],
  },
  schemaVersion: 5,
  apiList: ['Console', 'OIConnect'],
  protocolList: ['CSV', 'OPCHDA', 'SQLDbToFile', 'FolderScanner', 'Modbus', 'OPCUA', 'MQTT'],
}

export default testConfig
