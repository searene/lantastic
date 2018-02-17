declare const __IS_WEB__: boolean;
import {Sqlite as SqliteType} from "./Sqlite";
import * as FseType from 'fs-extra';
let Sqlite: typeof SqliteType;
let fse: typeof FseType;
if(!__IS_WEB__) {
  Sqlite = require('./Sqlite').Sqlite;
  fse = require('fs-extra');
}

import {getPathToConfigurationFile} from "./Utils";
import moment = require("moment");
import {DECK_COLUMN_NAME, DECK_TABLE} from "./Constants";

export class Configuration {
  static init = async (): Promise<void> => {
    const pathExists = await fse.pathExists(getPathToConfigurationFile());
    if(!pathExists) {
      const defaultDeckName = await Configuration.createDefaultDeck();
      await fse.writeJSON(getPathToConfigurationFile(), {
        timeZone: moment().format('Z'),
        defaultDeckName: defaultDeckName,
      });
    }
  };
  static isKeyExists = async (key: string): Promise<boolean> => {
    const conf = await fse.readJSON(getPathToConfigurationFile());
    return key in conf;
  };
  static insertOrUpdate = async (key: string, value: string): Promise<void> => {
    const conf = await Configuration.getConf();
    conf[key] = value;
    await fse.writeJSON(getPathToConfigurationFile(), conf);
  };
  static getConf = async (): Promise<any> => {
    return fse.readJSON(getPathToConfigurationFile());
  };
  static getConfSync = (): any => {
    return fse.readJSONSync(getPathToConfigurationFile());
  };
  private static createDefaultDeck = async (): Promise<string> => {
    const db = await Sqlite.getDb();
    const firstDeck = await db.get(`SELECT ${DECK_COLUMN_NAME} FROM ${DECK_TABLE}`);
    if(firstDeck === undefined) {
      // insert a default deck
      await db.run(`
              INSERT INTO ${DECK_TABLE}
                (${DECK_COLUMN_NAME})
              VALUES
                ('Default')
      `);
      return 'Default';
    }
    return firstDeck[`${DECK_COLUMN_NAME}`];
  };
  static getValue = async (key: string): Promise<any> => {
    const conf = await Configuration.getConf();
    return conf[key];
  };
  static getValueSync = (key: string): any => {
    const conf = Configuration.getConfSync();
    return conf[key];
  };
  static getDefaultDeckIdSync = (): number => {
    if(__IS_WEB__) {
      return 0;
    } else {
      return Configuration.getValueSync('defaultDeckName');
    }
  };
  static getDefaultDeckName = async (): Promise<string> => {
    return Configuration.getValue('defaultDeckName');
  }
}