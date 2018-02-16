import * as React from 'react';
import {connect, Dispatch} from "react-redux";
import {actions} from "../actions";
import { Menu, Icon } from 'semantic-ui-react';

import '../stylesheets/components/NavBar.scss';

export enum Tab {
  SEARCH_AND_ADD, REVIEW, PREFERENCES
}

export interface NavBarProps {
  activeTab: Tab;
  setActiveTab: (activeTab: Tab) => any;
}
const mapStateToProps = (state: NavBarProps) => ({
  activeTab: state.activeTab
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setActiveTab: (activeTab: Tab) => dispatch(actions.setActiveTab(activeTab))
});

export class ConnectedNavBar extends React.Component<NavBarProps, {}> {
  render() {
    return (
      <Menu icon='labeled' vertical className="navbar">
        <Menu.Item
          name='add'
          active={this.props.activeTab === Tab.SEARCH_AND_ADD}
          onClick={() => this.props.setActiveTab(Tab.SEARCH_AND_ADD)}>
          <Icon name='add' />
        </Menu.Item>

        <Menu.Item
          name='newspaper'
          active={this.props.activeTab === Tab.REVIEW}
          onClick={() => this.props.setActiveTab(Tab.REVIEW)}>
          <Icon name='newspaper' />
        </Menu.Item>

        <Menu.Item
          name='setting'
          active={this.props.activeTab === Tab.PREFERENCES}
          onClick={() => this.props.setActiveTab(Tab.PREFERENCES)}>
          <Icon name='setting' />
        </Menu.Item>
      </Menu>
    )
  }
}

export const NavBar = connect(mapStateToProps, mapDispatchToProps)(ConnectedNavBar);