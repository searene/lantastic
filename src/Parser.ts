import { DictParser } from "dict-parser";
import {DictMap} from "dict-parser/lib/DictionaryFinder";
import { getPathToDictionaryResources, getPathToDictParserDbFile, getPathToWordFormsFolder } from "./Utils/CommonUtils";

export class Parser {
  private static _dictParser: DictParser;
  public static init = async () => {
    Parser._dictParser = new DictParser(getPathToDictParserDbFile(), getPathToWordFormsFolder(), getPathToDictionaryResources());
    Parser._dictParser.init();
  }
  public static getDictParser = (): DictParser => {
    if (Parser._dictParser === undefined) {
      throw new Error("await Parser.init() should be executed first");
    }
    return Parser._dictParser;
  }
}
