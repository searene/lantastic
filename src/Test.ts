import {ZipReader} from "./ZipReader";
import {Sqlite} from "./Sqlite";

async function test() {
  const zipFile = '/home/searene/Public/complete/En-En-Longman_DOCE5.dsl.dz.files.zip';
  await Sqlite.init();
  const entries = await ZipReader.getZipEntries(zipFile);

  await Sqlite.db.exec('DELETE FROM zip_entry');
  const startTime = new Date();
  await ZipReader.saveEntriesToDb(zipFile, entries);
  const endTime = new Date();

  const seconds = (endTime.getTime() - startTime.getTime()) / 1000;
  console.log(`cost ${seconds}s`);
}
test();

const test2 = async () => {
  const stmt = `              INSERT INTO zip_entry (
                resource_holder, ver_made, version, flags, method, time, crc, compressedSize, size,
                fnameLen, extraLen, comLen, diskStart, inattr, attr, offset, headerOffset,
                name, isDirectory, comment
              ) VALUES ('/home/searene/Public/complete/En-En-Longman_DOCE5.dsl.dz.files.zip', 798, 20, 2, 8, 985372249, 3135717057, 3088, 3182, 18, 24, 0, 0, 0, 2172649472, 0, 1379613811, 'bre_ld41mullet.wav', 0, 'null'),
('/home/searene/Public/complete/En-En-Longman_DOCE5.dsl.dz.files.zip', 798, 20, 2, 8, 985375864, 2449555071, 9922, 10288, 22, 24, 0, 0, 0, 2172649472, 3164, 1379613899, 'exa_p008-001180682.wav', 0, 'null')`;
  await Sqlite.init();
  await Sqlite.db.exec(stmt);
};
// test2();
