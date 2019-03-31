import React from 'react'
import PropTypes from 'prop-types'

export default class ErrorView extends React.Component {
  static propTypes = {
    message: PropTypes.string.isRequired
  }

  render() {
    const {message} = this.props

    return (
      <div>
        {message}
      </div>
    )
  }
}
