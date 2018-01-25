import { $call } from 'utility-types';
import { createAction } from 'typesafe-actions';

const ADD_PATHS = 'ADD_PATHS';
const REMOVE_SELECTED_PATHS = 'REMOVE_SELECTED_PATHS';
const ADD_TO_SELECTED_PATHS = 'ADD_TO_SELECTED_PATHS';
const REMOVE_FROM_SELECTED_PATHS = 'REMOVE_FROM_SELECTED_PATHS';

export const actions = {
  addPaths: createAction(ADD_PATHS, (paths: string[]) => ({ type: ADD_PATHS, payload: paths })),
  removeSelectedPaths: createAction(REMOVE_SELECTED_PATHS, () => ({ type: REMOVE_SELECTED_PATHS })),
  addToSelectedPaths: createAction(ADD_TO_SELECTED_PATHS, (path: string) => ({ type: ADD_TO_SELECTED_PATHS, payload: path })),
  removeFromSelectedPaths: createAction(REMOVE_FROM_SELECTED_PATHS, (path: string) => ({ type: REMOVE_FROM_SELECTED_PATHS, payload: path })),
}

const returnsOfActions = Object.values(actions).map($call);
type AppAction = typeof returnsOfActions[number];

export type RootAction = AppAction;