import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Scan } from './Scan';
import { Grid, Menu, Segment, Modal, Button, Icon } from 'semantic-ui-react';

import '../stylesheets/components/Preference.scss';
import { actions } from '../actions/index';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

/** prevent from importing electron and other related stuff when we are building a web app
 *  http://ideasintosoftware.com/typescript-conditional-imports/ */
declare var __IS_WEB__: boolean;
import * as Electron from 'electron';
import {BaseButton} from "./BaseButton";
let electron: typeof Electron;
if(!__IS_WEB__) {
  electron = require('electron');
}

export interface PreferencesProps {
  isPreferencesOpen: boolean;
  setPreferencesVisibility: (visible: boolean) => any;
}
const mapStateToProps = (state: PreferencesProps) => ({
  isPreferencesOpen: state.isPreferencesOpen,
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setPreferencesVisibility: (isPreferencesOpen: boolean) => dispatch(actions.setPreferencesVisibility(isPreferencesOpen)),
});

class ConnectPreferences extends React.Component<PreferencesProps> {

  constructor(props: PreferencesProps) {
    super(props);
    if(!__IS_WEB__) {
      this.buildMenu();
    }
  }

  render() {
    return (
      <Modal
        trigger={<div></div>}
        open={this.props.isPreferencesOpen}
        size="large">
        <Modal.Header>Preferences</Modal.Header>
        <Modal.Content>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column width={4}>
                <Menu vertical>
                  <Menu.Item>
                    <Menu.Header>Dictionary</Menu.Header>
                    <Menu.Menu>
                      <Menu.Item name="scan" active />
                      <Menu.Item name="details" />
                    </Menu.Menu>
                  </Menu.Item>
                </Menu>
              </Grid.Column>
              <Grid.Column width={12}>
                <Segment>
                  <Scan />
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <BaseButton basic color='green' onClick={() => this.props.setPreferencesVisibility(false)}>
            <Icon name='checkmark' /> OK
          </BaseButton>
        </Modal.Actions>
      </Modal>
    )
  }
  private buildMenu = () => {
    const menu = new electron.remote.Menu();
    menu.append(new electron.remote.MenuItem({
      label: 'Preferences',
      click: () => {
        this.props.setPreferencesVisibility(true);
      }
    }));
    window.addEventListener('contextmenu', e => {
      e.preventDefault();
      menu.popup(electron.remote.getCurrentWindow());
    }, false);
  }
}
export const Preferences = connect(mapStateToProps, mapDispatchToProps)(ConnectPreferences);