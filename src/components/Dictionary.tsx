import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { Ref, Segment } from "semantic-ui-react";
import { RootState } from "../reducers";
import { AutoSuggestInput } from "./AutoSuggestInput";
import { InternalApp } from "../App";
import { List } from "immutable";
import { actions } from "../actions";
import { WordDefinition } from "dict-parser";
import * as fse from "fs-extra";
import WebviewTag = Electron.WebviewTag;
import { SearchEnabledWebview } from "./SearchEnabledWebview";

export const getDefinitionHTML = (wordDefinitions: List<WordDefinition>): string => {
  const multipleLineHTML = wordDefinitions.reduce((r, wordDefinition) => r + wordDefinition.html, "");
  const singleLineHTML = multipleLineHTML.replace(/[\r\n]/g, "");
  return singleLineHTML;
};

interface DictionaryStates {}

const mapStateToProps = (state: RootState) => ({
  wordDefinitions: state.wordDefinitions,
  isFindInputBoxVisible: state.isFindInputBoxVisible,
  findWord: state.findWord,
  findWordIndex: state.findWordIndex
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setFindInputBoxVisible: actions.setFindInputBoxVisible,
      setFindInputBoxFocused: actions.setFindInputBoxFocused,
      setFindWordIndex: actions.setFindWordIndex
    },
    dispatch
  );

type DictionaryProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class InternalDictionary extends React.Component<DictionaryProps, DictionaryStates> {
  constructor(props: DictionaryProps) {
    super(props);
  }

  private webview: WebviewTag;

  public render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          height: "100%"
        }}
      >
        <AutoSuggestInput
          onSearchCompleted={() => {
            this.webview.scrollTop = 0;
            let html = getDefinitionHTML(this.props.wordDefinitions);
            html = `<div style="height: 1000px">${html}</div>`;
            this.webview.src = `data:text/html;charset=UTF-8,${html}`;
          }}
        />
        <SearchEnabledWebview
          webviewRef={ref => this.webview = ref}
        />
      </div>
    );
  }
}

export const Dictionary = connect(
  mapStateToProps,
  mapDispatchToProps
)(InternalDictionary);
