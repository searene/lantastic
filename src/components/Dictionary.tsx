import * as React from "react";
import { AutoSuggestInput } from "./AutoSuggestInput";
import { SearchEnabledWebview } from "./SearchEnabledWebview";

interface IDictionaryStates {
  definition: string;
}

export class Dictionary extends React.Component<{}, IDictionaryStates> {
  // for recovering previous states when remounting
  public static previousDefinition = "";

  constructor(props: {}) {
    super(props);
    this.state = {
      definition: Dictionary.previousDefinition
    };
  }

  public render() {
    return (
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          height: "100%"
        }}
      >
        <AutoSuggestInput onSearchCompleted={this.handleSearchCompleted}/>
        <SearchEnabledWebview definition={this.state.definition} />
      </div>
    );
  }

  private handleSearchCompleted = (html: string) => {
    this.setState({ definition: html });
    Dictionary.previousDefinition = html;
  };
}
