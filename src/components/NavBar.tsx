import * as React from "react";
import {connect, Dispatch} from "react-redux";
import { Icon, Menu } from "semantic-ui-react";
import {actions} from "../actions";

import {bindActionCreators} from "redux";
import {RootState} from "../reducers";
import "../stylesheets/components/NavBar.scss";

export enum Tab {
  DECK, SEARCH_AND_ADD, REVIEW, CARD_BROWSER, PREFERENCES,
}

const mapStateToProps = (state: RootState) => ({
  activeTab: state.activeTab,
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  setActiveTab: actions.setActiveTab,
}, dispatch);

export type NavBarProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export class ConnectedNavBar extends React.Component<NavBarProps, {}> {
  public render() {
    return (
      <Menu
        icon="labeled"
        vertical
        className="navbar">
        <Menu.Item
          active={this.props.activeTab === Tab.DECK}
          onClick={() => this.props.setActiveTab(Tab.DECK)}>
          <Icon name="book" />
        </Menu.Item>
        <Menu.Item
          active={this.props.activeTab === Tab.SEARCH_AND_ADD}
          onClick={() => this.props.setActiveTab(Tab.SEARCH_AND_ADD)}>
          <Icon name="add" />
        </Menu.Item>

        <Menu.Item
          active={this.props.activeTab === Tab.REVIEW}
          onClick={() => this.props.setActiveTab(Tab.REVIEW)}>
          <Icon name="newspaper" />
        </Menu.Item>

        <Menu.Item
          active={this.props.activeTab === Tab.CARD_BROWSER}
          onClick={this.handleClickOnCardBrowserTab}>
          <Icon name="browser" />
        </Menu.Item>

        <Menu.Item
          active={this.props.activeTab === Tab.PREFERENCES}
          onClick={() => this.props.setActiveTab(Tab.PREFERENCES)}>
          <Icon name="setting" />
        </Menu.Item>

      </Menu>
    );
  }
  private handleClickOnCardBrowserTab = () => {
    this.props.setActiveTab(Tab.CARD_BROWSER);
  }
}

export const NavBar = connect(mapStateToProps, mapDispatchToProps)(ConnectedNavBar);
