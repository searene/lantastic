import * as sqlite from "sqlite";
import {
  CARD_COLUMN_BACK,
  CARD_COLUMN_CREATION_TIME,
  CARD_COLUMN_DECK,
  CARD_COLUMN_FRONT,
  CARD_COLUMN_ID,
  CARD_COLUMN_NEXT_REVIEW_TIME,
  CARD_COLUMN_PREVIOUS_REVIEW_TIME_LIST,
  CARD_TABLE,
  DECK_COLUMN_NAME,
  DECK_TABLE
} from "./Constants";
import { getPathToSqliteDbFile } from "./Utils/CommonUtils";

export class Sqlite {
  public static init = async () => {
    const db = await Sqlite.getDb();
    await Promise.all([
      db.run(`
          CREATE TABLE IF NOT EXISTS ${CARD_TABLE} (
            ${CARD_COLUMN_ID} INTEGER PRIMARY KEY,
            ${CARD_COLUMN_DECK} TEXT,
            ${CARD_COLUMN_FRONT} TEXT,
            ${CARD_COLUMN_BACK} TEXT,
            ${CARD_COLUMN_CREATION_TIME} INTEGER,
            ${CARD_COLUMN_NEXT_REVIEW_TIME} INTEGER,
            ${CARD_COLUMN_PREVIOUS_REVIEW_TIME_LIST} TEXT
          )`),
      db.run(`
          CREATE TABLE IF NOT EXISTS ${DECK_TABLE} (
            ${DECK_COLUMN_NAME} TEXT PRIMARY KEY
          )`)
    ]);
    await Sqlite.createDefaultDeckNoDeckExists();
  };

  /**
   * Used in INSERT and DELETE
   */
  public static getSQLParam = <T>(v: T): any => {
    if (v === null || v === undefined) {
      return null;
    }
    if (typeof v === "number") {
      return v;
    } else if (typeof v === "string") {
      const s = v.replace(/'/g, "''");
      return `'${s}'`;
    } else if (typeof v === "boolean") {
      return v === true ? 1 : 0;
    } else {
      throw new Error(`type ${typeof v} is not supported`);
    }
  };

  public static getDb = async (): Promise<sqlite.Database> => {
    if (Sqlite.db === undefined) {
      Sqlite.db = await sqlite.open(getPathToSqliteDbFile());
    }
    return Sqlite.db;
  };
  public static createDefaultDeckNoDeckExists = async (): Promise<void> => {
    const db = await Sqlite.getDb();
    const deckNum = (await db.get(`SELECT COUNT(*) AS count FROM ${DECK_TABLE}`)).count;
    if (deckNum === 0) {
      await db.run(`
                INSERT INTO ${DECK_TABLE}
                  (${DECK_COLUMN_NAME})
                VALUES
                  ('Default')
      `);
    }
  };
  public static deleteCard = async (cardId: number): Promise<void> => {
    const db = await Sqlite.getDb();
    await db.run(
      `
                DELETE FROM ${CARD_TABLE}
                WHERE ${CARD_COLUMN_ID} = ?
    `,
      cardId
    );
  };
  private static db: sqlite.Database;
}
