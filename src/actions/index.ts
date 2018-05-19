import {WordDefinition} from "dict-parser";
import {EditorState} from "draft-js";
import { createAction, TypeGetter } from "typesafe-actions";
import {Tab} from "../components/NavBar";

export const actions = {
  setActiveTab: createAction(
    "SET_ACTIVE_TAB",
    (activeTab: Tab) => ({ type: "SET_ACTIVE_TAB", activeTab })),
  setChosenDeckName: createAction(
    "SET_CHOSEN_DECK_NAME",
    (deckName: string) => ({ type: "SET_CHOSEN_DECK_NAME", chosenDeckName: deckName })),
  setDecks: createAction(
    "SET_DECKS",
    (decks: any[]) => ({ type: "SET_DECKS", decks })),
  setDefaultDeckName: createAction(
    "SET_DEFAULT_DECK_NAME",
    (defaultDeckName: string) => ({ type: "SET_DEFAULT_DECK_NAME", defaultDeckName })),
  setEditorStateList: createAction(
    "SET_EDITOR_STATE_LIST",
    (editorStateList: EditorState[]) => ({ type: "SET_EDITOR_STATE_LIST", editorStateList })),
  setFocusedEditorIndex: createAction(
    "SET_FOCUSED_EDITOR_INDEX",
    (focusedEditorIndex: number) => ({ type: "SET_FOCUSED_EDITOR_INDEX", focusedEditorIndex })),
  setLoading: createAction(
    "SET_LOADING",
    (isLoading: boolean) => ({ type: "SET_LOADING", isLoading })),
  setMoreDeckName: createAction(
    "SET_MORE_DECK_NAME",
    (moreDeckName: string) => ({ type: "SET_MORE_DECK_NAME", moreDeckName })),
  setWord: createAction(
    "WORD",
    (word: string) => ({ type: "WORD", word })),
  setWordDefinitions: createAction(
    "WORD_DEFINITIONS",
    (wordDefinitions: WordDefinition[]) => ({ type: "WORD_DEFINITIONS", wordDefinitions })),
};

export type RootAction = ReturnType<typeof actions[keyof typeof actions]>;
