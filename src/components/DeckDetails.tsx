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
import {Icon, Segment, Modal, Input} from 'semantic-ui-react';

import '../stylesheets/components/DeckDetails.scss';
import {BaseButton} from "./BaseButton";
import {DECK_COLUMN_NAME, DECK_TABLE} from "../Constants";
import {bindActionCreators} from "redux";

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
  deckNameInputValue: string;
  updateDeckNameMessage: string;
}

const mapStateToProps = (state: RootState) => ({
  decks: state.decks,
  moreDeckName: state.moreDeckName,
  defaultDeckName: state.defaultDeckName,
  chosenDeckName: state.chosenDeckName,
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  setMoreDeckName: actions.setMoreDeckName,
  setDecks: actions.setDecks,
  setDefaultDeckName: actions.setDefaultDeckName,
  setChosenDeckName: actions.setChosenDeckName,
}, dispatch);

export class ConnectedDeckDetails extends React.Component<DeckDetailsProps, DeckDetailsStates> {
  constructor(props: DeckDetailsProps) {
    super(props);
    this.state = {
      isDeleteDeckModalShown: false,
      deckNameInputValue: this.props.moreDeckName,
      updateDeckNameMessage: '',
    }
  }

  render() {
    return (
      <div>
        <div className="top">
          <div onClick={this.handleBackClick}><i className="fas fa-long-arrow-alt-left fa-2x back"/></div>
          <div className="title">{this.props.moreDeckName}</div>
        </div>
        <div className="deck-details-contents">
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

          <Segment>
            <h3>Deck Name</h3>
            <div className={"deck-name-contents-with-message"}>
              <div className="alert">{this.state.updateDeckNameMessage}</div>
              <div className="deck-name-contents">
                <Input
                  className="deck-name-input"
                  value={this.state.deckNameInputValue}
                  onChange={(event) => this.setState({deckNameInputValue: (event.target as HTMLInputElement).value})} />
                <BaseButton onClick={this.updateDeckName}>Update Deck Name</BaseButton>
              </div>
            </div>
          </Segment>

          <Segment>
            <h3>Default Deck</h3>
            {this.props.defaultDeckName === this.props.moreDeckName ?
              <BaseButton disabled>This deck is used by default.</BaseButton> :
              <BaseButton onClick={() => this.setDefaultDeck(this.props.moreDeckName)}>Set As Default</BaseButton>
            }
          </Segment>
        </div>
      </div>
    );
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
  private updateDeckName = async () => {
    if(this.props.moreDeckName === this.state.deckNameInputValue) {
      this.setState({
        updateDeckNameMessage: `Deck name is not changed`
      });
      return;
    }
    for(const deck of this.props.decks) {
      if(this.state.deckNameInputValue === deck.name && deck.name !== this.props.moreDeckName) {
        this.setState({
          updateDeckNameMessage: `Deck name ${this.state.deckNameInputValue} already exists`
        });
        return;
      }
    }

    // update database
    const db = await Sqlite.getDb();
    await db.run(`
                UPDATE ${DECK_TABLE}
                SET ${DECK_COLUMN_NAME} = ?
                WHERE ${DECK_COLUMN_NAME} = ?
    `, this.state.deckNameInputValue, this.props.moreDeckName);

    // update props
    if(this.props.defaultDeckName === this.props.moreDeckName) {
      await this.setDefaultDeck(this.state.deckNameInputValue);
    }
    if(this.props.chosenDeckName === this.props.moreDeckName) {
      this.props.setChosenDeckName(this.state.deckNameInputValue);
    }
    let newDecks = this.props.decks.concat();
    for(let i = 0; i < newDecks.length; i++) {
      if(newDecks[i].name === this.props.moreDeckName) {
        newDecks[i].name = this.state.deckNameInputValue;
        break;
      }
    }
    this.props.setDecks(newDecks);
    this.props.setMoreDeckName(this.state.deckNameInputValue);
  };
  setDefaultDeck = async (deckName: string): Promise<void> => {
    this.props.setDefaultDeckName(deckName);
    Configuration.insertOrUpdate("defaultDeckName", deckName);
  };
}

export const DeckDetails = connect(mapStateToProps, mapDispatchToProps)(ConnectedDeckDetails);
