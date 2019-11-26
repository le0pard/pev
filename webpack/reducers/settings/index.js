import {combineReducers} from 'redux'
import {createAction, createReducer} from 'redux-act'
import {
  APP_THEMES_LIGHT,
  APP_THEMES_DARK,
  GRAPH_VIEW
} from './constants'

export const settingsToggleTheme = createAction('Toggle app theme')
export const changePlanView = createAction('Change graph view')

const theme = createReducer({
  [settingsToggleTheme]: (state) => (
    APP_THEMES_LIGHT === state ? APP_THEMES_DARK : APP_THEMES_LIGHT
  )
}, APP_THEMES_LIGHT)

const planView = createReducer({
  [changePlanView]: (state, payload) => payload
}, GRAPH_VIEW)

export const reducer = combineReducers({
  planView,
  theme
})
