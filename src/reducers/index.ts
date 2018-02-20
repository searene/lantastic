import {RootAction} from '../actions';
import {getType} from 'typesafe-actions';
import {actions} from '../actions';
import {removeFromArray} from '../Utils';
import {WordDefinition} from "dict-parser";
import {Tab} from "../components/NavBar";
import {EditorState} from 'draft-js';

export type RootState = {
  readonly wordDefinitions: WordDefinition[];
  readonly word: string;
  readonly frontCardContents: string;
  readonly backCardContents: string;
  readonly activeTab: Tab;
  readonly chosenDeckName: string;
  readonly decks: any[];
  readonly isLoading: boolean;
  readonly moreDeckName: string;
  readonly defaultDeckName: string;
  readonly editorState: EditorState;
}

const initialState: RootState = {
  wordDefinitions: [],
  word: '',
  frontCardContents: '',
  backCardContents: '',
  activeTab: Tab.SEARCH_AND_ADD,
  chosenDeckName: '',
  decks: [],
  isLoading: true,
  moreDeckName: '',
  defaultDeckName: '',
  editorState: EditorState.createEmpty(),
};

export const rootReducer = (state: RootState = initialState, action: RootAction): RootState => {
  switch (action.type) {

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

    case getType(actions.setFrontCardContents):
      return {
        ...state,
        frontCardContents: action.contents
      };

    case getType(actions.setBackCardContents):
      return {
        ...state,
        backCardContents: action.contents
      };

    case getType(actions.setActiveTab):
      return {
        ...state,
        activeTab: action.activeTab
      };

    case getType(actions.setChosenDeckName):
      return {
        ...state,
        chosenDeckName: action.chosenDeckName
      };

    case getType(actions.setDecks):
      return {
        ...state,
        decks: action.decks
      };

    case getType(actions.setLoading):
      return {
        ...state,
        isLoading: action.isLoading
      };

    case getType(actions.setMoreDeckName):
      return {
        ...state,
        moreDeckName: action.moreDeckName
      };

    case getType(actions.setDefaultDeckName):
      return {
        ...state,
        defaultDeckName: action.defaultDeckName
      };

    case getType(actions.setEditorState):
      return {
        ...state,
        editorState: action.editorState
      };

    default:
      return state;
  }
};