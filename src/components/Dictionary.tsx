import {WordDefinition} from "dict-parser";
import * as React from 'react';
import {actions} from '../actions'
import {bindActionCreators, Dispatch} from 'redux';
import {connect} from 'react-redux';
import {Input, Segment, Ref, Icon} from 'semantic-ui-react';

import '../stylesheets/components/Dictionary.scss';
import '../stylesheets/dictionaries/common.scss';
import '../stylesheets/dictionaries/dsl.scss';
import {AutoSuggestInput} from "./AutoSuggestInput";
import { RootState } from "../reducers";

interface DictionaryStates {
}

const mapStateToProps = (state: RootState) => ({
  wordDefinitions: state.wordDefinitions,
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
}, dispatch);

type DictionaryProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class ConnectedDictionary extends React.Component<DictionaryProps, DictionaryStates> {

  private definitionSegment: HTMLElement;

  componentDidMount() {
    this.populateDefinition();
  }

  componentDidUpdate() {
    this.populateDefinition();
  }

  render() {
    return (
      <div className={"dictionary-container"}>
        <AutoSuggestInput
          onSearchCompleted={() => {this.definitionSegment.scrollTop = 0;}}
        />
        <Ref innerRef={ref => this.definitionSegment = ref}>
          <Segment className="definition"/>
        </Ref>
      </div>
    )
  }
  private populateDefinition = () => {
    this.definitionSegment.innerHTML = this.getDefinitionHTMLs();
  };

  private getDefinitionHTMLs(): string {
    let html = '';
    for (const wordDefinition of this.props.wordDefinitions) {
      html += wordDefinition.html;
    }
    return html;
  }
}

export const Dictionary = connect(mapStateToProps, mapDispatchToProps)(ConnectedDictionary);