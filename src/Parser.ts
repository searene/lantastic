import { DictParser, OS } from "dict-parser";
import {
  getPathToDictionaryResources,
  getPathToDictParserSqliteDbFile,
} from "./Utils/CommonUtils";
import { SqlitePC } from "./os-specific/SqlitePC";
import { FileSystemPC } from "./os-specific/FileSystemPC";
import { PathPC } from "./os-specific/PathPC";

export class Parser {
  public static init = async () => {
    Parser.dictParser = new DictParser({
      sqliteDbPath: getPathToDictParserSqliteDbFile(),
      commonResourceDirectory: getPathToDictionaryResources(),
      wordFormsFolder: "",
      fsImplementation: new FileSystemPC(),
      pathImplementation: new PathPC(),
      sqliteImplementation: new SqlitePC(),
      os: OS.PC
    });
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
