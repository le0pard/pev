import {reduxForm} from 'redux-form'
import {connect} from 'react-redux'
import ExplainForm from 'components/explainForm'
import {submitConfiguration} from 'reducers/configuration'
import {validate} from './validation'

const mapDispatchToProps = (dispatch) => ({
  onSubmitForm: (values) => dispatch(submitConfiguration(values))
})

export default connect(
  null,
  mapDispatchToProps
)(reduxForm({
  form: 'explainForm',
  validate
})(ExplainForm))
