import React from 'react'
import PropTypes from 'prop-types'
import _round from 'lodash/round'
import _flattenDeep from 'lodash/flattenDeep'
import {select, easeCubic} from 'd3'
import {flamegraph} from 'd3-flame-graph'
import {
  PLANS_PROP,
  NODE_TYPE_PROP,
  ACTUAL_DURATION_PROP
} from 'lib/planParser'

const convertNodeToFlamegraph = (plan, node) => {
  let children = []

  if (node[PLANS_PROP] &&
    Array.isArray(node[PLANS_PROP]) &&
    node[PLANS_PROP].length) {
    children = node[PLANS_PROP].map((n) => convertNodeToFlamegraph(plan, n))
  }

  return {
    name: `${node[NODE_TYPE_PROP]}`,
    value: node[ACTUAL_DURATION_PROP],
    node,
    children
  }
}

export default class PlanTreeFlamegraph extends React.Component {
  static propTypes = {
    plan: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.myFlamegraphEl = React.createRef()
  }

  componentDidMount() {
    const {plan, node, selectedNode, showPlanNodeInfo} = this.props

    const schema = convertNodeToFlamegraph(plan, node)

    this.fgObject = flamegraph()
      .width(960)
      .cellHeight(18)
      .transitionDuration(750)
      .minFrameSize(5)
      .transitionEase(easeCubic)
      .differential(false)
      .selfValue(true)
      .onClick((d) => showPlanNodeInfo(d.data.node))
    const fgElement = select(this.myFlamegraphEl.current)
      .datum(schema)
      .call(this.fgObject)

    if (selectedNode) {
      const recurseLoop = (nodes) => {
        return (nodes || []).map((n) => [n, recurseLoop(n.children)])
      }
      const flattenNodes = _flattenDeep(recurseLoop([fgElement.datum()]))
      const selItem = flattenNodes.find((n) => n.data.node === selectedNode)

      if (selItem) {
        const id = this.fgObject.findById(selItem.id)

        if (id) {
          this.fgObject.zoomTo(selItem)
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.fgObject) {
      this.fgObject.clear()
      this.fgObject.destroy()
      this.fgObject = null
    }
  }

  render() {
    return (
      <div ref={this.myFlamegraphEl} />
    )
  }
}
