import {RootState} from "../reducers";

import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {bindActionCreators} from "redux";
import {Icon, Input, Modal} from "semantic-ui-react";
import {actions} from "../actions";
import {Configuration} from "../Configuration";
import {CARD_COLUMN_DECK, CARD_TABLE, DECK_COLUMN_NAME, DECK_TABLE} from "../Constants";
import {Sqlite} from "../Sqlite";
import "../stylesheets/components/DeckDetails.scss";
import {BaseButton} from "./BaseButton";
import {Title} from "./Title";

interface IDeckDetailsStates {
  isDeleteDeckModalShown: boolean;
  deckNameInputValue: string;
  updateDeckNameMessage: string;
}

const mapStateToProps = (state: RootState) => ({
  chosenDeckName: state.chosenDeckName,
  decks: state.decks,
  defaultDeckName: state.defaultDeckName,
  moreDeckName: state.moreDeckName,
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  setChosenDeckName: actions.setChosenDeckName,
  setDecks: actions.setDecks,
  setDefaultDeckName: actions.setDefaultDeckName,
  setMoreDeckName: actions.setMoreDeckName,
}, dispatch);

type DeckDetailsProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export class ConnectedDeckDetails extends React.Component<DeckDetailsProps, IDeckDetailsStates> {
  constructor(props: DeckDetailsProps) {
    super(props);
    this.state = {
      deckNameInputValue: this.props.moreDeckName,
      isDeleteDeckModalShown: false,
      updateDeckNameMessage: "",
    };
  }

  public setDefaultDeck = async (deckName: string): Promise<void> => {
    this.props.setDefaultDeckName(deckName);
    Configuration.insertOrUpdate("defaultDeckName", deckName);
  }

  public render() {
    return (
      <div className={"deck-details-root"}>
        <div className="top">
          <div onClick={this.handleBackClick}><i className="fas fa-long-arrow-alt-left fa-2x back"/></div>
          <div className="title">{this.props.moreDeckName}</div>
        </div>
        <div className="deck-details-contents">
          <Title name={"Deletion"}>
            <p>Please be careful, the deletion is permanent!</p>

            <Modal
              open={this.state.isDeleteDeckModalShown}
              trigger={
                <BaseButton
                  color="red"
                  onClick={() => this.setState({isDeleteDeckModalShown: true})}>
                  Delete This Deck
                </BaseButton>}>
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
          </Title>

          <Title name={"Deck Name"}>
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
          </Title>
          <Title name={"Default Deck"}>
            {this.props.defaultDeckName === this.props.moreDeckName ?
              <BaseButton disabled>This deck is used by default.</BaseButton> :
              <BaseButton onClick={() => this.setDefaultDeck(this.props.moreDeckName)}>Set As Default</BaseButton>
            }
          </Title>
        </div>
      </div>
    );
  }

  private handleBackClick = () => {
    this.props.setMoreDeckName("");
  }
  private deleteDeck = async () => {
    const db = await Sqlite.getDb();

    // delete this deck and related cards
    const newDecks = this.props.decks.filter((deck) => deck.name !== this.props.moreDeckName);
    this.props.setDecks(newDecks);
    await Promise.all([
      db.run(`DELETE FROM ${DECK_TABLE} WHERE ${DECK_COLUMN_NAME} = ?`, this.props.moreDeckName),
      db.run(`DELETE FROM ${CARD_TABLE} WHERE ${CARD_COLUMN_DECK} = ?`, this.props.moreDeckName),
    ]);

    // check if this is the only deck
    if (this.props.decks.length === 0) {
      await db.run(`
                  INSERT INTO ${DECK_TABLE}
                    (${DECK_COLUMN_NAME})
                  VALUES
                    ('Default')` );
      this.props.setDecks([{
        name: "Default",
      }]);
    }

    // check if the current deck is default
    if (this.props.defaultDeckName === this.props.moreDeckName) {
      const newDefaultDeckName = (await db.get(`
                  SELECT
                    ${DECK_COLUMN_NAME}
                  FROM ${DECK_TABLE}
      `)).name;
      await Configuration.insertOrUpdate("defaultDeckName", newDefaultDeckName);
      this.props.setDefaultDeckName(newDefaultDeckName);
    }

    // check if the current deck is in use
    if (this.props.chosenDeckName === this.props.moreDeckName) {
      this.props.setChosenDeckName(this.props.defaultDeckName);
    }

    // return to the deck tab
    this.setState({
      isDeleteDeckModalShown: false,
    });
    this.props.setMoreDeckName("");
  }
  private updateDeckName = async () => {
    if (this.props.moreDeckName === this.state.deckNameInputValue) {
      this.setState({
        updateDeckNameMessage: `Deck name is not changed`,
      });
      return;
    }
    for (const deck of this.props.decks) {
      if (this.state.deckNameInputValue === deck.name && deck.name !== this.props.moreDeckName) {
        this.setState({
          updateDeckNameMessage: `Deck name ${this.state.deckNameInputValue} already exists`,
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
    if (this.props.defaultDeckName === this.props.moreDeckName) {
      await this.setDefaultDeck(this.state.deckNameInputValue);
    }
    if (this.props.chosenDeckName === this.props.moreDeckName) {
      this.props.setChosenDeckName(this.state.deckNameInputValue);
    }
    const newDecks = this.props.decks.concat();
    for (const newDeck of newDecks) {
      if (newDeck.name === this.props.moreDeckName) {
        newDeck.name = this.state.deckNameInputValue;
        break;
      }
    }
    this.props.setDecks(newDecks);
    this.props.setMoreDeckName(this.state.deckNameInputValue);
  }
}

export const DeckDetails = connect(mapStateToProps, mapDispatchToProps)(ConnectedDeckDetails);
