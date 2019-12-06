import {connect} from 'react-redux'
import PlanTree from 'components/planTree'
import {requestPlan, showPlanNodeInfo, clearPlanNodeInfo, resetPlan} from 'reducers/plans'
import {changePlanView} from 'reducers/settings'

const mapStateToProps = (state) => ({
  loading: state.plans.planLoading,
  error: state.plans.planError,
  plan: state.plans.plan,
  selectedNode: state.plans.selectedNode,
  planView: state.settings.planView
})

const mapDispatchToProps = (dispatch) => ({
  requestPlan: (data) => dispatch(requestPlan(data)),
  showPlanNodeInfo: (node) => dispatch(showPlanNodeInfo(node)),
  clearPlanNodeInfo: () => dispatch(clearPlanNodeInfo()),
  changePlanView: (view) => dispatch(changePlanView(view)),
  resetPlan: () => dispatch(resetPlan())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlanTree)
