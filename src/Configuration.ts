import * as fse from 'fs-extra';
import {getPathToConfigurationFile} from "./Utils";
import moment = require("moment");
import {Sqlite} from "./Sqlite";
import {DECK_COLUMN_ID, DECK_COLUMN_NAME, DECK_TABLE} from "./Constants";

export class Configuration {
  static init = async (): Promise<void> => {
    const pathExists = await fse.pathExists(getPathToConfigurationFile());
    if(!pathExists) {
      await fse.writeJSON(getPathToConfigurationFile(), {
        timeZone: moment().format('Z'),
        defaultDeckId: await Configuration.createDefaultDeckId()
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
  private static createDefaultDeckId = async (): Promise<number> => {
    const db = await Sqlite.getDb();
    const firstDeck = await db.get(`SELECT ${DECK_COLUMN_ID} FROM ${DECK_TABLE}`);
    if(firstDeck === undefined) {
      // insert a default deck
      await db.run(`
              INSERT INTO ${DECK_TABLE}
                (${DECK_COLUMN_ID}, ${DECK_COLUMN_NAME})
              VALUES
                (0, 'default')
      `);
      return 0;
    }
    return firstDeck.id;
  };
  static getValue = async (key: string): Promise<any> => {
    const conf = await Configuration.getConf();
    return conf[key];
  }
}