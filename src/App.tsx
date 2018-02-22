import {DECK_COLUMN_NAME, DECK_TABLE} from "./Constants";

import {Sqlite} from './Sqlite';
import {Configuration} from './Configuration';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Footer} from './components/Footer';
import {Preferences} from './components/Preferences';
import {connect, Dispatch, Provider} from 'react-redux';
import {store} from './store';

import './stylesheets/App.scss';
import {NavBar, Tab} from "./components/NavBar";
import {Review} from "./components/Review";
import {SearchAndAdd} from "./components/SearchAndAdd";
import {Deck} from "./components/Deck";
import {actions} from "./actions";
import {CardBrowser} from "./components/CardBrowser";
import {ConnectedTestComponent, TestComponent} from "./components/TestComponent";
import {ToolBar} from "./components/ToolBar";
import {RichEditorExample} from "./components/RichEditorExample";

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
  isLoading: state.isLoading,
  decks: state.decks,
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setLoading: (isLoading: boolean) => dispatch(actions.setLoading(isLoading)),
  setDecks: (decks: any[]) => dispatch(actions.setDecks(decks)),
  setChosenDeckName: (deckName: string) => dispatch(actions.setChosenDeckName(deckName)),
  setDefaultDeckName: (deckName: string) => dispatch(actions.setDefaultDeckName(deckName)),
});

export class ConnectedApp extends React.Component<AppProps, {}> {

  init = async (): Promise<void> => {
    await Sqlite.init();
    await Configuration.init();
    await this.setUpDecks();
    await this.setUpChosenDeckName();
    await this.setUpDefaultDeck();
    this.props.setLoading(false);
  };

  async componentWillMount() {
    await this.init();
  }

  render() {
    const styles: React.CSSProperties = {
      typeButton: {
        width: "40%",
      },
      buttonGroup: {
        width: "50%",
        paddingRight: "5px",
      },
      container: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "column",
      },
      row1: {
        width: '100%',
        display: "flex",
        flex: "1",
      },
    };
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
        {this.props.isLoading ? <div></div> :
          <div style={styles.container}>

            <div style={{
              width: '100%',
              display: 'flex',
              flex: 1,
              padding: '10px',
            }}>
              <NavBar/>
              {tabContents}
            </div>

            <div style={{width: '100%'}}>
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
  };
  private setUpChosenDeckName = async (): Promise<void> => {
    let defaultDeckName: string;
    defaultDeckName = await Configuration.get(Configuration.DEFAULT_DECK_NAME_KEY);
    this.props.setChosenDeckName(defaultDeckName);
  };
  private setUpDefaultDeck = async (): Promise<void> => {
    const defaultDeckName = await Configuration.get(Configuration.DEFAULT_DECK_NAME_KEY);
    this.props.setDefaultDeckName(defaultDeckName);
  }
}

export const App = connect(mapStateToProps, mapDispatchToProps)(ConnectedApp);

ReactDOM.render(
  <Provider store={store}>
    <RichEditorExample />
  </Provider>,
  document.getElementById('app')
);
