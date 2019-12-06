import React from 'react'
import PropTypes from 'prop-types'
import _round from 'lodash/round'
import _flattenDeep from 'lodash/flattenDeep'
import _throttle from 'lodash/throttle'
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

    this.recalculateFlamegraphWidth = _throttle(this.recalculateFlamegraphWidth.bind(this), 400)
  }

  recalculateFlamegraphWidth() {
    if (this.fgObject && this.myFlamegraphEl.current) {
      this.fgObject.width(this.flamegraphWidth()).update(this.flamegraphData())
    }
  }

  flamegraphData() {
    const {plan, node} = this.props
    return convertNodeToFlamegraph(plan, node)
  }

  flamegraphWidth() {
    if (this.myFlamegraphEl.current && this.myFlamegraphEl.current.offsetWidth) {
      const flamegraphWidth = this.myFlamegraphEl.current.offsetWidth - 10
      if (flamegraphWidth >= 600) {
        return flamegraphWidth
      }
    }

    return 960
  }

  componentDidMount() {
    const {selectedNode, showPlanNodeInfo} = this.props

    this.fgObject = flamegraph()
      .width(this.flamegraphWidth())
      .cellHeight(25)
      .transitionDuration(750)
      .minFrameSize(4)
      .transitionEase(easeCubic)
      .differential(false)
      .selfValue(true)
      .onClick((d) => showPlanNodeInfo(d.data.node))
    const fgElement = select(this.myFlamegraphEl.current)
      .datum(this.flamegraphData())
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

    window.addEventListener('resize', this.recalculateFlamegraphWidth)
  }

  componentDidUpdate(prevProps) {
    const {selectedNode, showPlanNodeInfo} = this.props

    if (!!prevProps.selectedNode && !selectedNode && this.fgObject) {
      this.fgObject.onClick(() => {}) // resetZoom will click on root
      this.fgObject.resetZoom()
      this.fgObject.clear()
      this.fgObject.onClick((d) => showPlanNodeInfo(d.data.node))
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.recalculateFlamegraphWidth)

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
