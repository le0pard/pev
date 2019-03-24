import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {Field} from 'redux-form'
import FormField from 'components/form/field'
import FormTextarea from 'components/form/textarea'

import './explain-form.sass'

export default class ExplainForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    onSubmitForm: PropTypes.func.isRequired
  }

  handleGenerateConfig(values) {
    console.log(values)
    return this.props.onSubmitForm(values)
  }

  render() {
    const {handleSubmit, submitting} = this.props

    return (
      <form onSubmit={handleSubmit(this.handleGenerateConfig.bind(this))}>
        <Field
          name="name"
          type="text"
          component={FormField}
          inputProps={{
            autoComplete: 'off',
            autoCorrect: 'on',
            autoCapitalize: 'on',
            placeholder: 'Name (optional)'
          }}
          label="Name"
          tooltip="Name for your PEV"
        />
        <Field
          name="content"
          component={FormTextarea}
          textareaProps={{
            placeholder: 'Execution plan'
          }}
          label="Execution plan"
          tooltip="JSON execution plan"
        />
        <Field
          name="query"
          component={FormTextarea}
          textareaProps={{
            placeholder: 'SQL query (optional)'
          }}
          label="SQL query"
          tooltip="Visualized SQL query"
        />
        <div className="explain-form-btn-wrapper">
          <button className={classnames('explain-form-btn', {
            'explain-form-btn--disabled': submitting
          })} type="submit" disabled={submitting}>
            Visualize
          </button>
        </div>
      </form>
    )
  }
}
