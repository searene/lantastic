import * as React from "react";
import { Modal } from "semantic-ui-react";
import { ipcRenderer } from "electron";
import * as fse from "fs-extra";
import "../stylesheets/components/ImageSearchModal.scss";
import * as path from "path";

interface ImageSearchModalProps {
  open: boolean;
  onClose: (event: React.MouseEvent<HTMLElement>) => void;
  url: string;
}
export interface IImageSearchWebViewData {
  src: string;
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
          bottom: "5px",
          left: "5px",
          right: "5px",
          position: "fixed"
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
            ref={this.webviewRefHandler}
          />
        </Modal.Content>
      </Modal>
    );
  }
  private webviewRefHandler = (webview: Electron.WebviewTag) => {
    if (webview === null) {
      return;
    }
    webview.addEventListener("dom-ready", async event => {
      const jsCode = await fse.readFile(path.resolve(__dirname, "ImageSearchInjection.js"), "utf-8");
      webview.executeJavaScript(jsCode);
    });
    webview.addEventListener('console-message', (e) => {
      console.log('Guest page logged a message:', e.message)
    })
  };
}
