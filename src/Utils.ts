import * as path from 'path';

export function removeFromArray<T>(array: Array<T>, element: T): Array<T> {
  return array.filter(a => a != element);
}
export function getPathToUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}
export function getPathToDocuments() {
  return path.join(getPathToUserHome(), 'Documents');
}
export function getPathToDbFile() {
  return path.join(getPathToDocuments(), 'dict-parser.db');
}