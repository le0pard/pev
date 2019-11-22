import {connect} from 'react-redux'
import PlanTree from 'components/planTree'
import {requestPlan, showPlanNodeInfo, resetPlan} from 'reducers/plans'

const mapStateToProps = (state) => ({
  loading: state.plans.planLoading,
  error: state.plans.planError,
  plan: state.plans.plan,
  selectedNode: state.plans.selectedNode
})

const mapDispatchToProps = (dispatch) => ({
  requestPlan: (data) => dispatch(requestPlan(data)),
  showPlanNodeInfo: (node) => dispatch(showPlanNodeInfo(node)),
  resetPlan: () => dispatch(resetPlan())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlanTree)
