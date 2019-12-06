import {combineReducers} from 'redux'
import {createAction, createReducer} from 'redux-act'

export const requestPlansList = createAction('Request plans list')
export const successPlansList = createAction('Success plans list')
export const errorPlansList = createAction('Errors plans list')

export const requestPlan = createAction('Request plan')
export const successPlan = createAction('Success plan')
export const errorPlan = createAction('Errors plan')
export const resetPlan = createAction('Reset plan')

export const showPlanNodeInfo = createAction('Show plan node info')
export const clearPlanNodeInfo = createAction('Clear plan node info')

export const requestAddPlan = createAction('Request add plan')
export const successAddPlan = createAction('Success add plan')
export const errorAddPlan = createAction('Errors add plan')

const listItems = createReducer({
  [requestPlansList]: () => null,
  [successPlansList]: (state, payload) => payload,
  [errorPlansList]: () => null,
  [successAddPlan]: (state, payload) => [payload].concat(state || [])
}, null)

const listError = createReducer({
  [requestPlansList]: () => null,
  [successPlansList]: () => null,
  [errorPlansList]: (state, payload) => payload
}, null)

const listLoading = createReducer({
  [requestPlansList]: () => true,
  [successPlansList]: () => false,
  [errorPlansList]: () => false
}, false)

const planLoading = createReducer({
  [requestPlan]: () => true,
  [successPlan]: () => false,
  [errorPlan]: () => false,
  [resetPlan]: () => false
}, false)

const plan = createReducer({
  [requestPlan]: () => null,
  [successPlan]: (state, payload) => payload,
  [errorPlan]: () => null,
  [resetPlan]: () => null
}, null)

const selectedNode = createReducer({
  [requestPlan]: () => null,
  [showPlanNodeInfo]: (state, payload) => payload,
  [clearPlanNodeInfo]: () => null,
  [resetPlan]: () => null
}, null)

const planError = createReducer({
  [requestPlan]: () => null,
  [successPlan]: () => null,
  [errorPlan]: (state, payload) => payload,
  [resetPlan]: () => null
}, null)

const addLoading = createReducer({
  [requestAddPlan]: () => true,
  [successAddPlan]: () => false,
  [errorAddPlan]: () => false
}, false)

const addError = createReducer({
  [requestAddPlan]: () => null,
  [successAddPlan]: () => null,
  [errorAddPlan]: (state, payload) => payload
}, null)

export const reducer = combineReducers({
  listLoading,
  listItems,
  listError,
  planLoading,
  plan,
  selectedNode,
  planError,
  addLoading,
  addError
})
