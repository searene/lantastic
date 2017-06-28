import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Grid, Input, Form, TextArea } from 'semantic-ui-react';

export class Dictionary extends React.Component<undefined, undefined> {
    render() {
        const style: React.CSSProperties = {
            searchRow: {
                paddingBottom: "5px",
                flexShrink: 1,
            },
            definitionRow: {
                marginTop: "0",
                marginBottom: "5px",
                paddingTop: "0",
                paddingBottom: "5px",
                flex: 2,
                height: "100%",
                overflow: "auto",
            },
            container: {
                paddingRight: "5px",
                width: "50%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
            },
        }
        return (
            <div style={style.container}>
                <div className="ui icon input" style={style.searchRow}>
                    <input type="text" placeholder="Search..."></input>
                    <i className="circular search link icon"></i>
                </div>
                <div className="ui segment" style={style.definitionRow}>
                </div>
            </div>
        )
    }
}