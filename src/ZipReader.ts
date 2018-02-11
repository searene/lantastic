const StreamZip = require('node-stream-zip');

export class ZipReader {

  private cache = new Map<string, any>();

  async extractFileFromZip(zipFile: string, fileName: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve) => {

      let zip: any;
      if(this.cache.has(zipFile)) {
        zip = this.cache.get(zipFile);
      } else {
        zip = new StreamZip({
          file: zipFile,
          storeEntries: true
        });
        // this.cache.set(zipFile, zip);
      }

      const bufs: Buffer[] = [];
      zip.on('ready', () => {
        zip.stream(fileName, (err: any, stm: any) => {
          stm.on('data', (data: Buffer) => {
            bufs.push(data);
          });
          stm.on('end', () => {
            resolve(Buffer.concat(bufs));
          });
        });
      });
    });
  }
}