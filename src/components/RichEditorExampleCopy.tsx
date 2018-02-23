import * as React from 'react';
import {Editor, RichUtils, EditorState, ContentBlock, DraftEditorCommand} from "draft-js";
import {Menu} from 'semantic-ui-react';
import {MouseEventHandler} from "react";
import {MenuItemProps} from "semantic-ui-react/src/collections/Menu/MenuItem";

interface RichEditorExampleProps {

}
interface RichEditorExampleStates {
  editorState: EditorState;
}

export class RichEditorExampleCopy extends React.Component<RichEditorExampleProps, RichEditorExampleStates> {
  private editorComponent: Editor;
  private focus = () => {
    return this.editorComponent.focus();
  };
  private onChange = (editorState: EditorState) => this.setState({editorState});
  private toggleInlineStyle = (type: string) => this._toggleInlineStyle(type);
  constructor(props: RichEditorExampleProps) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
  }

  _toggleInlineStyle(inlineStyle: string) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  render() {
    const {editorState} = this.state;

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    return (
      <div className="RichEditor-root">
        <Menu icon className={"toolbar-container borderless"}>
          {INLINE_STYLES.map(type =>
            <div key={type.label}>
              <Menu.Item
                className={"toolbar-icon"}
                active={this.state.editorState.getCurrentInlineStyle().has(type.style)}
                onMouseDown={(event: any, data: any) => {
                  event.preventDefault();
                  this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, type.style))
                }}>
                {type.label}
              </Menu.Item>
              <span onMouseDown={(e: React.SyntheticEvent<HTMLSpanElement>) => {
                e.preventDefault();
                this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, type.style));
              }}>{type.label}</span>
            </div>
          )}
        </Menu>
        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            editorState={editorState}
            onChange={this.onChange}
            ref={ref => this.editorComponent = ref}
          />
        </div>
      </div>
    );
  }
}

function getBlockStyle(block: ContentBlock): string {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
}

interface StyleButtonProps {
  onToggle: (style: string) => void;
  style: string;
  active: boolean;
  label: string;
}

export class StyleButton extends React.Component<StyleButtonProps> {
  onToggle = (e: React.SyntheticEvent<HTMLSpanElement>) => {
    e.preventDefault();
    this.props.onToggle(this.props.style);
  };

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
              {this.props.label}
            </span>
    );
  }
}

const INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
  {label: 'Monospace', style: 'CODE'},
];

interface InlineStyleControlsProps {
  editorState: EditorState;
  onToggle: (style: string) => void;
}

