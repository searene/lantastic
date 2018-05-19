import {Editor, EditorState, RichUtils} from "draft-js";
import * as fse from "fs-extra";
import {emptyDir} from "fs-extra";
import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {bindActionCreators} from "redux";
import {Segment} from "semantic-ui-react";
import {Icon, Input} from "semantic-ui-react";
import {actions} from "../actions";
import {IRootState} from "../reducers";
import {BaseButton} from "./BaseButton";

interface TestComponentStates {
  editorState: EditorState;
}

const mapStateToProps = (state: IRootState) => ({});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({}, dispatch);

type TestComponentProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export class ConnectedTestComponent extends React.Component<TestComponentProps, TestComponentStates> {

  private onChange: (editorState: EditorState) => void;

  constructor(props: TestComponentProps) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
    this.onChange = (editorState: EditorState) => this.setState({editorState});
  }

  private handleClick = (evt: React.SyntheticEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    const content = this.state.editorState.getCurrentContent();
    const contentWithEntity = content.createEntity("LINK", "MUTABLE", { url: "https://www.google.com" });
    const newEditorState = EditorState.push(this.state.editorState, contentWithEntity, "apply-entity");
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    contentWithEntity.getBlockMap().map((contentBlock) => {
      contentBlock.getCharacterList().map((character) => {
        console.log(character.getEntity());
      });
    });
    this.onChange(RichUtils.toggleLink(newEditorState, this.state.editorState.getSelection(), entityKey));
  }

  public render() {
    return (
      <div>
        <button onClick={this.handleClick}>click</button>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export const TestComponent = connect(mapStateToProps, mapDispatchToProps)(ConnectedTestComponent);
