import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Grid, Input, Form, TextArea } from 'semantic-ui-react';

export interface DictionaryProps {
    // width: string;
}

export class Dictionary extends React.Component<DictionaryProps, undefined> {
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
                    <input type="text" placeholder="Search in dictionaries..." style={styles.input}></input>
                    <i className="circular search link icon" style={styles.searchIcon}></i>
                </div>
                <div className="ui segment" style={styles.definitionRow}>
                </div>
            </div>
        )
    }
}