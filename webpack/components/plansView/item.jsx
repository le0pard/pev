import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import dayjs from 'dayjs'

export default class PlansViewItem extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    createdAt: PropTypes.instanceOf(Date)
  }

  getTitle() {
    const {name, createdAt} = this.props
    if (name && name.length) {
      return name
    } else {
      return dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')
    }
  }

  render() {
    const {id} = this.props

    return (
      <li>
        <Link to={`/plans/${id}`}>
          {this.getTitle()}
        </Link>
      </li>
    )
  }
}
