import { DictParser } from 'dict-parser';
import { getPathToDictParserDbFile, getPathToWordFormsFolder, getPathToDictionaryResources } from './Utils/CommonUtils';
import {DictMap} from "dict-parser/lib/DictionaryFinder";

export class Parser {
  private static _dictParser: DictParser;
  static init = async () => {
    Parser._dictParser = new DictParser(getPathToDictParserDbFile(), getPathToWordFormsFolder(), getPathToDictionaryResources());
    Parser._dictParser.init();
  };
  static getDictParser = (): DictParser => {
    if(Parser._dictParser === undefined) {
      throw new Error('await Parser.init() should be executed first');
    }
    return Parser._dictParser;
  };
}
