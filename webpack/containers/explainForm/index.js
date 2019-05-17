import {connect} from 'react-redux'
import ExplainForm from 'components/explainForm'
import {requestAddPlan} from 'reducers/plans'
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

export default withRouter(
connect(
  null,
  mapDispatchToProps
)(ExplainForm))
