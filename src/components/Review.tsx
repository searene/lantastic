import { RootState } from "../reducers";

import {
  AGAIN_DURATION_MINUTES,
  CARD_COLUMN_BACK,
  CARD_COLUMN_CREATION_TIME,
  CARD_COLUMN_DECK,
  CARD_COLUMN_FRONT,
  CARD_COLUMN_ID,
  CARD_COLUMN_NEXT_REVIEW_TIME,
  CARD_COLUMN_PREVIOUS_REVIEW_TIME_LIST,
  CARD_TABLE,
  DATE_FORMAT
} from "../Constants";
import { Sqlite } from "../Sqlite";

import moment = require("moment");
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { Container } from "semantic-ui-react";
import "../stylesheets/components/Review.scss";
import { BaseButton } from "./BaseButton";

interface IReviewStates {
  showAnswer: boolean;
  card: any;
}

const mapStateToProps = (state: RootState) => ({
  chosenDeckName: state.chosenDeckName
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({}, dispatch);

type ReviewProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export enum Level {
  AGAIN,
  HARD,
  GOOD,
  EASY
}

const INITIAL_CARD = "initial_card";

class Interval {}

class MinutesInterval extends Interval {
  public minutes: number;

  constructor(minutes: number) {
    super();
    this.minutes = minutes;
  }
}

class DaysInterval extends Interval {
  public days: number;

  constructor(days: number) {
    super();
    this.days = days;
  }
}

class InternalReview extends React.Component<ReviewProps, IReviewStates> {
  private reviewDiv: HTMLDivElement;

  constructor(props: ReviewProps) {
    super(props);
    this.state = {
      card: INITIAL_CARD,
      showAnswer: false
    };
  }

  public async componentWillMount() {
    if (this.state.card === INITIAL_CARD) {
      const card = await this.getReviewCard();
      this.setState({
        card
      });
    }
  }

  public render() {
    if (this.state.card === INITIAL_CARD) {
      return <div>Loading Data...</div>;
    } else if (this.state.card === undefined) {
      return (
        <div className="congrat-div">
          <h1>Congratulations!</h1>
          <div>You have finished reviewing cards in this deck.</div>
        </div>
      );
    }
    const againInterval = this.getInterval(Level.AGAIN);
    const easyInterval = this.getInterval(Level.EASY);
    const goodInterval = this.getInterval(Level.GOOD);
    const hardInterval = this.getInterval(Level.HARD);
    return (
      <Container
        style={{
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div style={{ overflow: "auto" }} ref={(ref: HTMLDivElement) => (this.reviewDiv = ref)} className="review-div">
          <div className="review-card" dangerouslySetInnerHTML={{ __html: this.state.card.front }} />
          {this.state.showAnswer && (
            <div className="review-answer">
              <hr className="answer-hr" />
              <div className="review-card" dangerouslySetInnerHTML={{ __html: this.state.card.back }} />
            </div>
          )}
        </div>
        <div
          style={{
            flexShrink: 0
          }}
          className="review-bottom"
        >
          <hr className="hr" />
          <div className="bottom-buttons">
            {this.state.showAnswer ? (
              [
                <BaseButton onClick={() => this.review(againInterval)} key={Level.AGAIN}>
                  <b>AGAIN</b>
                  <br /> ({this.getIntervalDescription(againInterval)})
                </BaseButton>,
                <BaseButton onClick={() => this.review(hardInterval)} key={Level.HARD}>
                  <b>HARD</b>
                  <br /> ({this.getIntervalDescription(hardInterval)})
                </BaseButton>,
                <BaseButton onClick={() => this.review(goodInterval)} key={Level.GOOD}>
                  <b>GOOD</b>
                  <br /> ({this.getIntervalDescription(goodInterval)})
                </BaseButton>,
                <BaseButton onClick={() => this.review(easyInterval)} key={Level.EASY}>
                  <b>EASY</b>
                  <br /> ({this.getIntervalDescription(easyInterval)})
                </BaseButton>
              ]
            ) : (
              <BaseButton onClick={this.showAnswer}>Show Answer</BaseButton>
            )}
          </div>
        </div>
      </Container>
    );
  }

  private showAnswer = () => {
    this.setState({
      showAnswer: true
    });
    setTimeout(() => {
      this.reviewDiv.scrollTop = this.reviewDiv.scrollHeight;
    }, 0);
  };

  private getReviewCard = async (): Promise<any> => {
    const db = await Sqlite.getDb();
    const sql = `
            SELECT
              ${CARD_COLUMN_ID},
              ${CARD_COLUMN_DECK},
              ${CARD_COLUMN_FRONT},
              ${CARD_COLUMN_BACK},
              ${CARD_COLUMN_CREATION_TIME},
              ${CARD_COLUMN_NEXT_REVIEW_TIME},
              ${CARD_COLUMN_PREVIOUS_REVIEW_TIME_LIST}
            FROM ${CARD_TABLE}
            WHERE ${CARD_COLUMN_NEXT_REVIEW_TIME} <= ?
              AND ${CARD_COLUMN_DECK} = ?`;
    const params = [moment().format(DATE_FORMAT), this.props.chosenDeckName];
    return await db.get(sql, params);
  };
  private getInterval = (level: Level): Interval => {
    if (this.state.card[CARD_COLUMN_PREVIOUS_REVIEW_TIME_LIST] === "") {
      return this.getInitialInterval(level);
    }
    const previousReviewTimeList = this.state.card[CARD_COLUMN_PREVIOUS_REVIEW_TIME_LIST].split(",");
    const lastReviewTime = moment(previousReviewTimeList[previousReviewTimeList.length - 1], DATE_FORMAT);
    const duration = Math.floor(moment.duration(moment().diff(lastReviewTime)).asDays());
    if (duration === 0) {
      // last level is AGAIN
      return this.getInitialInterval(level);
    }
    if (level === Level.AGAIN) {
      return new MinutesInterval(AGAIN_DURATION_MINUTES);
    } else if (level === Level.HARD) {
      return new DaysInterval(Math.floor(duration * 0.8 + 1));
    } else if (level === Level.GOOD) {
      return new DaysInterval(Math.floor(duration * 0.9 + 2));
    } else if (level === Level.EASY) {
      return new DaysInterval(Math.floor(duration * 1.1 + 3));
    }
  };
  private getIntervalDescription = (interval: Interval): string => {
    if (interval instanceof MinutesInterval) {
      return interval.minutes + (interval.minutes === 1 ? " min" : " mins");
    } else if (interval instanceof DaysInterval) {
      return interval.days + (interval.days === 1 ? " day" : " days");
    }
  };
  private review = async (interval: Interval): Promise<void> => {
    const nextReviewTime = this.getNextReviewTime(interval);
    await this.adjustReviewTime(this.state.card[CARD_COLUMN_ID], nextReviewTime);
    this.setState({
      card: await this.getReviewCard(),
      showAnswer: false
    });
  };
  private adjustReviewTime = async (cardId: number, nextReviewTime: moment.Moment): Promise<void> => {
    const db = await Sqlite.getDb();
    const previousReviewTimeList = (await db.get(`
            SELECT
              ${CARD_COLUMN_PREVIOUS_REVIEW_TIME_LIST}
            FROM
              ${CARD_TABLE}
            WHERE ${CARD_COLUMN_ID} = ${cardId}
    `))[`${CARD_COLUMN_PREVIOUS_REVIEW_TIME_LIST}`];
    const currentReviewTime = moment().format(DATE_FORMAT);
    const updatedReviewTimeList =
      previousReviewTimeList === "" ? currentReviewTime : previousReviewTimeList + "," + currentReviewTime;
    await db.run(
      `
            UPDATE
              ${CARD_TABLE}
            SET
              ${CARD_COLUMN_NEXT_REVIEW_TIME} = ${nextReviewTime.format(DATE_FORMAT)},
              ${CARD_COLUMN_PREVIOUS_REVIEW_TIME_LIST} = ?
            WHERE ${CARD_COLUMN_ID} = ${cardId}
    `,
      updatedReviewTimeList
    );
  };
  private getNextReviewTime = (interval: Interval): moment.Moment => {
    if (interval instanceof MinutesInterval) {
      return moment().add(interval.minutes, "minutes");
    } else if (interval instanceof DaysInterval) {
      const nextReviewTime = moment();
      nextReviewTime.add(interval.days, "days");
      nextReviewTime.set({
        hours: 0,
        milliseconds: 0,
        minutes: 0,
        seconds: 0
      });
      return nextReviewTime;
    }
  };
  private getInitialInterval = (level: Level): Interval => {
    if (level === Level.AGAIN) {
      return new MinutesInterval(AGAIN_DURATION_MINUTES);
    } else if (level === Level.HARD) {
      return new DaysInterval(2);
    } else if (level === Level.GOOD) {
      return new DaysInterval(3);
    } else if (level === Level.EASY) {
      return new DaysInterval(4);
    }
  };
}

export const Review = connect(
  mapStateToProps,
  mapDispatchToProps
)(InternalReview);
