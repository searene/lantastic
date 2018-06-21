import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect, Dispatch, Provider } from "react-redux";
import { actions } from "./actions";
import { CardBrowser } from "./components/CardBrowser";
import { Deck } from "./components/Deck";
import { Footer } from "./components/Footer";
import { NavBar, Tab } from "./components/NavBar";
import { Preferences } from "./components/Preferences";
import { Review } from "./components/Review";
import { SearchAndAdd } from "./components/SearchAndAdd";
import { Configuration } from "./Configuration";
import { DECK_COLUMN_NAME, DECK_TABLE } from "./Constants";
import { Parser } from "./Parser";
import { Sqlite } from "./Sqlite";
import { store } from "./store";
import "./stylesheets/App.scss";
import * as PropTypes from "prop-types";
import keymap from "./configs/Keymap";
import { ShortcutManager, Shortcuts } from "react-shortcuts";
import { AppCache } from "./services/AppCache";

export interface IAppStates {
  activeTab: Tab;
  loading: boolean;
  showSearchInputBox: boolean;
}
export interface IAppProps {
  decks: any[];
  setDecks: (decks: any[]) => any;
  setChosenDeckName: (deckName: string) => any;
  setDefaultDeckName: (deckName: string) => any;
}

const mapStateToProps = (state: IAppProps) => ({
  decks: state.decks
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setChosenDeckName: (deckName: string) => dispatch(actions.setChosenDeckName(deckName)),
  setDecks: (decks: any[]) => dispatch(actions.setDecks(decks)),
  setDefaultDeckName: (deckName: string) => dispatch(actions.setDefaultDeckName(deckName))
});

export class InternalApp extends React.Component<IAppProps, IAppStates> {
  public static childContextTypes = {
    shortcuts: PropTypes.object.isRequired
  };
  constructor(props: IAppProps) {
    super(props);
    this.state = {
      showSearchInputBox: false,
      activeTab: Tab.SEARCH_AND_ADD,
      loading: true
    };
  }
  public init = async (): Promise<void> => {
    await Sqlite.init();
    await Configuration.init();
    await Parser.init();
    await AppCache.init();
    await this.setUpDecks();
    await this.setUpChosenDeckName();
    await this.setUpDefaultDeck();
    this.stopLoading();
  };

  public getChildContext() {
    return {
      shortcuts: new ShortcutManager(keymap)
    };
  }

  public async componentDidMount() {
    await this.init();
  }
  public render() {
    let tabContents: React.ReactNode;

    if (this.state.activeTab === Tab.SEARCH_AND_ADD) {
      tabContents = (
        <SearchAndAdd
          showSearchInputBox={this.state.showSearchInputBox}
          onSearchInputBoxVisibilityChange={this.handleSearchInputBoxVisibilityChange}
        />
      );
    } else if (this.state.activeTab === Tab.REVIEW) {
      tabContents = <Review />;
    } else if (this.state.activeTab === Tab.PREFERENCES) {
      tabContents = <Preferences />;
    } else if (this.state.activeTab === Tab.DECK) {
      tabContents = <Deck />;
    } else if (this.state.activeTab === Tab.CARD_BROWSER) {
      tabContents = <CardBrowser />;
    }
    return (
      <Shortcuts
        name="App"
        handler={this.handleShortcuts}
        targetNodeSelector="body"
        className="app-container"
        alwaysFireHandler={true}
        isolate={true}
      >
        {!this.state.loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              height: "100%",
              width: "100%"
            }}
          >
            <div
              style={{
                display: "flex",
                flex: 1,
                padding: "10px",
                width: "100%"
              }}
            >
              <NavBar activeTab={this.state.activeTab} onActiveTabChange={this.activateTab}/>
              {tabContents}
            </div>

            <div style={{ width: "100%" }}>
              <Footer />
            </div>
          </div>
        )}
      </Shortcuts>
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
  };
  private setUpChosenDeckName = async (): Promise<void> => {
    let defaultDeckName: string;
    defaultDeckName = await Configuration.get(Configuration.DEFAULT_DECK_NAME_KEY);
    this.props.setChosenDeckName(defaultDeckName);
  };
  private setUpDefaultDeck = async (): Promise<void> => {
    const defaultDeckName = await Configuration.get(Configuration.DEFAULT_DECK_NAME_KEY);
    this.props.setDefaultDeckName(defaultDeckName);
  };
  private activateTab = (tab: Tab) => {
    this.setState({
      activeTab: tab
    });
  };
  private stopLoading = () => {
    this.setState({
      loading: false
    });
  };
  private startLoading = () => {
    this.setState({
      loading: true
    });
  };
  private handleShortcuts = (action: string, event: KeyboardEvent) => {
    if (
      action === "searchInDictionary" &&
      this.state.activeTab === Tab.SEARCH_AND_ADD &&
      this.state.showSearchInputBox === false
    ) {
      this.setState({
        showSearchInputBox: true
      });
    }
  };
  private handleSearchInputBoxVisibilityChange = (show: boolean) => {
    this.setState({
      showSearchInputBox: show
    });
  };
}

export const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(InternalApp);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);
