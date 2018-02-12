import * as sqlite from 'sqlite';
import {getPathToSqliteDbFile} from "./Utils";

export class Sqlite {
  static db: sqlite.Database;
  static init = async () => {
    Sqlite.db = await sqlite.open(getPathToSqliteDbFile());
    await Sqlite.db.run(`
                    CREATE TABLE IF NOT EXISTS zip_entry (
                      resource_holder_id INTEGER,
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
  }
}
