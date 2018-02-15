import * as sqlite from 'sqlite';
import {getPathToSqliteDbFile} from "./Utils";

export class Sqlite {
  private static _db: sqlite.Database;
  static init = async () => {
    await (await Sqlite.getDb()).run(`
                    CREATE TABLE IF NOT EXISTS zip_entry (
                      resource_holder TEXT,
                      ver_made INTEGER,
                      version INTEGER,
                      flags INTEGER,
                      method INTEGER,
                      time INTEGER,
                      crc INTEGER,
                      compressed_size INTEGER,
                      size INTEGER,
                      fname_len INTEGER,
                      extra_len INTEGER,
                      com_len INTEGER,
                      disk_start INTEGER,
                      inattr INTEGER,
                      attr INTEGER,
                      offset INTEGER,
                      header_offset INTEGER,
                      name TEXT,
                      is_directory INTEGER,
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
  };

  static getDb = async (): Promise<sqlite.Database> => {
    if(Sqlite._db === undefined) {
      Sqlite._db = await sqlite.open(getPathToSqliteDbFile());
    }
    return Sqlite._db;
  }

}
