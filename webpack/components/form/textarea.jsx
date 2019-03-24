import React from 'react'
import PropTypes from 'prop-types'
import _camelCase from 'lodash/camelCase'
import Tooltip from './tooltip'

import './textarea.sass'

export default class FormTextarea extends React.Component {
  static propTypes = {
    input: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    tooltip: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
      PropTypes.string
    ]).isRequired,
    textareaProps: PropTypes.object,
    meta: PropTypes.shape({
      touched: PropTypes.bool.isRequired,
      error: PropTypes.string
    }).isRequired
  }

  static defaultProps = {
    textareaProps: {}
  }

  render() {
    const {
      label,
      input,
      tooltip,
      textareaProps,
      meta: {touched, error}
    } = this.props

    const textareaID = _camelCase(`${input.name}-id`)
    const isError = touched && error

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
            {...input}
            {...textareaProps}
            className="form-textarea-wrapper__input"
            aria-label={label}
            aria-describedby={`tooltip${textareaID}Content`}
            id={textareaID} />
          {isError && <div className="form-textarea-error">{error}</div>}
        </div>
      </div>
    )
  }
}
