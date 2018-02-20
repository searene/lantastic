import * as React from 'react';
import {connect, Dispatch} from "react-redux";
import {RootState} from "../reducers";
import {bindActionCreators} from "redux";
import {actions} from "../actions";
import * as fse from 'fs-extra';
import {Segment} from 'semantic-ui-react';
import {Editor, EditorState} from 'draft-js';

interface TestComponentProps {
}

interface TestComponentStates {
  editorState: EditorState,
}

const mapStateToProps = (state: RootState) => ({
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
}, dispatch);


export class ConnectedTestComponent extends React.Component<TestComponentProps, TestComponentStates> {

  private onChange: (editorState: EditorState) => void;

  constructor(props: TestComponentProps) {
    super(props);
    this.state =  {
      editorState: EditorState.createEmpty(),
    };
    this.onChange = (editorState: EditorState) => this.setState({editorState});
  }

  render() {
    return (
      <Editor editorState={this.state.editorState} onChange={this.onChange} />
    );
  }
}

export const TestComponent = connect(mapStateToProps, mapDispatchToProps)(ConnectedTestComponent);
