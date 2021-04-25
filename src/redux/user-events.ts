import { RootState } from './store';
import { Action } from "redux";
import { ThunkAction } from "redux-thunk";

interface UserEvent {
  id: number;
  title: string;
  dateStart: string;
  dateEnd: string;
}

// state
interface UserEventsState {
  byIds: Record<UserEvent['id'], UserEvent>;
  allIds: UserEvent['id'][];
}

const initialState: UserEventsState = {
  byIds: {},
  allIds: []
}

// actions
const LOAD_REQUEST = 'userEvents/load-request'
const LOAD_SUCCESS = 'userEvents/load-success'
const LOAD_FAILURE = 'userEvents/load-failure'

interface LoadRequestAction extends Action<typeof LOAD_REQUEST>{}
interface LoadSucessAction extends Action<typeof LOAD_SUCCESS>{
  payload: {
    events: UserEvent[]
  }
}

interface LoadFailureAction extends Action<typeof LOAD_FAILURE>{
  error: string;
}

// action creator
export const loadUserEvent = (): ThunkAction<void, RootState, undefined, LoadRequestAction | LoadSucessAction | LoadFailureAction> =>  async (dispatch, getState) => {
  dispatch({
    type: LOAD_REQUEST
  })

  try {
    const response = await fetch('http://localhost:3001/events')
    const events: UserEvent[] = await response.json()

    dispatch({
      type: LOAD_SUCCESS,
      payload: {
        events
      }
    })
  } catch (error) {
    dispatch({
      type: LOAD_FAILURE,
      error: 'Failed to load events'
    })
  }
}

// reducer
const userEventReducer = (state: UserEventsState = initialState, action: LoadSucessAction) => {
  switch (action.type) {
    case LOAD_SUCCESS:
      const { events } = action.payload;
      return { ...state, allIds: events.map(({ id}) => id), byIds: events.reduce<UserEventsState['byIds']>((byIds, event) => {
        byIds[event.id] = event;
        return byIds;
      }, {})}

    default:
      return state;
  }
}

export default userEventReducer;