import * as sqlite from 'sqlite';
import {getPathToSqliteDbFile} from "./Utils";
import moment = require("moment");
import {
  CARD_COLUMN_BACK, CARD_COLUMN_CREATION_TIME, CARD_COLUMN_FRONT, CARD_COLUMN_ID,
  CARD_COLUMN_NEXT_REVIEW_TIME, CARD_COLUMN_PREVIOUS_REVIEW_TIME_LIST
} from "./Constants";

export class Sqlite {
  private static _db: sqlite.Database;
  static init = async () => {
    const db = await Sqlite.getDb();
    await Promise.all(
      [db.run(`
          CREATE TABLE IF NOT EXISTS zip_entry (
            resource_holder TEXT,
            flags INTEGER,
            method INTEGER,
            compressed_size INTEGER,
            size INTEGER,
            fname_len INTEGER,
            extra_len INTEGER,
            com_len INTEGER,
            offset INTEGER,
            name TEXT,
            is_directory INTEGER
          )`), db.run(`
          CREATE TABLE IF NOT EXISTS card (
            ${CARD_COLUMN_ID} INTEGER PRIMARY KEY,
            ${CARD_COLUMN_FRONT} TEXT,
            ${CARD_COLUMN_BACK} TEXT,
            ${CARD_COLUMN_CREATION_TIME} INTEGER,
            ${CARD_COLUMN_NEXT_REVIEW_TIME} INTEGER,
            ${CARD_COLUMN_PREVIOUS_REVIEW_TIME_LIST} TEXT
          )`), db.run(`
          CREATE TABLE IF NOT EXISTS meta (
            time_zone TEXT
          )`)]
    );
    await Sqlite.setTimeZoneIfNotExists();
  };

  private static setTimeZoneIfNotExists = async () => {
    const db = await Sqlite.getDb();
    const meta = await db.get(`SELECT time_zone FROM meta`);
    if(meta === null) {
      // this is the first time the user uses this app,
      // query the timezone and set it in the database
      await db.run(`INSERT INTO meta (time_zone) VALUES (?)`, moment().format('Z'));
    }
  };

  /**
   * Used in INSERT and DELETE
   */
  static getSQLParam = <T> (v: T): any => {
    if(v === null || v === undefined) {
      return null;
    }
    if(typeof v === 'number') {
      return v;
    } else if(typeof v === 'string') {
      let s = v.replace(/'/g, "''");
      return `'${s}'`;
    } else if(typeof v === 'boolean') {
      return v === true ? 1 : 0;
    } else {
      throw new Error(`type ${typeof v} is not supported`);
    }
  };

  static getDb = async (): Promise<sqlite.Database> => {
    if(Sqlite._db === undefined) {
      Sqlite._db = await sqlite.open(getPathToSqliteDbFile());
    }
    return Sqlite._db;
  }

}
