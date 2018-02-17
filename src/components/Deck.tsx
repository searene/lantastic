import {CreateNewDeckModal} from "./CreateNewDeckModal";

declare const __IS_WEB__: boolean;
import {Sqlite as SqliteType} from "../Sqlite";
import {Configuration as ConfigurationType} from "../Configuration";

let Sqlite: typeof SqliteType;
let Configuration: typeof ConfigurationType;
if (!__IS_WEB__) {
  Sqlite = require('../Sqlite').Sqlite;
  Configuration = require('../Configuration').Configuration;
}

import * as React from 'react';
import {BaseButton} from "./BaseButton";
import {Segment, Modal} from "semantic-ui-react";
import '../stylesheets/components/Deck.scss';
import {DECK_COLUMN_NAME} from "../Constants";
import {connect, Dispatch} from "react-redux";
import {actions} from "../actions";

interface DeckStates {
}

interface DeckProps {
  decks: any[];
  setDecks: (decks: any[]) => any;
  chosenDeckName: string;
  setChosenDeckName: (deckName: string) => any;
}

const mapStateToProps = (state: DeckProps) => ({
  chosenDeckName: state.chosenDeckName,
  decks: state.decks,
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setChosenDeckName: (deckName: string) => dispatch(actions.setChosenDeckName(deckName)),
  setDecks: (decks: any[]) => dispatch(actions.setDecks(decks)),
});

export class ConnectedDeck extends React.Component<DeckProps, DeckStates> {

  constructor(props: DeckProps) {
    super(props);
    this.state = {
      decks: [],
    };
  }

  render() {
    return (
      <Segment className="deck-segment">
        <div className="decks">
          {this.props.decks.map(deck => (
            <Segment stacked className="single-deck" key={deck.name}>
              <b>{deck.name}</b>
              <div className="single-deck-bottom">
                <BaseButton
                  size="mini"
                  primary
                  disabled={deck.name === this.props.chosenDeckName}
                  onClick={async () => {
                    this.props.setChosenDeckName(deck.name)
                  }}>
                  {deck.name === this.props.chosenDeckName ? 'In use' : 'Switch'}
                </BaseButton>
                <BaseButton size="mini">More...</BaseButton>
              </div>
            </Segment>
          ))}
        </div>
        <div className="decks-bottom-area">
          <CreateNewDeckModal />
        </div>
      </Segment>
    );
  }
}

export const Deck = connect(mapStateToProps, mapDispatchToProps)(ConnectedDeck);
