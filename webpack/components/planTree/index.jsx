import React from 'react'
import PropTypes from 'prop-types'
import ScrollContainer from 'react-indiana-drag-scroll'
import dayjs from 'dayjs'
import {PlanParser} from 'lib/planParser'
import PlanTreeInfo from './info'
import PlanTreeNode from './node'
import PlanTreeNodeInfo from './nodeInfo'
import Spinner from 'components/spinner'
import ErrorView from 'components/errorView'

import './plan-tree.sass'

export default class PlanTree extends React.Component {
  static propTypes = {
    planID: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    plan: PropTypes.object,
    selectedNode: PropTypes.object,
    requestPlan: PropTypes.func.isRequired,
    showPlanNodeInfo: PropTypes.func.isRequired,
    resetPlan: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.renderNode = this.renderNode.bind(this)
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
          node.Plans &&
          Array.isArray(node.Plans) &&
          node.Plans.length &&
          <ul>
            {node.Plans.map((n, i) => this.renderNode(plan, n, selectedNode, showPlanNodeInfo, i))}
          </ul>
        }
      </li>
    )
  }

  getTitle(plan) {
    if (plan.name && plan.name.length) {
      return plan.name
    } else {
      return dayjs(plan.createdAt).format('YYYY-MM-DD HH:mm:ss')
    }
  }

  render() {
    const {
      loading,
      error,
      plan,
      planID,
      selectedNode,
      showPlanNodeInfo
    } = this.props

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

    const planParser = new PlanParser()
    const planJSON = planParser.parse(plan.content)

    return (
      <div className="plan-tree-wrapper">
        <div className="plan-tree-info">
          <h2>{this.getTitle(plan)}</h2>
          <PlanTreeInfo plan={planJSON} />
        </div>
        <div className="plan-tree-settings">
          Settings
        </div>
        <ScrollContainer className="plan-tree-container plan-tree-drag-cursor">
          <ul>
            {this.renderNode(planJSON, planJSON.Plan, selectedNode, showPlanNodeInfo)}
          </ul>
        </ScrollContainer>
        <div className="plan-tree-sidebar">
          {selectedNode && <PlanTreeNodeInfo plan={planJSON} node={selectedNode} />}
        </div>
      </div>
    )
  }
}
