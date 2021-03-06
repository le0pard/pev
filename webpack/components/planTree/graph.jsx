import React from 'react'
import PropTypes from 'prop-types'
import _round from 'lodash/round'
import PlanTreeNode from './node'
import {
  PLANS_PROP
} from 'lib/planParser'

export default class PlanTreeGraph extends React.Component {
  static propTypes = {
    plan: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.renderNode = this.renderNode.bind(this)
  }

  renderNode(plan, node, selectedNode, showPlanNodeInfo, index = 0) {
    return (
      <li key={index}>
        <PlanTreeNode
          plan={plan}
          node={node}
          isSeleted={!!selectedNode && selectedNode === node}
          onClick={() => showPlanNodeInfo(node)}
        />
        {
          node[PLANS_PROP] &&
          Array.isArray(node[PLANS_PROP]) &&
          node[PLANS_PROP].length &&
          <ul>
            {node[PLANS_PROP].map((n, i) => this.renderNode(plan, n, selectedNode, showPlanNodeInfo, i))}
          </ul>
        }
      </li>
    )
  }

  render() {
    const {plan, node, selectedNode, showPlanNodeInfo} = this.props

    return (
      <ul>
        {this.renderNode(plan, node, selectedNode, showPlanNodeInfo)}
      </ul>
    )
  }
}
