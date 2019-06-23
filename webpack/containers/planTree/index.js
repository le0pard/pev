import {connect} from 'react-redux'
import PlanTree from 'components/planTree'
import {requestPlan, resetPlan} from 'reducers/plans'

const mapStateToProps = (state) => ({
  loading: state.plans.planLoading,
  error: state.plans.planError,
  plan: state.plans.plan
})

const mapDispatchToProps = (dispatch) => ({
  requestPlan: (data) => dispatch(requestPlan(data)),
  resetPlan: () => dispatch(resetPlan())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlanTree)
