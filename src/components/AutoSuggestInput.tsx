import * as React from "react";
import { Icon, Input, Ref } from "semantic-ui-react";
import { Parser } from "../Parser";
import "../stylesheets/components/AutoSuggestInput.scss";
import { CSSProperties } from "react";
import { WordDefinition } from "dict-parser";

interface AutoSuggestInputStates {
  word: string;
  suggestions: string[];
}

interface AutoSuggestInputProps {
  onSearchCompleted: (html: string) => void;
  style?: CSSProperties;
}

export class AutoSuggestInput extends React.Component<AutoSuggestInputProps, AutoSuggestInputStates> {
  private inputComponent: HTMLElement;
  private suggestionsComponent: HTMLDivElement;
  constructor(props: AutoSuggestInputProps) {
    super(props);
    this.state = {
      word: "",
      suggestions: []
    };
  }
  public render() {
    return (
      <div {...this.props.style}>
        <button
          id={"refer-word-search-button"}
          onClick={(event: React.SyntheticEvent<HTMLButtonElement>) =>
            this.search((event.target as HTMLButtonElement).innerHTML)
          }
        />
        <div className={"input-with-suggestions"}>
          <Ref innerRef={ref => (this.inputComponent = ref)}>
            <Input
              icon={
                <Icon
                  name={"search"}
                  inverted
                  circular
                  link
                  id={"search-word-icon"}
                  onClick={() => this.search(this.state.word)}
                />
              }
              placeholder="Search in dictionaries..."
              value={this.state.word}
              className="search-input"
              onKeyDown={this.handleOnKeyDown}
              onChange={this.handleChangeOnInput}
            />
          </Ref>
          {this.state.suggestions.length !== 0 ? (
            <div className={"suggestions"} ref={ref => (this.suggestionsComponent = ref)}>
              {this.state.suggestions.map(suggestion => (
                <div
                  key={suggestion}
                  onClick={async (evt: React.SyntheticEvent<HTMLDivElement>) => {
                    this.setState({ suggestions: [] });
                    await this.search((evt.target as HTMLDivElement).innerHTML);
                  }}
                  className={"suggestion-item"}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  }
  private handleOnKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const currentActiveSuggestion = this.getCurrentActiveSuggestion();
      await this.search(currentActiveSuggestion === undefined ? this.state.word : currentActiveSuggestion.innerHTML);
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
      this.suggestionsComponent.scrollTop =
        nextActiveSuggestion.offsetTop + nextActiveSuggestion.clientHeight - this.suggestionsComponent.clientHeight;
    }
  };
  private getCurrentActiveSuggestion = (): HTMLDivElement => {
    const activeSuggestionElement = document.querySelector(".suggestion-item.active");
    return activeSuggestionElement === null ? undefined : (activeSuggestionElement as HTMLDivElement);
  };
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
  };
  private search = async (word: string) => {
    this.setState({
      suggestions: []
    });
    const wordDefinitions = await Parser.getDictParser().getWordDefinitions(word);
    const html = this.getDefinitionHTML(wordDefinitions);
    this.props.onSearchCompleted(html);
  };
  private handleChangeOnInput = async (event: React.SyntheticEvent<HTMLInputElement>): Promise<void> => {
    const input = (event.target as HTMLInputElement).value;
    this.setState({ word: input });
    const suggestions = await Parser.getDictParser().getWordCandidates(input);
    this.setState({
      suggestions
    });
  };
  private getDefinitionHTML = (wordDefinitions: WordDefinition[]): string => {
    return wordDefinitions.reduce((r, wordDefinition) => r + wordDefinition.html, "");
  };
}
