import { Action } from "redux";
import { RootState } from "./store";


// actions and types
const START = 'recorder/start';
const STOP = 'recorder/stop';

type StartAction = Action<typeof START>
type StopAction = Action<typeof STOP>


// dispatchers
export const start = (): StartAction => ({
  type: START,
})

export const stop = (): StopAction => ({
  type: STOP,
})

// selectors
export const selectDateStart = (rootState: RootState) => selectRecorderState(rootState).dateStart
export const selectRecorderState = (rootState: RootState) => rootState.recorder




// state
interface RecorderState {
  dateStart: string;
}

const initialState:RecorderState = {
  dateStart: ''
}

// reducer
const recorderReducer = (state: RecorderState = initialState, action: StartAction | StopAction) => {
  switch (action.type) {
    case START: 
      return {...state, dateStart: new Date().toISOString()}
    case STOP: 
      return {...state, dateStart: ''}
    default:
      return state;
  }

}

export default recorderReducer;