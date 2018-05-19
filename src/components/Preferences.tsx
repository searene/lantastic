import * as React from "react";
import * as ReactDOM from "react-dom";

import {Button, Grid, Icon, Menu, Modal, Segment} from "semantic-ui-react";
import {Scan} from "./Scan";

import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {actions} from "../actions/index";
import "../stylesheets/components/Preference.scss";

import * as electron from "electron";

import { IRootState } from "../reducers";
import "../stylesheets/components/Preferences.scss";

const mapStateToProps = (state: IRootState) => ({});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
}, dispatch);

export type PreferencesProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class ConnectPreferences extends React.Component<PreferencesProps> {

  public render() {
    return (
      <div className="preferences-container">
        <Menu vertical className="preferences-selector">
          <Menu.Item>
            <Menu.Header>Dictionary</Menu.Header>
            <Menu.Menu>
              <Menu.Item name="scan" active/>
              <Menu.Item name="details"/>
            </Menu.Menu>
          </Menu.Item>
        </Menu>
        <Segment className="preferences-contents">
          <Scan/>
        </Segment>
      </div>
    );
  }
}

export const Preferences = connect(mapStateToProps, mapDispatchToProps)(ConnectPreferences);
