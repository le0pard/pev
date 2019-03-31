import React from 'react'
import PropTypes from 'prop-types'
import Spinner from 'components/spinner'

export default class PlansView extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    plans: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired
    })),
    requestPlansList: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.requestPlansList()
  }

  render() {
    const {loading, plans} = this.props

    if (loading) {
      return (
        <Spinner />
      )
    }

    return (
      <div>
        <ul>
          {plans && plans.map((plan) => (
            <li key={plan.id}>{plan.id}</li>
          ))}
        </ul>
      </div>
    )
  }
}
