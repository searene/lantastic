import {RootState} from "../reducers";

import {Sqlite} from '../Sqlite';
import * as React from 'react';
import {bindActionCreators, Dispatch} from 'redux';
import { connect } from 'react-redux';
import {Form} from 'semantic-ui-react';
import {actions} from "../actions";
import {BaseButton} from "./BaseButton";
import {stateToHTML} from 'draft-js-export-html';
import moment = require("moment");
import {
  CARD_COLUMN_BACK, CARD_COLUMN_CREATION_TIME, CARD_COLUMN_DECK, CARD_COLUMN_FRONT, CARD_COLUMN_NEXT_REVIEW_TIME,
  CARD_COLUMN_PREVIOUS_REVIEW_TIME_LIST,
  DATE_FORMAT
} from "../Constants";
import {EditorState, ContentState} from "draft-js";
import {RichEditor} from "./RichEditor";
import {ToolBar} from "./ToolBar";
import '../stylesheets/dictionaries/common.scss';
import '../stylesheets/dictionaries/dsl.scss';

export interface AddCardStates {
}

export interface AddCardProps {
  chosenDeckName: string
  setEditorStateList: (editorStateList: EditorState[]) => any;
  editorStateList: EditorState[];
}
const mapStateToProps = (state: RootState) => ({
  editorStateList: state.editorStateList,
  chosenDeckName: state.chosenDeckName,
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  setEditorStateList: actions.setEditorStateList,
}, dispatch);

class ConnectedAddCard extends React.Component<AddCardProps, AddCardStates> {
  constructor(props: AddCardProps) {
    super(props);
    this.props.setEditorStateList([EditorState.createEmpty(), EditorState.createEmpty()]);
  }
  render() {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: 'space-between',
        height: '100%',
      }}>
        <Form>
          <ToolBar/>
          <RichEditor editorIndex={0}/>
          <RichEditor editorIndex={1}/>
        </Form>
        <div style={{
          paddingTop: "10px",
          borderTop: "1px solid #BEBEBE",
        }}>
          <BaseButton
            content='Add'
            icon='add'
            labelPosition='left'
            onClick={this._add}
            style={{
              marginRight: 0,
              borderRadius: 0,
              float: "right",
            }} />
        </div>
      </div>
    );
  }
  private _add = async () => {
    const db = await Sqlite.getDb();
    const now = moment();
    const front = stateToHTML(this.props.editorStateList[0].getCurrentContent());
    const back = stateToHTML(this.props.editorStateList[1].getCurrentContent());
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

    [0, 1].map(editorIndex => this.clearEditor(editorIndex));
  };
  private getNextReviewMoment = (creationTime: moment.Moment): moment.Moment => {
    return creationTime;
  };
  private clearEditor = (editorIndex: number): void => {
    const newEditorState = EditorState.push(this.props.editorStateList[editorIndex], ContentState.createFromText(''), 'remove-range');
    const newEditorStateList = this.props.editorStateList.concat();
    newEditorStateList[editorIndex] = newEditorState;
    this.props.setEditorStateList(newEditorStateList);
  };
}
export const AddCard = connect(mapStateToProps, mapDispatchToProps)(ConnectedAddCard);
