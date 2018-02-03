import * as React from 'react';
import { actions } from '../actions'
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Input, Segment } from 'semantic-ui-react';
import '../stylesheets/components/Dictionary.scss';

// definition related styles
import '../stylesheets/dictionaries/common.scss';
import '../stylesheets/dictionaries/dsl.scss';

declare var __IS_WEB__: boolean;

/** prevent from importing electron and other related stuff when we are building a web app
 *  http://ideasintosoftware.com/typescript-conditional-imports/ */
import { dictParser as DictParser } from '../Parser';
import {WordDefinition} from "dict-parser";
let dictParser: typeof DictParser;
if (!__IS_WEB__) {
  dictParser = require('../Parser').dictParser;
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
    const audios = document.getElementsByClassName("audio");
    for(let i = 0; i < audios.length; i++) {
      const audio = audios[i] as HTMLLinkElement;
      const resourceName = audio.dataset['resource-name'];
      audio.addEventListener('click', (event) => {
      });
    }
  }

  render() {
    const styles: React.CSSProperties = {
      searchRow: {
        paddingBottom: "0.5em",
        flexGrow: 1,
        width: "100%",
        height: "3.5em",
        marginTop: "5px",
        marginLeft: "auto",
        marginRight: "auto",
      },
      input: {
        borderRadius: 0,
      },
      container: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
      },
      searchIcon: {

      }
    };
    return (
      <div style={styles.container}>
        <Input
          icon="search"
          placeholder="Search in dictionaries..."
          style={styles.input}
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
    const wordDefinitions = await dictParser.getWordDefinitions(this.props.word);
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