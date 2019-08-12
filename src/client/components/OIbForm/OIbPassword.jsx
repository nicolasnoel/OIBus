import React from 'react'
import PropTypes from 'prop-types'
import { FormGroup, FormFeedback, FormText, Label, Input } from 'reactstrap'

const OIbPassword = ({ label, help, value, name, onChange, valid, defaultValue }) => {
  /** @todo:  ask for a second password? */
  React.useLayoutEffect(() => {
    if (!value) onChange(name, defaultValue)
  }, [value])
  const handleChange = (event) => {
    const { target } = event
    const { value: newVal } = target
    onChange(name, newVal, valid(newVal))
  }
  const validCheck = valid(value)
  // if value is null, no need to render
  if (value === null) return null
  return (
    <FormGroup>
      {label && <Label for={name}>{label}</Label>}
      <Input className="oi-form-input" type="password" id={name} name={name} invalid={validCheck !== null} onChange={handleChange} value={value} />
      <FormFeedback>{validCheck}</FormFeedback>
      {help && <FormText>{help}</FormText>}
    </FormGroup>
  )
}
OIbPassword.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  help: PropTypes.element,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  valid: PropTypes.func,
}

OIbPassword.defaultProps = { valid: () => null, label: null, help: null, value: null, defaultValue: '' }

export default OIbPassword
