import { StreamZip, ZipEntry } from './js/node-stream-zip';

export class ZipReader {

  private cache = new Map<string, ZipEntry[]>();

  async extractFileFromZip(zipFile: string, fileName: string): Promise<Buffer> {
    const entries = this.cache.has(zipFile) ? this.cache.get(zipFile) : await this.buildCache(zipFile);
    const zip = new StreamZip({
      file: zipFile,
      buildEntries: false
    });
    zip.setEntries(entries);

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

  async buildCache(zipFile: string): Promise<ZipEntry[]> {
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
        this.cache.set(zipFile, entries);
        resolve(entries);
      });
    });
  }
}