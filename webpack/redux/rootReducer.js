import {combineReducers} from 'redux'

import {reducer as plans} from 'reducers/plans'
import {reducer as settings} from 'reducers/settings'
import {reducer as sw} from 'reducers/sw'

export default combineReducers({
  plans,
  settings,
  sw
})
