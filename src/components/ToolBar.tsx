import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { Icon, Menu } from "semantic-ui-react";
import { RootState } from "../reducers";

import "../stylesheets/components/ToolBar.scss";
import { actions } from "../actions";
import { ImageSearchModal } from "./ImageSearchModal";

interface IToolBarStates {
  openImageSearchModal: boolean;
}

interface IToolBarProps {
  searchWord: string;
}

export class ToolBar extends React.Component<IToolBarProps, IToolBarStates> {
  constructor(props: IToolBarProps) {
    super(props);
    this.state = {
      openImageSearchModal: false
    };
  }
  public render() {
    return (
      <Menu icon={true} style={{ marginRight: 0 }}>
        <Menu.Item name="google" onClick={this.openImageSearchModal} target={"_blank"}>
          <Icon name="google" />
          <ImageSearchModal
            url={this.getImageSearchURL()}
            onClose={this.closeImageSearchModal}
            open={this.state.openImageSearchModal}
          />
        </Menu.Item>
      </Menu>
    );
  }
  private openImageSearchModal = () => {
    this.setState({
      openImageSearchModal: true
    });
  };
  private getImageSearchURL = () => {
    return `https://www.google.com/search?q=${encodeURIComponent(this.props.searchWord)}&tbm=isch`;
  };
  private closeImageSearchModal = () => {
    this.setState({
      openImageSearchModal: false
    });
  };
}
