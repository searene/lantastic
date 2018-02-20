import * as React from 'react';
import {Dictionary} from "./Dictionary";
import {AddCard} from "./AddCard";
import * as SplitPane from "react-split-pane";

import '../stylesheets/components/SearchAndAdd.scss';

interface SearchAndAddProps {

}

export class SearchAndAdd extends React.Component<SearchAndAddProps, {}> {

  render() {
    return (
      <div style={{position: 'relative', flex: '1'}}>
        <SplitPane split="vertical" minSize={50} defaultSize='40%'>
          <Dictionary/>
          <AddCard/>
        </SplitPane>
      </div>
    );
  }
}
