import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { Icon, Menu, Modal } from "semantic-ui-react";
import { RootState } from "../reducers";
import { actions } from "../actions";

interface IToolBarStates {
  blockType: string;
}

const mapStateToProps = (state: RootState) => ({
  showGoogleImageModal: state.showGoogleImageModal
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setShowGoogleImageModal: actions.setShowGoogleImageModal
    },
    dispatch
  );

type GoogleImageModalProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export class InternalGoogleImageModal extends React.Component<GoogleImageModalProps> {
  public render() {
    return (
      <Modal onClose={this.closeModal} closeIcon size={"fullscreen"} open={this.props.showGoogleImageModal}>
        <Modal.Header icon={"google"} content={"Google Images"} />
        <Modal.Content>
          <iframe src={"https://www.google.com/search?q=apple&tbm=isch"} width={"100%"} height={"100%"} />
        </Modal.Content>
      </Modal>
    );
  }
  private closeModal = () => {
    this.props.setShowGoogleImageModal(false);
  };
}

export const GoogleImageModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(InternalGoogleImageModal);
