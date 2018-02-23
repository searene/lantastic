import {WordDefinition} from "dict-parser";
import * as React from 'react';
import {actions} from '../actions'
import {bindActionCreators, Dispatch} from 'redux';
import {connect} from 'react-redux';
import {Input, Segment, Ref, Icon} from 'semantic-ui-react';

import '../stylesheets/components/Dictionary.scss';
import '../stylesheets/dictionaries/common.scss';
import '../stylesheets/dictionaries/dsl.scss';
import {dictParser} from "../Parser";
import {AutoSuggestInput} from "./AutoSuggestInput";

interface DictionaryStates {
}

interface DictionaryProps {
  word: string
  wordDefinitions: WordDefinition[]
  setWord: (word: string) => any
  setWordDefinitions: (wordDefinitions: WordDefinition[]) => any
}

const mapStateToProps = (state: DictionaryProps) => ({
  word: state.word,
  wordDefinitions: state.wordDefinitions,
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  setWord: actions.setWord,
  setWordDefinitions: actions.setWordDefinitions,
}, dispatch);

class ConnectedDictionary extends React.Component<DictionaryProps, DictionaryStates> {

  private definitionSegment: HTMLElement;
  constructor(props: DictionaryProps) {
    super(props);
    this.state = {
      testKey: '',
    };
  }

  componentDidMount() {
    this.populateDefinition();
  }

  componentDidUpdate() {
    this.populateDefinition();
  }

  render() {
    const styles: React.CSSProperties = {
      container: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
      },
    };
    return (
      <div style={styles.container}>
        <AutoSuggestInput
          onFetched={() => {this.definitionSegment.scrollTop = 0;}}
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