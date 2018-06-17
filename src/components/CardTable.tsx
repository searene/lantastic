import * as React from "react";
import { CardModal } from "./CardModal";
import { Table } from "semantic-ui-react";
import {
  CARD_COLUMN_BACK,
  CARD_COLUMN_CREATION_TIME,
  CARD_COLUMN_DECK,
  CARD_COLUMN_FRONT,
  CARD_COLUMN_ID,
  CARD_COLUMN_NEXT_REVIEW_TIME,
  DATE_FORMAT
} from "../Constants";
import moment = require("moment");
import { Card } from "../models/Card";
import { List } from "immutable";

interface CardTableStates {
  activeCard: Card;
  showModal: boolean;
}
interface CardTableProps {
  cards: List<Card>;
  onDeleteCard: (cardId: number, callback: (success: boolean) => void) => void;
}
export class CardTable extends React.Component<CardTableProps, CardTableStates> {
  private readonly TABLE_DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";
  constructor(props: CardTableProps) {
    super(props);
    this.state = {
      activeCard: undefined,
      showModal: false
    };
  }
  render() {
    return (
      <div
        style={{
          width: "100%",
          flexGrow: 1,
          overflow: "auto",
          margin: "10px 10px 20px 0",
          paddingRight: "10px"
        }}
      >
        <CardModal
          card={this.state.activeCard}
          onDeleteCard={this.deleteActiveCard}
          open={this.state.showModal}
          onClose={this.closeModal}
        />
        <Table celled selectable striped sortable fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Deck</Table.HeaderCell>
              <Table.HeaderCell>Front</Table.HeaderCell>
              <Table.HeaderCell>Back</Table.HeaderCell>
              <Table.HeaderCell>Creation Time</Table.HeaderCell>
              <Table.HeaderCell>Next Review Time</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.props.cards.map(card => (
              <Table.Row
                key={card[CARD_COLUMN_ID]}
                className={"search-table-row"}
                onClick={() => this.handleClickOnTableRow(card)}
              >
                <Table.Cell>{card[CARD_COLUMN_DECK]}</Table.Cell>
                <Table.Cell>{card[CARD_COLUMN_FRONT]}</Table.Cell>
                <Table.Cell>{card[CARD_COLUMN_BACK]}</Table.Cell>
                <Table.Cell>
                  {moment(card[CARD_COLUMN_CREATION_TIME], DATE_FORMAT).format(this.TABLE_DATE_FORMAT)}
                </Table.Cell>
                <Table.Cell>
                  {moment(card[CARD_COLUMN_NEXT_REVIEW_TIME], DATE_FORMAT).format(this.TABLE_DATE_FORMAT)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
  private closeModal = () => {
    this.setState({ showModal: false });
  };
  private handleClickOnTableRow = (card: Card) => {
    this.setState({
      activeCard: card,
      showModal: true
    });
  };
  private deleteActiveCard = (callback: (success: boolean) => void) => {
    this.props.onDeleteCard(this.state.activeCard.id, callback);
  };
}
