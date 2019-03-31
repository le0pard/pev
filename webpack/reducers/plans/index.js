import {combineReducers} from 'redux'
import {createAction, createReducer} from 'redux-act'

export const requestPlansList = createAction('Request plans list')
export const successPlansList = createAction('Success plans list')
export const errorsPlansList = createAction('Errors plans list')

const list = createReducer({
  [requestPlansList]: () => null,
  [successPlansList]: (state, payload) => payload,
  [errorsPlansList]: () => null
}, null)

const error = createReducer({
  [requestPlansList]: () => null,
  [successPlansList]: () => null,
  [errorsPlansList]: (state, payload) => payload
}, null)

const loading = createReducer({
  [requestPlansList]: () => true,
  [successPlansList]: () => false,
  [errorsPlansList]: () => false
}, false)

export const reducer = combineReducers({
  loading,
  list,
  error
})
