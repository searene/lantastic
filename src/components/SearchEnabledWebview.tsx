import * as React from "react";
import { Icon, Input, Ref, SemanticICONS } from "semantic-ui-react";
import "../stylesheets/components/FindInputBox.scss";
import { MouseEventHandler } from "react";
import WebviewTag = Electron.WebviewTag;
import { InternalApp } from "../App";
import FoundInPageEvent = Electron.FoundInPageEvent;
import { Keyboard } from "../services/Keyboard";

interface SearchEnabledWebviewProps {
  definition: string;
}

interface SearchEnabledWebviewStates {
  showSearchInputBox: boolean;
  activeMatchOrdinal: number;
  totalMatches: number;
}

export class SearchEnabledWebview extends React.Component<SearchEnabledWebviewProps, SearchEnabledWebviewStates> {
  private input: HTMLInputElement;
  private webview: WebviewTag;

  constructor(props: SearchEnabledWebviewProps) {
    super(props);
    this.state = {
      showSearchInputBox: false,
      activeMatchOrdinal: 0,
      totalMatches: 0
    };
  }

  componentDidMount() {
    this.registerShowFindInputBoxShortcut();
    this.registerWebviewEventListeners();
    this.showDefinition();
  }

  public componentDidUpdate(prevProps: SearchEnabledWebviewProps, prevStates: SearchEnabledWebviewStates) {
    if (!prevStates.showSearchInputBox && this.state.showSearchInputBox) {
      this.resetSearchCounts();
      this.registerInputEventListeners();
    }
    if (this.props.definition !== prevProps.definition) {
      this.showDefinition();
    }
  }

  public render() {
    return (
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
        {this.state.showSearchInputBox && (
          <div
            style={{
              position: "absolute",
              zIndex: 999,
              display: "flex",
              top: 0,
              width: "100%",
              border: "1px solid rgba(34,36,38,.15)",
              padding: "9.5px 0 9.5px 14px",
              backgroundColor: "white"
            }}
          >
            <Ref innerRef={ref => (this.input = ref.childNodes[0] as HTMLInputElement)}>
              <Input
                className={"find-input"}
                style={{
                  flexGrow: 1,
                  borderRight: "1px solid rgba(34,36,38,.15)",
                  marginRight: "10px"
                }}
              />
            </Ref>
            <div
              style={{
                color: "#9F9F9F",
                marginRight: "10px"
              }}
            >
              {this.state.activeMatchOrdinal} / {this.state.totalMatches}
            </div>
            {this.inputIcon("chevron up", this.findPrev)}
            {this.inputIcon("chevron down", this.findNext)}
            {this.inputIcon("close", () => this.closeSearchInputBox())}
          </div>
        )}
        <webview
          src="data:text/html;charset=UTF-8,"
          ref={ref => (this.webview = ref as WebviewTag)}
          style={{
            height: "100%",
            margin: "10px 0 0 10px",
            flexGrow: 1
          }}
        />
      </div>
    );
  }

  private resetSearchCounts = () => {
    this.setState({
      activeMatchOrdinal: 0,
      totalMatches: 0
    });
  };
  private inputIcon = (iconName: SemanticICONS, handler: MouseEventHandler<HTMLDivElement>): React.ReactNode => {
    return (
      <div
        className={"find-input-icon-container"}
        style={{
          marginRight: "10px"
        }}
        onClick={handler}
      >
        <Icon name={iconName} />
      </div>
    );
  };
  private findPrev = () => {
    const searchText = this.input.value;
    if (searchText) {
      this.webview.findInPage(searchText, {
        forward: false,
        findNext: true
      });
    }
  };
  private findNext = () => {
    const searchText = this.input.value;
    if (searchText) {
      this.webview.findInPage(searchText, {
        findNext: true
      });
    }
  };
  private registerInputEventListeners = () => {
    this.registerInputKeyboardShortcuts();
    this.registerInputChangeEvents();
  };
  private registerWebviewEventListeners = () => {
    this.registerFoundInPage();
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
  private registerShowFindInputBoxShortcut = () => {
    document.addEventListener("keydown", event => {
      if (InternalApp.isKeyWithCtrlOrCmdPressed([], "f")) {
        this.setState({ showSearchInputBox: true });
        this.input.focus();
      }
    });
  };
  private registerInputKeyboardShortcuts = () => {
    this.input.addEventListener("keyup", event => {
      if (InternalApp.isKeyPressed([Keyboard.KEY_SHIFT], "Enter")) {
        this.findPrev();
      } else if (event.key === "Enter") {
        this.findNext();
      } else if (event.key === "Escape") {
        this.closeSearchInputBox();
      }
    });
  };
  private registerFoundInPage = () => {
    this.webview.addEventListener("found-in-page", (event: FoundInPageEvent) => {
      this.setState({
        activeMatchOrdinal: event.result.activeMatchOrdinal,
        totalMatches: event.result.matches
      });
    });
  };
  private registerInputChangeEvents = () => {
    this.input.addEventListener("input", event => {
      const searchText = (event.currentTarget as HTMLInputElement).value;
      if (searchText) {
        this.webview.findInPage(searchText);
      } else {
        this.webview.stopFindInPage("clearSelection");
      }
    });
  };
  private showDefinition = () => {
    this.webview.scrollTop = 0;
    this.webview.src = `data:text/html;charset=UTF-8,${this.props.definition}`;
  };
  private closeSearchInputBox = () => {
    this.setState({ showSearchInputBox: false });
    this.webview.stopFindInPage("clearSelection");
  };
  private commonCSS = `
    .dictp-sound-img {
      width: 25px;
      height: 25px;
    }
    .dictp-sound-img:hover {
      cursor: pointer;
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
