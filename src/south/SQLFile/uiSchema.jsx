import React from 'react'

const uiSchema = {
  dataSourceId: {
    'ui:help': '',
    'ui:readonly': true,
  },
  enabled: { 'ui:help': <div>If enabled, equipment will be enabled</div> },
  protocol: { 'ui:help': '' },
  driver: { 'ui:help': '' },
  host: { 'ui:help': '' },
  port: { 'ui:help': '' },
  username: { 'ui:help': '' },
  password: {
    'ui:help': '',
    'ui:widget': 'password',
  },
  database: { 'ui:help': '' },
  query: { 'ui:help': '' },
  connectionTimeout: { 'ui:help': '' },
  requestTimeout: { 'ui:help': '' },
  delimiter: { 'ui:help': '' },
  scanMode: { 'ui:help': <div>List of the scan modes defined by the user</div> },
}

export default uiSchema
