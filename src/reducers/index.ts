import {RootAction} from '../actions';
import {getType} from 'typesafe-actions';
import {actions} from '../actions';
import {removeFromArray} from '../Utils';
import {WordDefinition} from "dict-parser";
import {Tab} from "../components/NavBar";

export type RootState = {
  readonly paths: string[];
  readonly selectedPaths: string[];
  readonly scanMessage: string;
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
  readonly totalCardCount: number;
}

const initialState: RootState = {
  paths: ['/home/searene/Public/complete'],
  selectedPaths: [],
  scanMessage: '',
  wordDefinitions: [],
  word: '',
  frontCardContents: '',
  backCardContents: '',
  activeTab: Tab.CARD_BROWSER,
  chosenDeckName: '',
  decks: [],
  isLoading: true,
  moreDeckName: '',
  defaultDeckName: '',
  totalCardCount: 0,
};

export const rootReducer = (state: RootState = initialState, action: RootAction): RootState => {
  switch (action.type) {

    case getType(actions.addPaths):
      return {
        ...state,
        paths: state.paths.concat(action.payload),
      };

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

    case getType(actions.setTotalCardCount):
      return {
        ...state,
        totalCardCount: action.totalCardCount
      };

    default:
      return state;
  }
};