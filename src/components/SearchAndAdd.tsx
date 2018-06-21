import * as React from "react";
import * as SplitPane from "react-split-pane";
import { AddCard } from "./AddCard";
import { Dictionary } from "./Dictionary";

import "../stylesheets/components/SearchAndAdd.scss";

interface ISearchAndAddProps {
  onSearchInputBoxVisibilityChange: (show: boolean) => void;
  showSearchInputBox: boolean;
}

interface ISearchAndAddStates {
  searchWord: string;
}

export class SearchAndAdd extends React.Component<ISearchAndAddProps, ISearchAndAddStates> {
  constructor(props: ISearchAndAddProps) {
    super(props);
    this.state = {
      searchWord: ""
    };
  }
  public render() {
    return (
      <div style={{ position: "relative", flex: "1" }}>
        <SplitPane split="vertical" primary={"second"} minSize={200} maxSize={-100} defaultSize="60%">
          <Dictionary
            searchWord={this.state.searchWord}
            onSearchWordChange={this.handleSearchWordChange}
            onSearchInputBoxVisibilityChange={this.props.onSearchInputBoxVisibilityChange}
            showSearchInputBox={this.props.showSearchInputBox}
          />
          <AddCard searchWord={this.state.searchWord}/>
        </SplitPane>
      </div>
    );
  }

  private handleSearchWordChange = (word: string) => {
    this.setState({
      searchWord: word
    });
  };
}
