import {CreateNewDeckModal} from "./CreateNewDeckModal";
import * as React from 'react';
import {BaseButton} from "./BaseButton";
import {Segment} from "semantic-ui-react";
import '../stylesheets/components/Deck.scss';
import {connect, Dispatch} from "react-redux";
import {actions} from "../actions";
import {DeckDetails} from "./DeckDetails";
import {RootState} from "../reducers";
import {bindActionCreators} from "redux";

interface DeckStates {
}

const mapStateToProps = (state: RootState) => ({
  chosenDeckName: state.chosenDeckName,
  decks: state.decks,
  moreDeckName: state.moreDeckName,
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  setDecks: actions.setDecks,
  setMoreDeckName: actions.setMoreDeckName,
  setChosenDeckName: actions.setChosenDeckName,
}, dispatch);

type DeckProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export class ConnectedDeck extends React.Component<DeckProps, DeckStates> {

  render() {
    return (
      <Segment className="deck-segment">
        {this.props.moreDeckName === '' ?
          [<div className="decks" key="decks">
            {this.props.decks.map(deck => (
              <Segment stacked className="single-deck" key={deck.name}>
                <b>{deck.name}</b>
                <div className="single-deck-bottom">
                  <BaseButton
                    size="mini"
                    primary
                    disabled={deck.name === this.props.chosenDeckName}
                    onClick={() => this.props.setChosenDeckName(deck.name)}>
                    {deck.name === this.props.chosenDeckName ? 'In use' : 'Switch'}
                  </BaseButton>
                  <BaseButton size="mini" onClick={() => this.props.setMoreDeckName(deck.name)}>More...</BaseButton>
                </div>
              </Segment>
            ))}
          </div>,
            <div className="decks-bottom-area" key="decks-bottom-area">
              <CreateNewDeckModal/>
            </div>]
          : <DeckDetails/>
        }
      </Segment>
    );
  }
}

export const Deck = connect(mapStateToProps, mapDispatchToProps)(ConnectedDeck);
