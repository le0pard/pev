import {
  put,
  apply,
  call,
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
  const {values, resolve, reject} = payload
  try {
    const plan = yield apply(database, database.addPlan, [values])
    yield put(successAddPlan(plan))
    yield call(resolve, plan)
  } catch (error) {
    yield put(errorAddPlan(error))
    yield call(reject, error)
  }
}

export function* watch() {
  yield takeLatest(requestPlansList, fetchPlans)
  yield takeLatest(requestAddPlan, addPlanRequest)
}
