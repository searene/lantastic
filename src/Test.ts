import { ZipReader } from './ZipReader';

async function test() {
  const zipReader = new ZipReader();
  const data = await zipReader.extractFileFromZip('/home/searene/Public/complete/En-En-Longman_DOCE5.dsl.dz.files.zip', 'exa_p008-001109504.wav');
}
test();
