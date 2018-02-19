/// <reference path="./types/Types.d.ts"/>
import * as path from 'path';
import * as fse from 'fs-extra';

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
export const getPathToSqliteDbFile = () => {
  return path.join(getPathToLantastic(), 'sqlite.db');
};
export const getPathToConfigurationFile = () => {
  return path.join(getPathToLantastic(), 'configuration.json');
};

Array.prototype.remove = function<T>(o: T): T[] {
  const element = arguments[0];
  for (let i = 0; i < this.length; i++) {
    if (this[i] === element) {
      this.splice(i, 1);
    }
  }
  return this;
};
