import {DECK_COLUMN_NAME, DECK_TABLE} from "./Constants";

import * as React from "react";
import * as ReactDOM from "react-dom";
import {connect, Dispatch, Provider} from "react-redux";
import {Footer} from "./components/Footer";
import {Preferences} from "./components/Preferences";
import {Configuration} from "./Configuration";
import {Sqlite} from "./Sqlite";
import {store} from "./store";

import {actions} from "./actions";
import {CardBrowser} from "./components/CardBrowser";
import {Deck} from "./components/Deck";
import {NavBar, Tab} from "./components/NavBar";
import {Review} from "./components/Review";
import {SearchAndAdd} from "./components/SearchAndAdd";
import {Parser} from "./Parser";
import "./stylesheets/App.scss";
import { getOS, isCtrlOrCommand, OS } from "./Utils/CommonUtils";
import { Keyboard } from "./services/Keyboard";
import { Stack, Set } from "immutable";

export interface AppProps {
  activeTab: Tab;
  isLoading: boolean;
  setLoading: (isLoading: boolean) => any;
  decks: any[];
  setDecks: (decks: any[]) => any;
  setChosenDeckName: (deckName: string) => any;
  setDefaultDeckName: (deckName: string) => any;
}

const mapStateToProps = (state: AppProps) => ({
  activeTab: state.activeTab,
  decks: state.decks,
  isLoading: state.isLoading,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setChosenDeckName: (deckName: string) => dispatch(actions.setChosenDeckName(deckName)),
  setDecks: (decks: any[]) => dispatch(actions.setDecks(decks)),
  setDefaultDeckName: (deckName: string) => dispatch(actions.setDefaultDeckName(deckName)),
  setLoading: (isLoading: boolean) => dispatch(actions.setLoading(isLoading)),
});

export class InternalApp extends React.Component<AppProps> {

  public static isModifierKeyPressed = (modifierKeys: string[]) => {
    return Keyboard.isModifierKeyPressed(InternalApp.pressedKeyStack, modifierKeys);
  }

  public static isKeyPressed = (modifierKeys: string[], normalKey: string): boolean => {
    return InternalApp.isModifierKeyPressed(modifierKeys) &&
      InternalApp.pressedKeyStack[InternalApp.pressedKeyStack.length - 1] === normalKey;
  }

  public static isKeyWithCtrlOrCmdPressed = (otherModifierKeys: string[], normalKey: string): boolean => {
    const isMacShortcut = getOS() === OS.MacOS &&
      InternalApp.isKeyPressed([Keyboard.KEY_META, ...otherModifierKeys], normalKey);
    const isWinOrLinuxShortcut = [OS.MacOS, OS.Linux].indexOf(getOS()) &&
      InternalApp.isKeyPressed([Keyboard.KEY_CONTROL, ...otherModifierKeys], normalKey);
    return isMacShortcut || isWinOrLinuxShortcut;
  }

  private static pressedKeyStack: string[] = [];
  private static isKeyboardEventListenerRegistered = false;

  public init = async (): Promise<void> => {
    await Sqlite.init();
    await Configuration.init();
    await Parser.init();
    await this.setUpDecks();
    await this.setUpChosenDeckName();
    await this.setUpDefaultDeck();
    this.props.setLoading(false);
  }

  public async componentWillMount() {
    this.registerShortcuts();
    await this.init();
  }

  public render() {
    let tabContents: React.ReactNode;

    if (this.props.activeTab === Tab.SEARCH_AND_ADD) {
      tabContents = (<SearchAndAdd/>);
    } else if (this.props.activeTab === Tab.REVIEW) {
      tabContents = (<Review/>);
    } else if (this.props.activeTab === Tab.PREFERENCES) {
      tabContents = (<Preferences/>);
    } else if (this.props.activeTab === Tab.DECK) {
      tabContents = (<Deck/>);
    } else if (this.props.activeTab === Tab.CARD_BROWSER) {
      tabContents = (<CardBrowser/>);
    }
    return (

      <div className="app-container">
        {this.props.isLoading ? <div/> :
          <div style={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            height: "100%",
            width: "100%",
          }}>

            <div style={{
              display: "flex",
              flex: 1,
              padding: "10px",
              width: "100%",
            }}>
              <NavBar/>
              {tabContents}
            </div>

            <div style={{width: "100%"}}>
              <Footer/>
            </div>

          </div>
        }
      </div>
    );
  }

  private setUpDecks = async (): Promise<void> => {
    let decks: any[];
    const db = await Sqlite.getDb();
    decks = await db.all(`
          SELECT
            ${DECK_COLUMN_NAME}
          FROM
            ${DECK_TABLE}`);
    this.props.setDecks(decks);
  }
  private setUpChosenDeckName = async (): Promise<void> => {
    let defaultDeckName: string;
    defaultDeckName = await Configuration.get(Configuration.DEFAULT_DECK_NAME_KEY);
    this.props.setChosenDeckName(defaultDeckName);
  }
  private setUpDefaultDeck = async (): Promise<void> => {
    const defaultDeckName = await Configuration.get(Configuration.DEFAULT_DECK_NAME_KEY);
    this.props.setDefaultDeckName(defaultDeckName);
  }
  private registerShortcuts = () => {
    if (!InternalApp.isKeyboardEventListenerRegistered) {
      document.addEventListener("keydown", (event) => {
        InternalApp.pressedKeyStack.push(event.key);
      });
      document.addEventListener("keyup", (event) => {
        InternalApp.pressedKeyStack.pop();
      });
      InternalApp.isKeyboardEventListenerRegistered = true;
    }
  }
}

export const App = connect(mapStateToProps, mapDispatchToProps)(InternalApp);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app"),
);
