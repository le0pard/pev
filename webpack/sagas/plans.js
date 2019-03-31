import {
  put,
  apply,
  takeLatest
} from 'redux-saga/effects'
import {
  requestPlansList,
  successPlansList,
  errorPlansList,
  requestAddPlan,
  successAddPlan,
  errorAddPlan
} from 'reducers/plans'
import {database} from 'database'

function* fetchPlans() {
  try {
    const plans = yield apply(database, database.getPlans)
    yield put(successPlansList(plans))
  } catch (error) {
    yield put(errorPlansList(error))
  }
}

function* addPlanRequest({payload}) {
  try {
    const plan = yield apply(database, database.addPlan, [payload])
    yield put(successAddPlan(plan))
  } catch (error) {
    yield put(errorAddPlan(error))
  }
}

export function* watch() {
  yield takeLatest(requestPlansList, fetchPlans)
  yield takeLatest(requestAddPlan, addPlanRequest)
}
