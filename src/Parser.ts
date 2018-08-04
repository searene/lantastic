import { DictParser } from "dict-parser";
import {
  getPathToDictionaryResources,
  getPathToDictParserSqliteDbFile,
  getPathToWordFormsFolder
} from "./Utils/CommonUtils";

export class Parser {
  public static init = async () => {
    Parser.dictParser = new DictParser(
      getPathToDictParserSqliteDbFile(),
      getPathToWordFormsFolder(),
      getPathToDictionaryResources()
    );
    await Parser.dictParser.init();
  };
  public static getDictParser = (): DictParser => {
    if (Parser.dictParser === undefined) {
      throw new Error("await Parser.init() should be executed first");
    }
    return Parser.dictParser;
  };
  private static dictParser: DictParser;
}
