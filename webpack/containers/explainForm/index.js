import {reduxForm} from 'redux-form'
import {connect} from 'react-redux'
import ExplainForm from 'components/explainForm'
import {requestAddPlan} from 'reducers/plans'
import {validate} from './validation'

const mapDispatchToProps = (dispatch) => ({
  onSubmitForm: (values) => dispatch(requestAddPlan({
    ...values,
    content: JSON.parse(values.content)
  }))
})

export default connect(
  null,
  mapDispatchToProps
)(reduxForm({
  form: 'explainForm',
  validate
})(ExplainForm))
