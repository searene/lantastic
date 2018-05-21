import * as React from "react";

import {Menu, Segment} from "semantic-ui-react";
import {Scan} from "./Scan";

import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import "../stylesheets/components/Preference.scss";

import { RootState } from "../reducers";
import "../stylesheets/components/Preferences.scss";

const mapStateToProps = (state: RootState) => ({});
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
