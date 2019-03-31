import {connect} from 'react-redux'
import PlansView from 'components/plansView'
import {requestPlansList} from 'reducers/plans'

const mapStateToProps = (state) => ({
  loading: state.plans.listLoading,
  error: state.plans.listError,
  plans: state.plans.listItems
})

const mapDispatchToProps = (dispatch) => ({
  requestPlansList: () => dispatch(requestPlansList())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlansView)
