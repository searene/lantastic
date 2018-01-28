import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { actions } from '../actions/index'
import { Dispatch } from 'redux';

import { Grid, Input, Form, TextArea } from 'semantic-ui-react';


declare var __IS_WEB__: boolean;

/** prevent from importing electron and other related stuff when we are building a web app
 *  http://ideasintosoftware.com/typescript-conditional-imports/ */
import { dictParser as DictParser } from '../Parser';
import { connect } from 'react-redux';
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
            definitionRow: {
                marginTop: "0",
                marginBottom: "10px",
                paddingTop: "0",
                paddingBottom: "5px",
                flexGrow: 2,
                height: "100%",
                overflow: "auto",
                borderRadius: 0,
                width: "100%",
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
                <div className="ui segment" style={styles.definitionRow}>
                </div>
            </div>
        )
    }
    private search = async () => {
        const wordDefinitions = await dictParser.getWordDefinitions(this.props.word);
        for(const wordDefinition of wordDefinitions) {

        }
    }
}

export const Dictionary = connect(mapStateToProps, mapDispatchToProps)(ConnectedDictionary);