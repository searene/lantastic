import {getStrFromDate} from "../Utils";

declare var __IS_WEB__: boolean;
import {Card, cardDb as CardDb} from '../CardDb';
let cardDb: typeof CardDb;
if(!__IS_WEB__) {
  cardDb = require('../CardDb').cardDb;
}

import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import {Form, TextArea} from 'semantic-ui-react';
import {actions} from "../actions";
import {BaseButton} from "./BaseButton";

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
  get add(): () => void {
    return this._add;
  }

  set add(value: () => void) {
    this._add = value;
  }
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
          <BaseButton
            content='Add'
            icon='add'
            labelPosition='left'
            onClick={this._add}
            style={style.addButton} />
        </div>
      </div>
    );
  }
  private _add = () => {
    const now = new Date();
    cardDb.get('cards')
      .push<Card>({
        id: this.getNextId(),
        front: this.props.frontCardContents,
        back: this.props.backCardContents,
        creationTime: getStrFromDate(now),
        nextReviewTime: getStrFromDate(this.getNextReviewDate([now])),
        previousReviewTimeList: [],
      })
      .write();
    this.props.setFrontCardContents('');
    this.props.setBackCardContents('');
  };
  private getNextReviewDate = (previousReviewDates: Date[]) => {
    const lastReviewDateCopy = new Date(previousReviewDates[previousReviewDates.length - 1]);
    lastReviewDateCopy.setDate(lastReviewDateCopy.getDate() + 0);
    lastReviewDateCopy.setHours(0, 0, 0, 0);
    return lastReviewDateCopy;
  };
  private getNextId = (): number => {
    const cards = cardDb.get('cards').value();
    let maxId = 0;
    for(const card of cards) {
      maxId = card.id > maxId ? card.id : maxId;
    }
    return maxId;
  }
}
export const Field = connect(mapStateToProps, mapDispatchToProps)(ConnectedField);
