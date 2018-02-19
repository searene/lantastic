import { $call } from 'utility-types';
import { createAction } from 'typesafe-actions';
import {WordDefinition} from "dict-parser";
import {Tab} from "../components/NavBar";

export const actions = {
  setWord: createAction('WORD', (word: string) => ({ type: 'WORD', word: word })),
  setWordDefinitions: createAction('WORD_DEFINITIONS', (wordDefinitions: WordDefinition[]) => ({ type: 'WORD_DEFINITIONS', wordDefinitions: wordDefinitions })),
  setFrontCardContents: createAction('FRONT_CARD_CONTENTS', (contents: string) => ({ type: 'FRONT_CARD_CONTENTS', contents: contents })),
  setBackCardContents: createAction('BACK_CARD_CONTENTS', (contents: string) => ({ type: 'BACK_CARD_CONTENTS', contents: contents })),
  setActiveTab: createAction('SET_ACTIVE_TAB', (activeTab: Tab) => ({ type: 'SET_ACTIVE_TAB', activeTab: activeTab })),
  setChosenDeckName: createAction('SET_CHOSEN_DECK_NAME', (deckName: string) => ({ type: 'SET_CHOSEN_DECK_NAME', chosenDeckName: deckName })),
  setDecks: createAction('SET_DECKS', (decks: any[]) => ({ type: 'SET_DECKS', decks: decks })),
  setLoading: createAction('SET_LOADING', (isLoading: boolean) => ({ type: 'SET_LOADING', isLoading: isLoading })),
  setMoreDeckName: createAction('SET_MORE_DECK_NAME', (moreDeckName: string) => ({ type: 'SET_MORE_DECK_NAME', moreDeckName: moreDeckName })),
  setDefaultDeckName: createAction('SET_DEFAULT_DECK_NAME', (defaultDeckName: string) => ({ type: 'SET_DEFAULT_DECK_NAME', defaultDeckName: defaultDeckName })),
};

const returnsOfActions = Object.values(actions).map($call);
type AppAction = typeof returnsOfActions[number];

export type RootAction = AppAction;