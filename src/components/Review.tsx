import {getStrFromDate} from "../Utils";

declare var __IS_WEB__: boolean;
import {Card, cardDb as CardDb} from '../CardDb';
let cardDb: typeof CardDb;
if(!__IS_WEB__) {
  cardDb = require('../CardDb').cardDb;
}
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {Segment, Container} from "semantic-ui-react";
import '../stylesheets/components/Review.scss';
import {BaseButton} from "./BaseButton";

interface ReviewProps {
}
interface ReviewStates {
  isAnswerShown: boolean;
  card: Card;
}
const mapStateToProps = (state: ReviewProps) => ({
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
});
export enum Level {
  AGAIN, HARD, GOOD, EASY
}
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
      card: this.getReviewCard(),
      // card: undefined,
    };
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
  private getReviewCard = (): Card => {
    return __IS_WEB__ ? {
      id: 0,
      front: '<b>test front</b>',
      back: 'test back',
      creationTime: getStrFromDate(new Date()),
      nextReviewTime: getStrFromDate(new Date()),
      previousReviewTimeList: [],
    } : cardDb.get('cards')
      .find<Card>(card => new Date(card.nextReviewTime) <= new Date())
      .value();
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
  private review = (level: Level): void => {
    const interval = this.getInterval(level);
    const nextReviewTime = this.getNextReviewTime(interval);
    this.addReviewTimeToCard(this.state.card, nextReviewTime);
    this.setState({
      isAnswerShown: false,
      card: this.getReviewCard(),
    });
  };
  private addReviewTimeToCard = (card: Card, nextReviewTime: Date): Card[] => {
    const cards = cardDb.get('cards').value();
    const previousReviewList = card.previousReviewTimeList;
    for(const c of cards) {
      if(c.id === card.id) {
        c.previousReviewTimeList.push(getStrFromDate(new Date()));
        c.nextReviewTime = getStrFromDate(nextReviewTime);
      }
    }
    cardDb.set('cards', cards).write();
    return cards;
  };
  private getNextReviewTime = (interval: Interval): Date => {
    const nextReviewTime = new Date();
    nextReviewTime.setUTCMinutes(nextReviewTime.getUTCMinutes() + interval.minutes);
    nextReviewTime.setUTCHours(nextReviewTime.getUTCHours() + interval.hours);
    nextReviewTime.setUTCDate(nextReviewTime.getUTCDate() + interval.days);
    nextReviewTime.setUTCMonth(nextReviewTime.getUTCMonth() + interval.months);
    nextReviewTime.setUTCFullYear(nextReviewTime.getUTCFullYear() + interval.years);

    if(interval.days !== 0 || interval.months !== 0 || interval.years !== 0) {
      nextReviewTime.setHours(0, 0, 0, 0);
    }
    return nextReviewTime;
  };
}

export const Review = connect(mapStateToProps, mapDispatchToProps)(ConnectedReview);
