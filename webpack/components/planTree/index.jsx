import React from 'react'
import PropTypes from 'prop-types'
import {
  PlanParser,
  NODE_TYPE_PROP
} from 'lib/planParser'
import Spinner from 'components/spinner'
import ErrorView from 'components/errorView'

import './plan-tree.sass'

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
        <div className="plan-tree-container">
          <ul>
            {this.renderNode(planJSON.Plan)}
          </ul>
        </div>
      </div>
    )
  }
}
