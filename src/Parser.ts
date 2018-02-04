import { DictParser } from 'dict-parser';
import { getPathToDictParserDbFile, getPathToWordFormsFolder, getPathToDictionaryResources } from './Utils';

export let dictParser: DictParser;

declare var __IS_WEB__: boolean;
if(!__IS_WEB__) {
  dictParser = new DictParser(getPathToDictParserDbFile(), getPathToWordFormsFolder(), getPathToDictionaryResources());
}