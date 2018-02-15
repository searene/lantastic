import {ZipReader} from "./ZipReader";

async function test() {
  const buffer = await ZipReader.extractFileFromZip('/home/searene/Public/dz/En-En-Longman_DOCE5.dsl.dz.files.zip', 'shell.jpg');
  console.log(buffer);
}
test();
