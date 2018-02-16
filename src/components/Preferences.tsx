import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Scan} from './Scan';
import {Grid, Menu, Segment, Modal, Button, Icon} from 'semantic-ui-react';

import '../stylesheets/components/Preference.scss';
import {actions} from '../actions/index';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';

/** prevent from importing electron and other related stuff when we are building a web app
 *  http://ideasintosoftware.com/typescript-conditional-imports/ */
declare var __IS_WEB__: boolean;
import * as Electron from 'electron';

let electron: typeof Electron;
if (!__IS_WEB__) {
  electron = require('electron');
}

import '../stylesheets/components/Preferences.scss';

export interface PreferencesProps {
}

const mapStateToProps = (state: PreferencesProps) => ({});
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({});

class ConnectPreferences extends React.Component<PreferencesProps> {

  render() {
    return (
      <div className='preferences-container'>
        <Menu vertical className='preferences-selector'>
          <Menu.Item>
            <Menu.Header>Dictionary</Menu.Header>
            <Menu.Menu>
              <Menu.Item name="scan" active/>
              <Menu.Item name="details"/>
            </Menu.Menu>
          </Menu.Item>
        </Menu>
        <Segment className='preferences-contents'>
          <Scan/>
        </Segment>
      </div>
    )
  }
}

export const Preferences = connect(mapStateToProps, mapDispatchToProps)(ConnectPreferences);