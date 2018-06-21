import * as React from "react";
import { Icon, Input, Ref, SemanticICONS } from "semantic-ui-react";
import "../stylesheets/components/SearchEnabledWebview.scss";
import { MouseEventHandler } from "react";
import WebviewTag = Electron.WebviewTag;
import FoundInPageEvent = Electron.FoundInPageEvent;
import * as fse from "fs-extra";
import * as path from "path";
import { Shortcuts } from "react-shortcuts";

interface ISearchEnabledWebviewProps {
  onSearchInputBoxVisibilityChange: (show: boolean) => void;
  showSearchInputBox: boolean;
  definition: string;
}

interface ISearchEnabledWebviewStates {
  activeMatchOrdinal: number;
  totalMatches: number;
}

export class SearchEnabledWebview extends React.Component<ISearchEnabledWebviewProps, ISearchEnabledWebviewStates> {
  private input: HTMLInputElement;
  private webview: WebviewTag;

  constructor(props: ISearchEnabledWebviewProps) {
    super(props);
    this.state = {
      activeMatchOrdinal: 0,
      totalMatches: 0
    };
  }

  public async componentDidMount() {
    await this.registerWebviewEventListeners();
    this.showDefinition();
  }

  public componentDidUpdate(prevProps: ISearchEnabledWebviewProps, prevStates: ISearchEnabledWebviewStates) {
    if (!prevProps.showSearchInputBox && this.props.showSearchInputBox) {
      this.resetSearchCounts();
      this.registerInputEventListeners();
      this.focusSearchInputBox();
    }
    if (this.props.definition !== prevProps.definition) {
      this.showDefinition();
    }
  }

  public render() {
    return (
      <div
        style={{
          border: "1px solid rgba(34,36,38,.15)",
          boxShadow: "0 1px 2px 0 rgba(34,36,38,.15)",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          marginTop: "5px",
          overflow: "auto",
          position: "relative"
        }}
      >
        {this.props.showSearchInputBox && (
          <Shortcuts
            className="find-input-container"
            name="SearchEnabledWebview"
            handler={this.handleShortcuts}
            style={{
            }}
          >
            <Ref innerRef={this.handleInputRef}>
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
          </Shortcuts>
        )}
        <webview
          preload="./DefinitionWebviewPreload.js"
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
    this.registerInputChangeEvents();
  };
  private registerWebviewEventListeners = async () => {
    this.registerFoundInPage();
    this.registerConsoleMessage();
    await this.insertCSS();
  };
  private registerConsoleMessage = () => {
    this.webview.addEventListener("console-message", event => {
      // tslint:disable:no-console
      console.log("webview message: " + event.message);
      // tslint:enable:no-console
    });
  };
  private insertCSS = async () => {
    const css = await fse.readFile(path.resolve(__dirname, "css/dictionary.css"), "UTF-8");
    this.webview.addEventListener("dom-ready", event => {
      this.webview.insertCSS(css);
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
    this.webview.send("load-html", this.props.definition);
  };
  private closeSearchInputBox = () => {
    this.props.onSearchInputBoxVisibilityChange(false);
    this.webview.stopFindInPage("clearSelection");
  };
  private handleInputRef = (ref: HTMLElement) => {
    this.input = ref.childNodes[0] as HTMLInputElement;
  };
  private handleShortcuts = (action: string) => {
    if (action === "closeSearchInputBox") {
      this.closeSearchInputBox();
    } else if (action === "findNext") {
      this.findNext();
    } else if (action === "findPrev") {
      this.findPrev();
    }
  };
  private focusSearchInputBox = () => {
    this.input.focus();
  };
}
