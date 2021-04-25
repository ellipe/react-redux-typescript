import { combineReducers, createStore } from "redux";
import recorderReducer from "./recorder";
import userEventReducer from "./user-events";

const rootReducer = combineReducers({
  userEvents: userEventReducer,
  recorder: recorderReducer
})

export type RootState = ReturnType<typeof rootReducer>

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__();
const store = createStore(rootReducer, composeEnhancers)

export default store;