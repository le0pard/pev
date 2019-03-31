import {reduxForm} from 'redux-form'
import {connect} from 'react-redux'
import ExplainForm from 'components/explainForm'
import {requestAddPlan} from 'reducers/plans'
import {validate} from './validation'
import {withRouter} from 'react-router'

const mapDispatchToProps = (dispatch) => ({
  onSubmitForm: (values) => {
    return new Promise((resolve, reject) => {
      dispatch(requestAddPlan({
        values: {
          ...values,
          content: JSON.parse(values.content)
        },
        resolve,
        reject
      }))
    })
  }
})

export default connect(
  null,
  mapDispatchToProps
)(reduxForm({
  form: 'explainForm',
  validate
})(withRouter(
  ExplainForm
)))
