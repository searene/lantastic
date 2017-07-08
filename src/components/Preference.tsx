import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Scan } from './Scan';

export interface PreferenceProps {
    // width: string;
}

export class Preference extends React.Component<PreferenceProps, undefined> {
    render() {
      const styles: React.CSSProperties = {
        container: {
          padding: "0.5em",
        },
        menu: {
          width: "100%",
        },
      }
      return (
        <div className="ui grid" style={styles.container}>
          <div className="three wide column">
            <div className="ui vertical menu" style={styles.menu}>
              <div className="item">
                <div className="header">Dictionary</div>
                <div className="menu">
                  <a className="item active">Scan</a>
                  <a className="item">Details</a>
                </div>
              </div>
              <div className="item">
                <div className="header">Styles</div>
              </div>
            </div>
          </div>
          <div className="thirteen wide stretched column">
            <div className="ui segment">
              <Scan paths={['Run', 'Walk', 'Bike']}/>
            </div>
          </div>
        </div>
      )
    }
}