import React from 'react'
import Form from 'react-jsonschema-form-bs4'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import apis from '../client/services/apis'

const ConfigureNorth = ({ match, location }) => {
  const [configJson, setConfigJson] = React.useState()
  const [configSchema, setConfigSchema] = React.useState()

  const updateForm = (formData) => {
    setConfigJson(formData)
  }

  React.useEffect(() => {
    const { api } = match.params
    const { formData } = location

    apis.getNorthApiSchema(api).then((schema) => {
      setConfigSchema(schema)
      updateForm(formData)
    })
  }, [])

  const handleChange = (form) => {
    const { formData } = form

    updateForm(formData)
  }

  const handleSubmit = () => {}

  const log = type => console.info.bind(console, type)
  return (
    <>
      {configJson && configSchema && (
        <Form
          formData={configJson}
          liveValidate
          schema={configSchema}
          // uiSchema={ConfigureSouth.uiModbus}
          autocomplete="on"
          onChange={handleChange}
          onSubmit={handleSubmit}
          onError={log('errors')}
        />
      )}
      <pre>{configJson && JSON.stringify(configJson, ' ', 2)}</pre>
    </>
  )
}

ConfigureNorth.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}
export default withRouter(ConfigureNorth)
