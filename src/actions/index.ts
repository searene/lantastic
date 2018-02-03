import { $call } from 'utility-types';
import { createAction } from 'typesafe-actions';
import {WordDefinition} from "dict-parser";

const ADD_PATHS = 'ADD_PATHS';
const REMOVE_SELECTED_PATHS = 'REMOVE_SELECTED_PATHS';
const ADD_TO_SELECTED_PATHS = 'ADD_TO_SELECTED_PATHS';
const REMOVE_FROM_SELECTED_PATHS = 'REMOVE_FROM_SELECTED_PATHS';
const SCAN_MESSAGE = 'SCAN_MESSAGE';
const WORD_DEFINITIONS = 'WORD_DEFINITIONS';
const WORD = 'WORD';
const PREFERENCES_VISIBILITY = 'PREFERENCES_VISIBILITY';

export const actions = {
  addPaths: createAction(ADD_PATHS, (paths: string[]) => ({ type: ADD_PATHS, payload: paths })),
  removeSelectedPaths: createAction(REMOVE_SELECTED_PATHS, () => ({ type: REMOVE_SELECTED_PATHS })),
  addToSelectedPaths: createAction(ADD_TO_SELECTED_PATHS, (path: string) => ({ type: ADD_TO_SELECTED_PATHS, payload: path })),
  removeFromSelectedPaths: createAction(REMOVE_FROM_SELECTED_PATHS, (path: string) => ({ type: REMOVE_FROM_SELECTED_PATHS, payload: path })),
  setScanMessage: createAction(SCAN_MESSAGE, (message: string) => ({ type: SCAN_MESSAGE, message: message })),
  setWord: createAction(WORD, (word: string) => ({ type: WORD, word: word })),
  setWordDefinitions: createAction(WORD_DEFINITIONS, (wordDefinitions: WordDefinition[]) => ({ type: WORD_DEFINITIONS, wordDefinitions: wordDefinitions })),
  setPreferencesVisibility: createAction(PREFERENCES_VISIBILITY, (visibility: boolean) => ({ type: PREFERENCES_VISIBILITY, visibility: visibility })),
};

const returnsOfActions = Object.values(actions).map($call);
type AppAction = typeof returnsOfActions[number];

export type RootAction = AppAction;