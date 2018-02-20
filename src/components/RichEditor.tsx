import * as React from 'react';
import {connect, Dispatch} from "react-redux";
import {RootState} from "../reducers";
import {bindActionCreators} from "redux";
import {actions} from "../actions";
import * as fse from 'fs-extra';
import {Segment} from 'semantic-ui-react';
import {Editor, EditorState} from 'draft-js';
import '../stylesheets/components/RichEditor.scss';

interface RichEditorProps {
  editorState: EditorState;
  setEditorState: (editorState: EditorState) => any;
}

interface RichEditorStates {
  editorState: EditorState,
}

const mapStateToProps = (state: RootState) => ({
  editorState: state.editorState,
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  setEditorState: actions.setEditorState,
}, dispatch);


export class ConnectedRichEditor extends React.Component<RichEditorProps, RichEditorStates> {

  constructor(props: RichEditorProps) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }

  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        onFocus={this.onFocus}
        onChange={this.onChange}/>
    );
  }

  private onChange = (editorState: EditorState): void => {

    // render is done according to the internal state
    this.setState({editorState});

    // notify the toolbar of this change
    this.props.setEditorState(editorState);
  };
  private onFocus = (): void => {

    // set the current editorState as the active one
    this.props.setEditorState(this.state.editorState);
  }
}

export const RichEditor = connect(mapStateToProps, mapDispatchToProps)(ConnectedRichEditor);
