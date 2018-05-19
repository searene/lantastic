/// <reference path="../types/Types.d.ts"/>
import * as fse from "fs-extra";
import * as path from "path";

export function removeFromArray<T>(array: T[], element: T): T[] {
  return array.filter((a) => a !== element);
}
export function getPathToUserHome() {
  return process.env[(process.platform === "win32") ? "USERPROFILE" : "HOME"];
}
export function getPathToDocuments() {
  return path.join(getPathToUserHome(), "Documents");
}
export function getPathToLantastic() {
  // return path.join(getPathToDocuments(), 'lantastic');
  return "/mnt/HDD/lantastic-config-dir";
}
export function getPathToDictParserDbFile() {
  return path.join(getPathToLantastic(), "dict-parser.db");
}
export function getPathToCardDbFile() {
  return path.join(getPathToLantastic(), "card.db");
}
export function getPathToWordFormsFolder() {
  return path.join(__dirname, "../node_modules/dict-parser/lib/resources/wordforms");
}
export const getDateFromStr = (str: string) => {
  // assuming str is in utc
  return new Date(str);
};
export const getStrFromDate = (date: Date) => {
  return date.toISOString(); // YYYY-MM-DD, in UTC
};
export async function createDirIfNotExists(dir: string) {
  if (!await fse.pathExists(dir)) {
    await fse.mkdir(dir);
  }
}
export function getPathToDictionaryResources() {
  return "./resources/dictionaries";
}
export const getPathToSqliteDbFile = () => {
  return path.join(getPathToLantastic(), "sqlite.db");
};
export const getPathToConfigurationFile = () => {
  return path.join(getPathToLantastic(), "configuration.json");
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
Array.prototype.removeDuplicates = function<T>(): T[] {
  return this.filter((value: T, index: number) => this.indexOf(value) === index);
};
export const range = (start: number, end: number): number[] => {
  return new Array(end - start).fill(1).map((d, i) => i + start);
};
export const guid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
};
