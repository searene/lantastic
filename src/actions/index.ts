import { ActionType, createStandardAction } from "typesafe-actions";
import { Tab } from "../components/NavBar";

export const actions = {
  setActiveTab: createStandardAction("SET_ACTIVE_TAB")<Tab>(),
  setChosenDeckName: createStandardAction("SET_CHOSEN_DECK_NAME")<string>(),
  setDecks: createStandardAction("SET_DECKS")<any[]>(),
  setDefaultDeckName: createStandardAction("SET_DEFAULT_DECK_NAME")<string>(),
  setLoading: createStandardAction("SET_LOADING")<boolean>(),
  setMoreDeckName: createStandardAction("SET_MORE_DECK_NAME")<string>(),
  setWord: createStandardAction("SET_WORD")<string>(),
  setShowGoogleImageModal: createStandardAction("SET_SHOW_GOOGLE_IMAGE_MODAL")<boolean>(),
};

export type RootAction = ActionType<typeof actions>;
