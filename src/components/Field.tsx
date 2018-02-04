import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import {Button, Form, TextArea} from 'semantic-ui-react';
import {actions} from "../actions";

export interface FieldProps {
  frontCardContents: string
  backCardContents: string
  setFrontCardContents: (contents: string) => any
  setBackCardContents: (contents: string) => any
}
const mapStateToProps = (state: FieldProps) => ({
  frontCardContents: state.frontCardContents,
  backCardContents: state.backCardContents,
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setFrontCardContents: (contents: string) => dispatch(actions.setFrontCardContents(contents)),
  setBackCardContents: (contents: string) => dispatch(actions.setBackCardContents(contents)),
});

class ConnectedField extends React.Component<FieldProps, undefined> {
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
        margin: "10px",
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
    };
    return (
      <div style={style.container} id="field">
        <Form style={style.form}>
          <TextArea
            placeholder='Front'
            value={this.props.frontCardContents}
            onChange={(event) => this.props.setFrontCardContents((event.target as HTMLTextAreaElement).value)}
            rows={1}
            autoHeight
            style={style.textarea}/>
          <TextArea
            placeholder='Back'
            value={this.props.backCardContents}
            onChange={(event) => this.props.setBackCardContents((event.target as HTMLTextAreaElement).value)}
            rows={1}
            autoHeight
            style={style.textarea}/>
        </Form>
        <div style={style.buttonContainer}>
          <Button
            content='Add'
            icon='add'
            labelPosition='left'
            onClick={this.add}
            style={style.addButton}/>
        </div>
      </div>
    );
  }
  private add = () => {
    console.log(this.props.frontCardContents);
    console.log(this.props.backCardContents);
  }
}
export const Field = connect(mapStateToProps, mapDispatchToProps)(ConnectedField);
