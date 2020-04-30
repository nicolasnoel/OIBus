import React from 'react'
import { notEmpty, hasLengthBetween } from '../../services/validation.service'

const schema = { name: 'MQTT' }
schema.form = {
  MqttSettings: {
    type: 'OIbTitle',
    children: (
      <div>
        <p>This protocol is in restricted release. Please contact Optimistik</p>
        <ul>
          <li>
            <b>Protocol:</b>
            Network protocol used by MQTT client to connect with MQTT broker. OIBus supports MQTT, and MQTTS.
          </li>
          <li>
            <b>Host and Port:</b>
            MQTT host to connect. Make sure you specify right host and port number depending on MQTT connection protocol
            you selected. MQTT client may not get connected if you mention wrong port number or interchange port
            numbers.
          </li>
          <li>
            <b>Username:</b>
            Username required by broker, if any. MQTT allows to send username for authenticating and authorization of
            client.
          </li>
          <li>
            <b>Password:</b>
            Password required by broker, if any. MQTT allows to send password for authenticating and authorization of
            client.
          </li>
        </ul>
      </div>
    ),
  },
  url: {
    type: 'OIbLink',
    protocols: ['mqtt', 'mqtts', 'tcp', 'tls', 'ws', 'wss'],
    defaultValue: '',
    help: <div>The URL of the MQTT server. The protocol should be one of mqtt, mqtts, tcp, tls, ws, wss</div>,
  },
  username: {
    type: 'OIbText',
    valid: notEmpty(),
    defaultValue: '',
    help: <div>authorized user</div>,
  },
  password: {
    type: 'OIbPassword',
    newRow: false,
    valid: hasLengthBetween(0, 256),
    defaultValue: '',
    help: <div>password</div>,
  },
  timeStampSettings: {
    type: 'OIbTitle',
    children: (
      <div>
        <p>These parameters describe how to determine the timeStamp</p>
        <ul>
          <li>
            <b>Time Origin:</b>
            If the value is &quot;oibus&quot; the timestamp will be the timestamp for the reception of the value by oibus.
            If the value is &quot;payload&quot; the timestamp will be retrieved from the MQTT payload using the key specified below.
          </li>
          <li>
            <b>TimeStamp Key:</b>
            The string indicates which key in the payload contains the value timestamp.
          </li>
        </ul>
      </div>
    ),
  },
  timeStampOrigin: {
    type: 'OIbSelect',
    options: ['payload', 'oibus'],
    defaultValue: 'oibus',
  },
  timeStampKey: {
    type: 'OIbText',
    newRow: false,
    valid: notEmpty(),
    defaultValue: 'timestamp',
  },
  timeStampFormat: {
    type: 'OIbText',
    newRow: false,
    valid: notEmpty(),
    defaultValue: 'YYYY-MM-DD HH:mm:ss.SSS',
  },
  timeStampTimezone: {
    type: 'OIbTimezone',
    newRow: false,
    md: 2,
  },
}

schema.points = {
  pointId: {
    type: 'OIbText',
    valid: notEmpty(),
    defaultValue: '',
  },
  scanMode: { type: 'OIbScanMode', label: 'Scan Mode' },
  topic: {
    type: 'OIbText',
    defaultValue: '',
    valid: notEmpty(),
  },
}

export default schema
