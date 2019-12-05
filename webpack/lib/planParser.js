import _maxBy from 'lodash/maxBy'
import _flattenDeep from 'lodash/flattenDeep'

export const NODE_TYPE_PROP = 'Node Type'
export const ACTUAL_ROWS_PROP = 'Actual Rows'
export const PLAN_ROWS_PROP = 'Plan Rows'
export const ACTUAL_STARTUP_TIME_PRO = 'Actual Startup Time'
export const ACTUAL_TOTAL_TIME_PROP = 'Actual Total Time'
export const ACTUAL_LOOPS_PROP = 'Actual Loops'
export const STARTUP_COST_PROP = 'Startup Cost'
export const TOTAL_COST_PROP = 'Total Cost'
export const PLANS_PROP = 'Plans'
export const EXECUTION_TIME_PROP = 'Execution Time'
export const PLANNING_TIME_PROP = 'Planning Time'
export const RELATION_NAME_PROP = 'Relation Name'
export const SCHEMA_PROP = 'Schema'
export const ALIAS_PROP = 'Alias'
export const GROUP_KEY_PROP = 'Group Key'
export const SORT_KEY_PROP = 'Sort Key'
export const SORT_METHOD_PROP = 'Sort Method'
export const SORT_SPACE_TYPE_PROP = 'Sort Space Type'
export const SORT_SPACE_USED = 'Sort Space Used'
export const JOIN_TYPE_PROP = 'Join Type'
export const INDEX_NAME_PROP = 'Index Name'
export const HASH_CONDITION_PROP = 'Hash Cond'
export const PARENT_RELATIONSHIP_PROP = 'Parent Relationship'
export const SUBPLAN_NAME_PROP = 'Subplan Name'
export const PARALLEL_AWARE_PROP = 'Parallel Aware'
export const CTE_SCAN_PROP = 'CTE Scan'
export const CTE_NAME_PROP = 'CTE Name'
export const FUNCTION_NAME_PROP = 'Function Name'
export const WORKERS_PROP = 'Workers'
export const WORKERS_PLANNED_PROP = 'Workers Planned'
export const WORKERS_LAUNCHED_PROP = 'Workers Launched'

// computed by pev
export const ESTIMATE_DIRECTION_NONE = 'NONE'
export const ESTIMATE_DIRECTION_UNDER = 'UNDER'
export const ESTIMATE_DIRECTION_OVER = 'OVER'

export const COMPUTED_TAGS_PROP = 'COMPUTED_TAGS_PROP'

export const COSTLIEST_NODE_PROP = 'COSTLIEST_NODE_PROP'
export const LARGEST_NODE_PROP = 'LARGEST_NODE_PROP'
export const SLOWEST_NODE_PROP = 'SLOWEST_NODE_PROP'

export const MAXIMUM_COSTS_PROP = 'MAXIMUM_COSTS_PROP'
export const MAXIMUM_ROWS_PROP = 'MAXIMUM_ROWS_PROP'
export const MAXIMUM_DURATION_PROP = 'MAXIMUM_DURATION_PROP'
export const ACTUAL_DURATION_PROP = 'ACTUAL_DURATION_PROP'
export const ACTUAL_COST_PROP = 'ACTUAL_COST_PROP'
export const PLANNER_ESTIMATE_FACTOR_PROP = 'PLANNER_ESTIMATE_FACTOR_PROP'
export const PLANNER_ESTIMATE_DIRECTION_PROP = 'PLANNER_ESTIMATE_DIRECTION_PROP'

export const ARRAY_INDEX_KEY = 'arrayIndex'

export class PlanParser {
  constructor() {
    this.maxRows = 0
    this.maxCost = 0
    this.maxDuration = 0
  }

  parse(planJSON) {
    const planContent = (() => {
      if (Array.isArray(planJSON)) {
        return Object.assign({}, planJSON[0])
      }
      return Object.assign({}, planJSON)
    })()

    if (planContent.Plan) {
      this.processNode(planContent.Plan)
      this.calculateMaximums(planContent.Plan)

      planContent[MAXIMUM_ROWS_PROP] = this.maxRows
      planContent[MAXIMUM_COSTS_PROP] = this.maxCost
      planContent[MAXIMUM_DURATION_PROP] = this.maxDuration
    }

    return planContent
  }

