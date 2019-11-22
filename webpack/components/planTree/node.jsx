import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
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
import _omit from 'lodash/omit'
import _round from 'lodash/round'

export default class PlanTreeNode extends React.Component {
  static propTypes = {
    plan: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    isSeleted: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
  }

  stringifyValue(value) {
    return Array.isArray(value) ? value.join(', ') : value
  }

  renderRelation(node) {
    return (
      <React.Fragment>
        {
          node[RELATION_NAME_PROP] &&
          <div>
            <span>on </span>
            {node[SCHEMA_PROP] && <span>{this.stringifyValue(node[SCHEMA_PROP])}.</span>}
            {this.stringifyValue(node[RELATION_NAME_PROP])}
            {node[ALIAS_PROP] && <span> ({this.stringifyValue(node[ALIAS_PROP])})</span>}
          </div>
        }
        {
          node[GROUP_KEY_PROP] &&
          <div>
            <span>by </span>
            {this.stringifyValue(node[GROUP_KEY_PROP])}
          </div>
        }
        {
          node[SORT_KEY_PROP] &&
          <div>
            <span>by </span>
            {this.stringifyValue(node[SORT_KEY_PROP])}
          </div>
        }
        {
          node[JOIN_TYPE_PROP] &&
          <div>
            {this.stringifyValue(node[JOIN_TYPE_PROP])}
            <span> join</span>
          </div>
        }
        {
          node[INDEX_NAME_PROP] &&
          <div>
            <span>using </span>
            {this.stringifyValue(node[INDEX_NAME_PROP])}
          </div>
        }
        {
          node[HASH_CONDITION_PROP] &&
          <div>
            <span>on </span>
            {this.stringifyValue(node[HASH_CONDITION_PROP])}
          </div>
        }
        {
          node[CTE_NAME_PROP] &&
          <div>
            <span>CTE </span>
            {this.stringifyValue(node[CTE_NAME_PROP])}
          </div>
        }
      </React.Fragment>
    )
  }

  render() {
    const {plan, node, isSeleted, onClick} = this.props
    const executionTime = plan.Plan[EXECUTION_TIME_PROP] || plan.Plan[ACTUAL_TOTAL_TIME_PROP]
    const executionTimePercent = _round((node[ACTUAL_DURATION_PROP] / executionTime) * 100)
    const isNeverExecuted = plan.Plan[EXECUTION_TIME_PROP] && !node[ACTUAL_LOOPS_PROP]
    const durationPersentage = _round(node[ACTUAL_DURATION_PROP] / plan[MAXIMUM_DURATION_PROP] * 100)

    const planCost = plan.Plan[TOTAL_COST_PROP]
    const costPercent = _round((node[ACTUAL_COST_PROP] / planCost) * 100)

    const plannerRowEstimateDirection = node[PLANNER_ESTIMATE_DIRECTION_PROP]
    const plannerRowEstimateValue = node[PLANNER_ESTIMATE_FACTOR_PROP]

    return (
      <div className={classnames('plan-tree-node', {
        'plan-tree-node--selected': isSeleted
      })}>
        <p>
          <button onClick={onClick}>
            {node[NODE_TYPE_PROP]}
          </button>
        </p>
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
        {
          isNeverExecuted &&
          <p>Never Executed</p>
        }
        <div>
          {this.renderRelation(node)}
        </div>
        {
          node[ACTUAL_COST_PROP] &&
          <p>Cost: {node[ACTUAL_COST_PROP]} ({costPercent}%)</p>
        }
        {
          plannerRowEstimateDirection === ESTIMATE_DIRECTION_OVER &&
          <p>over estimated rows</p>
        }
        {
          plannerRowEstimateDirection === ESTIMATE_DIRECTION_UNDER &&
          <p>under estimated rows</p>
        }
        {
          plannerRowEstimateValue &&
          <p>by {plannerRowEstimateValue}</p>
        }
        {node[SLOWEST_NODE_PROP] && <div>SLOWEST</div>}
        {node[COSTLIEST_NODE_PROP] && <div>COSTLIEST</div>}
        {node[LARGEST_NODE_PROP] && <div>LARGEST</div>}
      </div>
    )
  }
}
