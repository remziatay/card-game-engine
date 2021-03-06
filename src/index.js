import React from 'react'
import ReactDOM from 'react-dom'
import './bootstrap-reboot.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import { applyMiddleware, compose, createStore } from 'redux'
import rootReducer from './store/reducers/root'
import cumulativeRafSchd from './lib/cumulativeRafSchd'
import { actionCreators } from './store/actions'
import thunk from 'redux-thunk'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))

window.addEventListener('resize', cumulativeRafSchd(() => {
  store.dispatch(actionCreators.resizeWindow(window.innerWidth, window.innerHeight))
}))

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

serviceWorker.unregister()
