import {WordDefinition} from "dict-parser";
import {EditorState} from "draft-js";
import {getType} from "typesafe-actions";
import {actions, RootAction} from "../actions";
import {Tab} from "../components/NavBar";

export interface IRootState {
  [index: string]: any;
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

const initialState: IRootState = {
  activeTab: Tab.SEARCH_AND_ADD,
  chosenDeckName: "",
  decks: [],
  defaultDeckName: "",
  editorStateList: [],
  focusedEditorIndex: 0,
  isLoading: true,
  moreDeckName: "",
  word: "",
  wordDefinitions: [],
};

export const rootReducer = (state: IRootState = initialState, action: RootAction): IRootState => {
  switch (action.type) {

    case getType(actions.setWordDefinitions):
      return {
        ...state,
        wordDefinitions: action.wordDefinitions,
      };

    case getType(actions.setWord):
      return {
        ...state,
        word: action.word,
      };

    case getType(actions.setActiveTab):
      return {
        ...state,
        activeTab: action.activeTab,
      };

    case getType(actions.setChosenDeckName):
      return {
        ...state,
        chosenDeckName: action.chosenDeckName,
      };

    case getType(actions.setDecks):
      return {
        ...state,
        decks: action.decks,
      };

    case getType(actions.setLoading):
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case getType(actions.setMoreDeckName):
      return {
        ...state,
        moreDeckName: action.moreDeckName,
      };

    case getType(actions.setDefaultDeckName):
      return {
        ...state,
        defaultDeckName: action.defaultDeckName,
      };

    case getType(actions.setFocusedEditorIndex):
      return {
        ...state,
        focusedEditorIndex: action.focusedEditorIndex,
      };

    case getType(actions.setEditorStateList):
      return {
        ...state,
        editorStateList: action.editorStateList,
      };

    default:
      return state;
  }
};
