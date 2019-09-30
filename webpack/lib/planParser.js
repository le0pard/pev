export const NODE_TYPE_PROP = 'Node Type'
export const ACTUAL_ROWS_PROP = 'Actual Rows'
export const PLAN_ROWS_PROP = 'Plan Rows'
export const ACTUAL_TOTAL_TIME_PROP = 'Actual Total Time'
export const ACTUAL_LOOPS_PROP = 'Actual Loops'
export const TOTAL_COST_PROP = 'Total Cost'
export const PLANS_PROP = 'Plans'
export const EXECUTION_TIME_PROP = 'Execution Time'
export const PLANNING_TIME_PROP = 'Planning Time'
export const RELATION_NAME_PROP = 'Relation Name'
export const SCHEMA_PROP = 'Schema'
export const ALIAS_PROP = 'Alias'
export const GROUP_KEY_PROP = 'Group Key'
export const SORT_KEY_PROP = 'Sort Key'
export const JOIN_TYPE_PROP = 'Join Type'
export const INDEX_NAME_PROP = 'Index Name'
export const HASH_CONDITION_PROP = 'Hash Cond'
export const CTE_SCAN_PROP = 'CTE Scan'
export const CTE_NAME_PROP = 'CTE Name'

// computed by pev
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
export const PLANNER_ESTIMATE_FACTOR = 'PLANNER_ESTIMATE_FACTOR'
export const PLANNER_ESIMATE_DIRECTION = 'PLANNER_ESIMATE_DIRECTION'

export const ARRAY_INDEX_KEY = 'arrayIndex'

export const PlanParser = {
  _maxRows: 0,
  _maxCost: 0,
  _maxDuration: 0,

  parse: (planJSON) => {
    PlanParser.initMaxValues()
    const planContent = (() => {
      if (Array.isArray(planJSON)) {
        return Object.assign({}, planJSON[0])
      }
      return Object.assign({}, planJSON)
    })()
    if (planContent.Plan) {
      PlanParser.processNode(planContent.Plan)

      planContent[MAXIMUM_ROWS_PROP] = PlanParser._maxRows
      planContent[MAXIMUM_COSTS_PROP] = PlanParser._maxCost
      planContent[MAXIMUM_DURATION_PROP] = PlanParser._maxDuration

      PlanParser.findOutlierNodes(planContent.Plan)
    }

    return planContent
  },

  initMaxValues: () => {
    PlanParser._maxRows = 0
    PlanParser._maxCost = 0
    PlanParser._maxDuration = 0
  },

  processNode: (node) => {
    PlanParser.calculatePlannerEstimate(node)
    PlanParser.calculateActuals(node)

    Object.keys(node).forEach((key) => {
      const value = node[key]
      PlanParser.calculateMaximums(key, value)
      if (key === PLANS_PROP && Array.isArray(value)) {
        value.forEach(PlanParser.processNode)
      }
    })
  },

  calculateMaximums: (key, value) => {
    if (key === ACTUAL_ROWS_PROP && PlanParser._maxRows < value) {
      PlanParser._maxRows = value
    }
    if (key === ACTUAL_COST_PROP && PlanParser._maxCost < value) {
      PlanParser._maxCost = value
    }
    if (key === ACTUAL_DURATION_PROP && PlanParser._maxDuration < value) {
      PlanParser._maxDuration = value
    }
  },

  // actual duration and actual cost are calculated by subtracting child values from the total
  calculateActuals: (node) => {
    node[ACTUAL_DURATION_PROP] = node[ACTUAL_TOTAL_TIME_PROP]
    node[ACTUAL_COST_PROP] = node[TOTAL_COST_PROP]

    if (node.Plans && Array.isArray(node.Plans)) {
      node.Plans.forEach((subPlan) => {
        // since CTE scan duration is already included in its subnodes, it should be be
        // subtracted from the duration of this node
        if (subPlan[NODE_TYPE_PROP] !== CTE_SCAN_PROP) {
          node[ACTUAL_DURATION_PROP] = node[ACTUAL_DURATION_PROP] - subPlan[ACTUAL_TOTAL_TIME_PROP]
          node[ACTUAL_COST_PROP] = node[ACTUAL_COST_PROP] - subPlan[TOTAL_COST_PROP]
        }
      })
    }

    if (node[ACTUAL_COST_PROP] < 0) {
      node[ACTUAL_COST_PROP] = 0
    }

    // since time is reported for an invidual loop, actual duration must be adjusted by number of loops
    node[ACTUAL_DURATION_PROP] = node[ACTUAL_DURATION_PROP] * node[ACTUAL_LOOPS_PROP]
  },

  findOutlierNodes: (node) => {
    node[SLOWEST_NODE_PROP] = false
    node[LARGEST_NODE_PROP] = false
    node[COSTLIEST_NODE_PROP] = false

    if (node[ACTUAL_COST_PROP] === PlanParser._maxCost) {
      node[COSTLIEST_NODE_PROP] = true
    }
    if (node[ACTUAL_ROWS_PROP] === PlanParser._maxRows) {
      node[LARGEST_NODE_PROP] = true
    }
    if (node[ACTUAL_DURATION_PROP] === PlanParser._maxDuration) {
      node[SLOWEST_NODE_PROP] = true
    }

    Object.keys(node).forEach((key) => {
      const value = node[key]
      if (key === PLANS_PROP && Array.isArray(value)) {
        value.forEach(PlanParser.findOutlierNodes)
      }
    })
  },

  // figure out order of magnitude by which the planner mis-estimated how many rows would be
  // invloved in this node
  calculatePlannerEstimate: (node) => {
    node[PLANNER_ESTIMATE_FACTOR] = node[ACTUAL_ROWS_PROP] / node[PLAN_ROWS_PROP]
    node[PLANNER_ESIMATE_DIRECTION] = ESTIMATE_DIRECTION_UNDER

    if (node[PLANNER_ESTIMATE_FACTOR] < 1) {
      node[PLANNER_ESIMATE_DIRECTION] = ESTIMATE_DIRECTION_OVER
      node[PLANNER_ESTIMATE_FACTOR] = node[PLAN_ROWS_PROP] / node[ACTUAL_ROWS_PROP]
    }
  }
}
