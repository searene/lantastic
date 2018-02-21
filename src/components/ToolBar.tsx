import * as React from 'react';
import {connect, Dispatch} from "react-redux";
import {RootState} from "../reducers";
import {bindActionCreators} from "redux";
import {actions} from "../actions";
import {Icon, Menu} from 'semantic-ui-react';
import {EditorState, Modifier} from 'draft-js';

import '../stylesheets/components/ToolBar.scss'
import {getSelectedCharacterStyles} from "../Utils/DraftJsUtils";

interface ToolBarProps {
  editorStateList: EditorState[];
  focusedEditorIndex: number;
  setEditorStateList: (editorStateList: EditorState[]) => any;
  setFocusedEditorIndex: (focusedEditorIndex: number) => any;
}

interface ToolBarStates {
}

const mapStateToProps = (state: RootState) => ({
  editorStateList: state.editorStateList,
  focusedEditorIndex: state.focusedEditorIndex,
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  setEditorStateList: actions.setEditorStateList,
  setFocusedEditorIndex: actions.setFocusedEditorIndex,
}, dispatch);


export class ConnectedToolBar extends React.Component<ToolBarProps, ToolBarStates> {

  constructor(props: ToolBarProps) {
    super(props);
  }

  render() {
    return (
      <Menu icon className={"toolbar-container"}>
        <Menu.Item className={"toolbar-icon"} active={this.isStyleActive('BOLD')} onClick={this.toggleBold}>
          <Icon name='bold' />
        </Menu.Item>

        <Menu.Item className={"toolbar-icon"}>
          <Icon name='italic' />
        </Menu.Item>

        <Menu.Item className={"toolbar-icon"}>
          <Icon name='underline' />
        </Menu.Item>
      </Menu>
    );
  }
  private isBold = (): boolean => {
    return false;
  };
  private toggleBold = (): void => {
    const editorState = this.props.editorStateList[this.props.focusedEditorIndex];
  };
  private applyEditorState = (editorState: EditorState): void => {
    const newEditorStateList = this.props.editorStateList.concat();
    newEditorStateList[this.props.focusedEditorIndex] = editorState;
    this.props.setEditorStateList(newEditorStateList);
  };
  private checkIfSelectionInStyle = (style: string): boolean => {
    const editorState = this.props.editorStateList[this.props.focusedEditorIndex];
    const selectedCharacterStyles = getSelectedCharacterStyles(editorState);
    if(selectedCharacterStyles.size === 0) {
      return false;
    }
    selectedCharacterStyles.map(styles => {
      styles.map(s => {
        console.log(s);
      });
    });
    return selectedCharacterStyles.findIndex(s => !s.contains(style)) === -1;
  };
  private isStyleActive = (style: string): boolean => {
    return this.checkIfSelectionInStyle(style);
  };
}

export const ToolBar = connect(mapStateToProps, mapDispatchToProps)(ConnectedToolBar);

