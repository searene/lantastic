import * as low from 'lowdb';
import * as FileSync from 'lowdb/adapters/FileSync';
import {getPathToCardDbFile} from "./Utils";

export interface Card {
  front: string,
  back: string,
  creationDate: string,
  nextReviewDate: string,
}

class CardDb {
  private static _instance: low.Lowdb<{} & { readonly "@@reference"?: { readonly "@@reference": {}; }; }, low.AdapterSync<any>>;

  public static get instance() {
    return this._instance || (this._instance = CardDb.createCardDbInstance());
  }

  private static createCardDbInstance() {
    const cardDb = low(new FileSync(getPathToCardDbFile()));
    cardDb.defaults<{cards: Card[]}>({ cards: [] }).write();
    return cardDb;
  }
}

export const cardDb = CardDb.instance;
