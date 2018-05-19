import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {bindActionCreators} from "redux";
import {IRootState} from "../reducers";
import "../stylesheets/components/RichEditor.scss";

const mapStateToProps = (state: IRootState) => ({
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
}, dispatch);

export type ContentEditableEditorProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & {
  editorIndex: number;
};

export class RawContentEditableEditor extends React.Component<ContentEditableEditorProps> {
  private editor: HTMLDivElement;

  constructor(props: ContentEditableEditorProps) {
    super(props);
  }

  public render() {
    return (
      <div
        style={{
          border: "1px solid rgba(34,36,38,.15)",
          fontSize: "1em",
          marginBottom: "5px",
          overflowX: "auto",
          padding: ".67857143em 1em",
        }}
        contentEditable={true}
        onPaste={this.handlePaste}
        ref={(ref) => {
          this.editor = ref;
        }}>

      </div>
    );
  }

  public clear = () => {
    this.editor.innerHTML = "";
  }
  public getContents = () => {
    return this.editor.innerHTML;
  }
  private handlePaste = (event: React.ClipboardEvent<HTMLDivElement>): void => {
    const html = event.clipboardData.getData("text/html");
    document.execCommand("insertHTML", false, html);
    event.preventDefault();
  }
}

export const ContentEditableEditor = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true },
)(RawContentEditableEditor);
