import React from 'react'
import PropTypes from 'prop-types'
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

    return (
      <div>
        <div className="plan-tree-container">
          <ul>
            <li>
              <div className="plan-tree-node">
                Plan ID: {plan.id}
              </div>
              <ul>
                <li>
                  <div className="plan-tree-node">Child</div>
                  <ul>
                    <li><div className="plan-tree-node">Grand Child</div></li>
                    <li><div className="plan-tree-node">Grand Child</div></li>
                    <li>
                      <div className="plan-tree-node">Grand Child</div>
                      <ul>
                        <li><div className="plan-tree-node">Great Grand Child</div></li>
                        <li><div className="plan-tree-node">Great Grand Child</div></li>
                        <li>
                          <div className="plan-tree-node">Grand Child</div>
                          <ul>
                            <li>
                              <div className="plan-tree-node">Grand Child</div>
                              <ul>
                                <li>
                                  <div className="plan-tree-node">Grand Child</div>
                                  <ul>
                                    <li><div className="plan-tree-node">Great Grand Child</div></li>
                                    <li><div className="plan-tree-node">Great Grand Child</div></li>
                                  </ul>
                                </li>
                                <li><div className="plan-tree-node">Great Grand Child</div></li>
                                <li><div className="plan-tree-node">Great Grand Child</div></li>
                              </ul>
                            </li>
                            <li><div className="plan-tree-node">Great Grand Child</div></li>
                            <li><div className="plan-tree-node">Great Grand Child</div></li>
                            <li>
                              <div className="plan-tree-node">Grand Child</div>
                              <ul>
                                <li><div className="plan-tree-node">Great Grand Child</div></li>
                                <li><div className="plan-tree-node">Great Grand Child</div></li>
                              </ul>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  <div className="plan-tree-node">Child</div>
                  <ul>
                    <li><div className="plan-tree-node">Grand Child</div></li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}
