import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'reactstrap'
import { OIbText, OIbPassword } from '../../client/components/OIbForm'
import validation from './TimescaleDB.validation'

const TimescaleDBForm = ({ application, onChange }) => (
  <>
    <Row>
      <Col md="4">
        <OIbText
          label="User name"
          onChange={onChange}
          value={application.TimescaleDB.user}
          valid={validation.TimescaleDB.user}
          name="TimescaleDB.user"
          help={<div />}
        />
      </Col>
      <Col md="4">
        <OIbPassword
          label="Password"
          onChange={onChange}
          value={application.TimescaleDB.password}
          valid={validation.TimescaleDB.password}
          name="TimescaleDB.password"
          help={<div />}
        />
      </Col>
    </Row>
    <Row>
      <Col md="4">
        <OIbText
          label="Database"
          onChange={onChange}
          value={application.TimescaleDB.db}
          valid={validation.TimescaleDB.db}
          name="TimescaleDB.db"
          help={<div />}
        />
      </Col>
      <Col md="4">
        <OIbText
          label="Host"
          onChange={onChange}
          value={application.TimescaleDB.host}
          valid={validation.TimescaleDB.host}
          name="TimescaleDB.host"
          help={<div />}
        />
      </Col>
    </Row>
  </>
)
TimescaleDBForm.propTypes = { application: PropTypes.object.isRequired, onChange: PropTypes.func.isRequired }

export default TimescaleDBForm
