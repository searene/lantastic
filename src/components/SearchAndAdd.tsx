import * as React from "react";
import * as SplitPane from "react-split-pane";
import {AddCard} from "./AddCard";
import {Dictionary} from "./Dictionary";

import "../stylesheets/components/SearchAndAdd.scss";

export class SearchAndAdd extends React.Component {

  public render() {
    return (
      <div style={{position: "relative", flex: "1"}}>
        <SplitPane
          split="vertical"
          primary={"second"}
          minSize={200}
          maxSize={-100}
          defaultSize="40%">
          <Dictionary/>
          <AddCard/>
        </SplitPane>
      </div>
    );
  }
}
