import {RootAction} from '../actions';
import {getType} from 'typesafe-actions';
import {actions} from '../actions';
import {WordDefinition} from "dict-parser";
import {Tab} from "../components/NavBar";
import {EditorState} from 'draft-js';

export type RootState = {
  readonly wordDefinitions: WordDefinition[];
  readonly word: string;
  readonly activeTab: Tab;
  readonly chosenDeckName: string;
  readonly decks: any[];
  readonly isLoading: boolean;
  readonly moreDeckName: string;
  readonly defaultDeckName: string;
  readonly editorStateList: EditorState[];
  readonly focusedEditorIndex: number; // starts from 0
}

const initialState: RootState = {
  wordDefinitions: [],
  word: '',
  activeTab: Tab.SEARCH_AND_ADD,
  chosenDeckName: '',
  decks: [],
  isLoading: true,
  moreDeckName: '',
  defaultDeckName: '',
  editorStateList: [],
  focusedEditorIndex: 0,
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

    case getType(actions.setFocusedEditorIndex):
      return {
        ...state,
        focusedEditorIndex: action.focusedEditorIndex
      };

    case getType(actions.setEditorStateList):
      return {
        ...state,
        editorStateList: action.editorStateList
      };

    default:
      return state;
  }
};