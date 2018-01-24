import { $call } from 'utility-types';
import { createAction } from 'typesafe-actions';

const ADD_PATH = 'ADD_PATH';

export const actions = {
  addPath: createAction(ADD_PATH, (path: string) => ({ type: ADD_PATH, payload: path }))
}

const returnsOfActions = Object.values(actions).map($call);
type AppAction = typeof returnsOfActions[number];

export type RootAction = AppAction;