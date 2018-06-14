import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { Button, Icon, Menu, MenuItemProps, Modal } from "semantic-ui-react";
import { RootState } from "../reducers";
import { actions } from "../actions";
import { Sqlite } from "../Sqlite";
import { List } from "immutable";
import { Card } from "../models/Card";

interface CardModalStates {
  activeMenuItem: string;
  showDeleteModal: boolean;
  showDeleteSuccessModal: boolean;
}
const mapStateToProps = (state: RootState) => ({
  cardModalOpen: state.cardModalOpen,
  cardInCardModal: state.cardInCardModal,
  cardsInCardBrowser: state.cardsInCardBrowser
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setCardModalOpen: (cardModalOpen: boolean) => dispatch(actions.setCardModalOpen(cardModalOpen)),
      setCardsInCardBrowser: (cardsInCardBrowser: List<Card>) =>
        dispatch(actions.setCardsInCardBrowser(cardsInCardBrowser))
    },
    dispatch
  );

type CardModalProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & {};

class InternalCardModal extends React.Component<CardModalProps, CardModalStates> {
  private MENU_CONTENTS = "home";
  private MENU_STATISTICS = "statistics";

  constructor(props: CardModalProps) {
    super(props);
    this.state = {
      activeMenuItem: this.MENU_CONTENTS,
      showDeleteModal: false,
      showDeleteSuccessModal: false
    };
  }

  public render() {
    return (
      <Modal open={this.props.cardModalOpen} size={"fullscreen"}>
        {this.deleteCardModal()}
        {this.deleteCardSuccessModal()}
        <Modal.Content>
          <Modal.Description>
            <Menu
              pointing
              secondary
              vertical
              style={{
                width: "10rem"
              }}
            >
              <Menu.Item
                name={this.MENU_CONTENTS}
                active={this.state.activeMenuItem === this.MENU_CONTENTS}
                onClick={this.handleClickOnMenuItem}
              />
              <Menu.Item
                name={this.MENU_STATISTICS}
                active={this.state.activeMenuItem === this.MENU_STATISTICS}
                onClick={this.handleClickOnMenuItem}
              />
            </Menu>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color={"red"} onClick={this.handleDelete}>
            Delete Card
          </Button>
          <Button primary onClick={this.handleOK}>
            OK <Icon name="chevron right" />
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  private deleteCardModal = () => (
    <Modal size={"mini"} open={this.state.showDeleteModal}>
      <Modal.Header>Delete Card</Modal.Header>
      <Modal.Content>
        <p>Are you sure you want to delete this card?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => this.setState({ showDeleteModal: false })} negative>
          No
        </Button>
        <Button positive icon="checkmark" labelPosition="right" onClick={this.deleteCard} content="Yes" />
      </Modal.Actions>
    </Modal>
  );

  private deleteCardSuccessModal = () => (
    <Modal size={"mini"} open={this.state.showDeleteSuccessModal}>
      <Modal.Header>Success</Modal.Header>
      <Modal.Content>
        <p>Card was deleted successfully</p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          icon="checkmark"
          labelPosition="right"
          onClick={this.handleClickOnDeleteCardSuccessModalOK}
          content="OK"
        />
      </Modal.Actions>
    </Modal>
  );

  private handleOK = () => {
    this.props.setCardModalOpen(false);
  };
  private handleClickOnMenuItem = (e: React.SyntheticEvent<HTMLElement>, menuItemProps: MenuItemProps): void => {
    this.setState({
      activeMenuItem: menuItemProps.name
    });
  };
  private handleDelete = () => {
    this.setState({
      showDeleteModal: true
    });
  };
  private deleteCard = async (): Promise<void> => {
    await Sqlite.deleteCard(this.props.cardInCardModal.id);
    this.setState({
      showDeleteSuccessModal: true
    });
  };
  private handleClickOnDeleteCardSuccessModalOK = () => {
    this.setState({
      showDeleteSuccessModal: false
    });
    this.props.setCardModalOpen(false);
    this.props.setCardsInCardBrowser(
      this.props.cardsInCardBrowser.filter(card => card.id !== this.props.cardInCardModal.id).toList()
    );
  };
}
export const CardModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(InternalCardModal);