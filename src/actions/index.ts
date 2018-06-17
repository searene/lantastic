import { WordDefinition } from "dict-parser";
import { EditorState } from "draft-js";
import { action, ActionType, createAction, createStandardAction } from "typesafe-actions";
import { Tab } from "../components/NavBar";
import { Card } from "../models/Card";
import { List } from "immutable";
import { create } from "domain";

export const actions = {
  setActiveTab: createStandardAction("SET_ACTIVE_TAB")<Tab>(),
  setChosenDeckName: createStandardAction("SET_CHOSEN_DECK_NAME")<string>(),
  setDecks: createStandardAction("SET_DECKS")<any[]>(),
  setDefaultDeckName: createStandardAction("SET_DEFAULT_DECK_NAME")<string>(),
  setLoading: createStandardAction("SET_LOADING")<boolean>(),
  setMoreDeckName: createStandardAction("SET_MORE_DECK_NAME")<string>(),
  setWord: createStandardAction("SET_WORD")<string>(),
  setCardModalOpen: createStandardAction("SET_CARD_MODAL_OPEN")<boolean>(),
  setCardInCardModal: createStandardAction("SET_CARD_IN_CARD_MODAL")<Card>(),
  setCardsInCardBrowser: createStandardAction("SET_CARDS_IN_CARD_BROWSER")<List<Card>>(),
  setShowGoogleImageModal: createStandardAction("SET_SHOW_GOOGLE_IMAGE_MODAL")<boolean>(),
};

export type RootAction = ActionType<typeof actions>;
