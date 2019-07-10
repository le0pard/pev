import React from 'react'
import PropTypes from 'prop-types'
import {
  PlanParser,
  NODE_TYPE_PROP,
  MAXIMUM_DURATION_PROP,
  MAXIMUM_ROWS_PROP,
  MAXIMUM_COSTS_PROP
} from 'lib/planParser'
import Spinner from 'components/spinner'
import ErrorView from 'components/errorView'

import './plan-tree.sass'

const EXECUTION_TIME_PROP = 'Execution Time'
const PLANNING_TIME_PROP = 'Planning Time'

export default class PlanTree extends React.Component {
  static propTypes = {
    planID: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    plan: PropTypes.object,
    requestPlan: PropTypes.func.isRequired,
    resetPlan: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.renderNode = this.renderNode.bind(this)
    this.renderNodeInfo = this.renderNodeInfo.bind(this)
    this.renderPlanInfo = this.renderPlanInfo.bind(this)
  }

  componentDidMount() {
    const {planID} = this.props
    const id = parseInt(planID, 10)
    if (!isNaN(id)) {
      this.props.requestPlan({id})
    }
  }

  componentWillUnmount() {
    this.props.resetPlan()
  }

  renderPlanInfo(plan) {
    return (
      <div className="plan-stats">
        <div>
          <span className="stat-value">{plan[EXECUTION_TIME_PROP]}</span>
          <span className="stat-label">execution time (ms)</span>
        </div>
        <div>
          <span className="stat-value">{plan[PLANNING_TIME_PROP]}</span>
          <span className="stat-label">planning time (ms)</span>
        </div>
        <div>
          <span className="stat-value">{plan[MAXIMUM_DURATION_PROP]}</span>
          <span className="stat-label">slowest node (ms)</span>
        </div>
        <div>
          <span className="stat-value">{plan[MAXIMUM_ROWS_PROP]}</span>
          <span className="stat-label">largest node (rows)</span>
        </div>
        <div>
          <span className="stat-value">{plan[MAXIMUM_COSTS_PROP]}</span>
          <span className="stat-label">costliest node</span>
        </div>
      </div>
    )
  }

  renderNodeInfo(node) {
    return (
      <div className="plan-tree-node">
        {node[NODE_TYPE_PROP]}
      </div>
    )
  }

  renderNode(node, index = 0) {
    return (
      <li key={index}>
        {this.renderNodeInfo(node)}
        {
          node.Plans &&
          Array.isArray(node.Plans) &&
          node.Plans.length &&
          <ul>
            {node.Plans.map(this.renderNode)}
          </ul>
        }
      </li>
    )
  }

  render() {
    const {loading, error, plan, planID} = this.props

    if (loading) {
      return (<Spinner />)
    }

    if (error) {
      return (<ErrorView message={error.message} />)
    }

    if (isNaN(parseInt(planID, 10))) {
      return (<ErrorView message="Invalid plan ID" />)
    }

    if (!plan) {
      return null
    }

    const planJSON = PlanParser.parse(plan.content)

    return (
      <div>
        {this.renderPlanInfo(planJSON)}
        <div className="plan-tree-container">
          <ul>
            {this.renderNode(planJSON.Plan)}
          </ul>
        </div>
      </div>
    )
  }
}
