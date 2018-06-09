import { EditorState } from "draft-js";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState } from "../reducers";
import { actions } from "../actions";

interface TestComponentStates {
  editorState: EditorState;
}

const mapStateToProps = (state: RootState) => ({
  findWord: state.findWord
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setFindWord: actions.setFindWord
    },
    dispatch
  );

type TestComponentProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export class InternalTestComponent extends React.Component<TestComponentProps, TestComponentStates> {
  componentDidMount() {
    this.props.setFindWord("abc");
  }
  componentDidUpdate() {
    console.log("update");
    this.props.setFindWord("abc");
  }
  render() {
    return <div>{this.props.findWord}</div>;
  }
}

export const TestComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(InternalTestComponent);
