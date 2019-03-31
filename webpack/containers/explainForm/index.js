import {reduxForm} from 'redux-form'
import {connect} from 'react-redux'
import ExplainForm from 'components/explainForm'
import {validate} from './validation'
import {database} from 'database'

const mapDispatchToProps = (dispatch) => ({
  onSubmitForm: (values) => {
    //dispatch(submitConfiguration(values))
    console.log(database)
  }
})

export default connect(
  null,
  mapDispatchToProps
)(reduxForm({
  form: 'explainForm',
  validate
})(ExplainForm))
