import { WordDefinition } from "dict-parser";
import { EditorState } from "draft-js";
import { getType } from "typesafe-actions";
import { actions, RootAction } from "../actions";
import { Tab } from "../components/NavBar";
import { Card } from "../models/Card";
import { List } from "immutable";

export interface RootState {
  [index: string]: any;
  readonly wordDefinitions: List<WordDefinition>;
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
  readonly definitionsDOM: HTMLDocument;
  readonly highlightedDefinitionsHTML: string;
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
  wordDefinitions: List(),
  cardModalOpen: false,
  cardInCardModal: undefined,
  cardsInCardBrowser: List(),
  showGoogleImageModal: false,
  isFindInputBoxVisible: false,
  findWord: "",
  findWordIndex: 0,
  isFindInputBoxFocused: false,
  definitionsDOM: new DOMParser().parseFromString("", "text/html"),
  highlightedDefinitionsHTML: ""
};

export const rootReducer = (state: RootState = initialState, action: RootAction): RootState => {
  switch (action.type) {
    case getType(actions.setWordDefinitions):
      return { ...state, wordDefinitions: action.payload };

    case getType(actions.setWord):
      return { ...state, word: action.payload };

    case getType(actions.setActiveTab):
      return { ...state, activeTab: action.payload };

    case getType(actions.setChosenDeckName):
      return { ...state, chosenDeckName: action.payload };

    case getType(actions.setDecks):
      return { ...state, decks: action.payload };

    case getType(actions.setLoading):
      return { ...state, isLoading: action.payload };

    case getType(actions.setMoreDeckName):
      return { ...state, moreDeckName: action.payload };

    case getType(actions.setDefaultDeckName):
      return { ...state, defaultDeckName: action.payload };

    case getType(actions.setCardModalOpen):
      return { ...state, cardModalOpen: action.payload };

    case getType(actions.setCardInCardModal):
      return { ...state, cardInCardModal: action.payload };

    case getType(actions.setCardsInCardBrowser):
      return { ...state, cardsInCardBrowser: action.payload };

    case getType(actions.setShowGoogleImageModal):
      return { ...state, showGoogleImageModal: action.payload };

    case getType(actions.setFindInputBoxVisible):
      return { ...state, isFindInputBoxVisible: action.payload };

    case getType(actions.setFindWord):
      return { ...state, findWord: action.payload };

    case getType(actions.setFindWordIndex):
      return { ...state, findWordIndex: action.payload };

    case getType(actions.setFindInputBoxFocused):
      return { ...state, isFindInputBoxFocused: action.payload };

    case getType(actions.setDefinitionsDOM):
      return { ...state, definitionsDOM: action.payload };

    case getType(actions.setHighlightedDefinitionsHTML):
      return { ...state, highlightedDefinitionsHTML: action.payload };

    default:
      return state;
  }
};
