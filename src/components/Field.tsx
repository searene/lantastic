import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Button, Form, TextArea } from 'semantic-ui-react';

export interface FieldProps {
    descriptions: string[];
}

export class Field extends React.Component<FieldProps, undefined> {
    render() {
        const style = {
            form: {
                marginBottom: "5px",
            },
            container: {
                width: "50%",
            },
            addButton: {
                marginLeft: "auto",
                marginRight: 0,
            },
            textarea: {
            },
        }
        const fields: JSX.Element[] = this.props.descriptions.map((description) => {
            return (
                <Form key={description} style={style.form}>
                    <TextArea placeholder={description} rows={1} autoHeight />
                </Form>
            )
        });
        return (
            <div style={style.container}>
                {fields}
                <Button content='Add' icon='add' labelPosition='left' style={style.addButton} />
            </div>
        );
    }
}