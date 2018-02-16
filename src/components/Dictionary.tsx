import {unescape} from "querystring";

declare var __IS_WEB__: boolean;
/** prevent from importing electron and other related stuff when we are building a web app
 *  http://ideasintosoftware.com/typescript-conditional-imports/ */
import { dictParser as DictParser } from '../Parser';
import {WordDefinition} from "dict-parser";
let dictParser: typeof DictParser;
if (!__IS_WEB__) {
  dictParser = require('../Parser').dictParser;
}

import * as React from 'react';
import { actions } from '../actions'
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Input, Segment } from 'semantic-ui-react';

import '../stylesheets/components/Dictionary.scss';
import '../stylesheets/dictionaries/common.scss';
import '../stylesheets/dictionaries/dsl.scss';

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
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setWord: (word: string) => dispatch(actions.setWord(word)),
  setWordDefinitions: (wordDefinitions: WordDefinition[]) => dispatch(actions.setWordDefinitions(wordDefinitions)),
});

class ConnectedDictionary extends React.Component<DictionaryProps, {}> {

  constructor(props: DictionaryProps) {
    super(props);
    this.state = {
      inputValue: ''
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
        <Input
          icon="search"
          placeholder="Search in dictionaries..."
          value={this.props.word}
          className="search-input"
          onKeyDown={this.handleOnKeyDown}
          onChange={(evt) => this.props.setWord((evt.target as HTMLInputElement).value)} />
        <Segment
          className="definition" />
      </div>
    )
  }
  private search = async () => {
    let wordDefinitions: WordDefinition[];
    if(!__IS_WEB__) {
      wordDefinitions = await dictParser.getWordDefinitions(this.props.word);
    } else {
      wordDefinitions = [{
        word: '',
        wordTree: undefined,
        html: '<div>test<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/></div>',
        dict: undefined
      }]
    }
    this.props.setWordDefinitions(wordDefinitions);
  };
  private handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter') {
      this.search();
    }
  };
  private populateDefinition = () => {
    document.getElementsByClassName('definition')[0].innerHTML = this.getDefinitionHTMLs();
  };
  private getDefinitionHTMLs(): string {
    let html = '';
    for (const wordDefinition of this.props.wordDefinitions) {
      html += wordDefinition.html;
    }
    return html;
  }
}

export const Dictionary = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(ConnectedDictionary);