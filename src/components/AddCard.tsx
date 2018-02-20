import {RootState} from "../reducers";

import {Sqlite} from '../Sqlite';
import * as React from 'react';
import {bindActionCreators, Dispatch} from 'redux';
import { connect } from 'react-redux';
import {Form, TextArea} from 'semantic-ui-react';
import {actions} from "../actions";
import {BaseButton} from "./BaseButton";
import moment = require("moment");
import {
  CARD_COLUMN_BACK, CARD_COLUMN_CREATION_TIME, CARD_COLUMN_DECK, CARD_COLUMN_FRONT, CARD_COLUMN_NEXT_REVIEW_TIME,
  CARD_COLUMN_PREVIOUS_REVIEW_TIME_LIST,
  DATE_FORMAT
} from "../Constants";
import {EditorState, Editor} from "draft-js";
import {RichEditor} from "./RichEditor";
import {ToolBar} from "./ToolBar";

export interface AddCardStates {
}

export interface AddCardProps {
  frontCardContents: string
  backCardContents: string
  chosenDeckName: string
  setFrontCardContents: (contents: string) => any
  setBackCardContents: (contents: string) => any
  setEditorStateList: (editorStateList: EditorState[]) => any;
}
const mapStateToProps = (state: RootState) => ({
  frontCardContents: state.frontCardContents,
  backCardContents: state.backCardContents,
  chosenDeckName: state.chosenDeckName,
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  setFrontCardContents: actions.setFrontCardContents,
  setBackCardContents: actions.setBackCardContents,
  setEditorStateList: actions.setEditorStateList,
}, dispatch);

class ConnectedAddCard extends React.Component<AddCardProps, AddCardStates> {
  constructor(props: AddCardProps) {
    super(props);
    this.props.setEditorStateList([EditorState.createEmpty(), EditorState.createEmpty()]);
  }
  render() {
    const style: React.CSSProperties = {
      form: {
      },
      container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: 'space-between',
        height: '100%',
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
        borderTop: "1px solid #BEBEBE",
      }
    };
    return (
      <div style={style.container}>
        <Form style={style.form}>
          <ToolBar/>
          <RichEditor editorIndex={0}/>
          <RichEditor editorIndex={1}/>
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
  private _add = async () => {
    const db = await Sqlite.getDb();
    const now = moment();
    const front = this.props.frontCardContents;
    const back = this.props.backCardContents;
    const creationTime = now.format(DATE_FORMAT);
    const nextReviewTime = this.getNextReviewMoment(now).format(DATE_FORMAT);
    const previousReviewTimeList = '';
    await db.run(`
        INSERT INTO card (
          ${CARD_COLUMN_DECK},
          ${CARD_COLUMN_FRONT},
          ${CARD_COLUMN_BACK},
          ${CARD_COLUMN_CREATION_TIME},
          ${CARD_COLUMN_NEXT_REVIEW_TIME},
          ${CARD_COLUMN_PREVIOUS_REVIEW_TIME_LIST}
        ) VALUES (?, ?, ?, ?, ?, ?)`,
         [this.props.chosenDeckName, front, back, creationTime, nextReviewTime, previousReviewTimeList]);

    this.props.setFrontCardContents('');
    this.props.setBackCardContents('');
  };
  private getNextReviewMoment = (creationTime: moment.Moment): moment.Moment => {
    return creationTime;
  };
}
export const AddCard = connect(mapStateToProps, mapDispatchToProps)(ConnectedAddCard);
