import reducers, { getInitialState } from '../reducers'

import { createStore, applyMiddleware, combineReducers, bindActionCreators, compose } from 'redux'
import thunk from 'redux-thunk'




export default ()=>{

  // console.log(getInitialState());

  const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
  const reducer = combineReducers(reducers)
  const store = createStoreWithMiddleware(reducer)

  return store
}

// export default store
