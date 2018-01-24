import { AnyAction, Reducer, combineReducers } from "redux";
import { ADD_PATH } from "../Constants";

interface ReduxState {
  paths: string[]
}
const initialState: ReduxState = {
  paths: ['a', 'b', 'c']
};

export const rootReducer: (state: ReduxState, action: AnyAction) => ReduxState = (state = initialState, action) => {
  let nextState: ReduxState;
  switch(action.type) {
    case(ADD_PATH):
      nextState = { ...state, paths: state.paths.concat(action.payload) };
      break;
    default:
      nextState = state;
      break;
  }
  return nextState;
}