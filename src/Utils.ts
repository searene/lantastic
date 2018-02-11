import * as path from 'path';
import * as FSE from 'fs-extra';
let fse: typeof FSE;

declare var __IS_WEB__: boolean;
if(!__IS_WEB__) {
  fse = require('fs-extra');
}
export function removeFromArray<T>(array: Array<T>, element: T): Array<T> {
  return array.filter(a => a != element);
}
export function getPathToUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}
export function getPathToDocuments() {
  return path.join(getPathToUserHome(), 'Documents');
}
export function getPathToLantastic() {
  return path.join(getPathToDocuments(), 'lantastic');
}
export function getPathToDictParserDbFile() {
  return path.join(getPathToLantastic(), 'dict-parser.db');
}
export function getPathToCardDbFile() {
  return path.join(getPathToLantastic(), 'card.db');
}
export function getPathToWordFormsFolder() {
  return path.join(__dirname, '../node_modules/dict-parser/lib/resources/wordforms');
}
export const getDateFromStr = (str: string) => {
  // assuming str is in utc
  return new Date(str);
};
export const getStrFromDate = (date: Date) => {
  return date.toISOString(); // YYYY-MM-DD, in UTC
};
export async function createDirIfNotExists(dir: string) {
  if(!await fse.pathExists(dir)) {
    await fse.mkdir(dir);
  }
}
export function getPathToDictionaryResources() {
  return './resources/dictionaries';
}