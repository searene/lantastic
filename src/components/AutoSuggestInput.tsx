import * as React from 'react';
import {bindActionCreators} from "redux";
import {connect, Dispatch} from "react-redux";
import {Ref, Input, Icon} from 'semantic-ui-react';
import {actions} from "../actions";
import {dictParser} from "../Parser";
import {WordDefinition} from "dict-parser";
import '../stylesheets/components/AutoSuggestInput.scss';

interface AutoSuggestInputStates {
  suggestions: string[];
}

interface AutoSuggestInputProps {
  word: string;
  onSearchCompleted: () => void;
  wordDefinitions: WordDefinition[]
  setWord: (word: string) => any
  setWordDefinitions: (wordDefinitions: WordDefinition[]) => any
}

const mapStateToProps = (state: AutoSuggestInputProps) => ({
  word: state.word,
  wordDefinitions: state.wordDefinitions,
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  setWord: actions.setWord,
  setWordDefinitions: actions.setWordDefinitions,
}, dispatch);

class ConnectedAutoSuggestInput extends React.Component<AutoSuggestInputProps, AutoSuggestInputStates> {
  private inputComponent: HTMLElement;
  constructor(props: AutoSuggestInputProps) {
    super(props);
    this.state = {
      suggestions: [],
    }
  }
  render() {
    if(this.props.word === 'dictionaries') {
      debugger;
    }
    return (
      <div>
        <button id={'refer-word-search-button'}
                onClick={(event: React.SyntheticEvent<HTMLButtonElement>) => this.search((event.target as HTMLButtonElement).innerHTML)}>
        </button>
        <div className={"input-with-suggestions"}>
          <Ref innerRef={ref => this.inputComponent = ref}>
            <Input
              icon={<Icon name={'search'} inverted circular link id={"search-word-icon"} onClick={() => this.search(this.props.word)}/>}
              placeholder="Search in dictionaries..."
              value={this.props.word}
              className="search-input"
              onKeyDown={this.handleOnKeyDown}
              onChange={this.handleChangeOnInput}/>
          </Ref>
          {this.state.suggestions.length !== 0 ?
          <div className={"suggestions"}>
            {this.state.suggestions.map(suggestion =>
              <div key={suggestion} className={"suggestion-item"}>{suggestion}</div>
            )}
          </div>
            : <div/>}
        </div>
      </div>
    )
  }
  private handleOnKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      await this.search(this.props.word);
    }
  };
  private search = async (word: string) => {
    const wordDefinitions = await dictParser.getWordDefinitions(word);
    this.setState({
      suggestions: [],
    });
    this.props.setWordDefinitions(wordDefinitions);
    this.props.onSearchCompleted();
  };
  private handleChangeOnInput = async (event: React.SyntheticEvent<HTMLInputElement>): Promise<void> => {
    const input = (event.target as HTMLInputElement).value;
    this.props.setWord(input);
    const wordCandidates = await dictParser.getWordCandidates(input);
    this.setState({
      suggestions: wordCandidates.map(wordCandidate => wordCandidate.word),
    });
  };
}
export const AutoSuggestInput = connect(mapStateToProps, mapDispatchToProps)(ConnectedAutoSuggestInput);
