import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {Form, Field} from 'react-final-form'
import FormField from 'components/form/field'
import FormTextarea from 'components/form/textarea'
import {validate} from './validation'

import './explain-form.sass'

export default class ExplainForm extends React.Component {
  static propTypes = {
    onSubmitForm: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  }

  handleGenerateConfig(values) {
    return this.props.onSubmitForm(values).then((plan) => {
      this.props.history.push(`/plans/${plan.id}`)
    })
  }

  render() {
    return (
      <Form
        onSubmit={this.handleGenerateConfig.bind(this)}
        validate={validate}
        render={({handleSubmit, submitting}) => (
          <form onSubmit={handleSubmit}>
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
              tooltip={<span>JSON execution plan from<br />'EXPLAIN (ANALYZE, COSTS, VERBOSE, BUFFERS, FORMAT JSON) your-sql-query'</span>}
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
        )}
      />
    )
  }
}
