import React from 'react'
import PropTypes from 'prop-types'
import _round from 'lodash/round'
import {
  MAXIMUM_DURATION_PROP,
  MAXIMUM_ROWS_PROP,
  MAXIMUM_COSTS_PROP,
  EXECUTION_TIME_PROP,
  PLANNING_TIME_PROP
} from 'lib/planParser'

export default class PlanTreeInfo extends React.Component {
  static propTypes = {
    plan: PropTypes.object.isRequired
  }

  calculateNumberValue(val) {
    if (val) {
      return _round(val, 2)
    }

    return 'None'
  }

  render() {
    const {plan} = this.props

    return (
      <div className="plan-stats">
        <div>
          <span className="stat-value">{this.calculateNumberValue(plan[EXECUTION_TIME_PROP])}</span>
          <span className="stat-label">execution time (ms)</span>
        </div>
        <div>
          <span className="stat-value">{this.calculateNumberValue(plan[PLANNING_TIME_PROP])}</span>
          <span className="stat-label">planning time (ms)</span>
        </div>
        <div>
          <span className="stat-value">{this.calculateNumberValue(plan[MAXIMUM_DURATION_PROP])}</span>
          <span className="stat-label">slowest node (ms)</span>
        </div>
        <div>
          <span className="stat-value">{this.calculateNumberValue(plan[MAXIMUM_ROWS_PROP])}</span>
          <span className="stat-label">largest node (rows)</span>
        </div>
        <div>
          <span className="stat-value">{this.calculateNumberValue(plan[MAXIMUM_COSTS_PROP])}</span>
          <span className="stat-label">costliest node</span>
        </div>
      </div>
    )
  }
}
