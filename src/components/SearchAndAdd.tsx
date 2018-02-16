import * as React from 'react';
import {Dictionary} from "./Dictionary";
import {Field} from "./Field";
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
          <Field/>
        </SplitPane>
      </div>
    );
  }
}
