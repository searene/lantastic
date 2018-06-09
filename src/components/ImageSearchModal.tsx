import * as React from "react";
import { Modal } from "semantic-ui-react";
import "../stylesheets/components/ImageSearchModal.scss";

interface ImageSearchModalProps {
  open: boolean;
  onClose: (event: React.MouseEvent<HTMLElement>) => void;
  url: string;
}

export class ImageSearchModal extends React.Component<ImageSearchModalProps> {
  constructor(props: ImageSearchModalProps) {
    super(props);
  }
  render() {
    return (
      <Modal
        className="search-image-modal"
        style={{
          marginTop: 0,
          marginBottom: 0,
          top: "5px",
          bottom: "5px"
        }}
        onClose={this.props.onClose}
        open={this.props.open}
        size="fullscreen"
      >
        <Modal.Header>Image Search</Modal.Header>
        <Modal.Content
          style={{
            flex: 1
          }}
        >
          <webview
            useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36"
            src={this.props.url}
            style={{ height: "100%" }}
          />
        </Modal.Content>
      </Modal>
    );
  }
}
