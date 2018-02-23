import * as React from 'react';
import {bindActionCreators} from "redux";
import {connect, Dispatch} from "react-redux";
import {Ref, Input, Icon} from 'semantic-ui-react';
import {actions} from "../actions";
import {dictParser} from "../Parser";
import {WordDefinition} from "dict-parser";

interface AutoSuggestInputStates {
}

interface AutoSuggestInputProps {
  word: string;
  onFetched: () => void;
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
  render() {
    return (
      <div>
        <button id={'refer-word-search-button'}
                onClick={(event: React.SyntheticEvent<HTMLButtonElement>) => this.search((event.target as HTMLButtonElement).innerHTML)}>
        </button>
        <Ref innerRef={ref => this.inputComponent = ref}>
          <Input
            icon={<Icon name={'search'} inverted circular link id={"search-word-icon"} onClick={() => this.search(this.props.word)}/>}
            placeholder="Search in dictionaries..."
            value={this.props.word}
            className="search-input"
            onKeyDown={this.handleOnKeyDown}
            onChange={(evt: React.SyntheticEvent<HTMLInputElement>) => this.props.setWord((evt.target as HTMLInputElement).value)}/>
        </Ref>
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
    this.props.setWordDefinitions(wordDefinitions);
    this.props.onFetched();
  };
}
export const AutoSuggestInput = connect(mapStateToProps, mapDispatchToProps)(ConnectedAutoSuggestInput);
