import { RootAction } from './../actions/index';
import { getType } from 'typesafe-actions';
import { AnyAction, Reducer, combineReducers } from "redux";
import { actions } from '../actions/index';

export type RootState = {
  readonly paths: string[]
}

const initialState: RootState = {
  paths: ['a', 'b']
};

export const rootReducer = (state: RootState = initialState, action: RootAction) => {
  switch(action.type) {
    case getType(actions.addPaths):
      return {...state, paths: state.paths.concat(action.payload)}
    default:
      return state;
  }
}