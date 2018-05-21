import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {bindActionCreators} from "redux";
import {Icon, Input, Ref} from "semantic-ui-react";
import {actions} from "../actions";
import {Parser} from "../Parser";
import { RootState } from "../reducers";
import "../stylesheets/components/AutoSuggestInput.scss";

interface IAutoSuggestInputStates {
  suggestions: string[];
}

const mapStateToProps = (state: RootState) => ({
  word: state.word,
  wordDefinitions: state.wordDefinitions,
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  setWord: actions.setWord,
  setWordDefinitions: actions.setWordDefinitions,
}, dispatch);

type AutoSuggestInputProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & {
  onSearchCompleted: () => void;
};

class ConnectedAutoSuggestInput extends React.Component<AutoSuggestInputProps, IAutoSuggestInputStates> {
  private inputComponent: HTMLElement;
  private suggestionsComponent: HTMLDivElement;
  constructor(props: AutoSuggestInputProps) {
    super(props);
    this.state = {
      suggestions: [],
    };
  }
  public render() {
    return (
      <div>
        <button id={"refer-word-search-button"}
                onClick={(event: React.SyntheticEvent<HTMLButtonElement>) => (
                  this.search((event.target as HTMLButtonElement).innerHTML))}>
        </button>
        <div className={"input-with-suggestions"}>
          <Ref innerRef={(ref) => this.inputComponent = ref}>
            <Input
              icon={
                <Icon
                  name={"search"}
                  inverted
                  circular
                  link
                  id={"search-word-icon"}
                  onClick={() => this.search(this.props.word)}/>}
              placeholder="Search in dictionaries..."
              value={this.props.word}
              className="search-input"
              onKeyDown={this.handleOnKeyDown}
              onChange={this.handleChangeOnInput}/>
          </Ref>
          {this.state.suggestions.length !== 0 ?
          <div className={"suggestions"} ref={(ref) => this.suggestionsComponent = ref}>
            {this.state.suggestions.map((suggestion) =>
              <div
                key={suggestion}
                onClick={(evt: React.SyntheticEvent<HTMLDivElement>) => {
                  this.setState({suggestions: []});
                  this.search((evt.target as HTMLDivElement).innerHTML);
                }}
                className={"suggestion-item"}>{suggestion}</div>,
            )}
          </div>
            : <div/>}
        </div>
      </div>
    );
  }
  private handleOnKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const currentActiveSuggestion = this.getCurrentActiveSuggestion();
      this.props.setWordDefinitions([]);
      await this.search(currentActiveSuggestion === undefined ? this.props.word : currentActiveSuggestion.innerHTML);
    } else if (["ArrowUp", "ArrowDown"].indexOf(event.key) > -1 && !this.suggestionsComponent) {
      event.preventDefault();
      const currentActiveSuggestion = this.getCurrentActiveSuggestion();
      const nextActiveSuggestion = this.getNextActiveSuggestion(event.key as "ArrowUp" | "ArrowDown");
      if (currentActiveSuggestion !== undefined) {
        currentActiveSuggestion.classList.remove("active");
      }
      if (nextActiveSuggestion !== undefined) {
        nextActiveSuggestion.classList.add("active");
      }
      this.suggestionsComponent.scrollTop = nextActiveSuggestion.offsetTop
        + nextActiveSuggestion.clientHeight
        - this.suggestionsComponent.clientHeight;
    }
  }
  private getCurrentActiveSuggestion = (): HTMLDivElement => {
    const activeSuggestionElement = document.querySelector(".suggestion-item.active");
    return activeSuggestionElement === null ? undefined : activeSuggestionElement as HTMLDivElement;
  }
  private getNextActiveSuggestion = (eventKey: "ArrowUp" | "ArrowDown"): HTMLDivElement => {
    const currentActiveSuggestion = this.getCurrentActiveSuggestion();
    if (currentActiveSuggestion === undefined && this.suggestionsComponent.firstChild === null) {
      return undefined;
    } else if (currentActiveSuggestion === undefined && eventKey === "ArrowUp") {
      return this.suggestionsComponent.lastChild as HTMLDivElement;
    } else if (currentActiveSuggestion === undefined && eventKey === "ArrowDown") {
      return this.suggestionsComponent.firstChild as HTMLDivElement;
    } else if (currentActiveSuggestion.previousSibling === null && eventKey === "ArrowUp") {
      return this.suggestionsComponent.lastChild as HTMLDivElement;
    } else if (currentActiveSuggestion.nextSibling === null && eventKey === "ArrowDown") {
      return this.suggestionsComponent.firstChild as HTMLDivElement;
    } else if (eventKey === "ArrowUp") {
      return currentActiveSuggestion.previousSibling as HTMLDivElement;
    } else if (eventKey === "ArrowDown") {
      return currentActiveSuggestion.nextSibling as HTMLDivElement;
    }
  }
  private search = async (word: string) => {
    this.setState({
      suggestions: [],
    });
    const wordDefinitions = await Parser.getDictParser().getWordDefinitions(word);
    this.props.setWordDefinitions(wordDefinitions);
    this.props.onSearchCompleted();
  }
  private handleChangeOnInput = async (event: React.SyntheticEvent<HTMLInputElement>): Promise<void> => {
    const input = (event.target as HTMLInputElement).value;
    this.props.setWord(input);
    const suggestions = await Parser.getDictParser().getWordCandidates(input);
    this.setState({
      suggestions,
    });
  }
}
export const AutoSuggestInput = connect(mapStateToProps, mapDispatchToProps)(ConnectedAutoSuggestInput);
