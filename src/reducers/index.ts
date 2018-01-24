import { RootAction } from './../actions/index';
import { getType } from 'typesafe-actions';
import { AnyAction, Reducer, combineReducers } from "redux";
import { actions } from '../actions/index';

export type RootState = {
  readonly paths: string[]
}

const initialState = {
  paths: ['a', 'b', 'c']
};

export const rootReducer = (state: RootState, action: RootAction) => {
  switch(action.type) {
    case getType(actions.addPath):
      return state + action.payload;
    default:
      return state;
  }
}