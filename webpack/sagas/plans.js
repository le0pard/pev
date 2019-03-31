import {
  put,
  apply,
  takeLatest
} from 'redux-saga/effects'
import {
  requestPlansList,
  successPlansList,
  errorsPlansList
} from 'reducers/plans'
import {database} from 'database'

function* fetchPlans() {
  try {
    const plans = yield apply(database, database.getPlans)
    yield put(successPlansList(plans))
  } catch (error) {
    yield put(errorsPlansList(error))
  }
}

export function* watch() {
  yield takeLatest(requestPlansList, fetchPlans)
}
