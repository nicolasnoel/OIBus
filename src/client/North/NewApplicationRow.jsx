import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Col, Row } from 'reactstrap'
import { OIbText, OIbSelect } from '../components/OIbForm/index.js'

const NewApplicationRow = ({ apiList, addApplication }) => {
  const [applicationId, setApplicationId] = React.useState('')
  const [api, setApi] = React.useState(apiList[0])
  /**
   * Updates the application's state
   * @param {*} event The change event
   * @returns {void}
   */
  const handleAddApplication = () => {
    //  update the new application's state
    if (applicationId === '') return
    addApplication({ applicationId, api })
  }

  const handleChange = (name, value) => {
    switch (name) {
      case 'applicationId':
        setApplicationId(value)
        break
      case 'api':
      default:
        setApi(value)
        break
    }
  }

  return (
    <Form>
      <Row>
        <Col md="5">
          <OIbText
            label="New Application ID"
            value={applicationId}
            name="applicationId"
            onChange={handleChange}
          />
        </Col>
        <Col md="3">
          <OIbSelect label="API" option={api} name="api" options={apiList} onChange={handleChange} />
        </Col>
        <Col md="3">
          <Button color="primary" onClick={() => handleAddApplication()}>
            Add
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

NewApplicationRow.propTypes = {
  apiList: PropTypes.arrayOf(PropTypes.string).isRequired,
  addApplication: PropTypes.func.isRequired,
}
export default NewApplicationRow
