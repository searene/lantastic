import { StreamZip, ZipEntry } from "./js/node-stream-zip";
import { Sqlite } from "./Sqlite";

export class ZipReader {

  public static async extractFileFromZip(zipFile: string, fileName: string): Promise<Buffer> {

    const zip = new StreamZip({
      buildEntries: false,
      file: zipFile,
    });
    const entry = await this.getEntry(zipFile, fileName);

    // entry was not found
    if (entry === null) {
      return Buffer.alloc(0);
    }

    await zip.setEntries([entry]);

    return new Promise<Buffer>((resolve) => {
      const bufs: Buffer[] = [];
      zip.stream(fileName, (err, stm) => {
        stm.on("data", (data: Buffer) => {
          bufs.push(data);
        });
        stm.on("end", () => {
          resolve(Buffer.concat(bufs));
        });
      });
    });
  }

  public static async getZipEntries(zipFile: string): Promise<ZipEntry[]> {
    const entries: ZipEntry[] = [];
    return new Promise<ZipEntry[]>((resolve) => {
      const zip = new StreamZip({
        buildEntries: true,
        file: zipFile,
      });
      zip.on("entry", (entry) => {
        entries.push(entry);
      });
      zip.on("ready", () => {
        resolve(entries);
      });
    });
  }
  public static saveEntriesToDb = async (zipFile: string, entries: ZipEntry[]): Promise<void> => {
    const db = await Sqlite.getDb();
    await db.exec(`DELETE FROM zip_entry WHERE resource_holder = ${Sqlite.getSQLParam(zipFile)}`);
    let insertStatement = `
              INSERT INTO zip_entry (
                resource_holder, flags, method, compressed_size, size,
                fname_len, extra_len, com_len, offset,
                name, is_directory
              ) VALUES `;
    const parameters = [];
    for (const entry of entries) {
      parameters.push(`(${Sqlite.getSQLParam(zipFile)},
                       ${Sqlite.getSQLParam(entry.flags)},
                       ${Sqlite.getSQLParam(entry.method)},
                       ${Sqlite.getSQLParam(entry.compressedSize)},
                       ${Sqlite.getSQLParam(entry.size)},
                       ${Sqlite.getSQLParam(entry.fnameLen)},
                       ${Sqlite.getSQLParam(entry.extraLen)},
                       ${Sqlite.getSQLParam(entry.comLen)},
                       ${Sqlite.getSQLParam(entry.offset)},
                       ${Sqlite.getSQLParam(entry.name)},
                       ${Sqlite.getSQLParam(entry.isDirectory)})`);
    }
    insertStatement = insertStatement + parameters.join(",\n");
    await db.exec(insertStatement);
  }
  public static getEntry = async (zipFile: string, fileName: string): Promise<ZipEntry> => {
    const result = await (await Sqlite.getDb()).get(`
              SELECT * FROM zip_entry WHERE resource_holder = ? AND name = ?`, [zipFile, fileName]);

    // no result
    if (result === undefined) {
      return null;
    }

    const entry = new ZipEntry();
    entry.flags = result.flags;
    entry.method = result.method;
    entry.compressedSize = result.compressed_size;
    entry.fnameLen = result.fname_len;
    entry.extraLen = result.extra_len;
    entry.comLen = result.com_len;
    entry.offset = result.offset;
    entry.name = result.name;
    entry.isDirectory = result.is_directory === 1;

    return entry;
  }
}
