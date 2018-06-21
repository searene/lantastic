import * as React from "react";
import * as SplitPane from "react-split-pane";
import { AddCard } from "./AddCard";
import { Dictionary } from "./Dictionary";

import "../stylesheets/components/SearchAndAdd.scss";

interface ISearchAndAddProps {
  onSearchInputBoxVisibilityChange: (show: boolean) => void;
  showSearchInputBox: boolean;
}

export class SearchAndAdd extends React.Component<ISearchAndAddProps> {
  constructor(props: ISearchAndAddProps) {
    super(props);
  }
  public render() {
    return (
      <div style={{ position: "relative", flex: "1" }}>
        <SplitPane split="vertical" primary={"second"} minSize={200} maxSize={-100} defaultSize="60%">
          <Dictionary
            onSearchInputBoxVisibilityChange={this.props.onSearchInputBoxVisibilityChange}
            showSearchInputBox={this.props.showSearchInputBox}
          />
          <AddCard />
        </SplitPane>
      </div>
    );
  }
}
