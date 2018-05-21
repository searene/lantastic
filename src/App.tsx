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

export class ConnectedApp extends React.Component<AppProps> {

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
}

export const App = connect(mapStateToProps, mapDispatchToProps)(ConnectedApp);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app"),
);
