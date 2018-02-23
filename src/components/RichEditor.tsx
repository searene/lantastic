import * as React from 'react';
import {connect, Dispatch} from "react-redux";
import {RootState} from "../reducers";
import {bindActionCreators} from "redux";
import {actions} from "../actions";
import * as fse from 'fs-extra';
import {Segment} from 'semantic-ui-react';
import {Editor, EditorState, RichUtils, DraftEditorCommand, DraftHandleValue} from 'draft-js';
import '../stylesheets/components/RichEditor.scss';
import {getSelectedCharacterStyles} from "../Utils/DraftJsUtils";

interface RichEditorProps {
  editorIndex: number;
  editorStateList: EditorState[];
  focusedEditorIndex: number;
  setEditorStateList: (editorStateList: EditorState[]) => any;
  setFocusedEditorIndex: (focusedEditorIndex: number) => any;
}

interface RichEditorStates {
}

const mapStateToProps = (state: RootState) => ({
  editorStateList: state.editorStateList,
  focusedEditorIndex: state.focusedEditorIndex,
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  setEditorStateList: actions.setEditorStateList,
  setFocusedEditorIndex: actions.setFocusedEditorIndex,
}, dispatch);


export class ConnectedRichEditor extends React.Component<RichEditorProps, RichEditorStates> {

  render() {
    return (
      <Editor
        editorState={this.props.editorStateList[this.props.editorIndex]}
        handleKeyCommand={this.handleKeyCommand}
        onTab={(e: React.KeyboardEvent<{}>) => {
          e.preventDefault();
          this.onChange(RichUtils.onTab(e, this.getEditorState(), 4))
        }}
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
    if(newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };
}

export const RichEditor = connect(mapStateToProps, mapDispatchToProps)(ConnectedRichEditor);
