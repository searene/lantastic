import {WordDefinition} from "dict-parser";
import {EditorState} from "draft-js";
import {getType} from "typesafe-actions";
import {actions, RootAction} from "../actions";
import {Tab} from "../components/NavBar";
import { Card } from "../models/Card";
import { List } from "immutable";

export interface RootState {
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
  readonly cardModalOpen: boolean;
  readonly cardInCardModal: Card;
  readonly cardsInCardBrowser: List<Card>;
  readonly showGoogleImageModal: boolean;
  readonly isFindInputBoxVisible: boolean;
  readonly findWord: string;
  readonly findWordIndex: number;
  readonly isFindInputBoxFocused: boolean;
}

const initialState: RootState = {
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
  cardModalOpen: false,
  cardInCardModal: undefined,
  cardsInCardBrowser: List(),
  showGoogleImageModal: false,
  isFindInputBoxVisible: false,
  findWord: "",
  findWordIndex: 0,
  isFindInputBoxFocused: false,
};

export const rootReducer = (state: RootState = initialState, action: RootAction): RootState => {
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

    case getType(actions.setCardModalOpen):
      return {
        ...state,
        cardModalOpen: action.cardModalOpen,
      };

    case getType(actions.setCardInCardModal):
      return {
        ...state,
        cardInCardModal: action.cardInCardModal,
      };

    case getType(actions.setCardsInCardBrowser):
      return {
        ...state,
        cardsInCardBrowser: action.cardsInCardBrowser,
      };

    case getType(actions.setShowGoogleImageModal):
      return {
        ...state,
        showGoogleImageModal: action.showGoogleImageModal,
      };

    case getType(actions.setFindInputBoxVisible):
      return {
        ...state,
        isFindInputBoxVisible: action.isFindInputBoxVisible,
      };

    case getType(actions.setFindWord):
      return {
        ...state,
        findWord: action.findWord,
      };

    case getType(actions.setFindWordIndex):
      return {
        ...state,
        findWordIndex: action.findWordIndex,
      };

    case getType(actions.setFindInputBoxFocused):
      return {
        ...state,
        isFindInputBoxFocused: action.isFindInputBoxFocused,
      };

    default:
      return state;
  }
};
