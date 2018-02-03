import { RootAction } from './../actions/index';
import { getType } from 'typesafe-actions';
import { AnyAction, Reducer, combineReducers } from "redux";
import { actions } from '../actions/index';
import { removeFromArray } from '../Utils';
import {WordDefinition} from "dict-parser";

export type RootState = {
  readonly paths: string[]
  readonly selectedPaths: string[]
  readonly scanMessage: string
  readonly wordDefinitions: WordDefinition[]
  readonly word: string
  readonly isPreferencesOpen: boolean
}

const initialState: RootState = {
  paths: ['/home/searene/Public/dz'],
  selectedPaths: [],
  scanMessage: '',
  wordDefinitions: [],
  word: '',
  isPreferencesOpen: false
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
      };
    
    case getType(actions.addToSelectedPaths):
      return {
        ...state,
        selectedPaths: state.selectedPaths.concat(action.payload)
      };

    case getType(actions.removeFromSelectedPaths):
      return {
        ...state,
        selectedPaths: removeFromArray(state.selectedPaths, action.payload)
      };

    case getType(actions.setScanMessage):
      return {
        ...state,
        scanMessage: action.message
      };

    case getType(actions.setWordDefinitions):
      return {
        ...state,
        wordDefinitions: action.wordDefinitions
      };
      
    case getType(actions.setWord):
      return {
        ...state,
        word: action.word
      };

    case getType(actions.setPreferencesVisibility):
      return {
        ...state,
        isPreferencesOpen: action.visibility
      };

    default:
      return state;
  }
};