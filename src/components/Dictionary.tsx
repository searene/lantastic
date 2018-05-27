import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { Ref, Segment } from "semantic-ui-react";

import { RootState } from "../reducers";
import "../stylesheets/dictionaries/common.scss";
import "../stylesheets/dictionaries/dsl.scss";
import { AutoSuggestInput } from "./AutoSuggestInput";
import { getOS, isCtrlOrCommand, OS } from "../Utils/CommonUtils";
import { InternalApp } from "../App";
import { Keyboard } from "../services/Keyboard";
import { List, Set } from "immutable";
import { FindInputBox } from "./FindInputBox";
import { removeDisabledFailures } from "tslint";
import { actions } from "../actions";

interface Match {
  node: Node,
  index: number,
}

interface DictionaryStates {
  highlightedHTML: string;
}

const mapStateToProps = (state: RootState) => ({
  wordDefinitions: state.wordDefinitions,
  isFindInputBoxVisible: state.isFindInputBoxVisible,
  findWord: state.findWord,
  findWordIndex: state.findWordIndex,
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  setFindInputBoxVisible: (isFindInputBoxVisible: boolean) =>
    dispatch(actions.setFindInputBoxVisible(isFindInputBoxVisible)),
  setFindInputBoxFocused: (isFindInputBoxFocused: boolean) =>
    dispatch(actions.setFindInputBoxFocused(isFindInputBoxFocused)),
  setFindWordIndex: (findWordIndex: number) =>
    dispatch(actions.setFindWordIndex(findWordIndex)),
}, dispatch);

type DictionaryProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class InternalDictionary extends React.Component<DictionaryProps, DictionaryStates> {

  constructor(props: DictionaryProps) {
    super(props);
    this.state = {
      highlightedHTML: undefined,
    };
  }

  private definitionSegment: HTMLElement;
  private definitionBodyNode: HTMLBodyElement;
  private matches: Match[];

  public componentDidMount() {
    this.registerShortcuts();
  }

  public componentDidUpdate(prevProps: DictionaryProps) {
    this.definitionSegment.innerHTML = this.props.isFindInputBoxVisible ?
        this.state.highlightedHTML :
        this.props.wordDefinitions.reduce((r, wordDefinition) => r + wordDefinition.html, "");
    this.buildSearchRelatedVariables(prevProps);
  }

  public render() {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        height: "100%",
      }}>
        <AutoSuggestInput
          onSearchCompleted={() => {
            this.definitionSegment.scrollTop = 0;
          }}
        />
        <div style={{
          marginTop: "5px",
          position: "relative",
          flexGrow: 1,
          overflow: "auto",
          border: "1px solid rgba(34,36,38,.15)",
          boxShadow: "0 1px 2px 0 rgba(34,36,38,.15)",
        }}>
          {
            this.props.isFindInputBoxVisible &&
            <FindInputBox/>
          }
          <Ref innerRef={(ref) => this.definitionSegment = ref}>
            <Segment style={{
              padding: "10px",
              width: "100%",
              borderRadius: 0,
              border: "none",
              boxShadow: "none",
            }}/>
          </Ref>
        </div>
      </div>
    );
  }

  private getDefinitionHTMLs(): string {
    return this.props.wordDefinitions.reduce(
      (r, wordDefinition) => r + wordDefinition.html, "");
  }

  private registerShortcuts = () => {
    this.registerFindShortcut();
  };
  private registerFindShortcut = () => {
    document.addEventListener("keydown", (event) => {
      if (InternalApp.isKeyWithCtrlOrCmdPressed([], "f")) {
        this.props.setFindInputBoxVisible(true);
        this.props.setFindInputBoxFocused(true);
      }
    });
  };
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
    [firstNode, secondNode, thirdNode].forEach(newNode.appendChild);
    return newNode;
  };
  private getHighlightedHTML = (findWordIndex: number) => {
    if (this.matches.length === 0) {
      return this.getDefinitionHTMLs();
    }
    const { node, index } = this.matches[findWordIndex % this.matches.length - 1];
    const highlightedNode = this.highlightNode(node, index);
    node.parentNode.replaceChild(highlightedNode, node);
    return this.definitionBodyNode.innerHTML;
  };
  private buildSearchRelatedVariables = (prevProps: DictionaryProps) => {
    if (!this.props.isFindInputBoxVisible) {
      return;
    }
    if (prevProps.wordDefinitions !== this.props.wordDefinitions) {
      this.definitionBodyNode = this.getDefinitionBodyNode();
    }
    if (prevProps.wordDefinitions !== this.props.wordDefinitions ||
        prevProps.findWord !== this.props.findWord) {
      this.matches = this.getSearchMatches(this.definitionBodyNode, this.props.findWord);
    }
    if (prevProps.wordDefinitions !== this.props.wordDefinitions ||
        prevProps.findWord !== this.props.findWord ||
        prevProps.findWordIndex !== this.props.findWordIndex) {
      this.setState({ highlightedHTML: this.getHighlightedHTML(this.props.findWordIndex) });
    } else if (this.state.highlightedHTML === undefined) {
      this.setState({ highlightedHTML: this.getDefinitionHTMLs() })
    }
  };
  private getDefinitionBodyNode = (): HTMLBodyElement => {
    return new DOMParser().parseFromString(this.getDefinitionHTMLs(), "text/html")
      .getElementsByTagName("body")[0];
  }
  private getSearchMatches = (bodyNode: Node, word: string): Match[] => {
    if (bodyNode === undefined) {
      return [];
    }
    return this.getMatchedNodes(bodyNode, word, []);
  }
}

export const Dictionary = connect(mapStateToProps, mapDispatchToProps)(InternalDictionary);
