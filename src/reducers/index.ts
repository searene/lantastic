import { getType } from "typesafe-actions";
import { actions, RootAction } from "../actions";
import { Tab } from "../components/NavBar";
import { Card } from "../models/Card";
import { List } from "immutable";

export interface RootState {
  [index: string]: any;
  readonly chosenDeckName: string;
  readonly decks: any[];
  readonly moreDeckName: string;
  readonly defaultDeckName: string;
  readonly showGoogleImageModal: boolean;
}

const initialState: RootState = {
  chosenDeckName: "",
  decks: [],
  defaultDeckName: "",
  moreDeckName: "",
  showGoogleImageModal: false,
};

export const rootReducer = (state: RootState = initialState, action: RootAction): RootState => {
  switch (action.type) {
    case getType(actions.setChosenDeckName):
      return { ...state, chosenDeckName: action.payload };

    case getType(actions.setDecks):
      return { ...state, decks: action.payload };

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
