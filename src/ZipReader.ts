import { StreamZip, ZipEntry } from './js/node-stream-zip';
import { Sqlite } from './Sqlite';
import * as fse from 'fs-extra';

export class ZipReader {

  static async extractFileFromZip(zipFile: string, fileName: string): Promise<Buffer> {

    const zip = new StreamZip({
      file: zipFile,
      buildEntries: false
    });
    const entry = await this.getEntry(zipFile, fileName);
    zip.setEntries([entry]);

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
        console.log(`Saving entries of ${zipFile} to DB...`);
        resolve(entries);
      });
    });
  }
  static saveEntriesToDb = async (zipFile: string, entries: ZipEntry[]): Promise<void> => {
    let insertStatement = `
              INSERT INTO zip_entry (
                resource_holder, ver_made, version, flags, method, time, crc, compressedSize, size,
                fnameLen, extraLen, comLen, diskStart, inattr, attr, offset, headerOffset,
                name, isDirectory, comment
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
    await Sqlite.db.exec(insertStatement);
  };
  static getEntry = async (zipFile: string, fileName: string): Promise<ZipEntry> => {
    const result = await Sqlite.db.get(`
              SELECT * FROM zip_entry WHERE resource_holder = ? AND name = ?`, [zipFile, fileName]);
    return <ZipEntry> {
      verMade: result.ver_made,
      version: result.version,
      flags: result.flags,
      method: result.method,
      time: result.time,
      crc: result.crc,
      compressedSize: result.compressed_size,
      size: result.size,
      fnameLen: result.fname_len,
      extraLen: result.extra_len,
      comLen: result.com_len,
      diskStart: result.disk_start,
      inattr: result.inattr,
      attr: result.attr,
      offset: result.offset,
      headerOffset: result.header_offset,
      name: result.name,
      isDirectory: result.is_directory,
      comment: result.comment
    };
  }
}