import * as React from "react";
import { Icon, Input, Ref } from "semantic-ui-react";
import { Parser } from "../Parser";
import "../stylesheets/components/AutoSuggestInput.scss";
import { CSSProperties } from "react";
import { WordDefinition } from "dict-parser";
import { Shortcuts } from "react-shortcuts";

interface IAutoSuggestInputStates {
  word: string;
  suggestions: string[];
}

interface IAutoSuggestInputProps {
  onSearchCompleted: (html: string) => void;
  style?: CSSProperties;
}

export class AutoSuggestInput extends React.Component<IAutoSuggestInputProps, IAutoSuggestInputStates> {
  private input: HTMLInputElement;
  private suggestionsComponent: HTMLDivElement;

  constructor(props: IAutoSuggestInputProps) {
    super(props);
    this.state = {
      suggestions: [],
      word: ""
    };
  }
  public render() {
    return (
      <div {...this.props.style}>
        <Shortcuts name="AutoSuggestInput" handler={this.handleShortcuts} className={"input-with-suggestions"}>
          <Ref innerRef={this.handleInputRef}>
            <Input
              icon={
                <Icon
                  circular={true}
                  id={"search-word-icon"}
                  inverted={true}
                  link={true}
                  name={"search"}
                  onClick={this.handleClickOnSearchIcon}
                />
              }
              placeholder="Search in dictionaries..."
              value={this.state.word}
              className="search-input"
              onChange={this.handleChangeOnInput}
            />
          </Ref>
          {this.state.suggestions.length !== 0 && (
            <div className={"suggestions"} ref={ref => (this.suggestionsComponent = ref)}>
              {this.state.suggestions.map(suggestion => (
                <div key={suggestion} onClick={this.handleClickOnSuggestion} className={"suggestion-item"}>
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </Shortcuts>
      </div>
    );
  }
  private getCurrentActiveSuggestion = (): HTMLDivElement => {
    const activeSuggestionElement = document.querySelector(".suggestion-item.active");
    return activeSuggestionElement === null ? undefined : (activeSuggestionElement as HTMLDivElement);
  };
  private getNextActiveSuggestion = (action: string): HTMLDivElement => {
    const currentActiveSuggestion = this.getCurrentActiveSuggestion();
    if (currentActiveSuggestion === undefined && this.suggestionsComponent.firstChild === null) {
      return undefined;
    } else if (currentActiveSuggestion === undefined && action === "prevPromptWord") {
      return this.suggestionsComponent.lastChild as HTMLDivElement;
    } else if (currentActiveSuggestion === undefined && action === "nextPromptWord") {
      return this.suggestionsComponent.firstChild as HTMLDivElement;
    } else if (currentActiveSuggestion.previousSibling === null && action === "prevPromptWord") {
      return this.suggestionsComponent.lastChild as HTMLDivElement;
    } else if (currentActiveSuggestion.nextSibling === null && action === "nextPromptWord") {
      return this.suggestionsComponent.firstChild as HTMLDivElement;
    } else if (action === "prevPromptWord") {
      return currentActiveSuggestion.previousSibling as HTMLDivElement;
    } else if (action === "nextPromptWord") {
      return currentActiveSuggestion.nextSibling as HTMLDivElement;
    }
  };
  private search = async (word: string) => {
    this.setState({
      word: word,
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
  private handleInputRef = (ref: HTMLElement) => (this.input = ref.childNodes[0] as HTMLInputElement);
  private handleClickOnSearchIcon = async () => {
    await this.search(this.state.word);
  };
  private handleClickOnSuggestion = async (evt: React.SyntheticEvent<HTMLDivElement>) => {
    this.setState({ suggestions: [] });
    await this.search((evt.target as HTMLDivElement).innerHTML);
  };
  private handleShortcuts = async (action: string) => {
    if (action === "search") {
      const currentActiveSuggestion = this.getCurrentActiveSuggestion();
      await this.search(currentActiveSuggestion === undefined ? this.state.word : currentActiveSuggestion.innerHTML);
    } else if (["prevPromptWord", "nextPromptWord"].indexOf(action) > -1 && this.state.suggestions.length !== 0) {
      const currentActiveSuggestion = this.getCurrentActiveSuggestion();
      const nextActiveSuggestion = this.getNextActiveSuggestion(action);
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
}
