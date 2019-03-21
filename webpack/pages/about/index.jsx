import React from 'react'

import './about.sass'

export default class AboutPage extends React.Component {
  render() {
    return (
      <div className="about-page">
        <p>
          <strong>PostgreSQL EXPLAIN Visualizer (PEV)</strong> is designed to make EXPLAIN output easier to grok
        </p>
        <h3>Useful links</h3>
        <ul>
          <li><a href="https://github.com/le0pard/pev">Source code</a></li>
          <li><a href="http://postgresql.leopard.in.ua/">Free PostgreSQL book (Russian language)</a></li>
          <li><a href="http://leopard.in.ua/">My blog</a></li>
        </ul>
      </div>
    )
  }
}
