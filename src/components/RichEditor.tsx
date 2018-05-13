import * as React from 'react';
import {connect, Dispatch} from "react-redux";
import {RootState} from "../reducers";
import {bindActionCreators} from "redux";
import {actions} from "../actions";
import {EditorState, RichUtils, DraftEditorCommand, DraftHandleValue, Modifier} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createImagePlugin from 'draft-js-image-plugin';
import '../stylesheets/components/RichEditor.scss';
import {RichEditorPasteHandler} from "../RichEditorPasteHandler";

interface RichEditorStates {
}

const mapStateToProps = (state: RootState) => ({
  editorStateList: state.editorStateList,
  focusedEditorIndex: state.focusedEditorIndex,
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  setEditorStateList: actions.setEditorStateList,
  setFocusedEditorIndex: actions.setFocusedEditorIndex,
}, dispatch);

type RichEditorProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & {
  editorIndex: number;
}

export class ConnectedRichEditor extends React.Component<RichEditorProps, RichEditorStates> {

  private imagePlugin = createImagePlugin();

  render() {
    return (
      <Editor
        editorState={this.props.editorStateList[this.props.editorIndex]}
        handleKeyCommand={this.handleKeyCommand}
        handlePastedText={this.handlePastedText}
        onTab={(e: React.KeyboardEvent<{}>) => {
          e.preventDefault();
          this.onChange(RichUtils.onTab(e, this.getEditorState(), 4))
        }}
        plugins={[this.imagePlugin]}
        onFocus={this.onFocus}
        onChange={this.onChange}/>
    );
  }

  private onChange = (editorState: EditorState): void => {
    const newEditorStateList = this.props.editorStateList.concat();
    newEditorStateList[this.props.editorIndex] = editorState;
    this.props.setEditorStateList(newEditorStateList);
  };
  private getEditorState = (): EditorState => {
    return this.props.editorStateList[this.props.editorIndex];
  };
  private onFocus = (): void => {
    this.props.setFocusedEditorIndex(this.props.editorIndex);
  };
  private handleKeyCommand = (command: DraftEditorCommand | string, editorState: EditorState): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };
  private handlePastedText = (text: string, html: string | undefined, editorState: EditorState): DraftHandleValue => {
    const newEditorState = new RichEditorPasteHandler().getEditorStateFromHTML(html);
    this.onChange(newEditorState);
    return 'handled';
  };
}

export const RichEditor = connect(mapStateToProps, mapDispatchToProps)(ConnectedRichEditor);
