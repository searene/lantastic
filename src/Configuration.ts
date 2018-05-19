import * as fse from "fs-extra";
import moment = require("moment");
import {DECK_COLUMN_NAME, DECK_TABLE} from "./Constants";
import {Sqlite} from "./Sqlite";
import {getPathToConfigurationFile} from "./Utils/CommonUtils";

export class Configuration {

  public static TIME_ZONE_KEY = "timeZone";
  public static DEFAULT_DECK_NAME_KEY = "defaultDeckName";
  public static SCAN_PATHS_KEY = "scanPaths";

  public static conf: {[index: string]: any} = {};

  public static init = async (): Promise<void> => {
    const pathExists = await fse.pathExists(getPathToConfigurationFile());
    if (!pathExists) {
      const defaultDeckName = await Configuration.assignOrCreateDefaultDeck();
      Configuration.conf[Configuration.TIME_ZONE_KEY] = moment().format("Z");
      Configuration.conf[Configuration.DEFAULT_DECK_NAME_KEY] = defaultDeckName;
      Configuration.conf[Configuration.SCAN_PATHS_KEY] = [];
      await fse.writeJSON(getPathToConfigurationFile(), Configuration.conf);
    } else {
      Configuration.conf = await fse.readJSON(getPathToConfigurationFile());
    }
  }
  public static insertOrUpdate = async (key: string, value: any): Promise<void> => {
    Configuration.conf[key] = value;
    await fse.writeJSON(getPathToConfigurationFile(), Configuration.conf);
  }
  public static assignOrCreateDefaultDeck = async (): Promise<string> => {
    const db = await Sqlite.getDb();
    let defaultDeckName = "";
    const firstDeck = await db.get(`SELECT ${DECK_COLUMN_NAME} FROM ${DECK_TABLE}`);
    if (firstDeck === undefined) {
      // insert a default deck
      defaultDeckName = "Default";
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
  }
  public static get = (key: string) => {
    return Configuration.conf[key];
  }
}
