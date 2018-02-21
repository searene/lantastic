import { DictParser } from 'dict-parser';
import { getPathToDictParserDbFile, getPathToWordFormsFolder, getPathToDictionaryResources } from './Utils/CommonUtils';

export const dictParser = new DictParser(getPathToDictParserDbFile(), getPathToWordFormsFolder(), getPathToDictionaryResources());
