import {combineReducers} from 'redux'
import {createAction, createReducer} from 'redux-act'

export const requestPlansList = createAction('Request plans list')
export const successPlansList = createAction('Success plans list')
export const errorPlansList = createAction('Errors plans list')

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
  addLoading,
  addError
})
