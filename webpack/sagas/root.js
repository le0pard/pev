import {all, fork} from 'redux-saga/effects'

import {watch as watchPlans} from './plans'

function* rootSaga() {
  yield all([
    fork(watchPlans)
  ])
}

export default rootSaga
