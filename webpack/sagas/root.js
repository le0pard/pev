import {fork} from 'redux-saga/effects'

import {watch as watchPlans} from './plans'

function* rootSaga() {
  yield [
    fork(watchPlans)
  ]
}

export default rootSaga
