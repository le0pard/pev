import React from 'react'
import PropTypes from 'prop-types'
import _camelCase from 'lodash/camelCase'
import Tooltip from './tooltip'

import './textarea.sass'

export default class FormTextarea extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    tooltip: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
      PropTypes.string
    ]).isRequired,
    field: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.any
    }).isRequired,
    form: PropTypes.shape({
      touched: PropTypes.object,
      errors: PropTypes.object
    }).isRequired
  }

  render() {
    const {
      label,
      tooltip,
      field,
      form: {
        touched,
        errors
      },
      ...props
    } = this.props

    const textareaID = _camelCase(`${field.name}-id`)
    const isError = touched[field.name] && errors[field.name]

    return (
      <div className="form-textarea">
        <label className="form-textarea-label" htmlFor={textareaID}>
          {label}
        </label>
        <Tooltip
          id={`tooltip${textareaID}`}
          label="what is this?"
          text={tooltip}
          className="form-textarea-tooltip" />
        <div className="form-textarea-wrapper">
          <textarea
            {...field}
            {...props}
            className="form-textarea-wrapper__input"
            aria-label={label}
            aria-describedby={`tooltip${textareaID}Content`}
            id={textareaID} />
          {isError && <div className="form-textarea-error">{errors[field.name]}</div>}
        </div>
      </div>
    )
  }
}
