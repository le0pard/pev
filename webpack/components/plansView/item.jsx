import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import _padStart from 'lodash/padStart'

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
      return [
        createdAt.getFullYear(),
        '-',
        _padStart(createdAt.getMonth() + 1, 2, '0'),
        '-',
        _padStart(createdAt.getDate(), 2, '0'),
        ' ',
        _padStart(createdAt.getHours(), 2, '0'),
        ':',
        _padStart(createdAt.getMinutes(), 2, '0'),
        ':',
        _padStart(createdAt.getSeconds(), 2, '0')
      ].join('')
    }
  }

  render() {
    const {id} = this.props

    return (
      <li>
        <Link to={`/plan/${id}`}>
          {this.getTitle()}
        </Link>
      </li>
    )
  }
}
