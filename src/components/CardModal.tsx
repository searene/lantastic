import * as React from "react";
import { Button, Icon, Menu, MenuItemProps, Modal } from "semantic-ui-react";
import { Card } from "../models/Card";

interface CardModalStates {
  activeMenuItem: string;
  showDeleteConfirmModal: boolean;
  showDeleteSuccessModal: boolean;
}
interface CardModalProps {
  card: Card;
  open: boolean;
  onClose: () => void;
  onDeleteCard: (callback: (success: boolean) => void) => void;
}
export class CardModal extends React.Component<CardModalProps, CardModalStates> {
  private readonly MENU_CONTENTS = "home";
  private readonly MENU_STATISTICS = "statistics";

  constructor(props: CardModalProps) {
    super(props);
    this.state = {
      activeMenuItem: this.MENU_CONTENTS,
      showDeleteConfirmModal: false,
      showDeleteSuccessModal: false
    };
  }

  public render() {
    return (
      <Modal open={this.props.open} size={"fullscreen"} closeIcon onClose={this.props.onClose}>
        {this.deleteConfirmModal()}
        <Modal.Header icon="sticky note outline" content="Card Details"/>
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

  private deleteConfirmModal = () => (
    <Modal size={"mini"} open={this.state.showDeleteConfirmModal} closeIcon onClose={this.closeDeleteCardModal}>
      {this.deleteSuccessModal()}
      <Modal.Header>Delete Card</Modal.Header>
      <Modal.Content>
        <p>Are you sure you want to delete this card?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={this.closeDeleteCardModal} negative>
          No
        </Button>
        <Button positive icon="checkmark" labelPosition="right" onClick={this.deleteCard} content="Yes" />
      </Modal.Actions>
    </Modal>
  );

  private deleteSuccessModal = () => (
    <Modal size={"mini"} open={this.state.showDeleteSuccessModal} closeIcon onClose={this.closeAllModals}>
      <Modal.Header>Success</Modal.Header>
      <Modal.Content>
        <p>Card was deleted successfully</p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          icon="checkmark"
          labelPosition="right"
          onClick={this.closeAllModals}
          content="OK"
        />
      </Modal.Actions>
    </Modal>
  );

  private handleOK = () => {
    this.props.onClose();
  };
  private handleClickOnMenuItem = (e: React.SyntheticEvent<HTMLElement>, menuItemProps: MenuItemProps): void => {
    this.setState({
      activeMenuItem: menuItemProps.name
    });
  };
  private handleDelete = () => {
    this.setState({
      showDeleteConfirmModal: true
    });
  };
  private deleteCard = () => {
    this.props.onDeleteCard(success => {
      if (success) {
        this.setState({
          showDeleteSuccessModal: true
        });
      } else {
        console.error("Card deletion failed");
      }
    });
  };
  private closeAllModals = () => {
    this.setState({
      showDeleteConfirmModal: false,
      showDeleteSuccessModal: false
    });
    this.props.onClose();
  };
  private closeDeleteCardModal = () => {
    this.setState({
      showDeleteConfirmModal: false
    });
  };
}
