module.exports = {
  title: 'Configure Link',
  type: 'object',
  properties: {
    applicationId: {
      type: 'string',
      title: 'Application ID',
    },
    enabled: {
      type: 'boolean',
      title: 'Enabled',
      default: true,
    },
    api: {
      type: 'string',
      title: 'API',
      enum: ['Link'],
      default: 'Link',
    },
    caching: {
      type: 'object',
      title: 'Caching',
      host: {
        type: 'string',
        title: 'Host',
        default: 'http://localhost:2223',
      },
      properties: {
        sendInterval: {
          type: 'number',
          title: 'Send interval',
          default: 15000,
        },
        retryInterval: {
          type: 'number',
          title: 'Retry interval',
          default: 10000,
        },
        groupCount: {
          type: 'number',
          title: 'Group count',
          default: 6,
        },
        subscribedTo: {
          type: 'array',
          title: 'Subscribed To',
          items: { type: 'string' },
        },
      },
    },
  },
}
