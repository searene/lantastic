import * as React from 'react';
import {connect, Dispatch} from "react-redux";
import {RootState} from "../reducers";
import {bindActionCreators} from "redux";
import {actions} from "../actions";
import {Icon, Menu} from 'semantic-ui-react';
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

  render() {
    return (
      <Menu icon className={"toolbar-container borderless"}>
        <Menu.Item
          className={"toolbar-icon"}
          active={this.isStyleActive(DRAFT_INLINE_STYLE_BOLD)}
          onClick={() => this.toggleStyle(DRAFT_INLINE_STYLE_BOLD)}>
          <Icon name='bold' />
        </Menu.Item>

        <Menu.Item
          className={"toolbar-icon"}
          active={this.isStyleActive(DRAFT_INLINE_STYLE_ITALIC)}
          onClick={() => this.toggleStyle(DRAFT_INLINE_STYLE_ITALIC)}>
          <Icon name='italic' />
        </Menu.Item>

        <Menu.Item
          className={"toolbar-icon"}
          active={this.isStyleActive(DRAFT_INLINE_STYLE_UNDERLINE)}
          onClick={() => this.toggleStyle(DRAFT_INLINE_STYLE_UNDERLINE)}>
          <Icon name='underline' />
        </Menu.Item>
      </Menu>
    );
  }
  private applyEditorState = (editorState: EditorState): void => {
    const newEditorStateList = this.props.editorStateList.concat();
    newEditorStateList[this.props.focusedEditorIndex] = editorState;
    this.props.setEditorStateList(newEditorStateList);
  };
  private isStyleActiveOnSelection = (style: string): boolean => {
    const editorState = this.props.editorStateList[this.props.focusedEditorIndex];
    const selectedCharacterStyles = getSelectedCharacterStyles(editorState);
    if(selectedCharacterStyles.size === 0) {
      return false;
    }
    return selectedCharacterStyles.findIndex(s => !s.contains(style)) === -1;
  };
  private isStyleActive = (style: string): boolean => {
    const editorState = this.props.editorStateList[this.props.focusedEditorIndex];
    if(isInSelection(editorState)) {
      return this.isStyleActiveOnSelection(style);
    } else {
      return this.isStyleActiveOnNextCharacter(style);
    }
  };
  private toggleStyle = (style: string): void => {
    const editorState = this.props.editorStateList[this.props.focusedEditorIndex];
    if(isInSelection(editorState)) {
      this.toggleStyleWhenSelected(style);
    } else {
      this.toggleStyleWhenNotSelected(style);
    }
  };
  private toggleStyleWhenSelected = (style: string): void => {
    const editorState = this.props.editorStateList[this.props.focusedEditorIndex];
    const styledEditorState = RichUtils.toggleInlineStyle(editorState, style);
    const focusedEditorState = this.refocus(styledEditorState, editorState.getSelection());
    this.applyEditorState(focusedEditorState);
  };
  private refocus = (editorState: EditorState, originalSelectionState: SelectionState): EditorState => {
    return EditorState.forceSelection(editorState, originalSelectionState);
  };
  private isStyleActiveOnNextCharacter = (style: string): boolean => {
    const editorState = this.props.editorStateList[this.props.focusedEditorIndex];
    const selectionState = editorState.getSelection();
    const key = selectionState.getStartKey();
    const blockContent = editorState.getCurrentContent().getBlockForKey(key);
    const offset = selectionState.getStartOffset();
    const characterList = blockContent.getCharacterList();
    if(characterList.size === 0) {
      return this.isLastUnemptyContentBlockHasStyle(editorState, style);
    } else if(offset === 0) {
      return characterList.get(0).hasStyle(style);
    } else {
      return characterList.get(offset - 1).hasStyle(style);
    }
  };
  private toggleStyleWhenNotSelected = (style: string): void => {
    debugger;
    const editorState = this.props.editorStateList[this.props.focusedEditorIndex];
    const contentState = editorState.getCurrentContent();
    console.log(contentState.getLastCreatedEntityKey());
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      {url: 'http://www.zombo.com'}
    );
    const newEditorState = EditorState.push(editorState, contentStateWithEntity, 'insert-fragment');
    this.applyEditorState(newEditorState);
  };
  private isLastUnemptyContentBlockHasStyle = (editorState: EditorState, style: string): boolean => {
    const key = editorState.getSelection().getStartKey();
    let previousBlockContent = editorState.getCurrentContent().getBlockBefore(key);
    while(true) {
      if(previousBlockContent === undefined) return false;
      const previousCharacterList = previousBlockContent.getCharacterList();
      if(previousCharacterList.size === 0) {
        previousBlockContent = editorState.getCurrentContent().getBlockBefore(previousBlockContent.getKey());
        continue;
      }
      return previousCharacterList.get(previousCharacterList.size - 1).hasStyle(style);
    }
  }
}

export const ToolBar = connect(mapStateToProps, mapDispatchToProps)(ConnectedToolBar);

