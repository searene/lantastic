import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Button, Form, TextArea } from 'semantic-ui-react';

export interface FieldProps {
    descriptions: string[];
}

export class Field extends React.Component<FieldProps, undefined> {
    render() {
        const style: React.CSSProperties = {
            form: {
                marginBottom: "5px",
                height: "100px",
                overflow: "auto",
                flex: "1",
            },
            container: {
                display: "flex",
                flexDirection: "column",
                width: "100%",
                marginTop: "10px",
                marginRight: "10px",
            },
            addButton: {
                marginRight: 0,
                borderRadius: 0,
                float: "right",
            },
            textarea: {
                borderRadius: 0,
                marginBottom: "5px",
                overflow: "hidden",
            },
            buttonContainer: {
                paddingTop: "10px",
                marginBottom: "10px",
                borderTop: "1px solid #BEBEBE",
            }
        }
        const fields: JSX.Element[] = this.props.descriptions.map((description) => {
            return (
                <TextArea key={description} placeholder={description} rows={1} autoHeight style={style.textarea} />
            )
        });
        return (
            <div style={style.container}>
                <Form style={style.form}>
                    {fields}
                </Form>
                <div style={style.buttonContainer}>
                    <Button content='Add' icon='add' labelPosition='left' style={style.addButton} />
                </div>
            </div>
        );
    }
}