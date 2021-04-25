import { combineReducers, createStore, compose, applyMiddleware } from "redux";
import thunk from 'redux-thunk'
import recorderReducer from "./recorder";
import userEventReducer from "./user-events";

const rootReducer = combineReducers({
  userEvents: userEventReducer,
  recorder: recorderReducer
})

export type RootState = ReturnType<typeof rootReducer>

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(thunk)
))

export default store;