import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { Ref, Segment } from "semantic-ui-react";
import { RootState } from "../reducers";
import "../stylesheets/dictionaries/common.scss";
import "../stylesheets/dictionaries/dsl.scss";
import { AutoSuggestInput } from "./AutoSuggestInput";
import { InternalApp } from "../App";
import { List } from "immutable";
import { FindInputBox } from "./FindInputBox";
import { actions } from "../actions";
import { WordDefinition } from "dict-parser";

export const getDefinitionHTML = (wordDefinitions: List<WordDefinition>): string => {
  return wordDefinitions.reduce((r, wordDefinition) => r + wordDefinition.html, "");
};

interface DictionaryStates {}

const mapStateToProps = (state: RootState) => ({
  wordDefinitions: state.wordDefinitions,
  isFindInputBoxVisible: state.isFindInputBoxVisible,
  findWord: state.findWord,
  findWordIndex: state.findWordIndex,
  highlightedDefinitionsHTML: state.highlightedDefinitionsHTML
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setFindInputBoxVisible: actions.setFindInputBoxVisible,
      setFindInputBoxFocused: actions.setFindInputBoxFocused,
      setFindWordIndex: actions.setFindWordIndex,
      setDefinitionsDOM: actions.setDefinitionsDOM
    },
    dispatch
  );

type DictionaryProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class InternalDictionary extends React.Component<DictionaryProps, DictionaryStates> {
  constructor(props: DictionaryProps) {
    super(props);
  }

  private definitionSegment: HTMLElement;

  public componentDidMount() {
    this.registerShortcuts();
  }

  public componentDidUpdate(prevProps: DictionaryProps) {
    if (prevProps.wordDefinitions !== this.props.wordDefinitions) {
      const html = getDefinitionHTML(this.props.wordDefinitions);
      const dom = new DOMParser().parseFromString(html, "text/html");
      this.definitionSegment.innerHTML = html;
      this.props.setDefinitionsDOM(dom);
    }
    if (prevProps.highlightedDefinitionsHTML !== this.props.highlightedDefinitionsHTML) {
      this.definitionSegment.innerHTML = this.props.highlightedDefinitionsHTML;
    }
  }

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
            this.definitionSegment.scrollTop = 0;
          }}
        />
        <div
          style={{
            marginTop: "5px",
            position: "relative",
            flexGrow: 1,
            overflow: "auto",
            border: "1px solid rgba(34,36,38,.15)",
            boxShadow: "0 1px 2px 0 rgba(34,36,38,.15)"
          }}
        >
          {this.props.isFindInputBoxVisible && <FindInputBox textContainerId="definition-segment" />}
          <Ref innerRef={ref => (this.definitionSegment = ref)}>
            <Segment
              style={{
                padding: "10px",
                width: "100%",
                borderRadius: 0,
                border: "none",
                boxShadow: "none",
                id: "definition-segment"
              }}
            />
          </Ref>
        </div>
      </div>
    );
  }

  private registerShortcuts = () => {
    this.registerFindShortcut();
  };
  private registerFindShortcut = () => {
    document.addEventListener("keydown", event => {
      if (InternalApp.isKeyWithCtrlOrCmdPressed([], "f")) {
        this.props.setFindInputBoxVisible(true);
        this.props.setFindInputBoxFocused(true);
      }
    });
  };
}

export const Dictionary = connect(
  mapStateToProps,
  mapDispatchToProps
)(InternalDictionary);
