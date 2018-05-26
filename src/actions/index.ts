import {WordDefinition} from "dict-parser";
import {EditorState} from "draft-js";
import { createAction} from "typesafe-actions";
import {Tab} from "../components/NavBar";
import { Card } from "../models/Card";
import { List } from "immutable";

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
    "SET_WORD",
    (word: string) => ({ type: "SET_WORD", word })),
  setWordDefinitions: createAction(
    "SET_WORD_DEFINITIONS",
    (wordDefinitions: WordDefinition[]) => ({ type: "SET_WORD_DEFINITIONS", wordDefinitions })),
  setCardModalOpen: createAction(
    "SET_CARD_MODAL_OPEN",
    (cardModalOpen: boolean) => ({ type: "SET_CARD_MODAL_OPEN", cardModalOpen })),
  setCardInCardModal: createAction(
    "SET_CARD_IN_CARD_MODAL",
    (cardInCardModal: Card) => ({ type: "SET_CARD_IN_CARD_MODAL", cardInCardModal })),
  setCardsInCardBrowser: createAction(
    "SET_CARDS_IN_CARD_BROWSER",
    (cardsInCardBrowser: List<Card>) => ({ type: "SET_CARDS_IN_CARD_BROWSER", cardsInCardBrowser })),
  setShowGoogleImageModal: createAction(
    "SET_SHOW_GOOGLE_IMAGE_MODAL",
    (showGoogleImageModal: boolean) => ({ type: "SET_SHOW_GOOGLE_IMAGE_MODAL", showGoogleImageModal })),
};

export type RootAction = ReturnType<typeof actions[keyof typeof actions]>;
