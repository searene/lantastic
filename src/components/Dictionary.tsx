import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { actions } from '../actions/index'
import { Dispatch } from 'redux';

import { Grid, Input, Form, TextArea } from 'semantic-ui-react';
import '../stylesheets/components/Dictionary.scss'


declare var __IS_WEB__: boolean;

/** prevent from importing electron and other related stuff when we are building a web app
 *  http://ideasintosoftware.com/typescript-conditional-imports/ */
import { dictParser as DictParser } from '../Parser';
import { connect } from 'react-redux';
import Segment from 'semantic-ui-react/dist/commonjs/elements/Segment/Segment';
let dictParser: typeof DictParser;
if(!__IS_WEB__) {
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
      document.getElementsByClassName('definition-row')[0].innerHTML = this.props.definitions;
    }

    componentDidUpdate() {
      document.getElementsByClassName('definition-row')[0].innerHTML = this.props.definitions;
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
                <div className="ui icon input" style={styles.searchRow}>
                    <input
                        type="text"
                        placeholder="Search in dictionaries..."
                        style={styles.input}
                        onChange={(evt) => this.props.setWord(evt.target.value)}
                        value={this.props.word}
                    ></input>
                    <i className="circular search link icon" style={styles.searchIcon} onClick={this.search}></i>
                </div>
                <Segment
                  className="definition-row" />
            </div>
        )
    }
    private search = async () => {
        const wordDefinitions = await dictParser.getWordDefinitions(this.props.word);
        let html = '';
        for(const wordDefinition of wordDefinitions) {
          html += wordDefinition.html;
        }
        this.props.setDefinitions(html);
    }
}

export const Dictionary = connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(ConnectedDictionary);