import * as React from 'react';
import {connect, Dispatch} from "react-redux";
import {RootState} from "../reducers";
import {bindActionCreators} from "redux";
import {actions} from "../actions";
import {Icon, Menu} from 'semantic-ui-react';
import {CharacterMetadata, Editor, EditorState, Modifier, ContentState, ContentBlock} from 'draft-js';

import '../stylesheets/components/ToolBar.scss'
import {
  DRAFT_INLINE_STYLE_BOLD, DRAFT_INLINE_STYLE_ITALIC, DRAFT_INLINE_STYLE_UNDERLINE,
  getSelectedCharacterStyles, getSelectedContentBlocksAsOrderedMap
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
      <Menu icon className={"toolbar-container"}>
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
  private checkIfSelectionInStyle = (style: string): boolean => {
    const editorState = this.props.editorStateList[this.props.focusedEditorIndex];
    const selectedCharacterStyles = getSelectedCharacterStyles(editorState);
    if(selectedCharacterStyles.size === 0) {
      return false;
    }
    return selectedCharacterStyles.findIndex(s => !s.contains(style)) === -1;
  };
  private isStyleActive = (style: string): boolean => {
    return this.checkIfSelectionInStyle(style);
  };
  private toggleStyle = (style: string): void => {
    const editorState = this.props.editorStateList[this.props.focusedEditorIndex];
    const selectionState = editorState.getSelection();
    const startOffset = selectionState.getStartOffset();
    const endOffset = selectionState.getEndOffset();
    const selectedContentBlocks = getSelectedContentBlocksAsOrderedMap(editorState);
    const styledSelectedContentBlocks = selectedContentBlocks
      .mapEntries((entry, index) => {
        const key = entry[0] as string;
        const contentBlock = entry[1] as ContentBlock;
        const startPos = index === 0 ? startOffset : 0;
        const endPos = index === selectedContentBlocks.size - 1 ? endOffset : contentBlock.getCharacterList().size;
        const newCharacterList: List<CharacterMetadata> = contentBlock
          .getCharacterList()
          .map((characterMetadata: CharacterMetadata, index: number) => {
            if (index >= startPos && index < endPos) {
              return CharacterMetadata.applyStyle(characterMetadata, style);
            }
            return characterMetadata;
          }).toList();
        const newContentBlock: ContentBlock = new ContentBlock({
          key: key,
          type: contentBlock.getType(),
          characterList: newCharacterList,
          text: contentBlock.getText(),
        });
        return [key, newContentBlock];
      }) as OrderedMap<string, ContentBlock>;
    const newContentBlocks: Array<ContentBlock> = editorState
      .getCurrentContent()
      .getBlockMap()
      .map((contentBlock: ContentBlock, key: string): ContentBlock =>
        styledSelectedContentBlocks.has(key) ? styledSelectedContentBlocks.get(key) : contentBlock)
      .toArray();
    const newEditorState = EditorState.push(
      editorState,
      ContentState.createFromBlockArray(newContentBlocks),
      'change-inline-style');
    this.applyEditorState(newEditorState);
  }
}

export const ToolBar = connect(mapStateToProps, mapDispatchToProps)(ConnectedToolBar);

