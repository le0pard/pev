import React from 'react'
import PropTypes from 'prop-types'
import {
  MAXIMUM_DURATION_PROP,
  MAXIMUM_ROWS_PROP,
  MAXIMUM_COSTS_PROP
} from 'lib/planParser'

const EXECUTION_TIME_PROP = 'Execution Time'
const PLANNING_TIME_PROP = 'Planning Time'

export default class PlanTreeInfo extends React.Component {
  static propTypes = {
    plan: PropTypes.object.isRequired
  }

  render() {
    const {plan} = this.props

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
}
