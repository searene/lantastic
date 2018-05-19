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
import {
  RawContentEditableEditor,
  ContentEditableEditor,
  ContentEditableEditorProps
} from "./ContentEditableEditor";
import '../stylesheets/dictionaries/common.scss';
import '../stylesheets/dictionaries/dsl.scss';
import {guid} from "../Utils/CommonUtils";

export interface AddCardStates {
}

const mapStateToProps = (state: RootState) => ({
  editorStateList: state.editorStateList,
  chosenDeckName: state.chosenDeckName,
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  setEditorStateList: actions.setEditorStateList,
}, dispatch);

export type AddCardProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const editorList = [{
  key: guid(),
  name: 'front',
}, {
  key: guid(),
  name: 'back',
}];

class ConnectedAddCard extends React.Component<AddCardProps, AddCardStates> {

  private editorComponents: RawContentEditableEditor[] = [];

  constructor(props: AddCardProps) {
    super(props);
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
        {
          editorList.map((e, i) =>
            <ContentEditableEditor
              key={e.key}
              editorIndex={i}
              ref={ editor => {
                if(editor) {
                  this.editorComponents[i] = (editor as any).getWrappedInstance();
                }
              }} />
          )
        }
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
    const front = this.editorComponents[0].getContents();
    const back = this.editorComponents[1].getContents();
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

    this.clearEditors();
  };
  private getNextReviewMoment = (creationTime: moment.Moment): moment.Moment => {
    return creationTime;
  };
  private clearEditors = (): void => {
    editorList.map((editor, i) => {
      this.editorComponents[i].clear();
    });
  };
}
export const AddCard = connect(mapStateToProps, mapDispatchToProps)(ConnectedAddCard);
