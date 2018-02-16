declare var __IS_WEB__: boolean;
import {Sqlite as SqliteType} from "../Sqlite";
let Sqlite: typeof SqliteType;
if(!__IS_WEB__) {
  Sqlite = require('../Sqlite');
}
import {
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
  minutes: number;
  hours: number;
  days: number;
  months: number;
  years: number;
  constructor(minutes: number, hours: number, days: number, months: number, years: number) {
    this.minutes = minutes;
    this.hours = hours;
    this.days = days;
    this.months = months;
    this.years = years;
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
                  [<BaseButton onClick={() => this.review(Level.AGAIN)} key={Level.AGAIN}><b>AGAIN</b> ({this.getIntervalDescription(this.getInterval(Level.AGAIN))})</BaseButton>,
                   <BaseButton onClick={() => this.review(Level.HARD)} key={Level.HARD}><b>HARD</b> ({this.getIntervalDescription(this.getInterval(Level.HARD))})</BaseButton>,
                   <BaseButton onClick={() => this.review(Level.GOOD)} key={Level.GOOD}><b>GOOD</b> ({this.getIntervalDescription(this.getInterval(Level.GOOD))})</BaseButton>,
                   <BaseButton onClick={() => this.review(Level.EASY)} key={Level.EASY}><b>EASY</b> ({this.getIntervalDescription(this.getInterval(Level.EASY))})</BaseButton>]
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
            WHERE ${CARD_COLUMN_NEXT_REVIEW_TIME} <= ?
            `;
    const param = moment().format(DATE_FORMAT);
    console.log(`Going to get the next review card, sql: ${sql}, param: ${param}`);
    const reviewCard = await db.get(sql, param);
    return reviewCard;
  };
  private getInterval = (level: Level): Interval => {
    if(level === Level.AGAIN) {
      return new Interval(10, 0, 0, 0, 0);
    } else if(level === Level.HARD) {
      return new Interval(0, 0, 2, 0, 0);
    } else if(level === Level.GOOD) {
      return new Interval(0, 0, 3, 0, 0);
    } else if(level === Level.EASY) {
      return new Interval(0, 0, 4, 0, 0);
    }
  };
  private getIntervalDescription = (interval: Interval): string => {
    if(interval.years !== 0) {
      return `${interval.years}years`;
    } else if(interval.months !== 0) {
      return `${interval.months}months`;
    } else if(interval.days !== 0) {
      return `${interval.days}d`;
    } else if(interval.hours !== 0) {
      return `${interval.hours}h`;
    } else if(interval.minutes !== 0) {
      return `${interval.minutes}min`;
    }
  };
  private review = async (level: Level): Promise<void> => {
    const nextReviewTime = this.getNextReviewTime(this.getInterval(level));
    await this.adjustReviewTime(this.state.card[`${CARD_COLUMN_ID}`], nextReviewTime);
    this.setState({
      isAnswerShown: false,
      card: this.getReviewCard(),
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
    let nextReviewTime = moment();
    if(interval.minutes !== 0 || interval.hours !== 0) {
      nextReviewTime.add(interval.minutes, 'minutes');
      nextReviewTime.add(interval.hours, 'hours');
    } else {
      nextReviewTime.add(interval.years, 'years');
      nextReviewTime.add(interval.months, 'months');
      nextReviewTime.add(interval.days, 'days');
      nextReviewTime.set({
        'hours': 0,
        'minutes': 0
      });
    }
    return nextReviewTime;
  };
}

export const Review = connect(mapStateToProps, mapDispatchToProps)(ConnectedReview);
