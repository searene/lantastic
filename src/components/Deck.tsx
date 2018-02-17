declare const __IS_WEB__: boolean;
import {Sqlite as SqliteType} from "../Sqlite";
import {Configuration as ConfigurationType} from "../Configuration";
let Sqlite: typeof SqliteType;
let Configuration: typeof ConfigurationType;
if(!__IS_WEB__) {
  Sqlite = require('../Sqlite');
  Configuration = require('../Configuration');
}

import * as React from 'react';
import {Segment} from "semantic-ui-react";
import '../stylesheets/components/Deck.scss';
import {DECK_COLUMN_ID, DECK_COLUMN_NAME} from "../Constants";

interface DeckTabStates {
  decks: any[];
  chosenDeckId: number;
  isFetchingDeckInfo: boolean;
}

interface DeckTabProps {

}

export class Deck extends React.Component<DeckTabProps, DeckTabStates> {

  constructor(props: DeckTabProps) {
    super(props);
    this.setState({
      decks: [],
      chosenDeckId: -1,
      isFetchingDeckInfo: true,
    });
  }

  async componentWillMount() {
    let decks: any[];
    let defaultDeckId: number;
    if(__IS_WEB__) {
      decks = [{
        id: 0,
        name: 'English',
      }, {
        id: 1,
        name: 'Japanese',
      }];
      defaultDeckId = 0;
    } else {
      const db = await Sqlite.getDb();
      decks = await db.all(`
          SELECT 
            ${DECK_COLUMN_ID},
            ${DECK_COLUMN_NAME}
          FROM deck`);
      defaultDeckId = await Configuration.getValue('defaultDeckId');
    }

    this.setState({
      decks: decks,
      chosenDeckId: defaultDeckId,
      isFetchingDeckInfo: false,
    });
  }

  render() {
    return (
      <Segment className="deck-segment">
        {this.state.isFetchingDeckInfo ? <div></div> :

          this.state.decks.map(deck => (
            <div>{deck.name}</div>
          ))

        }
      </Segment>
    );
  }
}