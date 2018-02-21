import * as sqlite from 'sqlite';
import {getPathToSqliteDbFile} from "./Utils/CommonUtils";
import {
  CARD_COLUMN_BACK, CARD_COLUMN_CREATION_TIME, CARD_COLUMN_DECK, CARD_COLUMN_FRONT, CARD_COLUMN_ID,
  CARD_COLUMN_NEXT_REVIEW_TIME, CARD_COLUMN_PREVIOUS_REVIEW_TIME_LIST, CARD_TABLE, DECK_COLUMN_NAME,
  DECK_TABLE,
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
          CREATE TABLE IF NOT EXISTS ${CARD_TABLE} (
            ${CARD_COLUMN_ID} INTEGER PRIMARY KEY,
            ${CARD_COLUMN_DECK} TEXT,
            ${CARD_COLUMN_FRONT} TEXT,
            ${CARD_COLUMN_BACK} TEXT,
            ${CARD_COLUMN_CREATION_TIME} INTEGER,
            ${CARD_COLUMN_NEXT_REVIEW_TIME} INTEGER,
            ${CARD_COLUMN_PREVIOUS_REVIEW_TIME_LIST} TEXT
          )`), db.run(`
          CREATE TABLE IF NOT EXISTS ${DECK_TABLE} (
            ${DECK_COLUMN_NAME} TEXT PRIMARY KEY
          )`)]
    );
    await Sqlite.createDefaultDeckNoDeckExists();
  };

  /**
   * Used in INSERT and DELETE
   */
  static getSQLParam = <T>(v: T): any => {
    if (v === null || v === undefined) {
      return null;
    }
    if (typeof v === 'number') {
      return v;
    } else if (typeof v === 'string') {
      let s = v.replace(/'/g, "''");
      return `'${s}'`;
    } else if (typeof v === 'boolean') {
      return v === true ? 1 : 0;
    } else {
      throw new Error(`type ${typeof v} is not supported`);
    }
  };

  static getDb = async (): Promise<sqlite.Database> => {
    if (Sqlite._db === undefined) {
      Sqlite._db = await sqlite.open(getPathToSqliteDbFile());
    }
    return Sqlite._db;
  };
  static createDefaultDeckNoDeckExists = async (): Promise<void> => {
    const db = await Sqlite.getDb();
    const deckNum = (await db.get(`SELECT COUNT(*) AS count FROM ${DECK_TABLE}`)).count;
    if(deckNum === 0) {
      await db.run(`
                INSERT INTO ${DECK_TABLE}
                  (${DECK_COLUMN_NAME})
                VALUES
                  ('Default')
      `);
    }
  };

}
