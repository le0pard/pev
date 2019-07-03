import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {Formik, Field, Form} from 'formik'
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

  handleGenerateConfig(values, {setSubmitting}) {
    return this.props.onSubmitForm(values).then((plan) => {
      this.props.history.push(`/plans/${plan.id}`)
    }).finally(() => setSubmitting(false))
  }

  render() {
    return (
      <Formik
        onSubmit={this.handleGenerateConfig.bind(this)}
        validate={validate}
        render={({isSubmitting}) => (
          <Form>
            <Field
              name="name"
              type="text"
              component={FormField}
              autoComplete="off"
              autoCorrect="on"
              autoCapitalize="on"
              placeholder="Name (optional)"
              label="Name"
              tooltip="Name for your PEV"
            />
            <Field
              name="content"
              component={FormTextarea}
              placeholder="Execution plan"
              label="Execution plan"
              tooltip={<span>JSON execution plan from<br />'EXPLAIN (ANALYZE, COSTS, VERBOSE, BUFFERS, FORMAT JSON) your-sql-query'</span>}
            />
            <Field
              name="query"
              component={FormTextarea}
              placeholder="SQL query (optional)"
              label="SQL query"
              tooltip="Visualized SQL query"
            />
            <div className="explain-form-btn-wrapper">
              <button className={classnames('explain-form-btn', {
                'explain-form-btn--disabled': isSubmitting
              })} type="submit" disabled={isSubmitting}>
                Visualize
              </button>
            </div>
          </Form>
        )}
      />
    )
  }
}
