import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { actions } from '../actions/index'
import { Dispatch } from 'redux';

import { Grid, Input, Form, TextArea } from 'semantic-ui-react';
import '../stylesheets/components/Dictionary.scss';

// definition related styles
import '../stylesheets/dictionaries/common.scss';
import '../stylesheets/dictionaries/dsl.scss';


declare var __IS_WEB__: boolean;

/** prevent from importing electron and other related stuff when we are building a web app
 *  http://ideasintosoftware.com/typescript-conditional-imports/ */
import { dictParser as DictParser } from '../Parser';
import { connect } from 'react-redux';
import Segment from 'semantic-ui-react/dist/commonjs/elements/Segment/Segment';
import { ReactEventHandler } from 'react';
let dictParser: typeof DictParser;
if (!__IS_WEB__) {
  dictParser = require('../Parser').dictParser;
}

interface DictionaryProps {
  word: string
  definitions: string
  setWord: (word: string) => any
  setDefinitions: (definitions: string) => any
}

const mapStateToProps = (state: DictionaryProps) => ({
  word: state.word,
  definitions: state.definitions,
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setWord: (word: string) => dispatch(actions.setWord(word)),
  setDefinitions: (definitions: string) => dispatch(actions.setDefinitions(definitions)),
});

class ConnectedDictionary extends React.Component<DictionaryProps, {}> {

  constructor(props: DictionaryProps) {
    super(props);
    this.state = {
      inputValue: ''
    };
  }

  private definitionRowElement: HTMLDivElement;

  componentDidMount() {
    this.populateDefinition();
  }

  componentDidUpdate() {
    this.populateDefinition();
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
    }
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
    let html = '';
    for (const wordDefinition of wordDefinitions) {
      html += wordDefinition.html;
    }
    this.props.setDefinitions(html);
  }
  private handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter') {
      this.search();
    }
  }
  private populateDefinition = () => {
    document.getElementsByClassName('definition')[0].innerHTML = this.props.definitions;
  }
}

export const Dictionary = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(ConnectedDictionary);