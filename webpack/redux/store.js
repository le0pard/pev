import config from 'config'
import {createStore, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import {loggers} from 'redux-act'
import createSagaMiddleware from 'redux-saga'
import rootSaga from 'sagas/root'
import rootReducer from './rootReducer'

export const initializeStore = (preloadedState = null) => {
  const sagaMiddleware = createSagaMiddleware()
  let middlewares = [
    sagaMiddleware
  ]

  if (config.logger.reduxEnabled) {
    middlewares.push(createLogger({
      ...loggers,
      level: 'info',
      duration: true,
      timestamp: true,
      collapsed: true,
      diff: true
    }))
  }

  const store = (() => {
    let storeArg = [
      rootReducer,
      applyMiddleware(...middlewares)
    ]

    if (preloadedState) {
      storeArg.splice(1, 0, preloadedState)
    }

    return createStore(...storeArg)
  })()

  sagaMiddleware.run(rootSaga)

  if (module.hot) {
    module.hot.accept('./root_reducer', () => {
      store.replaceReducer(rootReducer)
    })
  }

  return store
}
