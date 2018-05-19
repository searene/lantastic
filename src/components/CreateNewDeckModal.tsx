import {DECK_COLUMN_NAME, DECK_TABLE} from "../Constants";

import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {Icon, Modal} from "semantic-ui-react";
import {actions} from "../actions";
import {BaseButton} from "./BaseButton";

import {bindActionCreators} from "redux";
import { IRootState } from "../reducers";
import {Sqlite} from "../Sqlite";
import "../stylesheets/components/CreateNewDeckModal.scss";
import {BaseInput} from "./BaseInput";

interface CreateNewDeckModalStates {
  message: string;
  deckName: string;
  isShown: boolean;
}

const mapStateToProps = (state: IRootState) => ({
  decks: state.decks,
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  setDecks: actions.setDecks,
}, dispatch);

type CreateNewDeckModalProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export class ConnectedCreateNewDeckModal extends React.Component<CreateNewDeckModalProps, CreateNewDeckModalStates> {
  constructor(props: CreateNewDeckModalProps) {
    super(props);
    this.state = {
      deckName: "",
      isShown: false,
      message: "",
    };
  }
  public render() {
    return (
      <Modal size="mini" open={this.state.isShown} trigger={
        <BaseButton onClick={this.open}>Create A New Deck</BaseButton>
      }>
        <Modal.Header>Please Input The Deck Name</Modal.Header>
        <Modal.Content>
          <div className="message">{this.state.message}</div>
          <BaseInput
            value={this.state.deckName}
            onChange={this.handleInputChange}
            placeholder="Deck name..."/>
        </Modal.Content>
        <Modal.Actions>
          <BaseButton color="green" onClick={this.createDeck}>
            <Icon name="checkmark"/> OK
          </BaseButton>
          <BaseButton color="red" onClick={this.close}>
            <Icon name="remove"/> Cancel
          </BaseButton>
        </Modal.Actions>
      </Modal>
    );
  }
  private createDeck = async (): Promise<void> => {
    const deckName = this.state.deckName;
    const db = await Sqlite.getDb();
    if (await this.isDeckNameExists(deckName)) {
      this.setState({
        message: "Deck name already exists",
      });
      return;
    }
    await db.run(`
            INSERT INTO ${DECK_TABLE}
              (${DECK_COLUMN_NAME})
            VALUES
              (?)
    `, deckName);
    this.props.setDecks(this.props.decks.concat({
      name: deckName,
    }));
    this.close();
  }
  private isDeckNameExists = async (deckName: string): Promise<boolean> => {
    const db = await Sqlite.getDb();
    const result = await db.get(`
            SELECT
              COUNT(*) AS count
            FROM ${DECK_TABLE}
            WHERE
              ${DECK_COLUMN_NAME} = ?`, deckName);
    return result.count >= 1;
  }
  private handleInputChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    this.setState({
      deckName: (event.target as HTMLInputElement).value,
      message: "",
    });
  }
  private open = () => {
    this.setState({
      isShown: true,
    });
  }
  private close = () => {
    this.setState({
      isShown: false,
    });
  }
}

export const CreateNewDeckModal = connect(mapStateToProps, mapDispatchToProps)(ConnectedCreateNewDeckModal);
