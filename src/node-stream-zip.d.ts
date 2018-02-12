import * as Stream from "stream";

declare module 'node-stream-zip' {
  class StreamZip {
    constructor(options: StreamZipOptions);
    on: on;
    stream: (entry: ZipEntry | string, cb: (err: Error, stm: Stream) => void) => void;
    entries: (entries?: ZipEntry[]) => ZipEntry[];
  }
  interface StreamZipOptions {
    file: string;
    storeEntries: boolean;
  }
  interface ZipEntry {
    // version made by
    verMade: number;
    // version needed to extract
    version: number;
    // encrypt, decrypt flags
    flags: number;
    // compression method
    method: number;
    // modification time (2 bytes time, 2 bytes date)
    time: number;
    // uncompressed file crc-32 value
    crc: number;
    // compressed size
    compressedSize: number;
    // uncompressed size
    size: number;
    // filename length
    fnameLen: number;
    // extra field length
    extraLen: number;
    // file comment length
    comLen: number;
    // volume number start
    diskStart: number;
    // internal file attributes
    inattr: number;
    // external file attributes
    attr: number;
    // LOC header offset
    offset: number;
    headerOffset: number;
    name: string;
    isDirectory: boolean,
    comment: string;
  }
  interface on {
    (event: 'entry', cb: (entry: ZipEntry) => void): void;
    (event: 'on', cb: () => void): void;
    (event: 'error', cb: (error: Error) => void): void;
    (event: 'ready', cb: () => void): void;
  }
  export = StreamZip
}
