import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {bindActionCreators} from "redux";
import {Icon, Menu} from "semantic-ui-react";
import {RootState} from "../reducers";

import "../stylesheets/components/ToolBar.scss";
import { actions } from "../actions";
import { GoogleImageModal } from "./GoogleImageModal";

interface IToolBarStates {
  blockType: string;
}

const mapStateToProps = (state: RootState) => ({
  word: state.word,
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  setShowGoogleImageModal: actions.setShowGoogleImageModal,
}, dispatch);

type ToolBarProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export class InternalToolBar extends React.Component<ToolBarProps, IToolBarStates> {
  public render() {
    return (
      <Menu icon style={{ marginRight: 0 }}>
        <Menu.Item
          name="google"
          href={`https://www.google.com/search?q=${encodeURIComponent(this.props.word)}&tbm=isch`}
          target={"_blank"}>
          <Icon name="google" />
        </Menu.Item>
      </Menu>
    );
  }
  private handleClickOnGoogleImage = () => {
    this.props.setShowGoogleImageModal(true);
  }
}

export const ToolBar = connect(mapStateToProps, mapDispatchToProps)(InternalToolBar);
