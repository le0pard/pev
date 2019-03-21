import {combineReducers} from 'redux'
import {createReducer} from 'redux-act'

const connector = createReducer({}, null)

export const reducer = combineReducers({
  connector
})
