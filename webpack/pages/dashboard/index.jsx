import React from 'react'
import MainGenerator from 'containers/mainGenerator'
import pevLogo from './pev.svg'

import './dashboard.sass'

export default class DashboardPage extends React.Component {
  render() {
    return (
      <div className="dashboard-page">
        <div className="dashboard-header-wrapper">
          <div className="dashboard-header-logo">
            <img alt="PEV"
              className="dashboard-header-logo__svg"
              src={pevLogo} />
          </div>
          <div className="dashboard-header-title">
            <h1 className="dashboard-header-title__text">
              PEV
            </h1>
          </div>
        </div>
        <MainGenerator />
      </div>
    )
  }
}
