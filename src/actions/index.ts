import { $call } from 'utility-types';
import { createAction } from 'typesafe-actions';

const ADD_PATHS = 'ADD_PATHS';

export const actions = {
  addPaths: createAction(ADD_PATHS, (paths: string[]) => ({ type: ADD_PATHS, payload: paths }))
}

const returnsOfActions = Object.values(actions).map($call);
type AppAction = typeof returnsOfActions[number];

export type RootAction = AppAction;