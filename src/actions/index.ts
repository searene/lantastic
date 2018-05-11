import { createAction } from 'typesafe-actions';
import {WordDefinition} from "dict-parser";
import {Tab} from "../components/NavBar";
import {EditorState} from "draft-js";

export const actions = {
  setWord: createAction('WORD', (word: string) => ({ type: 'WORD', word: word })),
  setWordDefinitions: createAction('WORD_DEFINITIONS', (wordDefinitions: WordDefinition[]) => ({ type: 'WORD_DEFINITIONS', wordDefinitions: wordDefinitions })),
  setActiveTab: createAction('SET_ACTIVE_TAB', (activeTab: Tab) => ({ type: 'SET_ACTIVE_TAB', activeTab: activeTab })),
  setChosenDeckName: createAction('SET_CHOSEN_DECK_NAME', (deckName: string) => ({ type: 'SET_CHOSEN_DECK_NAME', chosenDeckName: deckName })),
  setDecks: createAction('SET_DECKS', (decks: any[]) => ({ type: 'SET_DECKS', decks: decks })),
  setLoading: createAction('SET_LOADING', (isLoading: boolean) => ({ type: 'SET_LOADING', isLoading: isLoading })),
  setMoreDeckName: createAction('SET_MORE_DECK_NAME', (moreDeckName: string) => ({ type: 'SET_MORE_DECK_NAME', moreDeckName: moreDeckName })),
  setDefaultDeckName: createAction('SET_DEFAULT_DECK_NAME', (defaultDeckName: string) => ({ type: 'SET_DEFAULT_DECK_NAME', defaultDeckName: defaultDeckName })),
  setFocusedEditorIndex: createAction('SET_FOCUSED_EDITOR_INDEX', (focusedEditorIndex: number) => ({ type: 'SET_FOCUSED_EDITOR_INDEX', focusedEditorIndex: focusedEditorIndex })),
  setEditorStateList: createAction('SET_EDITOR_STATE_LIST', (editorStateList: EditorState[]) => ({ type: 'SET_EDITOR_STATE_LIST', editorStateList: editorStateList })),
};

export type RootAction = ReturnType<typeof actions.setWord>
    | ReturnType<typeof actions.setWordDefinitions>
    | ReturnType<typeof actions.setActiveTab>
    | ReturnType<typeof actions.setChosenDeckName>
    | ReturnType<typeof actions.setDecks>
    | ReturnType<typeof actions.setLoading>
    | ReturnType<typeof actions.setMoreDeckName>
    | ReturnType<typeof actions.setDefaultDeckName>
    | ReturnType<typeof actions.setFocusedEditorIndex>
    | ReturnType<typeof actions.setEditorStateList>

// const returnsOfActions = Object.values(actions).map(action => $Call<typeof action>);
// type AppAction = typeof returnsOfActions[number];

// export type RootAction = AppAction;