  processNode(node) {
    this.calculatePlannerEstimate(node)

    if (node[PLANS_PROP] && Array.isArray(node[PLANS_PROP])) {
      node[PLANS_PROP].forEach((child) => {
        // All children of Gather node will be considered parallel
        // Pass the number of workers launched to children
        if (!child[WORKERS_PROP]) {
          let workersLaunched = null
          if (node[WORKERS_PLANNED_PROP]) {
            // Launched workers info may not be available (ie. no analyze)
            workersLaunched = node[WORKERS_LAUNCHED_PROP] || node[WORKERS_PLANNED_PROP]
          }
          child[WORKERS_PROP] = workersLaunched || node[WORKERS_PROP]
        }
        this.processNode(child)
      })
    }

    this.calculateActuals(node)
  }

  calculateMaximums(plan) {
    const recurseLoop = (nodes) => {
      return (nodes || []).map((node) => [node, recurseLoop(node[PLANS_PROP])])
    }
    const flattenNodes = _flattenDeep(recurseLoop([plan]))

    const largest = _maxBy(flattenNodes, ACTUAL_ROWS_PROP)
    if (largest) {
      largest[LARGEST_NODE_PROP] = true
      this.maxRows = largest[ACTUAL_ROWS_PROP]
    }

    const costliest = _maxBy(flattenNodes, ACTUAL_COST_PROP)
    if (costliest) {
      costliest[COSTLIEST_NODE_PROP] = true
      this.maxCost = costliest[ACTUAL_COST_PROP]
    }

    const slowest = _maxBy(flattenNodes, ACTUAL_DURATION_PROP)
    if (slowest) {
      slowest[SLOWEST_NODE_PROP] = true
      this.maxDuration = slowest[ACTUAL_DURATION_PROP]
    }
  }

  // actual duration and actual cost are calculated by subtracting child values from the total
  calculateActuals(node) {
    if (node.hasOwnProperty(ACTUAL_TOTAL_TIME_PROP)) {
      node[ACTUAL_DURATION_PROP] = node[ACTUAL_TOTAL_TIME_PROP]
      // since time is reported for an invidual loop, actual duration must be adjusted by number of loops
      // unless the current node is a child of a gather node
      if (!node[WORKERS_PROP]) {
        node[ACTUAL_DURATION_PROP] = node[ACTUAL_DURATION_PROP] * node[ACTUAL_LOOPS_PROP]
      }
      // since time is reported for an invidual loop, actual duration must be adjusted by number of loops
      node[ACTUAL_DURATION_PROP] = node[ACTUAL_DURATION_PROP] - this.childrenDuration(node, 0)
    }

    if (node.hasOwnProperty(TOTAL_COST_PROP)) {
      node[ACTUAL_COST_PROP] = node[TOTAL_COST_PROP]
    }

    if (node[PLANS_PROP] && Array.isArray(node[PLANS_PROP])) {
      node[PLANS_PROP].forEach((subPlan) => {
        if (subPlan[PARENT_RELATIONSHIP_PROP] !== 'InitPlan' && subPlan[TOTAL_COST_PROP]) {
          node[ACTUAL_COST_PROP] = node[ACTUAL_COST_PROP] - subPlan[TOTAL_COST_PROP]
        }
      })
    }

    if (node[ACTUAL_COST_PROP] < 0) {
      node[ACTUAL_COST_PROP] = 0
    }
  }

  childrenDuration(node, duration) {
    if (node[PLANS_PROP] && Array.isArray(node[PLANS_PROP])) {
      node[PLANS_PROP].forEach((subPlan) => {
        if (subPlan[PARENT_RELATIONSHIP_PROP] !== 'InitPlan') {
          duration += subPlan[ACTUAL_DURATION_PROP] || 0
          duration = this.childrenDuration(subPlan, duration)
        }
      })
    }
    return duration
  }

  // figure out order of magnitude by which the planner mis-estimated how many rows would be
  // invloved in this node
  calculatePlannerEstimate(node) {
    if (!node[ACTUAL_ROWS_PROP]) {
      return;
    }

    node[PLANNER_ESTIMATE_FACTOR_PROP] = node[ACTUAL_ROWS_PROP] / node[PLAN_ROWS_PROP]
    node[PLANNER_ESTIMATE_DIRECTION_PROP] = ESTIMATE_DIRECTION_NONE

    if (node[PLANNER_ESTIMATE_FACTOR_PROP] > 1) {
      node[PLANNER_ESTIMATE_DIRECTION_PROP] = ESTIMATE_DIRECTION_UNDER
    }

    if (node[PLANNER_ESTIMATE_FACTOR_PROP] < 1) {
      node[PLANNER_ESTIMATE_DIRECTION_PROP] = ESTIMATE_DIRECTION_OVER
      node[PLANNER_ESTIMATE_FACTOR_PROP] = node[PLAN_ROWS_PROP] / node[ACTUAL_ROWS_PROP]
    }
  }
}
