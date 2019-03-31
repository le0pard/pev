import {connect} from 'react-redux'
import PlansView from 'components/plansView'
import {requestPlansList} from 'reducers/plans'

const mapStateToProps = (state) => ({
  loading: state.plans.loading,
  error: state.plans.error,
  plans: state.plans.list
})

const mapDispatchToProps = (dispatch) => ({
  requestPlansList: () => dispatch(requestPlansList())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlansView)
