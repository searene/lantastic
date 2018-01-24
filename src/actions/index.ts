import { ADD_PATH } from './../Constants';

export interface AddPathAction {
  type: string,
  payload: string
}
export const addPath = (path: string) => ({ type: ADD_PATH, payload: path});