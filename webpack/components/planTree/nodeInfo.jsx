import React from 'react'
import PropTypes from 'prop-types'
import _round from 'lodash/round'
import {
  ACTUAL_DURATION_PROP,
  NODE_TYPE_PROP,
  ACTUAL_LOOPS_PROP,
  ACTUAL_TOTAL_TIME_PROP,
  EXECUTION_TIME_PROP,
  TOTAL_COST_PROP,
  ACTUAL_COST_PROP,
  MAXIMUM_DURATION_PROP,
  RELATION_NAME_PROP,
  SCHEMA_PROP,
  ALIAS_PROP,
  GROUP_KEY_PROP,
  SORT_KEY_PROP,
  JOIN_TYPE_PROP,
  INDEX_NAME_PROP,
  HASH_CONDITION_PROP,
  CTE_NAME_PROP,
  SLOWEST_NODE_PROP,
  COSTLIEST_NODE_PROP,
  LARGEST_NODE_PROP,
  PLANNER_ESTIMATE_DIRECTION_PROP,
  PLANNER_ESTIMATE_FACTOR_PROP,
  ESTIMATE_DIRECTION_OVER,
  ESTIMATE_DIRECTION_UNDER
} from 'lib/planParser'

export default class PlanTreeNodeInfo extends React.Component {
  static propTypes = {
    plan: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired
  }

  render() {
    const {plan, node} = this.props

    const executionTime = plan.Plan[EXECUTION_TIME_PROP] || plan.Plan[ACTUAL_TOTAL_TIME_PROP]
    const executionTimePercent = _round((node[ACTUAL_DURATION_PROP] / executionTime) * 100)
    const durationPersentage = _round(node[ACTUAL_DURATION_PROP] / plan[MAXIMUM_DURATION_PROP] * 100)

    return (
      <div className="plan-node-info-container">
        <p>{node[NODE_TYPE_PROP]}</p>
        {
          node[ACTUAL_DURATION_PROP] &&
          <p>Duration: {node[ACTUAL_DURATION_PROP]}</p>
        }
        {
          executionTimePercent &&
          <p>Percentage: {executionTimePercent}</p>
        }
        {
          durationPersentage &&
          <p>Duration Percentage: {durationPersentage}</p>
        }
      </div>
    )
  }
}
