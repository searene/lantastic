import {inspect} from "util";

declare var __IS_WEB__: boolean;
import {Sqlite as SqliteType} from "../Sqlite";
let Sqlite: typeof SqliteType;
if(!__IS_WEB__) {
  Sqlite = require('../Sqlite').Sqlite;
}
import {
  AGAIN_DURATION_MINUTES,
  CARD_COLUMN_BACK, CARD_COLUMN_CREATION_TIME, CARD_COLUMN_FRONT, CARD_COLUMN_ID, CARD_COLUMN_NEXT_REVIEW_TIME,
  CARD_COLUMN_PREVIOUS_REVIEW_TIME_LIST, CARD_TABLE,
  DATE_FORMAT
} from "../Constants";

import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {Segment, Container} from "semantic-ui-react";
import '../stylesheets/components/Review.scss';
import {BaseButton} from "./BaseButton";
import moment = require("moment");

interface ReviewProps {
}
interface ReviewStates {
  isAnswerShown: boolean;
  card: any;
}
const mapStateToProps = (state: ReviewProps) => ({
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
});
export enum Level {
  AGAIN, HARD, GOOD, EASY
}
const INITIAL_CARD = 'initial_card';
class Interval {
}
class MinutesInterval extends Interval {
  minutes: number;
  constructor(minutes: number) {
    super();
    this.minutes = minutes;
   }
}
class DaysInterval extends Interval {
  days: number;
  constructor(days: number) {
    super();
    this.days = days;
  }
}
class ConnectedReview extends React.Component<ReviewProps, ReviewStates> {
  constructor(props: ReviewProps) {
    super(props);
    this.state = {
      isAnswerShown: false,
      card: INITIAL_CARD
    };
  }
  async componentWillMount() {
    if(this.state.card === INITIAL_CARD) {
      const card = await this.getReviewCard();
      this.setState({
        card: card
      });
    }
  }
  render() {
    return (
      <Container>
        {this.state.card === undefined ?
          <div className="congrat-div">
            <h1>Congratulations!</h1>
            <div>You have finished reviewing cards in this deck.</div>
          </div>
        :
          <div className="review-div">
            <div className="review-card" dangerouslySetInnerHTML={{__html: this.state.card.front}} />
            {this.state.isAnswerShown ?
              <div className="review-answer">
                <hr className="hr"/>
                <div className="review-card" dangerouslySetInnerHTML={{__html: this.state.card.back}} />
              </div>
              : ''
            }
            <div className="review-bottom">
              <hr className="hr"/>
              <div className="bottom-buttons">
                {this.state.isAnswerShown ?
                  [<BaseButton onClick={() => this.review(Level.AGAIN)} key={Level.AGAIN}><b>AGAIN</b><br/> ({this.getIntervalDescription(this.getInterval(Level.AGAIN))})</BaseButton>,
                   <BaseButton onClick={() => this.review(Level.HARD)} key={Level.HARD}><b>HARD</b><br/> ({this.getIntervalDescription(this.getInterval(Level.HARD))})</BaseButton>,
                   <BaseButton onClick={() => this.review(Level.GOOD)} key={Level.GOOD}><b>GOOD</b><br/> ({this.getIntervalDescription(this.getInterval(Level.GOOD))})</BaseButton>,
                   <BaseButton onClick={() => this.review(Level.EASY)} key={Level.EASY}><b>EASY</b><br/> ({this.getIntervalDescription(this.getInterval(Level.EASY))})</BaseButton>]
                  :
                   <BaseButton onClick={() => this.setState({isAnswerShown: true})}>Show Answer</BaseButton>
                }
              </div>
            </div>
          </div>
        }
      </Container>
    )
  }
  private getReviewCard = async (): Promise<any> => {
    const db = await Sqlite.getDb();
    const sql = `
            SELECT
              ${CARD_COLUMN_ID},
              ${CARD_COLUMN_FRONT},
              ${CARD_COLUMN_BACK},
              ${CARD_COLUMN_CREATION_TIME},
              ${CARD_COLUMN_NEXT_REVIEW_TIME},
              ${CARD_COLUMN_PREVIOUS_REVIEW_TIME_LIST}
            FROM ${CARD_TABLE}
            WHERE ${CARD_COLUMN_NEXT_REVIEW_TIME} <= ?`;
    const param = moment().format(DATE_FORMAT);
    const reviewCard = await db.get(sql, param);
    console.log(reviewCard);
    return reviewCard;
  };
  private getInterval = (level: Level): Interval => {
    if(this.state.card[`${CARD_COLUMN_PREVIOUS_REVIEW_TIME_LIST}`] === '') {
      return this.getInitialInterval(level);
    }
    const previousReviewTimeList = this.state.card[`${CARD_COLUMN_PREVIOUS_REVIEW_TIME_LIST}`];
    console.log(this.state.card);
    const lastReviewTime = moment(previousReviewTimeList[previousReviewTimeList.length - 1], DATE_FORMAT);
    const duration = ~~moment.duration(moment().diff(lastReviewTime)).asDays();
    if(duration === 0) {
      // last level is AGAIN
      return this.getInitialInterval(level);
    }
    if(level === Level.AGAIN) {
      return new MinutesInterval(AGAIN_DURATION_MINUTES);
    } else if(level === Level.HARD) {
      return new DaysInterval(~~(duration * 1.2 + 1));
    } else if(level === Level.GOOD) {
      return new DaysInterval(~~(duration * 1.3 + 2));
    } else if(level === Level.EASY) {
      return new DaysInterval(~~(duration * 1.4 + 3));
    }
  };
  private getIntervalDescription = (interval: Interval): string => {
    if(interval instanceof MinutesInterval) {
      return interval.minutes + (interval.minutes === 1 ? ' min' : ' mins');
    } else if(interval instanceof DaysInterval) {
      return interval.days + (interval.days === 1 ? ' day' : ' days');
    }
  };
  private review = async (level: Level): Promise<void> => {
    const nextReviewTime = this.getNextReviewTime(this.getInterval(level));
    await this.adjustReviewTime(this.state.card[`${CARD_COLUMN_ID}`], nextReviewTime);
    this.setState({
      isAnswerShown: false,
      card: await this.getReviewCard(),
    });
  };
  private adjustReviewTime = async (cardId: number, nextReviewTime: moment.Moment): Promise<void> => {
    const db = await Sqlite.getDb();
    await db.exec(`
            UPDATE
              ${CARD_TABLE}
            SET
              ${CARD_COLUMN_NEXT_REVIEW_TIME} = ${nextReviewTime.format(DATE_FORMAT)},
              ${CARD_COLUMN_PREVIOUS_REVIEW_TIME_LIST} = ${CARD_COLUMN_PREVIOUS_REVIEW_TIME_LIST} + ',${moment().format(DATE_FORMAT)}'`
    );
  };
  private getNextReviewTime = (interval: Interval): moment.Moment => {
    if(interval instanceof MinutesInterval) {
      return moment().add(interval.minutes, 'minutes');
    } else if(interval instanceof DaysInterval) {
      const nextReviewTime = moment();
      nextReviewTime.add(interval.days, 'days');
      nextReviewTime.set({
        'hours': 0,
        'minutes': 0,
        'seconds': 0,
        'milliseconds': 0
      });
      return nextReviewTime;
    }
  };
  private getInitialInterval = (level: Level): Interval => {
    if(level === Level.AGAIN) {
      return new MinutesInterval(AGAIN_DURATION_MINUTES);
    } else if(level === Level.HARD) {
      return new DaysInterval(2);
    } else if(level === Level.GOOD) {
      return new DaysInterval(3);
    } else if(level === Level.EASY) {
      return new DaysInterval(4);
    }
  }
}

export const Review = connect(mapStateToProps, mapDispatchToProps)(ConnectedReview);
