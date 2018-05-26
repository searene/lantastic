import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {Ref, Segment} from "semantic-ui-react";

import { RootState } from "../reducers";
import "../stylesheets/dictionaries/common.scss";
import "../stylesheets/dictionaries/dsl.scss";
import {AutoSuggestInput} from "./AutoSuggestInput";
import { getOS, isCtrlOrCommand, OS } from "../Utils/CommonUtils";
import { InternalApp } from "../App";
import { Keyboard } from "../services/Keyboard";
import { Set } from "immutable";
import { FindInputBox } from "./FindInputBox";
import { removeDisabledFailures } from "tslint";
import { actions } from "../actions";

const mapStateToProps = (state: RootState) => ({
  wordDefinitions: state.wordDefinitions,
  isFindInputBoxVisible: state.isFindInputBoxVisible,
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  setFindInputBoxVisible: (isFindInputBoxVisible: boolean) =>
    dispatch(actions.setFindInputBoxVisible(isFindInputBoxVisible)),
  setFindInputBoxFocused: (isFindInputBoxFocused: boolean) =>
    dispatch(actions.setFindInputBoxFocused(isFindInputBoxFocused)),
}, dispatch);

type DictionaryProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class InternalDictionary extends React.Component<DictionaryProps> {

  private static isShortcutRegistered = false;

  private definitionSegment: HTMLElement;

  public componentWillMount() {
    this.registerShortcuts();
  }

  public componentDidMount() {
    this.populateDefinition();
  }

  public componentDidUpdate() {
    this.populateDefinition();
  }

  public render() {
    console.log("render");
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        height: "100%",
      }}>
        <AutoSuggestInput
          onSearchCompleted={() => {this.definitionSegment.scrollTop = 0; }}
        />
        <div style={{
          marginTop: "5px",
          position: "relative",
          flexGrow: 1,
          overflow: "auto",
          border: "1px solid rgba(34,36,38,.15)",
          boxShadow: "0 1px 2px 0 rgba(34,36,38,.15)",
        }}>
          {
            this.props.isFindInputBoxVisible &&
            <FindInputBox/>
          }
          <Ref innerRef={(ref) => this.definitionSegment = ref}>
            <Segment style={{
              padding: "10px",
              width: "100%",
              borderRadius: 0,
              border: "none",
              boxShadow: "none",
            }}/>
          </Ref>
        </div>
      </div>
    );
  }
  private populateDefinition = () => {
    this.definitionSegment.innerHTML = this.getDefinitionHTMLs();
  }

  private getDefinitionHTMLs(): string {
    let html = "";
    for (const wordDefinition of this.props.wordDefinitions) {
      html += wordDefinition.html;
    }
    return html;
  }
  private registerShortcuts = () => {
    if (!InternalDictionary.isShortcutRegistered) {
      this.registerFindShortcut();
      InternalDictionary.isShortcutRegistered = true;
    }
  }
  private registerFindShortcut = () => {
    document.addEventListener("keydown", (event) => {
      if (InternalApp.isKeyWithCtrlOrCmdPressed([], "f")) {
        this.props.setFindInputBoxVisible(true);
        this.props.setFindInputBoxFocused(true);
      }
    });
  }
}

export const Dictionary = connect(mapStateToProps, mapDispatchToProps)(InternalDictionary);
