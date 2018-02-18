import * as fse from 'fs-extra';
import {getPathToConfigurationFile} from "./Utils";
import moment = require("moment");
import {DECK_COLUMN_NAME, DECK_TABLE} from "./Constants";
import {Sqlite} from "./Sqlite";

export class Configuration {
  static init = async (): Promise<void> => {
    const pathExists = await fse.pathExists(getPathToConfigurationFile());
    if(!pathExists) {
      const defaultDeckName = await Configuration.assignOrCreateDefaultDeck();
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
  static assignOrCreateDefaultDeck = async (): Promise<string> => {
    const db = await Sqlite.getDb();
    let defaultDeckName = '';
    const firstDeck = await db.get(`SELECT ${DECK_COLUMN_NAME} FROM ${DECK_TABLE}`);
    if(firstDeck === undefined) {
      // insert a default deck
      defaultDeckName = 'Default';
      await db.run(`
              INSERT INTO ${DECK_TABLE}
                (${DECK_COLUMN_NAME})
              VALUES
                (?)
      `, defaultDeckName);
    } else {
      defaultDeckName = firstDeck[`${DECK_COLUMN_NAME}`];
    }
    return defaultDeckName;
  };
  static getValue = async (key: string): Promise<any> => {
    const conf = await Configuration.getConf();
    return conf[key];
  };
  static getDefaultDeckName = async (): Promise<string> => {
    return Configuration.getValue('defaultDeckName');
  };
}