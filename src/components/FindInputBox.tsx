import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import { RootState } from "../reducers";
import { Icon, Input, Ref, SemanticICONS } from "semantic-ui-react";
import "../stylesheets/components/FindInputBox.scss";
import { actions } from "../actions";
import { MouseEventHandler } from "react";
import { getDefinitionHTML } from "./Dictionary";

export interface Match {
  node: Node,
  index: number,
}

const mapStateToProps = (state: RootState) => ({
  wordDefinitions: state.wordDefinitions,
  isFindInputBoxFocused: state.isFindInputBoxFocused,
  findWordIndex: state.findWordIndex,
  findWord: state.findWord,
  isFindInputBoxVisible: state.isFindInputBoxVisible,
  definitionsDOM: state.definitionsDOM,
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  setFindInputBoxVisible: actions.setFindInputBoxVisible,
  setFindInputBoxFocused: actions.setFindInputBoxFocused,
  setFindWordIndex: actions.setFindWordIndex,
  setFindWord: actions.setFindWord,
  setHighlightedDefinitionsHTML: actions.setHighlightedDefinitionsHTML,
}, dispatch);

type FindInputBoxProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & {
  [key: string]: any;
  style?: React.CSSProperties;
};

export class InternalFindInputBox extends React.Component<FindInputBoxProps> {

  private input: HTMLInputElement;
  private matches: Match[] =[];
  private previouslyHighlightedNode: Node;

  public componentDidMount() {
    this.reset();
    this.input.addEventListener("keyup", (event) => {
      if (event.key === "Escape") {
        this.props.setFindInputBoxVisible(false);
      }
    });
    this.input.addEventListener("blur", (event) => {
      this.props.setFindInputBoxFocused(false);
    });
    this.input.addEventListener("focus", (event) => {
      this.props.setFindInputBoxFocused(true);
    });
    this.input.addEventListener("input", (event) => {
      const word = (event.currentTarget as HTMLInputElement).value;
      this.props.setFindWord(word);
      this.props.setFindWordIndex(0);
      this.props.setHighlightedDefinitionsHTML(this.getHighlightedHTML(word, 0));
    });
  }
  public componentDidUpdate() {
    if (this.props.isFindInputBoxFocused) {
      this.input.focus();
    }
  }
  public render() {
    return (
      <div style={{
        position: "absolute",
        zIndex: 999,
        display: "flex",
        top: 0,
        width: "216px",
        left: "calc(50% - 108px)",
        border: "1px solid rgba(34,36,38,.15)",
        padding: "9.5px 14px",
        backgroundColor: "white",
      }}>
        <Ref innerRef={(ref) => this.input = ref.childNodes[0] as HTMLInputElement}>
          <Input
            className={"find-input"}
            style={{
              width: "100px",
              borderRight: "1px solid rgba(34,36,38,.15)",
              marginRight: "10px",
            }}/>
        </Ref>
        { this.inputIcon("chevron up", this.handleClickOnPrevFind) }
        { this.inputIcon("chevron down", this.handleClickOnNextFind) }
        { this.inputIcon("close", this.handleClickOnClose) }
      </div>
    );
  }
  private inputIcon = (iconName: SemanticICONS, handler: MouseEventHandler<HTMLDivElement>): React.ReactNode => {
    return (
      <div className={"find-input-icon-container"}
           style={{
             marginRight: "10px",
           }}
           onClick={handler}>
        <Icon name={iconName}/>
      </div>
    );
  }
  private handleClickOnPrevFind = () => {

  }
  private handleClickOnNextFind = () => {

  }
  private handleClickOnClose = () => {
    this.props.setFindInputBoxVisible(false);
    this.reset();
  }
  private reset = () => {
    this.props.setFindWordIndex(0);
    this.props.setFindWord("");
    this.props.setFindInputBoxFocused(true);
  }
  private getMatchedNodes = (node: Node, word: string, prevMatchedNodes: Match[]) => {
    for (let i = 0; i < node.childNodes.length; i++) {
      const currentNode = node.childNodes[i];
      if (currentNode.nodeName === "#text") {
        const matchedIndexes = this.getAllMatchedIndexes(currentNode.nodeValue, word);
        for (let matchedIndex of matchedIndexes) {
          prevMatchedNodes.push({
            node: currentNode,
            index: matchedIndex,
          });
        }
      } else {
        this.getMatchedNodes(currentNode, word, prevMatchedNodes);
      }
    }
    return prevMatchedNodes;
  };
  private getAllMatchedIndexes = (source: string, find: string): number[] => {
    if (find.length === 0) {
      return [];
    }
    const result = [];
    for (let i = 0; i < source.length; i++) {
      if (source.substring(i, i + find.length) === find) {
        result.push(i);
      }
    }
    return result;
  };
  private highlightNode = (matchedNode: Node, index: number): Node => {
    const nodeValue = matchedNode.nodeValue;
    const firstPart = nodeValue.substring(0, index);
    const secondPart = nodeValue.substring(index, index + this.props.findWord.length);
    const thirdPart = nodeValue.substring(index + this.props.findWord.length, nodeValue.length);

    const firstNode = document.createTextNode(firstPart);
    const secondNode = document.createElement("span");
    secondNode.style.backgroundColor = "black";
    secondNode.style.color = "white";
    secondNode.appendChild(document.createTextNode(secondPart));
    const thirdNode = document.createTextNode(thirdPart);

    const newNode = document.createElement("span");
    newNode.id = "lantastic-find-highlight";
    [firstNode, secondNode, thirdNode].forEach(node => newNode.appendChild(node));
    matchedNode.parentNode.replaceChild(newNode, matchedNode);
    return newNode;
  };
  private getHighlightedHTML = (findWord: string, findWordIndex: number) => {
    this.deHighlight(this.previouslyHighlightedNode);
    this.matches = this.getSearchMatches(this.props.definitionsDOM, findWord);
    if (this.matches.length === 0) {
      return this.props.definitionsDOM.getElementsByTagName("body")[0].innerHTML;
    }
    const { node, index } = this.matches[findWordIndex % this.matches.length];
    this.previouslyHighlightedNode = this.highlightNode(node, index);
    return this.props.definitionsDOM.getElementsByTagName("body")[0].innerHTML;
  };
  private getSearchMatches = (dom: HTMLDocument, word: string): Match[] => {
    return this.getMatchedNodes(dom.getElementsByTagName("body")[0], word, []);
  };
  private deHighlight = (node: Node) => {
    if (node === undefined) {
      return;
    }
    const text = node.childNodes[0].nodeValue +
      node.childNodes[1].childNodes[0].nodeValue +
      node.childNodes[2].nodeValue;
    const newNode = document.createTextNode(text);
    node.parentNode.replaceChild(newNode, node);
  };
}

export const FindInputBox = connect(mapStateToProps, mapDispatchToProps)(InternalFindInputBox);
