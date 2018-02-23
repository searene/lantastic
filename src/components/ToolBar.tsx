import * as React from 'react';
import {connect, Dispatch} from "react-redux";
import {RootState} from "../reducers";
import {bindActionCreators} from "redux";
import {actions} from "../actions";
import {Icon, Menu, SemanticICONS, Dropdown} from 'semantic-ui-react';
import {CharacterMetadata, EditorState, ContentState, ContentBlock, RichUtils, SelectionState, Modifier} from 'draft-js';
import Select from 'react-select';

import '../stylesheets/components/ToolBar.scss'
import {
  DRAFT_INLINE_STYLE_BOLD, DRAFT_INLINE_STYLE_ITALIC, DRAFT_INLINE_STYLE_UNDERLINE,
} from "../Utils/DraftJsUtils";

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

  private INLINE_ICONS = [{
    style: DRAFT_INLINE_STYLE_BOLD,
    icon: 'bold',
  }, {
    style: DRAFT_INLINE_STYLE_ITALIC,
    icon: 'italic',
  }, {
    style: DRAFT_INLINE_STYLE_UNDERLINE,
    icon: 'underline',
  }];

  private BLOCK_TYPES = [
    {label: 'Normal', style: 'unstyled'},
    {label: 'H1', style: 'header-one'},
    {label: 'H2', style: 'header-two'},
    {label: 'H3', style: 'header-three'},
    {label: 'H4', style: 'header-four'},
    {label: 'H5', style: 'header-five'},
    {label: 'H6', style: 'header-six'},
    {label: 'Blockquote', style: 'blockquote'},
  ];

  render() {
    return (
      <Menu icon className={"toolbar-container borderless"}>
        <Dropdown text={"type"} pointing className={"link item"}>
          <Dropdown.Menu>
            {this.BLOCK_TYPES.map(blockType =>
              <Dropdown.Item
                key={blockType.style}
                onMouseDown={(e: React.SyntheticEvent<HTMLDivElement>) => {
                e.preventDefault();
                this.toggleBlockStyle(blockType.style);
              }}>{blockType.label}</Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
        {this.INLINE_ICONS.map(inlineIcon =>
          <Menu.Item
            key={inlineIcon.style}
            className={"toolbar-icon"}
            active={this.isStyleActive(inlineIcon.style)}
            onMouseDown={(e: React.SyntheticEvent<HTMLDivElement>) => {
              e.preventDefault();
              this.toggleInlineStyle(inlineIcon.style);
            }}>
            <Icon name={inlineIcon.icon as SemanticICONS} />
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
  private toggleBlockStyle = (style: string): void => {
    this.applyEditorState(
      RichUtils.toggleBlockType(
        this.getEditorState(),
        style
      )
    );
  };
}

export const ToolBar = connect(mapStateToProps, mapDispatchToProps)(ConnectedToolBar);

