import { RootState } from "../reducers";

import * as moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { Form } from "semantic-ui-react";
import { actions } from "../actions";
import {
  CARD_COLUMN_BACK,
  CARD_COLUMN_CREATION_TIME,
  CARD_COLUMN_DECK,
  CARD_COLUMN_FRONT,
  CARD_COLUMN_NEXT_REVIEW_TIME,
  CARD_COLUMN_PREVIOUS_REVIEW_TIME_LIST,
  DATE_FORMAT
} from "../Constants";
import { Sqlite } from "../Sqlite";
import "../stylesheets/dictionaries/common.scss";
import "../stylesheets/dictionaries/dsl.scss";
import { guid } from "../Utils/CommonUtils";
import { BaseButton } from "./BaseButton";
import { ContentEditableEditor, RawContentEditableEditor } from "./ContentEditableEditor";
import { ToolBar } from "./ToolBar";

const mapStateToProps = (state: RootState) => ({
  chosenDeckName: state.chosenDeckName,
  editorStateList: state.editorStateList
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({}, dispatch);

export type AddCardProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & {
  searchWord: string;
}

const editorList = [
  {
    key: guid(),
    name: "front"
  },
  {
    key: guid(),
    name: "back"
  }
];

class ConnectedAddCard extends React.Component<AddCardProps> {
  private editorComponents: RawContentEditableEditor[] = [];

  constructor(props: AddCardProps) {
    super(props);
  }
  public render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between"
        }}
      >
        <Form
          style={{
            overflow: "auto"
          }}
        >
          <ToolBar searchWord={this.props.searchWord}/>
          {editorList.map((e, i) => (
            <ContentEditableEditor
              key={e.key}
              editorIndex={i}
              ref={editor => {
                if (editor) {
                  this.editorComponents[i] = (editor as any).getWrappedInstance();
                }
              }}
            />
          ))}
        </Form>
        <div
          style={{
            borderTop: "1px solid #BEBEBE",
            paddingTop: "10px"
          }}
        >
          <BaseButton
            content="Add"
            icon="add"
            labelPosition="left"
            onClick={this.add}
            style={{
              borderRadius: 0,
              float: "right",
              marginRight: 0
            }}
          />
        </div>
      </div>
    );
  }
  private add = async () => {
    const db = await Sqlite.getDb();
    const now = moment();
    const front = this.editorComponents[0].getContents();
    const back = this.editorComponents[1].getContents();
    const creationTime = now.format(DATE_FORMAT);
    const nextReviewTime = this.getNextReviewMoment(now).format(DATE_FORMAT);
    const previousReviewTimeList = "";
    await db.run(
      `
        INSERT INTO card (
          ${CARD_COLUMN_DECK},
          ${CARD_COLUMN_FRONT},
          ${CARD_COLUMN_BACK},
          ${CARD_COLUMN_CREATION_TIME},
          ${CARD_COLUMN_NEXT_REVIEW_TIME},
          ${CARD_COLUMN_PREVIOUS_REVIEW_TIME_LIST}
        ) VALUES (?, ?, ?, ?, ?, ?)`,
      [this.props.chosenDeckName, front, back, creationTime, nextReviewTime, previousReviewTimeList]
    );

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
export const AddCard = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedAddCard);
