import { $call } from 'utility-types';
import { createAction } from 'typesafe-actions';
import {WordDefinition} from "dict-parser";
import {Tab} from "../components/NavBar";

const ADD_PATHS = 'ADD_PATHS';
const REMOVE_SELECTED_PATHS = 'REMOVE_SELECTED_PATHS';
const ADD_TO_SELECTED_PATHS = 'ADD_TO_SELECTED_PATHS';
const REMOVE_FROM_SELECTED_PATHS = 'REMOVE_FROM_SELECTED_PATHS';
const SCAN_MESSAGE = 'SCAN_MESSAGE';
const WORD_DEFINITIONS = 'WORD_DEFINITIONS';
const WORD = 'WORD';
const FRONT_CARD_CONTENTS = 'FRONT_CARD_CONTENTS';
const BACK_CARD_CONTENTS = 'BACK_CARD_CONTENTS';
const SET_ACTIVE_TAB = 'SET_ACTIVE_TAB';
const CHOSEN_DECK_NAME = 'CHOSEN_DECK_NAME';
const SET_CHOSEN_DECK_NAME = 'SET_CHOSEN_DECK_NAME';
const SET_DECKS = 'SET_DECKS';
const SET_LOADING = 'SET_LOADING';

export const actions = {
  addPaths: createAction(ADD_PATHS, (paths: string[]) => ({ type: ADD_PATHS, payload: paths })),
  removeSelectedPaths: createAction(REMOVE_SELECTED_PATHS, () => ({ type: REMOVE_SELECTED_PATHS })),
  addToSelectedPaths: createAction(ADD_TO_SELECTED_PATHS, (path: string) => ({ type: ADD_TO_SELECTED_PATHS, payload: path })),
  removeFromSelectedPaths: createAction(REMOVE_FROM_SELECTED_PATHS, (path: string) => ({ type: REMOVE_FROM_SELECTED_PATHS, payload: path })),
  setScanMessage: createAction(SCAN_MESSAGE, (message: string) => ({ type: SCAN_MESSAGE, message: message })),
  setWord: createAction(WORD, (word: string) => ({ type: WORD, word: word })),
  setWordDefinitions: createAction(WORD_DEFINITIONS, (wordDefinitions: WordDefinition[]) => ({ type: WORD_DEFINITIONS, wordDefinitions: wordDefinitions })),
  setFrontCardContents: createAction(FRONT_CARD_CONTENTS, (contents: string) => ({ type: FRONT_CARD_CONTENTS, contents: contents })),
  setBackCardContents: createAction(BACK_CARD_CONTENTS, (contents: string) => ({ type: BACK_CARD_CONTENTS, contents: contents })),
  setActiveTab: createAction(SET_ACTIVE_TAB, (activeTab: Tab) => ({ type: SET_ACTIVE_TAB, activeTab: activeTab })),
  setChosenDeckName: createAction(SET_CHOSEN_DECK_NAME, (deckName: string) => ({ type: SET_CHOSEN_DECK_NAME, chosenDeckName: deckName })),
  setDecks: createAction(SET_DECKS, (decks: any[]) => ({ type: SET_DECKS, decks: decks })),
  setLoading: createAction(SET_LOADING, (isLoading: boolean) => ({ type: SET_LOADING, isLoading: isLoading })),
};

const returnsOfActions = Object.values(actions).map($call);
type AppAction = typeof returnsOfActions[number];

export type RootAction = AppAction;