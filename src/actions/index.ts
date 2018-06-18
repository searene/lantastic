import { ActionType, createStandardAction } from "typesafe-actions";
import { Tab } from "../components/NavBar";

export const actions = {
  setChosenDeckName: createStandardAction("SET_CHOSEN_DECK_NAME")<string>(),
  setDecks: createStandardAction("SET_DECKS")<any[]>(),
  setDefaultDeckName: createStandardAction("SET_DEFAULT_DECK_NAME")<string>(),
  setMoreDeckName: createStandardAction("SET_MORE_DECK_NAME")<string>(),
  setShowGoogleImageModal: createStandardAction("SET_SHOW_GOOGLE_IMAGE_MODAL")<boolean>(),
};

export type RootAction = ActionType<typeof actions>;
