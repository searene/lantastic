import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Footer} from './components/Footer';
import {Preferences} from './components/Preferences';
import {connect, Provider} from 'react-redux';
import {store} from './store';

import './stylesheets/App.scss';
import {NavBar, Tab} from "./components/NavBar";
import {Review} from "./components/Review";
import {SearchAndAdd} from "./components/SearchAndAdd";
import {Deck} from "./components/Deck";

export interface AppProps {
  deck: string;
  type: string;
  activeTab: Tab;
}

const mapStateToProps = (state: AppProps) => ({
  activeTab: state.activeTab
});

export class ConnectedApp extends React.Component<AppProps, {}> {

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

    if(this.props.activeTab === Tab.SEARCH_AND_ADD) {
      tabContents = ( <SearchAndAdd /> );
    } else if(this.props.activeTab === Tab.REVIEW) {
      tabContents = ( <Review /> );
    } else if(this.props.activeTab === Tab.PREFERENCES) {
      tabContents = ( <Preferences /> );
    } else if(this.props.activeTab === Tab.DECK) {
      tabContents = ( <Deck /> );
    }
    return (
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
          <Footer deck="Default" type="Basic"/>
        </div>

      </div>
    );
  }
}

export const App = connect(mapStateToProps, {})(ConnectedApp);

ReactDOM.render(
  <Provider store={store}>
    <App deck="Default" type="Basic"/>
  </Provider>,
  document.getElementById('app')
);
