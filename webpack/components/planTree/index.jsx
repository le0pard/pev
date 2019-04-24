import React from 'react'
import PropTypes from 'prop-types'
import Spinner from 'components/spinner'
import ErrorView from 'components/errorView'

import './plan-tree.sass'

export default class PlanTree extends React.Component {
  static propTypes = {
    planID: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object
  }

  render() {
    const {loading, error, planID} = this.props

    if (loading) {
      return (<Spinner />)
    }

    if (error) {
      return (<ErrorView message={error.toString()} />)
    }

    return (
      <div>
        <div className="plan-tree-container">
          <ul>
            <li>
              <div className="plan-tree-node">
                Plan ID: {planID}
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
