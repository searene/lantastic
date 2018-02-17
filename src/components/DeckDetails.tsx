import {RootState} from "../reducers";

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
import {connect, Dispatch} from "react-redux";
import {actions} from "../actions";
import {Icon, Segment, Modal} from 'semantic-ui-react';

import '../stylesheets/components/DeckDetails.scss';
import {BaseButton} from "./BaseButton";
import {DECK_COLUMN_NAME, DECK_TABLE} from "../Constants";

interface DeckDetailsProps {
  decks: any[];
  moreDeckName: string;
  defaultDeckName: string;
  chosenDeckName: string;
  setMoreDeckName: (deckName: string) => any;
  setDecks: (decks: any[]) => any;
  setDefaultDeckName: (deckName: string) => any;
  setChosenDeckName: (deckName: string) => any;
}

interface DeckDetailsStates {
  isDeleteDeckModalShown: boolean;
}

const mapStateToProps = (state: RootState) => ({
  decks: state.decks,
  moreDeckName: state.moreDeckName,
  defaultDeckName: state.defaultDeckName,
  chosenDeckName: state.chosenDeckName,
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setMoreDeckName: (deckName: string) => dispatch(actions.setMoreDeckName(deckName)),
  setDecks: (decks: any[]) => dispatch(actions.setDecks(decks)),
  setDefaultDeckName: (deckName: string) => dispatch(actions.setDefaultDeckName(deckName)),
  setChosenDeckName: (deckName: string) => dispatch(actions.setChosenDeckName(deckName)),
});

export class ConnectedDeckDetails extends React.Component<DeckDetailsProps, DeckDetailsStates> {
  constructor(props: DeckDetailsProps) {
    super(props);
    this.state = {
      isDeleteDeckModalShown: false
    }
  }

  render() {
    return (
      <div>
        <div className="top">
          <div onClick={this.handleBackClick}><i className="fas fa-long-arrow-alt-left fa-2x back"/></div>
          <div className="title">{this.props.moreDeckName}</div>
        </div>
        <div>
          <Segment>
            <h3>Deletion</h3>
            <p>Please be careful, the deletion is permanent!</p>

            <Modal
              open={this.state.isDeleteDeckModalShown}
              trigger={<BaseButton color="red" onClick={() => this.setState({isDeleteDeckModalShown: true})}>Delete This Deck</BaseButton>}>
              <Modal.Header>Deck Deletion</Modal.Header>
              <Modal.Content>
                <p>Are you sure you want to delete deck {this.props.moreDeckName}?</p>
              </Modal.Content>
              <Modal.Actions>
                <BaseButton color="green" onClick={this.deleteDeck}>
                  <Icon name="checkmark"/> Delete
                </BaseButton>
                <BaseButton color="red" onClick={() => this.setState({isDeleteDeckModalShown: false})}>
                  <Icon name="remove"/> Cancel
                </BaseButton>
              </Modal.Actions>
            </Modal>

          </Segment>
        </div>
      </div>
    )
  }

  private handleBackClick = () => {
    this.props.setMoreDeckName('');
  };
  private deleteDeck = async () => {
    const db = await Sqlite.getDb();

    // delete this deck
    const newDecks = this.props.decks.filter(deck => deck.name !== this.props.moreDeckName);
    this.props.setDecks(newDecks);
    await db.run(`DELETE FROM ${DECK_TABLE} WHERE ${DECK_COLUMN_NAME} = ?`, this.props.moreDeckName);

    // check if this is the only deck
    if(this.props.decks.length === 0) {
      await db.run(`
                  INSERT INTO ${DECK_TABLE} 
                    (${DECK_COLUMN_NAME})
                  VALUES 
                    ('Default')`, );
      this.props.setDecks([{
        name: 'Default'
      }]);
    }

    // check if the current deck is default
    if(this.props.defaultDeckName === this.props.moreDeckName) {
      const newDefaultDeckName = (await db.get(`
                  SELECT 
                    ${DECK_COLUMN_NAME}
                  FROM ${DECK_TABLE}
      `)).name;
      await Configuration.insertOrUpdate('defaultDeckName', newDefaultDeckName);
      this.props.setDefaultDeckName(newDefaultDeckName);
    }

    // check if the current deck is in use
    if(this.props.chosenDeckName === this.props.moreDeckName) {
      this.props.setChosenDeckName(this.props.defaultDeckName);
    }

    // return to the deck tab
    this.setState({
      isDeleteDeckModalShown: false
    });
    this.props.setMoreDeckName('');
  };
}

export const DeckDetails = connect(mapStateToProps, mapDispatchToProps)(ConnectedDeckDetails);
