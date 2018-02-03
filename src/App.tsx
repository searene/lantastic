import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Field } from './components/Field';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { Preferences } from './components/Preferences';
import Split = require('split.js');
import { Provider } from 'react-redux';
import { store } from './store';

import './stylesheets/App.scss';

export interface AppProps {
  deck: string;
  type: string;
}

export class App extends React.Component<AppProps, undefined> {
  componentDidMount() { 
    Split(['#navbar', '#field'], {
      direction: 'horizontal',
      minSize: [150, 100],
    });
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
        height: "100%",
        display: "flex",
        width: "100%",
        flex: "1",
        overflow: "auto",
      },
    };
    let descriptions: string[] = ['front', 'back'];
    return (
      <div style={styles.container}>
        <div style={styles.row1} id="row1">
            <Navbar />
            <Field descriptions={descriptions}/>
        </div>
        <div style={styles.row2} id="row2">
          <Footer deck="Default" type="Basic" />
        </div>

        <Preferences />

      </div>
    );
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App deck="Default" type="Basic" />
  </Provider>,
  document.getElementById('app')
);