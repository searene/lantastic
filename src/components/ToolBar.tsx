import * as React from 'react';
import {connect, Dispatch} from "react-redux";
import {RootState} from "../reducers";
import {bindActionCreators} from "redux";
import {actions} from "../actions";
import {Icon, Menu, SemanticICONS} from 'semantic-ui-react';
import {CharacterMetadata, EditorState, ContentState, ContentBlock, RichUtils, SelectionState, Modifier} from 'draft-js';

import '../stylesheets/components/ToolBar.scss'
import {
  DRAFT_INLINE_STYLE_BOLD, DRAFT_INLINE_STYLE_ITALIC, DRAFT_INLINE_STYLE_UNDERLINE, getSelectedCharacterStyles,
  getSelectedContentBlocksAsOrderedMap, isInSelection
} from "../Utils/DraftJsUtils";
import {List, OrderedMap} from "immutable";

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

  private styleIcons = [{
    style: DRAFT_INLINE_STYLE_BOLD,
    icon: 'bold',
  }, {
    style: DRAFT_INLINE_STYLE_ITALIC,
    icon: 'italic',
  }, {
    style: DRAFT_INLINE_STYLE_UNDERLINE,
    icon: 'underline',
  }];

  render() {
    return (
      <Menu icon className={"toolbar-container borderless"}>
        {this.styleIcons.map(styleIcon =>
          <Menu.Item
            key={styleIcon.style}
            className={"toolbar-icon"}
            active={this.isStyleActive(styleIcon.style)}
            onMouseDown={(event: React.SyntheticEvent<HTMLDivElement>) => {
              event.preventDefault();
              this.toggleInlineStyle(styleIcon.style)
            }}>
            <Icon name={styleIcon.icon as SemanticICONS} />
          </Menu.Item>
        )}
      </Menu>
    );
  }
  private applyEditorState = (editorState: EditorState): void => {
    const newEditorStateList = this.props.editorStateList.concat();
    newEditorStateList[this.props.focusedEditorIndex] = editorState;
    this.props.setEditorStateList(newEditorStateList);
  };
  private isStyleActive = (style: string): boolean => {
    const editorState = this.getEditorState();
    return editorState.getCurrentInlineStyle().has(style);
  };
  private getEditorState = (): EditorState => {
    return this.props.editorStateList[this.props.focusedEditorIndex];
  };
  private toggleInlineStyle = (style: string): void => {
    this.applyEditorState(
      RichUtils.toggleInlineStyle(
        this.getEditorState(),
        style,
      )
    );
  };
}

export const ToolBar = connect(mapStateToProps, mapDispatchToProps)(ConnectedToolBar);

