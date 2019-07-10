import React from 'react'
import PropTypes from 'prop-types'
import {
  NODE_TYPE_PROP
} from 'lib/planParser'

export default class PlanTreeNode extends React.Component {
  static propTypes = {
    node: PropTypes.object.isRequired
  }

  render() {
    const {node} = this.props

    return (
      <div className="plan-tree-node">
        {node[NODE_TYPE_PROP]}
      </div>
    )
  }
}
