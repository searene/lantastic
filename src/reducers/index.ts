import { RootAction } from './../actions/index';
import { getType } from 'typesafe-actions';
import { AnyAction, Reducer, combineReducers } from "redux";
import { actions } from '../actions/index';

export type RootState = {
  readonly paths: string[]
  readonly selectedPaths: string[]
}

const initialState: RootState = {
  paths: ['a', 'b'],
  selectedPaths: []
};

export const rootReducer = (state: RootState = initialState, action: RootAction): RootState => {
  switch(action.type) {

    case getType(actions.addPaths):
      return {...state, paths: state.paths.concat(action.payload)}

    case getType(actions.removeSelectedPaths):
      return {
        ...state,
        paths: state.paths.filter(item => state.selectedPaths.indexOf(item) === -1),
        selectedPaths: []
      }
    
    case getType(actions.addToSelectedPaths):
      return {
        ...state,
        selectedPaths: state.selectedPaths.concat(action.payload)
      }

    case getType(actions.removeFromSelectedPaths):
      return {
        ...state,
        selectedPaths: state.selectedPaths.filter(path => path != action.payload)
      }

    default:
      return state;
  }
}