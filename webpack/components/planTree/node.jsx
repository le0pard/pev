import React from 'react'
import PropTypes from 'prop-types'
import {
  ACTUAL_DURATION_PROP,
  NODE_TYPE_PROP,
  EXECUTION_TIME_PROP,
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
  LARGEST_NODE_PROP
} from 'lib/planParser'
import _round from 'lodash/round'

export default class PlanTreeNode extends React.Component {
  static propTypes = {
    plan: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired
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
    const {plan, node} = this.props
    const durationInPercentage = _round(node[ACTUAL_DURATION_PROP] / plan[EXECUTION_TIME_PROP] * 100)

    return (
      <div className="plan-tree-node">
        <p>{node[NODE_TYPE_PROP]}</p>
        <p>Duration: {durationInPercentage}%</p>
        <p>Duration: {_round(node[ACTUAL_DURATION_PROP], 2)}ms</p>
        <div>
          {this.renderRelation(node)}
        </div>
        {node[SLOWEST_NODE_PROP] && <div>SLOWEST</div>}
        {node[COSTLIEST_NODE_PROP] && <div>COSTLIEST</div>}
        {node[LARGEST_NODE_PROP] && <div>LARGEST</div>}
      </div>
    )
  }
}
