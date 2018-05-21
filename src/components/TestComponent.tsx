import {EditorState} from "draft-js";
import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {bindActionCreators} from "redux";
import {RootState} from "../reducers";

interface TestComponentStates {
  editorState: EditorState;
}

const mapStateToProps = (state: RootState) => ({});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({}, dispatch);

type TestComponentProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export class ConnectedTestComponent extends React.Component<TestComponentProps, TestComponentStates> {
}

export const TestComponent = connect(mapStateToProps, mapDispatchToProps)(ConnectedTestComponent);
