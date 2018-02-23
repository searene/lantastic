import * as fse from 'fs-extra';

const init = async () => {
  const a = await fse.readFile('/test', {encoding: 'utf8'});
  console.log(a);
};
init();