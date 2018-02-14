import * as sqlite from 'sqlite';
import {getPathToSqliteDbFile} from "./Utils";

export class Sqlite {
  static db: sqlite.Database;
  static init = async () => {
    Sqlite.db = await sqlite.open(getPathToSqliteDbFile());
    await Sqlite.db.run(`
                    CREATE TABLE IF NOT EXISTS zip_entry (
                      resource_holder TEXT,
                      ver_made INTEGER,
                      version INTEGER,
                      flags INTEGER,
                      method INTEGER,
                      time INTEGER,
                      crc INTEGER,
                      compressedSize INTEGER,
                      size INTEGER,
                      fnameLen INTEGER,
                      extraLen INTEGER,
                      comLen INTEGER,
                      diskStart INTEGER,
                      inattr INTEGER,
                      attr INTEGER,
                      offset INTEGER,
                      headerOffset INTEGER,
                      name TEXT,
                      isDirectory INTEGER,
                      comment TEXT
                    )`);
  };

  static getInsertParam = <T> (v: T): any => {
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
  }
}
