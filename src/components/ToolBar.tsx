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
  blockType: string;
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
    this.state = {
      blockType: this.BLOCK_TYPE_LABEL_NORMAL_TEXTS
    };
  }

  private BLOCK_TYPE_LABEL_HEADING1 = 'Heading 1';
  private BLOCK_TYPE_LABEL_HEADING2 = 'Heading 2';
  private BLOCK_TYPE_LABEL_HEADING3 = 'Heading 3';
  private BLOCK_TYPE_LABEL_NORMAL_TEXTS = 'Normal Text';

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
    {label: this.BLOCK_TYPE_LABEL_HEADING1, style: 'header-one'},
    {label: this.BLOCK_TYPE_LABEL_HEADING2, style: 'header-two'},
    {label: this.BLOCK_TYPE_LABEL_HEADING3, style: 'header-three'},
    {label: this.BLOCK_TYPE_LABEL_NORMAL_TEXTS, style: 'unstyled'},
  ];

  render() {
    return (
      <Menu icon className={"toolbar-container borderless"}>
        <Dropdown text={this.state.blockType} pointing className={"link item"}>
          <Dropdown.Menu>
            {this.BLOCK_TYPES.map(blockType =>
              <Dropdown.Item
                key={blockType.style}
                className={blockType.style}
                onMouseDown={(event: React.SyntheticEvent<HTMLDivElement>) => this.handleMouseDownOnBlockTypeDropdown.call(this, event, blockType)}>{blockType.label}</Dropdown.Item>
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
  private handleMouseDownOnBlockTypeDropdown = (event: React.SyntheticEvent<HTMLDivElement>, blockType: {label: string, style: string}): void => {
    event.preventDefault();
    this.toggleBlockStyle(blockType.style);
    this.setState({
      blockType: blockType.label
    });
  };
}

export const ToolBar = connect(mapStateToProps, mapDispatchToProps)(ConnectedToolBar);

