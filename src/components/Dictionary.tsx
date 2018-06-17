import * as React from "react";
import { AutoSuggestInput } from "./AutoSuggestInput";
import WebviewTag = Electron.WebviewTag;
import { SearchEnabledWebview } from "./SearchEnabledWebview";

interface DictionaryStates {
  definition: string;
}

interface DictionaryProps {}

export class Dictionary extends React.Component<DictionaryProps, DictionaryStates> {

  // for recovering previous states when remounting
  static previousDefinition = "";

  constructor(props: DictionaryProps) {
    super(props);
    this.state = {
      definition: Dictionary.previousDefinition,
    };
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
          onSearchCompleted={html => {
            this.setState({ definition: html });
            Dictionary.previousDefinition = html;
          }}
        />
        <SearchEnabledWebview definition={this.state.definition} webviewRef={ref => (this.webview = ref)} />
      </div>
    );
  }
}
