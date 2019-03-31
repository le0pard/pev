import React from 'react'
import PlansView from 'containers/plansView'
import ExplainForm from 'containers/explainForm'

import './main-generator.sass'

export default class MainGenerator extends React.Component {
  render() {
    return (
      <div className="main-generator">
        <div className="main-generator-form-wrapper">
          <div>
            For best results, use <pre><code>EXPLAIN (ANALYZE, COSTS, VERBOSE, BUFFERS, FORMAT JSON)</code></pre>
            Psql users can export the plan to a file using <pre><code>psql -qAt -f explain.sql > analyze.json</code></pre>
          </div>
          <ExplainForm />
        </div>
        <div className="main-generator-results-wrapper">
          <PlansView />
        </div>
      </div>
    )
  }
}
