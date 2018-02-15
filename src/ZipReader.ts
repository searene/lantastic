import { StreamZip, ZipEntry } from './js/node-stream-zip';
import { Sqlite } from './Sqlite';

export class ZipReader {

  static async extractFileFromZip(zipFile: string, fileName: string): Promise<Buffer> {

    const zip = new StreamZip({
      file: zipFile,
      buildEntries: false
    });
    const entry = await this.getEntry(zipFile, fileName);

    // entry was not found
    if(entry === null) {
      return Buffer.alloc(0);
    }

    await zip.setEntries([entry]);

    return new Promise<Buffer>((resolve) => {
      const bufs: Buffer[] = [];
      zip.stream(fileName, (err, stm) => {
        stm.on('data', (data: Buffer) => {
          bufs.push(data);
        });
        stm.on('end', () => {
          resolve(Buffer.concat(bufs));
        });
      });
    });
  }

  static async getZipEntries(zipFile: string): Promise<ZipEntry[]> {
    const entries: ZipEntry[] = [];
    return new Promise<ZipEntry[]>(resolve => {
      const zip = new StreamZip({
        file: zipFile,
        buildEntries: true,
      });
      zip.on('entry', entry => {
        entries.push(entry);
      });
      zip.on('ready', () => {
        resolve(entries);
      });
    });
  }
  static saveEntriesToDb = async (zipFile: string, entries: ZipEntry[]): Promise<void> => {
    let insertStatement = `
              INSERT INTO zip_entry (
                resource_holder, ver_made, version, flags, method, time, crc, compressed_size, size,
                fname_len, extra_len, com_len, disk_start, inattr, attr, offset, header_offset,
                name, is_directory, comment
              ) VALUES `;
    let parameters = [];
    for(let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      parameters.push(`(${Sqlite.getInsertParam(zipFile)},
                       ${Sqlite.getInsertParam(entry.verMade)},
                       ${Sqlite.getInsertParam(entry.version)},
                       ${Sqlite.getInsertParam(entry.flags)},
                       ${Sqlite.getInsertParam(entry.method)},
                       ${Sqlite.getInsertParam(entry.time)},
                       ${Sqlite.getInsertParam(entry.crc)},
                       ${Sqlite.getInsertParam(entry.compressedSize)},
                       ${Sqlite.getInsertParam(entry.size)},
                       ${Sqlite.getInsertParam(entry.fnameLen)},
                       ${Sqlite.getInsertParam(entry.extraLen)},
                       ${Sqlite.getInsertParam(entry.comLen)},
                       ${Sqlite.getInsertParam(entry.diskStart)},
                       ${Sqlite.getInsertParam(entry.inattr)},
                       ${Sqlite.getInsertParam(entry.attr)},
                       ${Sqlite.getInsertParam(entry.offset)},
                       ${Sqlite.getInsertParam(entry.headerOffset)},
                       ${Sqlite.getInsertParam(entry.name)},
                       ${Sqlite.getInsertParam(entry.isDirectory)},
                       ${Sqlite.getInsertParam(entry.comment)})`);
    }
    insertStatement = insertStatement + parameters.join(',\n');
    await (await Sqlite.getDb()).exec(insertStatement);
  };
  static getEntry = async (zipFile: string, fileName: string): Promise<ZipEntry> => {
    const result = await (await Sqlite.getDb()).get(`
              SELECT * FROM zip_entry WHERE resource_holder = ? AND name = ?`, [zipFile, fileName]);

    // no result
    if(result === undefined) {
      return null;
    }

    let entry = new ZipEntry();
    entry.verMade = result.ver_made;
    entry.version = result.version;
    entry.flags = result.flags;
    entry.method = result.method;
    entry.time = result.time;
    entry.crc = result.crc;
    entry.compressedSize = result.compressed_size;
    entry.size = result.size;
    entry.fnameLen = result.fname_len;
    entry.extraLen = result.extra_len;
    entry.comLen = result.com_len;
    entry.diskStart = result.disk_start;
    entry.inattr = result.inattr;
    entry.attr = result.attr;
    entry.offset = result.offset;
    entry.headerOffset = result.header_offset;
    entry.name = result.name;
    entry.isDirectory = result.is_directory === 1;
    entry.comment = result.commen;

    return entry;
  }
}