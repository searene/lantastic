import { getType } from "typesafe-actions";
import { actions, RootAction } from "../actions";
import { Tab } from "../components/NavBar";
import { Card } from "../models/Card";
import { List } from "immutable";

export interface RootState {
  [index: string]: any;
  readonly word: string;
  readonly activeTab: Tab;
  readonly chosenDeckName: string;
  readonly decks: any[];
  readonly isLoading: boolean;
  readonly moreDeckName: string;
  readonly defaultDeckName: string;
  readonly showGoogleImageModal: boolean;
}

const initialState: RootState = {
  activeTab: Tab.SEARCH_AND_ADD,
  chosenDeckName: "",
  decks: [],
  defaultDeckName: "",
  isLoading: true,
  moreDeckName: "",
  word: "",
  wordDefinitions: List(),
  showGoogleImageModal: false,
};

export const rootReducer = (state: RootState = initialState, action: RootAction): RootState => {
  switch (action.type) {
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

    case getType(actions.setShowGoogleImageModal):
      return { ...state, showGoogleImageModal: action.payload };

    default:
      return state;
  }
};
