import { DictParser } from 'dict-parser';
import { getPathToDbFile, getPathToWordFormsFolder, getPathToDictionaryResources } from './Utils';

export let dictParser: DictParser;

declare var __IS_WEB__: boolean;
if(!__IS_WEB__) {
  dictParser = new DictParser(getPathToDbFile(), getPathToWordFormsFolder(), getPathToDictionaryResources());
}