import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Grid, Input, Button, Container } from 'semantic-ui-react';
import { Dictionary } from './components/Dictionary';
import { Field } from './components/Field';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';

export interface AppProps {
  deck: string;
  type: string;
}

export class App extends React.Component<AppProps, undefined> {
  render() {
    const style = {
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
      row2: {
      },
    };
    let descriptions: string[] = ['front', 'back'];
    return (
      <div style={style.container as any}>
        <div style={style.row1 as any}>
          <Navbar />
          <Field descriptions={descriptions}/>
        </div>
        <div style={style.row2}>
          <Footer deck="Default" type="Basic" />
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <App deck="Default" type="Basic" />,
  document.getElementById('app')
);
