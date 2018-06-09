import { buildAudioTag } from "dict-parser/lib/util/HTMLUtil";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState } from "../reducers";
import "../stylesheets/components/RichEditor.scss";
import { nodeFromHTML } from "../Utils/CommonUtils";

const mapStateToProps = (state: RootState) => ({});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({}, dispatch);

export type ContentEditableEditorProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> & {
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
          padding: ".67857143em 1em"
        }}
        contentEditable={true}
        onPaste={this.handlePaste}
        ref={ref => {
          this.editor = ref;
        }}
      />
    );
  }

  public clear = () => {
    this.editor.innerHTML = "";
  };
  public getContents = () => {
    return this.editor.innerHTML;
  };
  private handlePaste = (event: React.ClipboardEvent<HTMLDivElement>): void => {
    const html = event.clipboardData.getData("text/html");
    document.execCommand("insertHTML", false, this.rebuildAudioTag(html));
    event.preventDefault();
  };
  private rebuildAudioTag = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const audioLinks = doc.querySelectorAll<HTMLLinkElement>("a.dictp-audio");
    for (let i = 0; i < audioLinks.length; i++) {
      if (this.getDirectChilds(audioLinks[i], "audio").length === 0) {
        const completeResourcePath = audioLinks[i].getAttribute("data-dictp-audio-id");
        audioLinks[i].appendChild(this.buildAudioTag(completeResourcePath));
      }
    }
    const head = doc.documentElement.childNodes[0] as HTMLElement;
    const body = doc.documentElement.childNodes[1] as HTMLElement;
    return head.innerHTML + body.innerHTML;
  };
  private getDirectChilds = (htmlElement: HTMLElement, childNodeName: string): Node[] => {
    const result = [];
    for (let i = 0; i < htmlElement.childNodes.length; i++) {
      const childNode = htmlElement.childNodes[i];
      if (childNode.nodeName === childNodeName) {
        result.push(childNode);
      }
    }
    return result;
  };
  private buildAudioTag = (resourcePath: string): Node => {
    const audioTagString = buildAudioTag(resourcePath);
    return nodeFromHTML(audioTagString);
  };
}

export const ContentEditableEditor = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(RawContentEditableEditor);
