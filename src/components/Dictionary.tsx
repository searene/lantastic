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
import WebviewTag = Electron.WebviewTag;

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
      setFindWordIndex: actions.setFindWordIndex,
    },
    dispatch
  );

type DictionaryProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class InternalDictionary extends React.Component<DictionaryProps, DictionaryStates> {
  constructor(props: DictionaryProps) {
    super(props);
  }

  private webview: WebviewTag;

  public componentDidMount() {
    this.registerShortcuts();
    this.insertCSS();
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
            this.webview.scrollTop = 0;
            let html = getDefinitionHTML(this.props.wordDefinitions);
            html = `<div style="height: 1000px">${html}</div>`
            this.webview.src = `data:text/html,${html}`;
          }}
        />
        <div
          style={{
            marginTop: "5px",
            position: "relative",
            flexGrow: 1,
            flexDirection: "column",
            display: "flex",
            overflow: "auto",
            border: "1px solid rgba(34,36,38,.15)",
            boxShadow: "0 1px 2px 0 rgba(34,36,38,.15)"
          }}
        >
          {this.props.isFindInputBoxVisible && <FindInputBox textContainerId="definition-segment" />}

          <webview
            src="data:text/html,"
            ref={ref => this.webview = ref as WebviewTag}
            style={{
              height: "100%",
              padding: "10px",
              flexGrow: 1,
            }}
          />
        </div>
      </div>
    )
  }
  private registerShortcuts = () => {
    this.registerFindShortcut();
    this.registerEverythingAboutWebview();
  };
  private registerFindShortcut = () => {
    document.addEventListener("keydown", event => {
      if (InternalApp.isKeyWithCtrlOrCmdPressed([], "f")) {
        this.props.setFindInputBoxVisible(true);
        this.props.setFindInputBoxFocused(true);
      }
    });
  };
  private registerEverythingAboutWebview = () => {
    this.registerConsoleMessage();
    this.insertCSS();
  };
  private registerConsoleMessage = () => {
    this.webview.addEventListener("console-message", event => {
      console.log("webview message: " + event.message);
    });
  };
  private insertCSS = () => {
    const css = this.commonCSS + this.dslCSS;
    this.webview.addEventListener("dom-ready", event => {
      this.webview.insertCSS(css);
    });
  };
  private commonCSS = `
    .sound-img {
      width: 25px;
      height: 25px;
    }
    .dict-title {
      text-align: center;
      padding: 20px;
      border: 1px dashed black;
      font-weight: 700;
      font-size: 21px;
    }
    .dp-entry {
      margin: 10px 0;
      font-size: 20px;
      font-weight: 700;
    }
  `;
  private dslCSS = `
    .dsl-headwords {
      font-weight: bold;
      margin-top: 15px;
      margin-bottom: 10px;
    }
    .dsl-headwords p {
      font-weight: bold;
      font-size: 15px;
      margin: 0;
    }
    .dsl-b {
      font-weight: bold;
    }
    .dsl-i {
      font-style: italic;
    }
    .dsl-u {
      text-decoration: underline;
    }
    .dsl-m0 {
      padding-left: 0;
    }
    .dsl-m1 {
      padding-left: 9px;
    }
    .dsl-m2 {
      padding-left: 18px;
    }
    .dsl-m3 {
      padding-left: 27px;
    }
    .dsl-m4 {
      padding-left: 36px;
    }
    .dsl-m5 {
      padding-left: 45px;
    }
    .dsl-m6 {
      padding-left: 54px;
    }
    .dsl-m7 {
      padding-left: 63px;
    }
    .dsl-m8 {
      padding-left: 72px;
    }
    .dsl-m9 {
      padding-left: 81px;
    }
    .dsl-opt {
      display: inline;
      color: gray;
    }
    .dsl-p {
      color: green;
      font-style: italic;
    }
    .dsl-ref {
      color: blue;
      text-decoration: underline;
    }
  `;
}

export const Dictionary = connect(
  mapStateToProps,
  mapDispatchToProps
)(InternalDictionary);
