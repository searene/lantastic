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
}

const mapStateToProps = (state: ReviewProps) => ({
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
});

class ConnectedReview extends React.Component<ReviewProps, ReviewStates> {
  constructor(props: ReviewProps) {
    super(props);
    this.state = {
      isAnswerShown: false
    };
  }
  render() {
    let cards: Card[] = [];
    if(__IS_WEB__) {
      const now = new Date();
      cards = [{
        front: '<b>test front</b>',
        back: 'test back',
        creationDate: getStrFromDate(now),
        nextReviewDate: getStrFromDate(now),
      }];
    } else {
      cards = this.getCards();
    }
    const card = cards[0];
    return (
      <Container>
        <div className="review-card" dangerouslySetInnerHTML={{__html: card.front}} />
        {this.state.isAnswerShown ?
          <div className="review-card" dangerouslySetInnerHTML={{__html: card.back}} />
          : ''
        }
        <div className="review-bottom">
          <hr className="hr"/>
          <div className="bottom-buttons">
            {this.state.isAnswerShown ?
              [<BaseButton>Again</BaseButton>,
                <BaseButton>Hard</BaseButton>,
                <BaseButton>Good</BaseButton>,
                <BaseButton>Easy</BaseButton>]
              :
              <BaseButton onClick={() => this.setState({isAnswerShown: true})}>Show Answer</BaseButton>
            }
          </div>
        </div>
      </Container>
    )
  }
  private getCards = (): Card[] => {
    return cardDb.get('cards')
      .filter<Card>({ nextReviewDate: getStrFromDate(new Date()) })
      .value();
  }
}

export const Review = connect(mapStateToProps, mapDispatchToProps)(ConnectedReview);
