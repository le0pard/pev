import React from 'react'
import PropTypes from 'prop-types'
import PlanTree from 'containers/planTree'

import './plan.sass'

export default class PlanPage extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        planID: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }

  render() {
    const {match: {params: {planID}}} = this.props

    return (
      <div className="plan-page">
        <PlanTree planID={planID} />
      </div>
    )
  }
}
