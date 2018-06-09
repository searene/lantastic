import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { Icon, Menu } from "semantic-ui-react";
import { RootState } from "../reducers";

import "../stylesheets/components/ToolBar.scss";
import { actions } from "../actions";
import { GoogleImageModal } from "./GoogleImageModal";
import { ImageSearchModal } from "./ImageSearchModal";

interface IToolBarStates {
  openImageSearchModal: boolean;
}

const mapStateToProps = (state: RootState) => ({
  word: state.word
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setShowGoogleImageModal: actions.setShowGoogleImageModal
    },
    dispatch
  );

type ToolBarProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export class InternalToolBar extends React.Component<ToolBarProps, IToolBarStates> {
  constructor(props: ToolBarProps) {
    super(props);
    this.state = {
      openImageSearchModal: false
    };
  }
  public render() {
    return (
      <Menu icon style={{ marginRight: 0 }}>
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
    return `https://www.google.com/search?q=${encodeURIComponent(this.props.word)}&tbm=isch`;
  };
  private closeImageSearchModal = () => {
    this.setState({
      openImageSearchModal: false
    });
  };
}

export const ToolBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(InternalToolBar);
